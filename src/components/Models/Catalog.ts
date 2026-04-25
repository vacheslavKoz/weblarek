import { IProduct } from '../../types';

export class ProductCatalog {
  protected products: IProduct[] = [];
  protected product: IProduct | undefined;
  protected chooseProduct: IProduct | undefined;

  constructor(products: IProduct[]) {
    this.products = products;
  }

  setAllProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProductById(id: string): IProduct | undefined {
    this.product = this.products.find((x) => x.id === id);
    return this.product;
  }

  getAllProduct(): IProduct[] {
    return this.products;
  }

  getProduct(): IProduct | undefined {
    return this.chooseProduct;
  }

  saveProduct(product: IProduct): void {
    this.chooseProduct = product;
  }
}
