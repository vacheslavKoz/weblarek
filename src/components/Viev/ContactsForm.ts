import { Form } from './Form';

export class ContactsForm extends Form<object> {
    private _emailInput: HTMLInputElement | null;
    private _phoneInput: HTMLInputElement | null;

    constructor(
        container: HTMLElement,
        onChange?: (field: string, value: string) => void,
        onSubmit?: () => void
    ) {
        super(container);

        this._emailInput = this.container.querySelector('input[name="email"]');
        this._phoneInput = this.container.querySelector('input[name="phone"]');

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
}