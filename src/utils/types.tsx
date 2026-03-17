
export interface CustomButtonProps {
    title: string;
    loading?: boolean;
    onPress?: () => void
    disabled?: boolean
}

export interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void
}

export interface CustomTextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'h8';
    style?: any;
    fontSize?: number;
    children: React.ReactNode;
    fontFamily?: 'SemiBold' | 'Regular' | 'Bold' | 'Medium' | 'Light';
    numberOfLines?: number;
}

declare module 'react-native-mmkv' {
  export class MMKV {
    clearAll() {
        throw new Error("Method not implemented.");
    }
    constructor(config?: {
      id?: string;
      path?: string;
      encryptionKey?: string;
    });

    set(key: string, value: string | number | boolean): void;
    getString(key: string): string | undefined;
    getNumber(key: string): number | undefined;
    getBoolean(key: string): boolean | undefined;
    delete(key: string): void;
  }
}
