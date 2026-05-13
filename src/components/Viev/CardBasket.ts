import { Card } from './CardBase';
import { IProduct } from '../../types';

export class CardBasket extends Card {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, onDelete?: () => void) {
        super(container);

        const index = container.querySelector('.basket__item-index');
        const deleteButton = container.querySelector('.basket__item-delete');

        if (!index || !deleteButton) {
            throw new Error('CardBasket: Required elements .basket__item-index or .basket__item-delete not found');
        }

        this._index = index as HTMLElement;
        this._deleteButton = deleteButton as HTMLButtonElement;

        if (onDelete) {
            this._deleteButton.addEventListener('click', onDelete);
        }
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }

    render(data?: Partial<IProduct>): HTMLElement {
        if (data) {
            if (data.title !== undefined) this.title = data.title;
            if (data.price !== undefined) this.price = data.price;
        }
        return this.container;
    }
}