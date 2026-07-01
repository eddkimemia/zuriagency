/* ============================================================
   ZuriAgency — Master Script
   Consolidated logic for all pages
   ============================================================ */

/**
 * THEME MANAGEMENT
 * Handles light/dark mode persistence and toggling
 */
const ThemeManager = {
    init() {
        try {
            const saved = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = saved ? saved === 'dark' : (saved === 'light' ? false : prefersDark);

            this.setTheme(isDark);
        } catch (e) {
            console.error('Theme init error:', e);
        }

        // Bind toggle buttons
        document.querySelectorAll('[aria-label="Toggle theme"], #themeToggle, #themeToggleMobile').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
        });
    },

    setTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.updateIcons(isDark);
    },

    toggle() {
        const isDark = !document.documentElement.classList.contains('dark');
        this.setTheme(isDark);
    },

    updateIcons(isDark) {
        const moonIcon = document.getElementById('moonIcon');
        const sunIcon = document.getElementById('sunIcon');
        if (moonIcon && sunIcon) {
            moonIcon.classList.toggle('hidden', isDark);
            sunIcon.classList.toggle('hidden', !isDark);
        }
    }
};

/**
 * MOBILE MENU
 * Handles navigation visibility on mobile devices
 */
const MobileMenu = {
    init() {
        const btns = document.querySelectorAll('[aria-label="Toggle menu"], #mobileMenuBtn, #menuToggle, #mobileMenuButton, #sidebarClose');
        const menu = document.getElementById('mobileMenu');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobileOverlay');

        if (!menu && !sidebar) return;

        const toggle = (force) => {
            const isOpening = force !== undefined ? force : (sidebar ? !sidebar.classList.contains('open') : (menu ? !menu.classList.contains('open') : false));

            if (menu) menu.classList.toggle('open', isOpening);
            if (sidebar) sidebar.classList.toggle('open', isOpening);
            if (overlay) overlay.classList.toggle('active', isOpening);

            // Update icons if they exist
            const menuIcon = document.getElementById('menuIcon');
            const closeIcon = document.getElementById('closeIcon');
            if (menuIcon && closeIcon) {
                menuIcon.classList.toggle('hidden', isOpening);
                closeIcon.classList.toggle('hidden', !isOpening);
            }

            btns.forEach(btn => btn.setAttribute('aria-expanded', String(isOpening)));
        };

        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggle();
            });
        });

        if (overlay) {
            overlay.addEventListener('click', () => toggle(false));
        }
    }
};

/**
 * SCROLL REVEAL & ANCHORS
 * Animates elements as they enter the viewport and handles smooth scrolling
 */
const Navigation = {
    init() {
        // Scroll Reveal
        const elements = document.querySelectorAll('.anim-up, .anim-left, .anim-right, .anim-scale, .reveal, .reveal-left, .reveal-right');
        if (elements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

            elements.forEach(el => observer.observe(el));
        }

        // Smooth Scroll for Anchors
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Close mobile menu if open
                    const menu = document.getElementById('mobileMenu');
                    if (menu && menu.classList.contains('open')) {
                        menu.classList.remove('open');
                        setTimeout(() => menu.classList.add('hidden'), 400);
                    }
                }
            });
        });
    }
};

/**
 * STAT COUNTERS
 * Animates numbers from 0 to target
 */
const StatCounters = {
    init() {
        const elements = document.querySelectorAll('[data-count], .stat-number');
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        elements.forEach(el => observer.observe(el));
    },

    format(num, format) {
        if (format === 'short') {
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
        }
        return num.toLocaleString();
    },

    animate(el) {
        const target = parseInt(el.dataset.count || el.textContent.replace(/[^0-9]/g, ''));
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const format = el.dataset.format || '';
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);

            el.textContent = prefix + this.format(current, format) + suffix;

            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }
};

/**
 * EARNING CALCULATOR
 * Logic for the interactive profit calculator
 */
