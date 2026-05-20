import { Component } from '../base/Component';

export class Success extends Component<object> {
    private _closeButton: HTMLButtonElement | null;
    private _description: HTMLElement | null;
    private _element: HTMLElement;

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);

        if (this.container instanceof DocumentFragment) {
            this._element = this.container.children[0] as HTMLElement;
        } else {
            this._element = this.container as HTMLElement;
        }

        this._closeButton = this._element.querySelector('.order-success__close');
        this._description = this._element.querySelector('.order-success__description');

        if (this._closeButton) {
            this._closeButton.addEventListener('click', onClose);
        }
    }

    set total(value: number) {
        if (this._description) {
            this._description.textContent = `Списано ${value} синапсов`;
        }
    }

    get element(): HTMLElement {
        return this._element;
    }

    render(): HTMLElement {
        return this._element;
    }
}