# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.
## Данные
 ## Класс ProductCatalog
Класс используется для  хранения всех товаров полученных с сервера . 

### Интерфейс IProduct
Класс работает с интерфейсом IProduct, который описывает структуру товара, получаемого с сервера. 
|Поле            | Тип      | Описание                              |
|id                 |  string  |   идентификатор товара       |
|description | string         |  описание товара                  |
|image          |  string        |    путь к изображению товара|
|title              |      string     |   название товара               |
|category     |       string     |     катергория товара            |
|price           |   number     | null  цена товара (null если товар бесценный)|

конструктор принимает массив товаров полученных с сервера

Поля класса: protected products: IProduct[] = [] 
хранит все товары, полученные с сервера
protected product: IProduct  | undefined
поле которое хранит товар , выбранный  по id
protected chooseProduct: IProduct | undefined
поле  хранит товар , который выбрал пользователь
методы класса: 
setAllProducts(products: IProduct[]): void
принимает массив товаров и записывает его в поле products
getProductById(id: string): IProduct | undefined 
позволяет получить товар по id, если товар не найден возвращает undefined,а также 
сохраняет выбранный товар в поле product
getAllProduct(): IProduct[]
позволяет получить все товары каталога
saveProduct(product: IProduct): void
сохраняет  выбранный товар
getProduct(): IProduct | undefined
позволяет получить, выбранный товар

 ## Класс Cart 
класс реализует корзину покупателя, а именно в корзину можно добавлять товары для дальнейшей  покупки 

конструктор принимает  массив с товарами IProduct[]

Поля класса:  
поле cartProducts : IProduct[] = [] 
в нем хранится массив товаров 

Методы класса:

getAllProducts(): IProduct[] 
метод возвращает массив товаров
setNewProduct(product: IProduct): void
метод добавляет в корзину новый товар 
а именно в cartProducts
deleteProduct(product: IProduct): void
метод удаляет конкретный товар из корзины, а именно из массива cartProducts
deleteAll(): void 
метод удаляет все товары из корзины
метод getAllPrice(): number  
считает сумму всех товаров из корзины, а именно проходит по массиву  cartProducts и суммирует значения у поля price у всех элементов этого массива, если цена у товара null , она считается как 0
getAllCount(): number
метод считает общее количество товаров в корзине, а именно количеcтво элементов в массиве 
cartProducts
checkProduct(id: string): boolean
метод проверяет есть ли в корзине конкретный товар, с указанным id ,возвращая true если есть и false если нет

Пример использования:

const ProductCart = new Cart(apiProducts.items)

console.log("метод, который позволяет получить все товары в корзине", ProductCart.getAllProducts())
console.log("метод для добавления нового товара в корзину", ProductCart.setNewProduct(apiProducts.items[1]))
console.log("метод, который удаляет товар из корзины", ProductCart.deleteProduct(apiProducts.items[1]))
console.log("метод, который очищает корзину", ProductCart.deleteAll())
console.log("метод, который выдает итоговую сумму", ProductCart.getAllPrice())
console.log("метод, который считает количество товаров в корзине", ProductCart.getAllCount())
console.log("метод, который проверяет наличие товара в корзине", ProductCart.checkProduct(apiProducts.items[1].id))

Класс Customer
Класс хранит данные покупателя: способ оплаты, адрес, email, телефон. Позволяет сохранять данные по отдельности (не удаляя другие поля), получать все данные, очищать и проверять валидность полей.

Конструктор: не принимает параметров (все поля пустые по умолчанию)

Поля класса:

payment: TPayment — способ оплаты (cash, card, online или пустая строка)

address: string — адрес доставки

email: string — email покупателя

phone: string — телефон покупателя

Методы класса:

setPayment(payment: TPayment): void — сохраняет способ оплаты

setAddress(address: string): void — сохраняет адрес

setEmail(email: string): void — сохраняет email

setPhone(phone: string): void — сохраняет телефон

getAllData(): IBuyer — возвращает объект со всеми данными покупателя

deleteAllData(): void — очищает все поля

validate(): ValidationErrors — проверяет, какие поля не заполнены. Возвращает объект с ошибками только для пустых полей. Например, если не заполнен email, вернёт { email: "Укажите email" }. Если все поля валидны, вернёт пустой объект {}.

