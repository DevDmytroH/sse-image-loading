/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        typing: {
          '0%': {
            width: '0%',
          },
          '100%': {
            width: '100%'
          }
        },
        blink: {
          '50%': {
            borderColor: 'transparent'
          },
          '100%': {
            borderColor: 'white'
          }
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.3s ease-out',
        typing: 'typing 3s steps(40) alternate, blink .7s infinite'
      }
    },
  },
  plugins: [],
}

