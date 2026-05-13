import { Component } from '../base/Component';

export class OrderForm extends Component<object> {
    private _cardButton: HTMLButtonElement | null;
    private _cashButton: HTMLButtonElement | null;
    private _addressInput: HTMLInputElement | null;
    private _submitButton: HTMLButtonElement | null;
    private _errorsContainer: HTMLElement | null;
    private _selectedPayment: string = '';

    constructor(container: HTMLElement) {
        super(container);

        this._cardButton = this.container.querySelector('button[name="card"]');
        this._cashButton = this.container.querySelector('button[name="cash"]');
        this._addressInput = this.container.querySelector('input[name="address"]');
        this._submitButton = this.container.querySelector('.order__button');
        this._errorsContainer = this.container.querySelector('.form__errors');

        if (this._cardButton) {
            this._cardButton.addEventListener('click', () => this.selectPayment('card'));
        }
        if (this._cashButton) {
            this._cashButton.addEventListener('click', () => this.selectPayment('cash'));
        }
        if (this._addressInput) {
            this._addressInput.addEventListener('input', () => this.validateForm());
        }

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.isValid()) {
               
            }
        });
    }

    private selectPayment(payment: string): void {
        this._selectedPayment = payment;
        this.updatePaymentButtons();
        this.validateForm();
    }

    private updatePaymentButtons(): void {
        if (this._selectedPayment === 'card') {
            if (this._cardButton) {
                this._cardButton.classList.add('button_alt-active');
            }
            if (this._cashButton) {
                this._cashButton.classList.remove('button_alt-active');
            }
        } else if (this._selectedPayment === 'cash') {
            if (this._cashButton) {
                this._cashButton.classList.add('button_alt-active');
            }
            if (this._cardButton) {
                this._cardButton.classList.remove('button_alt-active');
            }
        }
    }

    private isValid(): boolean {
        return this._selectedPayment !== '' &&
            (this._addressInput?.value.trim() !== '');
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

    get address(): string {
        return this._addressInput?.value || '';
    }

    get payment(): string {
        return this._selectedPayment;
    }

    set valid(value: boolean) {
        if (this._submitButton) {
            this._submitButton.disabled = !value;
        }
    }
}