import './scss/styles.scss';
import { ProductCatalog } from './components/Models/Catalog';
import { Customer } from './components/Models/Customer';
import { ServerApi } from './components/Models/ServerApi';
import { Cart } from './components/Models/Cart';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { IOrderData } from './types/index';
import { API_URL } from './utils/constants';

const productsModel = new ProductCatalog(apiProducts.items);
productsModel.setAllProducts(apiProducts.items);

// методы класса, в котором реализуется каталог товаров
console.log('метод выводит все товары', productsModel.getAllProduct());
console.log('поиск товара по id', productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('сохранение конкретного товара', productsModel.saveProduct(apiProducts.items[0]));
console.log('получение ранее сохраненного товара', productsModel.getProduct());

// методы класса, в котором реализуется корзина товаров
const productCart = new Cart(apiProducts.items);

console.log('метод, который позволяет получить все товары в корзине', productCart.getAllProducts());
console.log('метод для добавления нового товара в корзину', productCart.setNewProduct(apiProducts.items[1]));
console.log('метод, который удаляет товар из корзины', productCart.deleteProduct(apiProducts.items[1]));
console.log('метод, который очищает корзину', productCart.deleteAll());
console.log('метод, который выдает итоговую сумму', productCart.getAllPrice());
console.log('метод, который считает количество товаров в корзине', productCart.getAllCount());
console.log('метод, который проверяет наличие товара в корзине', productCart.checkProduct(apiProducts.items[1].id));

// методы класса, в котором реализуется работа с покупателем
const objectCustomer = new Customer();

console.log('выбор способа оплаты', objectCustomer.setPayment('online'));
console.log('метод для указания адреса', objectCustomer.setAddress('ул. Садовническая'));
console.log('метод для указания почты', objectCustomer.setEmail('example@.com'));
console.log('метод для указания телефона', objectCustomer.setPhone('343435454545'));
console.log('метод для получения всех введенных данных', objectCustomer.getAllData());
console.log('метод для очистки всех данных', objectCustomer.deleteAllData());
console.log('метод, который укажет какие поля не заполнены', objectCustomer.validate());
console.log('метод проверяющий заполнено ли поле способа оплаты', objectCustomer.isPaymentValid());
console.log('метод проверяющий заполнено ли поле почты', objectCustomer.isEmailValid());
console.log('метод, проверяющий заполнено ли поле телефона', objectCustomer.isPhoneValid());
console.log('метод проверяющий заполнено ли поле адреса', objectCustomer.isAddressValid());

// методы класса, в котором реализовано взаимодействие с сервером
const objectServerApi = new ServerApi(new Api(API_URL));

async function getProductsFromServer(): Promise<void> {
  const serverData = await objectServerApi.getAllProducts('/product/');
  console.log('получение всех товаров с сервера', serverData);
  productsModel.setAllProducts(serverData.items);
}

const objectCustomerToSend: IOrderData = {
  payment: 'online',
  email: 'john@gmail.com',
  phone: '34343434',
  address: 'ул Садовническая',
  total: 750,
  items: ['854cef69-976d-4c2a-a18c-2aa45046c390'],
};

async function sendProductsOnServer(): Promise<void> {
  console.log(
    'отправка на сервер оформленного заказа',
    await objectServerApi.sendDataOnServer('/order', objectCustomerToSend)
  );
}

getProductsFromServer();
sendProductsOnServer();



