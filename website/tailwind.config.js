module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    fontFamily: {
      sans: ["Droid Sans", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        herobg: 'url("/src/assets/heroBg.svg")',
        contributeBg: 'url("/src/assets/contributeBg.svg")',
        footerBg: 'url("/src/assets/footerBg.svg")',
        gradientBg: 'url("/src/assets/gradientBg.svg")',
      },
    },
  },
  plugins: [],
};
