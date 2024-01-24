/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  mode: 'jit',
  theme: {
    colors: {
      transparent: 'transparent',
      primary: '#7b96ec',
      secondary: '#5d5b8d',
      darksecondary: '#2f2d52',
      bgcolor: '#a7bcff',
      bgcolorlight: '#ddddf7',
      white: '#fff',
      gray: '#585858',
      graymedium: '#d9d9d9',
      graylight: '#F5F5F5',
      graydark: '#3a3a3a',
      black: '#000',
      blue: '#0965ea',
      red: '#F03030',
      green: "#91e76a",
    },
    extend: {
      maxWidth: {
        '80%': '80%',
      },
    },
  },
  plugins: [],
}

