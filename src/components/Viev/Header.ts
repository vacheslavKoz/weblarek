import { Component } from '../base/Component';

export class Header extends Component<{ counter: number }> {
    private _counter: HTMLElement | null;
    private _basketButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, onBasketClick?: () => void) {
        super(container);
        this._counter = container.querySelector('.header__basket-counter');
        this._basketButton = container.querySelector('.header__basket');

        if (this._basketButton && onBasketClick) {
            this._basketButton.addEventListener('click', onBasketClick);
        }
    }

    set counter(value: number) {
        if (this._counter) {
            this._counter.textContent = String(value);
        }
    }
}