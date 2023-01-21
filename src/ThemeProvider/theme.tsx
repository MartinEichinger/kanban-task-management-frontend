const colors = {
  lines_light: 'rgba(228,235,250,1)',
  lines_dark: 'rgba(62,63,78,1)',
  main_purple: 'rgba(99, 95, 199, 1)',
  main_purple25: 'rgba(99, 95, 199, 0.25)',
  main_purple10: 'rgba(99, 95, 199, 0.1)',
  main_purple_hover: 'rgba(168, 164, 255, 1)',
  main_purple_light: 'rgba(99, 95, 199, 0.1)',
  main_purple_light_hover: 'rgba(99, 95, 199, 0.25)',
  medium_grey: 'rgba(130,143,163,1)',
  medium_grey25: 'rgba(130,143,163,0.25)',
  light_grey: 'rgba(244,247,253,1)',
  lighter_grey: 'rgba(233, 239, 250, 1)',
  dark_grey: 'rgba(43,44,55,1)',
  very_dark_grey: 'rgba(32,33,44,1)',
  white: 'rgba(255,255,255,1)',
  white50: 'rgba(255,255,255,0.5)',
  white25: 'rgba(255,255,255,0.25)',
  red: 'rgba(234,85,85,1)',
  black: 'rgba(0,1,18,1)',
  black50: 'rgba(0,1,18,0.5)',
};

export const themes = {
  light: {
    light: true,
    themeBgDark: {
      background: colors.white,
      color: colors.black,
    },
    themeBg: {
      background: colors.white,
    },
    themeBg2: {
      background: colors.lighter_grey,
    },
    themeHg: {
      color: colors.black,
    },
    themeP: {
      'p:hover': {
        background: colors.light_grey,
      },
    },
  },
  dark: {
    light: false,
    themeBgDark: {
      background: colors.very_dark_grey,
      color: colors.medium_grey,
    },
    themeBg: {
      background: colors.dark_grey,
    },
    themeBg2: {
      background: colors.dark_grey,
    },
    themeHg: {
      color: colors.white,
    },
    themeP: {
      'p:hover': {
        background: colors.light_grey,
      },
    },
  },
};