const EarningCalculator = {
    init() {
        const refSlider = document.getElementById('referralSlider') || document.getElementById('calcReferrals');
        const teamSlider = document.getElementById('teamSlider') || document.getElementById('calcTeam');

        if (!refSlider || !teamSlider) return;

        const update = () => this.update();
        refSlider.addEventListener('input', update);
        teamSlider.addEventListener('input', update);
        this.update();
    },

    update() {
        const refSlider = document.getElementById('referralSlider') || document.getElementById('calcReferrals');
        const teamSlider = document.getElementById('teamSlider') || document.getElementById('calcTeam');

        const refs = parseInt(refSlider.value);
        const team = parseInt(teamSlider.value);

        // Update labels if they exist
        const refVal = document.getElementById('referralCount') || document.getElementById('calcRefVal');
        const teamVal = document.getElementById('teamCount') || document.getElementById('calcTeamVal');
        if (refVal) refVal.textContent = refs;
        if (teamVal) teamVal.textContent = team;

        const direct = refs * 350;
        const passive = (document.getElementById('teamSlider')) ? (refs * team * 150) : (team * 150);
        const total = direct + passive;

        const directEl = document.getElementById('directEarnings');
        const passiveEl = document.getElementById('passiveEarnings');
        const totalEl = document.getElementById('totalEarnings') || document.getElementById('calcResult');
        const netEl = document.getElementById('netProfit');
        const dailyEl = document.getElementById('calcDaily');

        if (directEl) directEl.textContent = `KES ${direct.toLocaleString()}`;
        if (passiveEl) passiveEl.textContent = `KES ${passive.toLocaleString()}`;
        if (totalEl) totalEl.textContent = `KES ${total.toLocaleString()}`;
        if (netEl) netEl.textContent = `KES ${(total - 1000).toLocaleString()}`;
        if (dailyEl) dailyEl.textContent = Math.round(total / 30);

        const progress = document.getElementById('progressBar');
        if (progress) {
            const max = 335000;
            progress.style.width = Math.min(100, (total / max) * 100) + '%';
        }
    }
};

/**
 * FORM VALIDATION
 * Shared logic for registration and contact forms
 */
const FormValidator = {
    init() {
        const regForm = document.getElementById('registerForm');
        if (regForm) {
            regForm.addEventListener('submit', (e) => {
                if (!this.validateRegistration(regForm)) {
                    e.preventDefault();
                } else if (regForm.id === 'registerForm' && !regForm.action.includes('http')) {
                    // Demo success message if no real action
                    e.preventDefault();
                    const success = document.getElementById('successMessage');
                    if (success) success.classList.add('show');
                    regForm.reset();
                    setTimeout(() => success && success.classList.remove('show'), 3000);
                }
            });
        }
    },

    validateRegistration(form) {
        let isValid = true;
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const phone = form.querySelector('#phone');
        const pass = form.querySelector('#password');
        const confirm = form.querySelector('#confirmPassword');

        const setError = (el, show) => {
            const err = document.getElementById(el.id + 'Error');
            if (err) err.classList.toggle('show', show);
            return !show;
        };

        if (name) isValid &= setError(name, name.value.trim().length < 3);
        if (email) isValid &= setError(email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
        if (phone) isValid &= setError(phone, phone.value.replace(/\D/g, '').length < 10);
        if (pass) isValid &= setError(pass, pass.value.length < 8);
        if (confirm) isValid &= setError(confirm, confirm.value !== pass.value || confirm.value === '');

        return !!isValid;
    }
};

/**
 * TOAST NOTIFICATIONS
 */
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'fixed top-4 right-4 z-[100] flex flex-col gap-2';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colors = {
        success: 'border-green-500/30 bg-green-500/10 text-green-400',
        error: 'border-red-500/30 bg-red-500/10 text-red-400',
        info: 'border-blue-500/30 bg-blue-500/10 text-blue-400'
    };

    toast.className = `glass rounded-xl px-4 py-3 flex items-center gap-3 border ${colors[type]} min-w-[280px] transition-all duration-400 translate-x-[120%]`;
    toast.innerHTML = `<span class="text-xs font-medium">${message}</span>`;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.style.transform = 'translateX(0)');

    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ─── Initialize All ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    MobileMenu.init();
    Navigation.init();
    StatCounters.init();
    EarningCalculator.init();
    FormValidator.init();
    if (typeof lucide !== 'undefined') lucide.createIcons();
});
