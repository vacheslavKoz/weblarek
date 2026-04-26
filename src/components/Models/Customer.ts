import { ValidationErrors } from '../../types';
import { TPayment } from '../../types';
import { IBuyer } from '../../types';

export class Customer {
 protected payment: TPayment = "";
 protected address: string = "";
 protected email: string = "";
 protected phone: string = "";

  setPayment(payment: TPayment): void {
    this.payment = payment;
  }

  setAddress(address: string): void {
    this.address = address;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
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

}