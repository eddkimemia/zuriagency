tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: 'var(--brand)',
                    light: 'var(--brand-light)',
                    dark: 'var(--brand-dark)',
                },
                surface: {
                    DEFAULT: 'var(--surface)',
                    alt: 'var(--surface-alt)',
                    card: 'var(--surface-card)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)',
                },
                accent: {
                    blue: 'var(--accent-blue)',
                    green: 'var(--accent-green)',
                    purple: 'var(--accent-purple)',
                    red: 'var(--accent-red)',
                }
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'sans-serif'],
                heading: ['var(--font-heading)', 'sans-serif'],
            },
            borderRadius: {
                'sm': 'var(--radius-sm)',
                'DEFAULT': 'var(--radius)',
                'lg': 'var(--radius-lg)',
                'xl': 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                '3xl': 'var(--radius-3xl)',
            },
            boxShadow: {
                'glass': 'var(--glass-shadow)',
            }
        }
    }
}
