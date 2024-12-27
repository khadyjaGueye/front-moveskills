/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Ajout de la police Inter
      },
      animation: {
        fadeInUp: 'fadeInUp 1s ease-out',
        bounceTwice: 'bounceTwice 1s ease-in-out',
        boum: 'boum 1s ease-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceTwice: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        boum: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.5)', opacity: '0.7' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
    }
  },
  plugins: [],
}

