module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        "objetive-regular": ["Objective-Regular"],
        "objetive-medium": ["Objective-Medium"],
        "objetive-bold": ["Objective-Bold"],
      },
      colors: {
        "app-btn-dark": "#161B33",
        "app-purple-10": "#FFFFFF",
        "app-B178D8": "#B178D8",
        "app-purple-20": "#F6EFFB",
        "app-purple-100": "#E4D0F2",
        "app-purple-200": "#CDA8E6",
        "app-purple-300": "#9649CB",
        "app-purple-400": "#552C71",
        "app-violet-300": "#9649CB",
        "app-blue-600": "#161B33",
        "app-purple-btn": "#9649CB",
        "app-yellow-1": "#FFB100",
        "app-yellow-2": "#C38802",
        "app-yellow-3": "#F8E19E",
        "app-yellow-4": "#FEF6E2",
        "app-yellow-5": "#FFB100",
        "app-yellow-6": "#F6D271",
        "app-red-1": "#FFE4E8",
        "app-red-2": "#EF233C",
        "app-red-3": "#F1AAB4",
        "app-red-4": "#ED8292",
        "app-green-1": "#D5F5F4",
        "app-green-2": "#95CCCA",
        "app-green-3": "#306C67",
        "app-green-4": "#6AB0AD",
      },
      backgroundImage: {
        "app-btn-gradient": "linear-gradient(90deg, #EF233C, #FF4B33)",
      },
      margin: {
        "-6": "-6px",
      },
      transitionProperty: {
        'padding': 'padding',
      }
    },
  },
  variants: {
    extend: {
      cursor: ['hover', 'disabled'],
      fontFamily: ['disabled'],
      textColor: ['disabled'],
    }
  },
  plugins: [require("@tailwindcss/forms")],
};
