import { Component } from '../base/Component';

export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement | null;
    protected _errorsContainer: HTMLElement | null;
    protected onSubmitCallback?: () => void;

    constructor(container: HTMLElement) {
        super(container);
        this._submitButton = this.container.querySelector('.button[type="submit"]');
        this._errorsContainer = this.container.querySelector('.form__errors');

        this.element.addEventListener('submit', (e) => {
            e.preventDefault();
            this.onSubmitCallback?.();
        });
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
            return this.container.children[0] as HTMLFormElement;
        }
        return this.container as HTMLFormElement;
    }

    set onSubmit(callback: () => void) {
        this.onSubmitCallback = callback;
    }
}