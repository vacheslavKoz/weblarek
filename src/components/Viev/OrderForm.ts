import { Form } from './Form';

export class OrderForm extends Form<object> {
    private _cardButton: HTMLButtonElement | null;
    private _cashButton: HTMLButtonElement | null;
    private _addressInput: HTMLInputElement | null;

    constructor(
        container: HTMLElement,
        onChange?: (field: string, value: string) => void,
        onSubmit?: () => void
    ) {
        super(container);

        this._cardButton = this.container.querySelector('button[name="card"]');
        this._cashButton = this.container.querySelector('button[name="cash"]');
        this._addressInput = this.container.querySelector('input[name="address"]');

        if (this._cardButton) {
    console.log('✅ Card button found');
    this._cardButton.addEventListener('click', () => {
        console.log('🔥 Card button CLICKED');
        onChange?.('payment', 'card');
    });
}
        if (this._cashButton) {
            this._cashButton.addEventListener('click', () => {
                onChange?.('payment', 'cash');
            });
        }

        if (this._addressInput) {
            this._addressInput.addEventListener('input', () => {
                onChange?.('address', this._addressInput?.value || '');
            });
        }

        if (this._submitButton) {
            this._submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                onSubmit?.();
            });
        }
    }

   set payment(value: 'card' | 'cash' | null) {
    console.log('🎨 OrderForm.set payment called with:', value);
    if (value === 'card') {
        this._cardButton?.classList.add('button_alt-active');
        this._cashButton?.classList.remove('button_alt-active');
    } else if (value === 'cash') {
        this._cashButton?.classList.add('button_alt-active');
        this._cardButton?.classList.remove('button_alt-active');
    } else {
        this._cardButton?.classList.remove('button_alt-active');
        this._cashButton?.classList.remove('button_alt-active');
    }
}

    set address(value: string) {
        if (this._addressInput && this._addressInput.value !== value) {
            this._addressInput.value = value;
        }
    }
}