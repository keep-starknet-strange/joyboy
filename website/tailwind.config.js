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
        herobg: 'url("/public/assets/heroBg.svg")',
        mobileHeroBg: 'url("/public/assets/mobileHeroBg.svg")',
        contributeBg: 'url("/public/assets/contributeBg.svg")',
        footerBg: 'url("/public/assets/footerBg.svg")',
        gradientBg: 'url("/public/assets/gradientBg.svg")',
      },
    },
  },
  plugins: [],
};
