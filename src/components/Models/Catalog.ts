import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductCatalog {
    protected products: IProduct[] = [];
    protected choosenProduct: IProduct | null = null;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setAllProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('products:changed', this.products);
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
        this.events.emit('product:changed', this.choosenProduct);
    }
}