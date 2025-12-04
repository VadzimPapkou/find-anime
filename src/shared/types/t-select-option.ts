export type TSelectOption<T = string> = T & {
    value: number | string;
    label: string;
};