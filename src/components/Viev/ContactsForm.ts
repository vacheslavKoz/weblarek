import { Component } from '../base/Component';

export class ContactsForm extends Component<object> {
    private _emailInput: HTMLInputElement | null;
    private _phoneInput: HTMLInputElement | null;
    private _submitButton: HTMLButtonElement | null;
    private _errorsContainer: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);

        this._emailInput = this.container.querySelector('input[name="email"]');
        this._phoneInput = this.container.querySelector('input[name="phone"]');
        this._submitButton = this.container.querySelector('.button[type="submit"]');
        this._errorsContainer = this.container.querySelector('.form__errors');

        if (this._emailInput) {
            this._emailInput.addEventListener('input', () => this.validateForm());
        }
        if (this._phoneInput) {
            this._phoneInput.addEventListener('input', () => this.validateForm());
        }

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.isValid()) {
               
            }
        });
    }

    private isValid(): boolean {
        return (this._emailInput?.value.trim() !== '') &&
            (this._phoneInput?.value.trim() !== '');
    }

    private validateForm(): void {
        const isValid = this.isValid();
        if (this._submitButton) {
            this._submitButton.disabled = !isValid;
        }
        if (isValid && this._errorsContainer) {
            this._errorsContainer.textContent = '';
        }
    }

    set errors(value: string) {
        if (this._errorsContainer) {
            this._errorsContainer.textContent = value;
        }
    }

    get element(): HTMLFormElement {
        if (this.container instanceof DocumentFragment) {
            return this.container.children[0] as HTMLFormElement;
        }
        return this.container as HTMLFormElement;
    }

    get email(): string {
        return this._emailInput?.value || '';
    }

    get phone(): string {
        return this._phoneInput?.value || '';
    }

    set valid(value: boolean) {
        if (this._submitButton) {
            this._submitButton.disabled = !value;
        }
    }
}