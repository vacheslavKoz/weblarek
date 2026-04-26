import './scss/styles.scss';
import { ProductCatalog } from './components/Models/Catalog';
import { Customer } from './components/Models/Customer';
import { ServerApi } from './components/Models/ServerApi';
import { Cart } from './components/Models/Cart';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { IOrderData } from './types/index';
import { API_URL } from './utils/constants';

const productsModel = new ProductCatalog();

// методы класса, в котором реализуется каталог товаров
console.log('метод для сохранения всех товаров', productsModel.setAllProducts(apiProducts.items));
console.log('метод выводит все товары', productsModel.getAllProduct());
console.log('поиск товара по id', productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('сохранение конкретного товара', productsModel.saveProduct(apiProducts.items[0]));
console.log('получение ранее сохраненного товара', productsModel.getChosenProduct());

// методы класса, в котором реализуется корзина товаров
const productCart = new Cart();

console.log('метод, который сохраняет все переданные товары в корзину', productCart.saveAllProducts(apiProducts.items));
console.log('метод, который позволяет получить все товары в корзине', productCart.getAllProducts());
console.log('метод для добавления нового товара в корзину', productCart.setNewProduct(apiProducts.items[1]));
console.log('метод, который выдает итоговую сумму', productCart.getAllPrice());
console.log('метод, который считает количество товаров в корзине', productCart.getAllCount());
console.log('метод, который проверяет наличие товара в корзине', productCart.checkProduct(apiProducts.items[1].id));
console.log('метод, который удаляет товар из корзины', productCart.deleteProduct(apiProducts.items[1]));
console.log('метод, который очищает корзину', productCart.deleteAll());

// методы класса, в котором реализуется работа с покупателем
const objectCustomer = new Customer();

console.log('выбор способа оплаты', objectCustomer.setPayment('card'));
console.log('метод для указания адреса', objectCustomer.setAddress('ул. Садовническая'));
console.log('метод для указания почты', objectCustomer.setEmail('example@.com'));
console.log('метод для указания телефона', objectCustomer.setPhone('343435454545'));
console.log('метод для получения всех введенных данных', objectCustomer.getAllData());
console.log('метод для очистки всех данных', objectCustomer.deleteAllData());
console.log('метод, который укажет какие поля не заполнены', objectCustomer.validate());

// методы класса, в котором реализовано взаимодействие с сервером
const objApi = new Api(API_URL)
const objectServerApi = new ServerApi(objApi);

async function getProductsFromServer(): Promise<void> {
  try {
  const serverData = await objectServerApi.getAllProducts();
  console.log('получение всех товаров с сервера', serverData);
  productsModel.setAllProducts(serverData.items);

  } catch(err)
   {
    console.log("ошибка загрузки данных", err)
  }
}

const objectCustomerToSend: IOrderData = {
  payment: 'card',
  email: 'john@gmail.com',
  phone: '34343434',
  address: 'ул Садовническая',
  total: 750,
  items: ['854cef69-976d-4c2a-a18c-2aa45046c390'],
};

async function sendProductsOnServer(): Promise<void> {
  try {
  console.log(
    'отправка на сервер оформленного заказа',
    await objectServerApi.sendDataOnServer(objectCustomerToSend)
  );
} catch(err) {
 console.log("ошибка отправки данных", err)
}
}

getProductsFromServer();
sendProductsOnServer();



