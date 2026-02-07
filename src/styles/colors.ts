// Light and Dark palettes with typed palette
type Palette = Record<number, string>;

type Theme = {
    palette: Palette;
    background: string;
    text: string;
    border: string;
    white: string;
    black: string;
    pink: string;
    header: string;
};

const light: Theme = {
    palette: {
        0: '#233225',
        1: '#39503B',
        2: '#B7CFB9',
        3: '#437A48',
        4: '#BBFAC1',
        5: '#95FF9E'
    },
    background: '#F5F5F5',
    text: '#333333',
    border: '#E0E0E0',
    white: '#FFFFFF',
    black: '#000000',
    pink: '#ec4899',
    header: '#39503B'
};

const dark: Theme = {
    palette: {
        0: '#CAE5D0',
        1: '#A3C9A3',
        2: '#6B8F6B',
        3: '#4B6B4B',
        4: '#2C3D2C',
        5: '#172317'
    },
    background: '#0F1720',
    text: '#E6E6E6',
    border: '#2A2A2A',
    white: '#0F1720',
    black: '#FFFFFF',
    pink: '#ec4899',
    header: '#39503B'
};

let current: 'light' | 'dark' = 'light';

export function setAppTheme(t: 'light' | 'dark') {
    current = t;
}

export function getAppTheme() {
    return current;
}

// Typed Proxy that returns values based on current theme at access time
export const colors: Theme = new Proxy({} as Theme, {
    get(_, prop: keyof Theme) {
        const base = current === 'dark' ? dark : light;
        return base[prop];
    }
});

export default colors;