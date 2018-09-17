import { IFont, FontWeight } from '../Interfaces/IFont';

export class Font implements IFont {
    typename: string;
    fontsize: string;
    weight: FontWeight;

    constructor(typename: string, fontsize: string, weight: FontWeight = 'normal') {
        this.typename = typename;
        this.fontsize = fontsize;
        this.weight = weight;
        // could add validation here
    }
}