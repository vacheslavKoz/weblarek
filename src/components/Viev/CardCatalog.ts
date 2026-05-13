import { Card } from './CardBase';
import { IProduct } from '../../types';

export class CardCatalog extends Card {
    constructor(container: HTMLElement) {
        super(container);
    }

    render(data?: Partial<IProduct>): HTMLElement {
        if (data) {
            if (data.category !== undefined) this.category = data.category;
            if (data.title !== undefined) this.title = data.title;
            if (data.price !== undefined) this.price = data.price;
            if (data.image !== undefined) this.image = data.image;
        }

        if (this.container instanceof DocumentFragment) {
            const element = this.container.children[0] as HTMLElement;
            if (element) return element;
        }

        return this.container as HTMLElement;
    }
}