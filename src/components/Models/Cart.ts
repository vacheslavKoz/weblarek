import { IProduct } from '../../types';

export class Cart {
  cartProducts: IProduct[] = [];

  constructor(products: IProduct[]) {
    this.cartProducts = products;
  }

  getAllProducts(): IProduct[] {
    return this.cartProducts;
  }

  setNewProduct(product: IProduct): void {
    this.cartProducts.push(product);
  }

  deleteProduct(product: IProduct): void {
    this.cartProducts = this.cartProducts.filter((x) => x.id !== product.id);
  }

  deleteAll(): void {
    this.cartProducts = [];
  }

  getAllPrice(): number {
    let allPrice: number = 0;
    this.cartProducts.forEach((x) => (allPrice += x.price || 0));
    return allPrice;
  }

  getAllCount(): number {
    return this.cartProducts.length;
  }

  checkProduct(id: string): boolean {
    return this.cartProducts.some((x) => x.id === id);
  }
}