import { Card } from './CardBase';
import { IProduct } from '../../types';

export class CardBasket extends Card {
    protected _index: HTMLElement | null;
    protected _deleteButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, onDelete?: (id: string) => void) {
        super(container);
        this._index = container.querySelector('.basket__item-index');
        this._deleteButton = container.querySelector('.basket__item-delete');

        if (onDelete && this._deleteButton) {
            this._deleteButton.addEventListener('click', () => {
                const id = this.container.dataset.productId;
                if (id) onDelete(id);
            });
        }
    }

    set index(value: number) {
        if (this._index) {
            this._index.textContent = String(value);
        }
    }

    render(data?: Partial<IProduct>): HTMLElement {
        if (data) {
            if (data.title !== undefined) this.title = data.title;
            if (data.price !== undefined) this.price = data.price;
            if (data.id !== undefined) {
                this.container.dataset.productId = data.id;
            }
        }
        return this.container;
    }
}