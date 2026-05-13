import { Card } from './CardBase';
import { IProduct } from '../../types';

export class CardPreview extends Card {
    protected _button: HTMLButtonElement;
    protected _text: HTMLElement;

    constructor(container: HTMLElement, onButtonClick?: () => void) {
        super(container);

        const button = container.querySelector('.card__button');
        const text = container.querySelector('.card__text');

        if (!button || !text) {
            throw new Error('CardPreview: Required elements .card__button or .card__text not found');
        }

        this._button = button as HTMLButtonElement;
        this._text = text as HTMLElement;

        if (onButtonClick) {
            this._button.addEventListener('click', onButtonClick);
        }
    }

    set description(value: string) {
        this._text.textContent = value;
    }

    set buttonText(value: string) {
        this._button.textContent = value;
    }

    set disabled(value: boolean) {
        this._button.disabled = value;
    }

    render(data?: Partial<IProduct>): HTMLElement {
        if (data) {
            if (data.category !== undefined) this.category = data.category;
            if (data.title !== undefined) this.title = data.title;
            if (data.description !== undefined) this.description = data.description;
            if (data.price !== undefined) this.price = data.price;
            if (data.image !== undefined) this.image = data.image;
        }
        return this.container;
    }
}