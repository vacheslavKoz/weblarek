import { Card } from './CardBase';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export class CardPreview extends Card {
    protected _category: HTMLElement | null;
    protected _image: HTMLImageElement | null;
    protected _text: HTMLElement | null;
    protected _button: HTMLButtonElement | null;

    constructor(container: HTMLElement, onButtonClick?: () => void) {
        super(container);
        this._category = container.querySelector('.card__category');
        this._image = container.querySelector('.card__image');
        this._text = container.querySelector('.card__text');
        this._button = container.querySelector('.card__button');

        if (onButtonClick && this._button) {
            this._button.addEventListener('click', onButtonClick);
        }
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            this._category.className = 'card__category';
            const modifier = categoryMap[value as keyof typeof categoryMap];
            const modifierClass = modifier || 'card__category_other';
            this._category.classList.add(modifierClass);
        }
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value, 'картинка товара');
        }
    }

    set description(value: string) {
        if (this._text) {
            this._text.textContent = value;
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }

    set disabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
        }
    }

    render(data?: Partial<IProduct>): HTMLElement {
        if (data) {
            if (data.title !== undefined) this.title = data.title;
            if (data.price !== undefined) this.price = data.price;
            if (data.category !== undefined) this.category = data.category;
            if (data.image !== undefined) this.image = data.image;
            if (data.description !== undefined) this.description = data.description;
        }
        return this.container;
    }
}