export const ScrollAnimation = {
  hidden: {
    opacity: 0,
    x: -40,
    transition: {
      duration: 0.1,
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.1,
    },
  },
};

export const NavbarOpen = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.1,
    },
  },
  visible: {
    opacity: 1,
    height: 100,
    transition: {
      duration: 0.1,
    },
  },
};

export const MenuItemAnimation = (delay) => {
  return {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        delay: delay,
      },
    },
  };
};
