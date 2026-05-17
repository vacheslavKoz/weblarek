import { Card } from './CardBase';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export class CardCatalog extends Card {
    protected _category: HTMLElement | null;
    protected _image: HTMLImageElement | null;

    constructor(container: HTMLElement, onClick?: (id: string) => void) {
        super(container);
        this._category = container.querySelector('.card__category');
        this._image = container.querySelector('.card__image');

        if (onClick) {
            container.addEventListener('click', () => {
                const id = this.container.dataset.productId;
                if (id) onClick(id);
            });
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

    render(data?: Partial<IProduct>): HTMLElement {
        if (data) {
            if (data.title !== undefined) this.title = data.title;
            if (data.price !== undefined) this.price = data.price;
            if (data.category !== undefined) this.category = data.category;
            if (data.image !== undefined) this.image = data.image;
            if (data.id !== undefined) {
                this.container.dataset.productId = data.id;
            }
        }
        return this.container;
    }
}