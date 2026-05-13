import { Component } from '../base/Component';

export class Catalog extends Component<{ items: HTMLElement[] }> {
    private _gallery: HTMLElement | null;
    private _counter: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this._gallery = container.querySelector('.gallery');
        this._counter = container.querySelector('.header__basket-counter');
    }

    set items(cards: HTMLElement[]) {
        if (this._gallery) {
            this._gallery.replaceChildren(...cards);
        }
    }

    set counter(value: number) {
        if (this._counter) {
            this._counter.textContent = String(value);
        }
    }
}