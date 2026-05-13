import { Component } from '../base/Component';

export class Success extends Component<object> {
    private _closeButton: HTMLButtonElement | null;
    private _description: HTMLElement | null;

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);

        this._closeButton = this.container.querySelector('.order-success__close');
        this._description = this.container.querySelector('.order-success__description');

        if (this._closeButton) {
            this._closeButton.addEventListener('click', onClose);
        }
    }

    set total(value: number) {
        if (this._description) {
            this._description.textContent = `Списано ${value} синапсов`;
        }
    }
}