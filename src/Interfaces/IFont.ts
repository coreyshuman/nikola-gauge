
export type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter';

export interface IFont {
    typename: string;
    fontsize: string;
    weight: FontWeight;
}