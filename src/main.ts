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

const productsModel = new ProductCatalog(events);
const cartModel = new Cart(events);
const customerModel = new Customer(events);
const api = new Api(API_URL);
const serverApi = new ServerApi(api);

const pageContainer = document.querySelector('.page') as HTMLElement;
const catalogView = new Catalog(pageContainer);
const modalView = new Modal(pageContainer);
const headerView = new Header(pageContainer, () => {
  events.emit('basket:open');
});

const basketTemplate = getTemplate('basket');
const basketElement = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const basketView = new Basket(basketElement, () => {
  events.emit('order:open');
});
basketView.disabled = true;

const orderTemplate = getTemplate('order');
const orderElement = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const orderForm = new OrderForm(orderElement,
  (field, value) => events.emit('order:change', { field, value }),
  () => events.emit('order:submit')
);

const contactsTemplate = getTemplate('contacts');
const contactsElement = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const contactsForm = new ContactsForm(contactsElement,
  (field, value) => events.emit('contacts:change', { field, value }),
  () => events.emit('contacts:submit')
);

const previewTemplate = getTemplate('card-preview');
const previewElement = previewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const previewCard = new CardPreview(previewElement, () => {
  const product = productsModel.getChosenProduct();
  if (product) {
    events.emit('card:toggle', { id: product.id });
  }
});

const successTemplate = getTemplate('success');
const successElement = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const successView = new Success(successElement, () => modalView.close());

function getTemplate(id: string): HTMLTemplateElement {
  const template = document.getElementById(id) as HTMLTemplateElement;
  if (!template) throw new Error(`Template ${id} not found`);
  return template;
}

function createCatalogCard(product: IProduct): HTMLElement {
  const template = document.getElementById('card-catalog') as HTMLTemplateElement;
  if (!template) throw new Error('Template card-catalog not found');

  const element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const card = new CardCatalog(element, (id) => {
    events.emit('card:select', { id });
  });

  card.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: CDN_URL + product.image.replace('.svg', '.png'),
    id: product.id,
  });

  return element;
}

function createBasketCard(product: IProduct, index: number): HTMLElement {
  const template = getTemplate('card-basket');
  const element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const card = new CardBasket(element, (id) => {
    events.emit('basket:remove', { id });
  });

  card.render({
    title: product.title,
    price: product.price,
    id: product.id,
  });
  card.index = index + 1;

  return element;
}

function updateBasket(): void {
  const cartItems = cartModel.getAllProducts();
  const cards = cartItems.map((product, i) => createBasketCard(product, i));

  basketView.items = cards;
  basketView.total = cartModel.getAllPrice();
  basketView.disabled = cards.length === 0;
  headerView.counter = cartModel.getAllCount();
}

function renderCatalog(): void {
  const products = productsModel.getAllProduct();
  const cards = products.map(product => createCatalogCard(product));
  catalogView.items = cards;
}

events.on('products:changed', renderCatalog);

events.on('card:select', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) {
    productsModel.saveProduct(product);
  }
});

events.on('product:changed', () => {
  const product = productsModel.getChosenProduct();
  if (!product) return;

  previewCard.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: CDN_URL + product.image.replace('.svg', '.png'),
    description: product.description,
  });

  const isInCart = cartModel.checkProduct(product.id);
  previewCard.buttonText = isInCart ? 'Удалить из корзины' : 'В корзину';
  previewCard.disabled = product.price === null;

  modalView.content = previewCard.render();
  modalView.open();
});

events.on('card:toggle', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) {
    if (cartModel.checkProduct(product.id)) {
      cartModel.deleteProduct(product);
    } else {
      cartModel.setNewProduct(product);
    }
  }
});

events.on('cart:changed', () => {
  updateBasket();

  if (modalView.isOpen) {
    const product = productsModel.getChosenProduct();
    if (product) {
      const isInCart = cartModel.checkProduct(product.id);
      previewCard.buttonText = isInCart ? 'Удалить из корзины' : 'В корзину';
    }
  }
});

events.on('basket:remove', (data: { id: string }) => {
  const product = cartModel.getAllProducts().find(p => p.id === data.id);
  if (product) {
    cartModel.deleteProduct(product);
  }
});

events.on('basket:open', () => {
  modalView.content = basketView.render();
  modalView.open();
});

events.on('order:open', () => {
  modalView.content = orderForm.render();
  modalView.open();
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
  const errors = customerModel.validate();
  if (errors.payment || errors.address) return;
  modalView.content = contactsForm.render();
});

events.on('contacts:submit', async () => {
  const errors = customerModel.validate();
  if (errors.email || errors.phone) {
    contactsForm.errors = [errors.email, errors.phone].filter(Boolean).join(', ');
    return;
  }

  const orderData: IOrderData = {
    payment: customerModel.getPayment(),
    email: customerModel.getEmail(),
    phone: customerModel.getPhone(),
    address: customerModel.getAddress(),
    total: cartModel.getAllPrice(),
    items: cartModel.getAllProducts().map(p => p.id),
  };

  try {
    const result = await serverApi.sendDataOnServer(orderData);

    successView.total = result.total;
    modalView.content = successView.render();
    modalView.open();

    cartModel.deleteAll();
    customerModel.deleteAllData();
  } catch (error) {
    console.error('Ошибка отправки заказа:', error);
    contactsForm.errors = 'Ошибка при оформлении заказа';
  }
});

events.on('customer:changed', () => {
  const data = customerModel.getAllData();
  const errors = customerModel.validate();

  orderForm.payment = data.payment as 'card' | 'cash' | null;
  orderForm.address = data.address;
  contactsForm.email = data.email;
  contactsForm.phone = data.phone;

  orderForm.valid = !errors.payment && !errors.address;
  orderForm.errors = [errors.payment, errors.address].filter(Boolean).join(', ');

  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.errors = [errors.email, errors.phone].filter(Boolean).join(', ');
});

async function loadProducts(): Promise<void> {
  try {
    const data = await serverApi.getAllProducts();
    productsModel.setAllProducts(data.items);
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
  }
}

loadProducts();