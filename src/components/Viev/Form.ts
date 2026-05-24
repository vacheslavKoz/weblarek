import { Component } from '../base/Component';

export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement | null;
    protected _errorsContainer: HTMLElement | null;
    protected onSubmitCallback?: () => void;

    constructor(container: HTMLElement) {
        super(container);
        this._submitButton = this.container.querySelector('.button[type="submit"]');
        this._errorsContainer = this.container.querySelector('.form__errors');

        this.container.addEventListener('submit', (e) => {
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

    render(): HTMLElement {
        return this.container;
    }

    set onSubmit(callback: () => void) {
        this.onSubmitCallback = callback;
    }
}