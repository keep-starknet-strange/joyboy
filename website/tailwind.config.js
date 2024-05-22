module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    fontFamily: {
      sans: ["Droid Sans", "sans-serif"],
    },
    extend: {
      screens: {
        phones: "500px",
        tab: "600px",
        mids: "1000px",
        desktop: "1270px",
      },
      backgroundImage: {
        herobg: 'url("/src/assets/heroBg.svg")',
        mobileHeroBg: 'url("/src/assets/mobileHeroBg.svg")',
        contributeBg: 'url("/src/assets/contributeBg.svg")',
        footerBg: 'url("/src/assets/footerBg.svg")',
        gradientBg: 'url("/src/assets/gradientBg.svg")',
      },
    },
  },
  plugins: [],
};
