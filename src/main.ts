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
const headerView = new Header(pageContainer, () => {
    events.emit('basket:open');
});

// Представления, создаваемые один раз
const basketTemplate = getTemplate('basket');
const basketClone = basketTemplate.content.cloneNode(true) as HTMLElement;
const basketView = new Basket(basketClone, () => {
    openOrderForm();
});

let successView: Success | null = null;
let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;

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
    modalView.open();
}

function openOrderForm(): void {
    const template = getTemplate('order');
    const clone = template.content.cloneNode(true) as HTMLElement;
    currentOrderForm = new OrderForm(clone,
        (field, value) => {
            console.log('📤 onChange called:', field, value);
            events.emit('order:change', { field, value });
        },
        () => events.emit('order:submit')
    );
    
    const buyer = customerModel.getAllData();
    currentOrderForm.payment = buyer.payment as 'card' | 'cash' | null;
    currentOrderForm.address = buyer.address;
    
    const orderErrors = customerModel.validateOrder();
    currentOrderForm.valid = Object.keys(orderErrors).length === 0;
    currentOrderForm.errors = Object.values(orderErrors).join(', ');
    
    modalView.content = currentOrderForm.element;
    modalView.open();
}

function openContactsForm(): void {
    const template = getTemplate('contacts');
    const clone = template.content.cloneNode(true) as HTMLElement;
    currentContactsForm = new ContactsForm(clone,
        (field, value) => {
            console.log('📤 contacts onChange called:', field, value);
            events.emit('contacts:change', { field, value });
        },
        () => events.emit('contacts:submit')
    );
    
    const buyer = customerModel.getAllData();
    currentContactsForm.email = buyer.email;
    currentContactsForm.phone = buyer.phone;
    
    const contactsErrors = customerModel.validateContacts();
    currentContactsForm.valid = Object.keys(contactsErrors).length === 0;
    currentContactsForm.errors = Object.values(contactsErrors).join(', ');
    
    modalView.content = currentContactsForm.element;
    modalView.open();
}

function resetAfterSuccess(): void {
    basketView.items = [];
    basketView.total = 0;
    basketView.disabled = true;
    updateBasketData();
    updateBasketCounter();
}

function showSuccess(total: number): void {
    const successTemplate = getTemplate('success');
    const successClone = successTemplate.content.cloneNode(true) as HTMLElement;
    const successView = new Success(successClone, () => {
        modalView.close();
        resetAfterSuccess();
    });

    successView.total = total;
    modalView.content = successView.render();
    modalView.open();
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
        modalView.open();
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
    console.log('📡 order:change received:', field, value);
    if (field === 'payment') {
        customerModel.setPayment(value as 'card' | 'cash');
    }
    if (field === 'address') {
        customerModel.setAddress(value);
    }
});

events.on('contacts:change', ({ field, value }: { field: string; value: string }) => {
    console.log('📡 contacts:change received:', field, value);
    if (field === 'email') {
        customerModel.setEmail(value);
    }
    if (field === 'phone') {
        customerModel.setPhone(value);
    }
});

events.on('order:submit', () => {
    console.log('📡 order:submit received');
    openContactsForm();
});

events.on('contacts:submit', async () => {
    console.log('📡 contacts:submit received');
    
    const errors = customerModel.validateContacts();
    if (Object.keys(errors).length > 0) {
        console.log('Validation errors:', errors);
        return;
    }

    const orderData: IOrderData = {
        payment: customerModel.getPayment(),
        email: customerModel.getEmail(),
        phone: customerModel.getPhone(),
        address: customerModel.getAddress(),
        total: cartModel.getAllPrice(),
        items: cartModel.getAllProducts().map(p => p.id)
    };

    try {
        const result = await serverApi.sendDataOnServer(orderData);
        console.log('Order sent successfully:', result);
        showSuccess(result.total);
        
        cartModel.deleteAll();
        customerModel.deleteAllData();
        updateBasketCounter();
        updateBasketData();
        
    } catch (error) {
        console.error('Ошибка отправки заказа:', error);
        if (currentContactsForm) {
            currentContactsForm.errors = 'Ошибка при оформлении заказа';
        }
    }
});

events.on('product:changed', (product: IProduct) => {
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
    modalView.open();
});

events.on('cart:changed', () => {
    updateBasketCounter();
    updateBasketData();
});

events.on('customer:changed', (data: IBuyer) => {
    console.log('📡 customer:changed received:', data);
    
    if (currentOrderForm && modalView.isOpen) {
        currentOrderForm.payment = data.payment as 'card' | 'cash' | null;
        currentOrderForm.address = data.address;
        
        const orderErrors = customerModel.validateOrder();
        currentOrderForm.valid = Object.keys(orderErrors).length === 0;
        currentOrderForm.errors = Object.values(orderErrors).join(', ');
    }
    
    if (currentContactsForm && modalView.isOpen) {
        currentContactsForm.email = data.email;
        currentContactsForm.phone = data.phone;
        
        const contactsErrors = customerModel.validateContacts();
        currentContactsForm.valid = Object.keys(contactsErrors).length === 0;
        currentContactsForm.errors = Object.values(contactsErrors).join(', ');
    }
});

// ============================================
// 4. ЗАПУСК
// ============================================
loadProducts();