isPaymentValid(): ValidationErrors — проверяет только поле payment

isEmailValid(): ValidationErrors — проверяет только поле email

isPhoneValid(): ValidationErrors — проверяет только поле phone

isAddressValid(): ValidationErrors — проверяет только поле address

Пример использования:
const ObjectCustomer = new Customer()

console.log("выбор способа оплаты", ObjectCustomer.setPayment("online"))
console.log("метод для указания аддресса", ObjectCustomer.setAddress("ул. Садовническая"))
console.log("метод для указания почты", ObjectCustomer.setEmail("example@.com"))
console.log("метод для указания телефона", ObjectCustomer.setPhone("343435454545"))
console.log("метод для получения всех введеных данных", ObjectCustomer.getAllData())
console.log("метод для очистки всех данных", ObjectCustomer.deleteAllData())
console.log("метод, который укажет какие поля не заполнены", ObjectCustomer.validate())
console.log("метод проверяющий заполнено ли поле способа оплаты", ObjectCustomer.isPaymentValid())
console.log("метод проверяющий заполнено ли поле почты", ObjectCustomer.isEmailValid())
console.log("метод, проверяющий заполнено ли поле телефона", ObjectCustomer.isPhoneValid())
console.log("метод проверяющий заполнено ли поле способа оплаты", ObjectCustomer.isAddressValid())

Класс ServerApi
Класс отвечает за взаимодействие с сервером. Использует композицию — принимает в конструкторе объект, реализующий интерфейс IApi (например, экземпляр класса Api), и через него выполняет GET и POST запросы.

Конструктор: принимает объект с интерфейсом IApi

Поля класса:

allProducts: objWithProducts — хранит объект с товарами, полученными с сервера (поля total и items)

objectForWorkwithServer: IApi — объект для выполнения запросов (принимается в конструкторе)

receiveAnswerObject: IOrderResponse — хранит ответ сервера после оформления заказа

Методы класса:

getAllProducts(settingUrl: string): Promise<objWithProducts> — выполняет GET запрос по указанному эндпоинту, получает с сервера объект с массивом товаров, сохраняет его в поле allProducts и возвращает

sendDataOnServer(url: string, data: IOrderData): Promise<IOrderResponse> — выполняет POST запрос на указанный эндпоинт, отправляет на сервер данные о заказе (способ оплаты, email, телефон, адрес, общую сумму и массив id товаров), сохраняет ответ сервера в поле receiveAnswerObject и возвращает его

Пример использования:
let ObjectServerApi = new ServerApi(new Api(`https://larek-api.nomoreparties.co/api/weblarek`))

async function getProductsFromServer(): Promise<void> {

console.log("получение всез товаров с сервера", await ObjectServerApi.getAllProducts("/product/"))

}

let ObjectCustomertoSend : IOrderData = {

 payment: "online",
    email: "john@gmail.com",
    phone: "34343434",
    address: "ул Садовническая",
    total: 750,
    items: ["854cef69-976d-4c2a-a18c-2aa45046c390"]

}




async function sendProductsOnServer(): Promise<void> {

console.log("отправка на сервер оформленного заказа",await ObjectServerApi.sendDataOnServer("/order",ObjectCustomertoSend))

}
getProductsFromServer()
sendProductsOnServer()

Типы данных (src/types/index.ts)
IProduct — интерфейс товара (описан выше)

TPayment — тип для способа оплаты: "cash" | "card" | "online" | ""

IBuyer — интерфейс покупателя, объединяет payment, email, phone, address

ValidationErrors — тип для ошибок валидации, все поля опциональные: { payment?: string, email?: string, phone?: string, address?: string }

objWithProducts — объект с товарами от сервера: { total: number, items: IProduct[] }

IOrderData — данные для отправки заказа: { payment: string, email: string, phone: string, address: string, total: number, items: string[] }

IOrderResponse — ответ сервера после оформления заказа: { id: string, total: number }

IApi — интерфейс для работы с API: методы get и post

ApiPostMethods — тип для методов POST-запросов: 'POST' | 'PUT' | 'DELETE'

