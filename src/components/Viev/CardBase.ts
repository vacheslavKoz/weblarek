import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export class Card extends Component<IProduct> {
    protected _title: HTMLElement | null;
    protected _price: HTMLElement | null;
    protected _category: HTMLElement | null;
    protected _image: HTMLImageElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this._title = container.querySelector('.card__title');
        this._price = container.querySelector('.card__price');
        this._category = container.querySelector('.card__category');
        this._image = container.querySelector('.card__image');
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

    set title(value: string) {
        if (this._title) {
            this._title.textContent = value;
        }
    }

    set price(value: number | null) {
        if (this._price) {
            if (value === null) {
                this._price.textContent = 'Недоступно';
            } else {
                this._price.textContent = `${value} синапсов`;
            }
        }
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value, 'картинка товара');
        }
    }
}