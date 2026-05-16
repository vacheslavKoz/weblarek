import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { CDN_URL } from './utils/constants';
import { IProduct, IOrderData } from './types/index';
import { ProductCatalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';
import { ServerApi } from './components/Models/ServerApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { Catalog } from './components/Viev/Catalog';
import { Basket } from './components/Viev/Basket';
import { Modal } from './components/Viev/Modal';
import { OrderForm } from './components/Viev/OrderForm';
import { ContactsForm } from './components/Viev/ContactsForm';
import { Success } from './components/Viev/Success';
import { CardCatalog } from './components/Viev/CardCatalog';
import { CardPreview } from './components/Viev/CardPreviev';
import { CardBasket } from './components/Viev/CardBasket';

// ============================================
// 1. ИНИЦИАЛИЗАЦИЯ
// ============================================
const events = new EventEmitter();

const productsModel = new ProductCatalog();
const cartModel = new Cart();
const customerModel = new Customer();
const api = new Api(API_URL);
const serverApi = new ServerApi(api);

const pageContainer = document.querySelector('.page') as HTMLElement;
const catalogView = new Catalog(pageContainer);
const modalView = new Modal(pageContainer);
let basketView: Basket | null = null;
let orderFormView: OrderForm | null = null;
let contactsFormView: ContactsForm | null = null;

// ============================================
// 2. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================
function getTemplate(id: string): HTMLTemplateElement {
    const template = document.getElementById(id) as HTMLTemplateElement;
    if (!template) throw new Error(`Template ${id} not found`);
    return template;
}

function createCatalogCard(product: IProduct): HTMLElement {
    const template = getTemplate('card-catalog');
    const clone = template.content.cloneNode(true) as HTMLElement;
    const element = clone.children[0] as HTMLElement;

    const card = new CardCatalog(element, (id) => {
        events.emit('card:select', { id });
    });

    card.render({
        title: product.title,
        price: product.price,
        category: product.category,
        image: CDN_URL + product.image.replace('.svg', '.png'),
        id: product.id
    });

    return element;
}

function createBasketCard(product: IProduct, index: number): HTMLElement {
    const template = getTemplate('card-basket');
    const clone = template.content.cloneNode(true) as HTMLElement;
    const element = clone.children[0] as HTMLElement;

    const card = new CardBasket(element, (id) => {
        events.emit('basket:remove', { id });
    });

    card.render({
        title: product.title,
        price: product.price,
        id: product.id
    });
    card.index = index + 1;

    return element;
}

function renderBasket(): void {
    const template = getTemplate('basket');
    const clone = template.content.cloneNode(true) as HTMLElement;
    const cartItems = cartModel.getAllProducts();
    const cards = cartItems.map((product, i) => createBasketCard(product, i));

    // Всегда создаём новый basketView, чтобы избежать проблем с переиспользованием DOM
    basketView = new Basket(clone, () => {
        openOrderForm();
    });

    basketView.items = cards;
    basketView.total = cartModel.getAllPrice();
    basketView.disabled = cards.length === 0;

    modalView.content = basketView.render();
    modalView.open('form');
}

function updateBasketCounter(): void {
    catalogView.counter = cartModel.getAllCount();
}

function openOrderForm(): void {
    const template = getTemplate('order');
    const clone = template.content.cloneNode(true) as HTMLElement;

    orderFormView = new OrderForm(clone);

    orderFormView.element.addEventListener('submit', (e) => {
        e.preventDefault();
        if (orderFormView && orderFormView.payment && orderFormView.address) {
            customerModel.setPayment(orderFormView.payment as 'card' | 'cash');
            customerModel.setAddress(orderFormView.address);
            openContactsForm();
        }
    });

    modalView.content = orderFormView.element;
    modalView.open('form');
}

function openContactsForm(): void {
    const template = getTemplate('contacts');
    const clone = template.content.cloneNode(true) as HTMLElement;

    contactsFormView = new ContactsForm(clone);

    contactsFormView.element.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (contactsFormView && contactsFormView.email && contactsFormView.phone) {
            customerModel.setEmail(contactsFormView.email);
            customerModel.setPhone(contactsFormView.phone);

            const orderData: IOrderData = {
                payment: customerModel.getPayment() as 'card' | 'cash',
                email: customerModel.getEmail(),
                phone: customerModel.getPhone(),
                address: customerModel.getAddress(),
                total: cartModel.getAllPrice(),
                items: cartModel.getAllProducts().map(p => p.id)
            };

            try {
                const result = await serverApi.sendDataOnServer(orderData);
                showSuccess(result.total);
                cartModel.deleteAll();
                customerModel.deleteAllData();
                updateBasketCounter();
            } catch (error) {
                console.error('Ошибка отправки заказа:', error);
                if (contactsFormView) {
                    contactsFormView.errors = 'Ошибка при оформлении заказа';
                }
            }
        }
    });

    modalView.content = contactsFormView.element;
    modalView.open('form');
}

