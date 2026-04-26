import { IProduct } from '../../types';

export class ProductCatalog {
  protected products: IProduct[] = [];
  protected choosenProduct: IProduct | null = null

  setAllProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((item) => item.id === id);
  }

  getAllProduct(): IProduct[] {
    return this.products;
  }

  getChosenProduct(): IProduct | null {
    return this.choosenProduct;
  }

  saveProduct(product: IProduct): void {
    this.choosenProduct = product;
  }
}
