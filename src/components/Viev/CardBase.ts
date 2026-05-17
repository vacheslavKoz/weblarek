import { Component } from '../base/Component';
import { IProduct } from '../../types';

export class Card extends Component<IProduct> {
    protected _title: HTMLElement | null;
    protected _price: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this._title = container.querySelector('.card__title');
        this._price = container.querySelector('.card__price');
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
}