function showSuccess(total: number): void {
    const template = getTemplate('success');
    const clone = template.content.cloneNode(true) as HTMLElement;

    const successView = new Success(clone, () => {
        modalView.close();
    });

    successView.total = total;
    modalView.content = successView.render();
    modalView.open('form');
}

function renderCatalog(products: IProduct[]): void {
    const cards = products.map(product => createCatalogCard(product));
    catalogView.items = cards;
}

async function loadProducts(): Promise<void> {
    try {
        const data = await serverApi.getAllProducts();
        productsModel.setAllProducts(data.items);
        renderCatalog(productsModel.getAllProduct());
        updateBasketCounter();
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

// ============================================
// 3. ПОДПИСКИ НА СОБЫТИЯ
// ============================================
events.on('card:select', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) {
        productsModel.saveProduct(product);
    }
});

productsModel.on('product:changed', (product: IProduct) => {
    const template = getTemplate('card-preview');
    const clone = template.content.cloneNode(true) as HTMLElement;

    const isInCart = cartModel.checkProduct(product.id);
    const buttonText = isInCart ? 'Удалить из корзины' : 'В корзину';

    const previewCard = new CardPreview(clone, () => {
        if (cartModel.checkProduct(product.id)) {
            cartModel.deleteProduct(product);
        } else {
            cartModel.setNewProduct(product);
        }
        updateBasketCounter();
        previewCard.buttonText = cartModel.checkProduct(product.id) ? 'Удалить из корзины' : 'В корзину';
    });

    previewCard.render({
        title: product.title,
        price: product.price,
        category: product.category,
        image: CDN_URL + product.image.replace('.svg', '.png'),
        description: product.description
    });
    previewCard.buttonText = buttonText;
    previewCard.disabled = product.price === null;

    modalView.content = previewCard.render();
    modalView.open('preview');
});

events.on('basket:remove', (data: { id: string }) => {
    const product = cartModel.getAllProducts().find(p => p.id === data.id);
    if (product) {
        cartModel.deleteProduct(product);
    }
});

cartModel.on('cart:changed', () => {
    updateBasketCounter();
    
    // Если корзина сейчас открыта — обновляем её содержимое
    if (modalView.isOpen && basketView) {
        const cartItems = cartModel.getAllProducts();
        const cards = cartItems.map((product, i) => createBasketCard(product, i));
        
        basketView.items = cards;
        basketView.total = cartModel.getAllPrice();
        basketView.disabled = cards.length === 0;
        
        // Обновляем содержимое модального окна, не пересоздавая basketView
        const currentContent = modalView.content;
        if (currentContent === basketView.element) {
            modalView.content = basketView.render();
        }
    }
});

// ============================================
// 4. ЗАПУСК
// ============================================
const basketButton = document.querySelector('.header__basket');
if (basketButton) {
    basketButton.addEventListener('click', () => {
        renderBasket();
    });
}

loadProducts();