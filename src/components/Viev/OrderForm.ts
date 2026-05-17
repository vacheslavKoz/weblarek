import { Component } from '../base/Component';

export class OrderForm extends Component<object> {
    private _cardButton: HTMLButtonElement | null;
    private _cashButton: HTMLButtonElement | null;
    private _addressInput: HTMLInputElement | null;
    private _submitButton: HTMLButtonElement | null;
    private _errorsContainer: HTMLElement | null;

    constructor(
        container: HTMLElement,
        onChange?: (field: string, value: string) => void,
        onSubmit?: () => void
    ) {
        super(container);

        this._cardButton = this.container.querySelector('button[name="card"]');
        this._cashButton = this.container.querySelector('button[name="cash"]');
        this._addressInput = this.container.querySelector('input[name="address"]');
        this._submitButton = this.container.querySelector('.order__button');
        this._errorsContainer = this.container.querySelector('.form__errors');

       
        if (this._cardButton) {
            this._cardButton.addEventListener('click', () => {
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
        console.log('Клик по кнопке Далее'); // ← ДОЛЖНО ПОЯВИТЬСЯ
        onSubmit?.();
    });
}
    }

    
    set payment(value: 'card' | 'cash' | null) {
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

   
    set errors(value: string) {
        if (this._errorsContainer) {
            this._errorsContainer.textContent = value;
        }
    }

    
    set valid(value: boolean) {
          console.log('OrderForm valid:', value);
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