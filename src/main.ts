import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { CDN_URL } from './utils/constants';
import { IProduct, IOrderData, IBuyer } from './types/index';
import { ProductCatalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';
import { ServerApi } from './components/Models/ServerApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { Catalog } from './components/Viev/Catalog';
import { Basket } from './components/Viev/Basket';
import { Modal } from './components/Viev/Modal';
import { Header } from './components/Viev/Header';
import { OrderForm } from './components/Viev/OrderForm';
import { ContactsForm } from './components/Viev/ContactsForm';
import { Success } from './components/Viev/Success';
import { CardCatalog } from './components/Viev/CardCatalog';
import { CardPreview } from './components/Viev/CardPreviev';
import { CardBasket } from './components/Viev/CardBasket';


const events = new EventEmitter();

const productsModel = new ProductCatalog();
const cartModel = new Cart();
const customerModel = new Customer();
const api = new Api(API_URL);
const serverApi = new ServerApi(api);

const pageContainer = document.querySelector('.page') as HTMLElement;
const catalogView = new Catalog(pageContainer);
const modalView = new Modal(pageContainer);
const headerView = new Header(pageContainer, () => {
    events.emit('basket:open');
});

const basketTemplate = getTemplate('basket');
const basketClone = basketTemplate.content.cloneNode(true) as HTMLElement;
const basketView = new Basket(basketClone, () => {
    openOrderForm();
});


const orderTemplate = getTemplate('order');
const orderClone = orderTemplate.content.cloneNode(true) as HTMLElement;
const orderForm = new OrderForm(orderClone,
    (field, value) => events.emit('order:change', { field, value }),
    () => {
        console.log('Колбэк onSubmit вызван'); // ← ДОБАВЬ
        events.emit('order:submit');
    }
);
const contactsTemplate = getTemplate('contacts');
const contactsClone = contactsTemplate.content.cloneNode(true) as HTMLElement;
const contactsForm = new ContactsForm(contactsClone,
    (field, value) => events.emit('contacts:change', { field, value }),
    () => {
        console.log('Колбэк onSubmit для контактов вызван'); // ← ДОБАВЬ
        events.emit('contacts:submit');
    }
);
let successView: Success | null = null;


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

function updateBasketData(): void {
    const cartItems = cartModel.getAllProducts();
    const cards = cartItems.map((product, i) => createBasketCard(product, i));
    
    basketView.items = cards;
    basketView.total = cartModel.getAllPrice();
    basketView.disabled = cards.length === 0;
}

function updateBasketCounter(): void {
    headerView.counter = cartModel.getAllCount();
}

function openBasket(): void {
    updateBasketData();
    modalView.content = basketView.render();
    modalView.open('form');
}

function openOrderForm(): void {
    modalView.content = orderForm.element;
    modalView.open('form');
}

function showSuccess(total: number): void {
    if (!successView) {
        const successTemplate = getTemplate('success');
        const successClone = successTemplate.content.cloneNode(true) as HTMLElement;
        successView = new Success(successClone, () => {
            modalView.close();
        });
    }

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


events.on('card:select', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) {
        productsModel.saveProduct(product);
    }
});

events.on('basket:open', () => {
    openBasket();
});

events.on('basket:remove', (data: { id: string }) => {
    const product = cartModel.getAllProducts().find(p => p.id === data.id);
    if (product) {
        cartModel.deleteProduct(product);
        updateBasketData();
    }
});

events.on('order:change', ({ field, value }: { field: string; value: string }) => {
    if (field === 'payment') customerModel.setPayment(value as 'card' | 'cash');
    if (field === 'address') customerModel.setAddress(value);
});

events.on('contacts:change', ({ field, value }: { field: string; value: string }) => {
    if (field === 'email') customerModel.setEmail(value);
    if (field === 'phone') customerModel.setPhone(value);
});

events.on('order:submit', () => {
     console.log('order:submit сработал'); 
    modalView.content = contactsForm.element;
    modalView.open('form');
});


events.on('contacts:submit', async () => {
    console.log('contacts:submit сработал'); // ← ДОБАВЬ
    
    const errors = customerModel.validateContacts();
    console.log('Ошибки валидации:', errors); // ← ДОБАВЬ
    
    if (Object.keys(errors).length > 0) return;
    
    const orderData: IOrderData = {
        payment: customerModel.getPayment(),
        email: customerModel.getEmail(),
        phone: customerModel.getPhone(),
        address: customerModel.getAddress(),
        total: cartModel.getAllPrice(),
        items: cartModel.getAllProducts().map(p => p.id)
    };
    
    console.log('Отправка заказа:', orderData); // ← ДОБАВЬ
    
    try {
        const result = await serverApi.sendDataOnServer(orderData);
        console.log('Результат отправки:', result); // ← ДОБАВЬ
        showSuccess(result.total);
        cartModel.deleteAll();
        customerModel.deleteAllData();
        updateBasketCounter();
        updateBasketData();
    } catch (error) {
        console.error('Ошибка отправки заказа:', error);
        contactsForm.errors = 'Ошибка при оформлении заказа';
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
        updateBasketData();
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

cartModel.on('cart:changed', () => {
    updateBasketCounter();
    updateBasketData();
});


customerModel.on('customer:changed', (data: IBuyer) => {
    orderForm.address = data.address;
    orderForm.payment = data.payment as 'card' | 'cash';
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    
    
    const orderErrors = customerModel.validateOrder();
    const orderErrorsText = Object.values(orderErrors).join(', ');
    orderForm.errors = orderErrorsText;
    orderForm.valid = Object.keys(orderErrors).length === 0;
    
    
    const contactsErrors = customerModel.validateContacts();
    const contactsErrorsText = Object.values(contactsErrors).join(', ');
    contactsForm.errors = contactsErrorsText;
    contactsForm.valid = Object.keys(contactsErrors).length === 0;
});

loadProducts();