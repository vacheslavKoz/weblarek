import { Component } from '../base/Component';

export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement | null;
    protected _errorsContainer: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this._submitButton = this.container.querySelector('.button[type="submit"]');
        this._errorsContainer = this.container.querySelector('.form__errors');
    }

    set errors(value: string) {
        if (this._errorsContainer) {
            this._errorsContainer.textContent = value;
        }
    }

    set valid(value: boolean) {
        if (this._submitButton) {
            this._submitButton.disabled = !value;
        }
    }

   get element(): HTMLFormElement {
    if (this.container instanceof DocumentFragment) {
        const element = this.container.children[0] as HTMLFormElement;
        console.log('Form.element из фрагмента:', element);
        return element;
    }
    console.log('Form.element из контейнера:', this.container);
    return this.container as HTMLFormElement;
}
}