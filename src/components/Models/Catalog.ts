import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductCatalog extends EventEmitter {
    protected products: IProduct[] = [];
    protected choosenProduct: IProduct | null = null;

    setAllProducts(products: IProduct[]): void {
        this.products = products;
        this.emit('products:changed', this.products);
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
        this.emit('product:changed', this.choosenProduct);
    }
}