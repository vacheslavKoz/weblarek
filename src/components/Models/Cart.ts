import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Cart extends EventEmitter{
  protected cartProducts: IProduct[] = [];

   saveAllProducts(products: IProduct[]): void{
    this.cartProducts = products;
  }

  getAllProducts(): IProduct[] {
    return this.cartProducts;
  }

  setNewProduct(product: IProduct): void {
    this.cartProducts.push(product);
    this.emit('cart:changed', this.cartProducts);
  }

  deleteProduct(product: IProduct): void {
    this.cartProducts = this.cartProducts.filter((item) => item.id !== product.id);
    this.emit('cart:changed', this.cartProducts);
  }

  deleteAll(): void {
    this.cartProducts = [];
    this.emit('cart:changed', this.cartProducts);
  }

  getAllPrice(): number {
     return this.cartProducts.reduce((acc, item) => acc + (item.price ?? 0), 0);
  }

  getAllCount(): number {
    return this.cartProducts.length;
  }

  checkProduct(id: string): boolean {
    return this.cartProducts.some((item) => item.id === id);
  }
}