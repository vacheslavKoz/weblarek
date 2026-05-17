import { Component } from '../base/Component';

export class ContactsForm extends Component<object> {
    private _emailInput: HTMLInputElement | null;
    private _phoneInput: HTMLInputElement | null;
    private _submitButton: HTMLButtonElement | null;
    private _errorsContainer: HTMLElement | null;

    constructor(
        container: HTMLElement,
        onChange?: (field: string, value: string) => void,
        onSubmit?: () => void
    ) {
        super(container);

        this._emailInput = this.container.querySelector('input[name="email"]');
        this._phoneInput = this.container.querySelector('input[name="phone"]');
        this._submitButton = this.container.querySelector('.button[type="submit"]');
        this._errorsContainer = this.container.querySelector('.form__errors');

        if (this._emailInput) {
            this._emailInput.addEventListener('input', () => {
                onChange?.('email', this._emailInput?.value || '');
            });
        }

        if (this._phoneInput) {
            this._phoneInput.addEventListener('input', () => {
                onChange?.('phone', this._phoneInput?.value || '');
            });
        }

       
        if (this._submitButton) {
            this._submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Клик по кнопке Оплатить'); // ← для отладки
                onSubmit?.();
            });
        }
    }

    set email(value: string) {
        if (this._emailInput && this._emailInput.value !== value) {
            this._emailInput.value = value;
        }
    }

    set phone(value: string) {
        if (this._phoneInput && this._phoneInput.value !== value) {
            this._phoneInput.value = value;
        }
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
}