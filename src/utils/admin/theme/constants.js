export const SidebarWidth = "320px";

export const shadows = [
    'none',
    '0px 2px 3px rgba(0,0,0,0.10)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 2px 2px -2px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 4px 6px -2px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 4px 6px -2px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 4px 8px -2px rgba(0,0,0,0.25)',
    '0 9px 17.5px rgb(0,0,0,0.05)',
    'rgb(145 158 171 / 30%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 7px 12px -4px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 6px 16px -4px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 7px 16px -4px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 8px 18px -8px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 9px 18px -8px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 10px 20px -8px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 11px 20px -8px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 12px 22px -8px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 13px 22px -8px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 14px 24px -8px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 16px 28px -8px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 18px 30px -8px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 20px 32px -8px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 22px 34px -8px rgba(0,0,0,0.25)',
    '0 0 1px 0 rgba(0,0,0,0.31), 0 24px 36px -8px rgba(0,0,0,0.25)',
];


export const colorTheme = {
    direction: 'ltr',
    palette: {
        primary: {
            main: '#19891c',
            light: '#f3fcf2',
            dark: '#237d0e',
        },
        secondary: {
            main: '#49BEFF',
            light: '#f3fcf2',
            dark: '#23afdb',
        },
        success: {
            main: '#13DEB9',
            light: '#E6FFFA',
            dark: '#02b3a9',
            contrastText: '#ffffff',
        },
        info: {
            main: '#539BFF',
            light: '#EBF3FE',
            dark: '#1682d4',
            contrastText: '#ffffff',
        },
        error: {
            main: '#FA896B',
            light: '#FDEDE8',
            dark: '#f3704d',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#FFAE1F',
            light: '#FEF5E5',
            dark: '#ae8e59',
            contrastText: '#ffffff',
        },
        purple: {
            A50: '#EBF3FE',
            A100: '#6610f2',
            A200: '#557fb9',
        },
        grey: {
            100: '#F2F6FA',
            200: '#EAEFF4',
            300: '#DFE5EF',
            400: '#7C8FAC',
            500: '#5A6A85',
            600: '#2A3547',

        },
        text: {
            primary: '#2A3547',
            secondary: '#2A3547',
        },
        action: {
            disabledBackground: 'rgba(73,82,88,0.12)',
            hoverOpacity: 0.02,
            hover: '#f6f9fc',
        },
        divider: '#e5eaef',
    },
};

export const customizer = {
    activeDir: 'ltr',
    activeMode: 'light', // This can be light or dark
    activeTheme: 'BLUE_THEME', // BLUE_THEME, GREEN_THEME, BLACK_THEME, PURPLE_THEME, ORANGE_THEME
    SidebarWidth: 270,
    MiniSidebarWidth: 87,
    TopbarHeight: 70,
    isLayout: 'boxed', // This can be full or boxed
    isCollapse: false, // to make sidebar Mini by default
    isSidebarHovered: false,
    isMobileSidebar: false,
    isHorizontal: true,
    isLanguage: 'en',
    isCardShadow: true,
    borderRadius: 7,
};