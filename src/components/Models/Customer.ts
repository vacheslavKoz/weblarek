import { ValidationErrors } from '../../types';
import { TPayment } from '../../types';
import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';

export class Customer extends EventEmitter {
    protected payment: TPayment = "";
    protected address: string = "";
    protected email: string = "";
    protected phone: string = "";

    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.emit('customer:changed', this.getAllData());
    }

    setAddress(address: string): void {
        this.address = address;
        this.emit('customer:changed', this.getAllData());
    }

    setEmail(email: string): void {
        this.email = email;
        this.emit('customer:changed', this.getAllData());
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.emit('customer:changed', this.getAllData());
    }

    getAllData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
        };
    }

    deleteAllData(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.emit('customer:changed', this.getAllData());
    }

    validate(): ValidationErrors {
        const errors: ValidationErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.email || this.email.trim() === '') {
            errors.email = 'Укажите email';
        }

        if (!this.phone || this.phone.trim() === '') {
            errors.phone = 'Укажите номер телефона';
        }

        if (!this.address || this.address.trim() === '') {
            errors.address = 'Укажите адрес доставки';
        }

        return errors;
    }

   
validateOrder(): ValidationErrors {
    const errors: ValidationErrors = {};
    if (!this.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.address || this.address.trim() === '') errors.address = 'Укажите адрес доставки';
    return errors;
}

validateContacts(): ValidationErrors {
    const errors: ValidationErrors = {};
    if (!this.email || this.email.trim() === '') errors.email = 'Укажите email';
    if (!this.phone || this.phone.trim() === '') errors.phone = 'Укажите номер телефона';
    return errors;
}

    getPayment(): TPayment {
        return this.payment;
    }

    getEmail(): string {
        return this.email;
    }

    getPhone(): string {
        return this.phone;
    }

    getAddress(): string {
        return this.address;
    }
}