# Проектная работа "Веб-ларек"

**GitHub:** https://github.com/vacheslavKoz/weblarek

**Стек:** HTML, SCSS, TS, Vite

---

## Структура проекта
src/
├── components/
│ ├── base/ # базовые классы (Component, Api, EventEmitter)
│ ├── Models/ # модели данных
│ └── Viev/ # классы представления (View)
├── scss/ # стили
├── types/ # типы данных
├── utils/ # утилиты и константы
├── main.ts # точка входа (презентер)
└── index.html # главная страница


### Важные файлы

| Файл | Назначение |
|------|------------|
| `src/types/index.ts` | Типы данных |
| `src/main.ts` | Презентер, логика приложения |
| `src/scss/styles.scss` | Корневые стили |
| `src/utils/constants.ts` | Константы (API_URL, CDN_URL, categoryMap) |

---

## Установка и запуск
npm install
npm run dev


или
yarn
yarn dev


## Сборка
npm run build


или
yarn build


---

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — интернет-магазин с товарами для веб-разработчиков. Пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы.

---

## Архитектура приложения (MVP)

| Слой | Ответственность |
|------|----------------|
| Model | Хранение и изменение данных |
| View | Отображение данных на странице |
| Presenter | Связь Model и View, бизнес-логика |

**Взаимодействие между слоями построено на событиях (EventEmitter):**
- Модели генерируют события при изменении данных
- Представления генерируют события при действиях пользователя
- Презентер подписывается на события и реагирует на них

---

## Базовый код

### `Component<T>`

**Конструктор:** `constructor(container: HTMLElement)`

| Метод | Описание |
|-------|----------|
| `render(data?: Partial<T>): HTMLElement` | Отрисовка компонента |
| `setImage(element: HTMLImageElement, src: string, alt?: string): void` | Установка изображения |

---

### `Api`

**Конструктор:** `constructor(baseUrl: string, options: RequestInit = {})`

| Метод | Описание |
|-------|----------|
| `get<T extends object>(uri: string): Promise<T>` | GET-запрос |
| `post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` | POST-запрос |
| `protected handleResponse<T>(response: Response): Promise<T>` | Обработка ответа |

---

### `EventEmitter`

| Метод | Описание |
|-------|----------|
| `on<T extends object>(event: EventName, callback: (data: T) => void): void` | Подписка на событие |
| `emit<T extends object>(event: string, data?: T): void` | Вызов события |
| `trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` | Создание триггера |

---

## Модели данных (Model)

### `ProductCatalog` — каталог товаров

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `products` | `IProduct[]` | Массив товаров |
| `choosenProduct` | `IProduct \| null` | Выбранный товар |

**Методы:**

| Метод | Описание |
|-------|----------|
| `setAllProducts(products: IProduct[]): void` | Сохранить массив товаров |
| `getAllProduct(): IProduct[]` | Получить все товары |
| `getProductById(id: string): IProduct \| undefined` | Найти товар по id |
| `saveProduct(product: IProduct): void` | Сохранить выбранный товар |
| `getChosenProduct(): IProduct \| null` | Получить выбранный товар |

**События:** `products:changed`, `product:changed`

---

### `Cart` — корзина

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `cartProducts` | `IProduct[]` | Массив товаров в корзине |

**Методы:**

| Метод | Описание |
|-------|----------|
| `saveAllProducts(products: IProduct[]): void` | Сохранить все товары |
| `getAllProducts(): IProduct[]` | Получить все товары из корзины |
| `setNewProduct(product: IProduct): void` | Добавить товар |
| `deleteProduct(product: IProduct): void` | Удалить товар |
| `deleteAll(): void` | Очистить корзину |
| `getAllPrice(): number` | Общая стоимость |
| `getAllCount(): number` | Количество товаров |
| `checkProduct(id: string): boolean` | Проверка наличия товара |

**События:** `cart:changed`

---

### `Customer` — данные покупателя

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `payment` | `TPayment` | Способ оплаты |
| `address` | `string` | Адрес |
| `email` | `string` | Email |
| `phone` | `string` | Телефон |

**Методы:**

| Метод | Описание |
|-------|----------|
| `setPayment(payment: TPayment): void` | Сохранить способ оплаты |
| `setAddress(address: string): void` | Сохранить адрес |
| `setEmail(email: string): void` | Сохранить email |
| `setPhone(phone: string): void` | Сохранить телефон |
| `getAllData(): IBuyer` | Получить все данные |
| `deleteAllData(): void` | Очистить данные |
| `validate(): ValidationErrors` | Валидация всех полей |

**События:** `customer:changed`

---

### `ServerApi` — работа с сервером

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `objectForWorkwithServer` | `IApi` | Экземпляр Api для запросов |

**Методы:**

| Метод | Описание |
|-------|----------|
| `getAllProducts(): Promise<ObjWithProducts>` | GET `/product/` — получить товары |
| `sendDataOnServer(data: IOrderData): Promise<IOrderResponse>` | POST `/order/` — отправить заказ |

---

## Слой представления (View)

### `Card` — базовый класс карточки

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `_title` | `HTMLElement \| null` | Элемент с названием товара |
| `_price` | `HTMLElement \| null` | Элемент с ценой |

**Методы (сеттеры):**

| Сеттер | Описание |
|--------|----------|
| `set title(value: string): void` | Устанавливает название |
| `set price(value: number \| null): void` | Устанавливает цену («Недоступно» для null) |

---

### `CardCatalog` — карточка в каталоге

**Наследует:** `Card`

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `_category` | `HTMLElement \| null` | Элемент с категорией |
| `_image` | `HTMLImageElement \| null` | Элемент с изображением |

**Методы (сеттеры):**

| Сеттер | Описание |
|--------|----------|
| `set category(value: string): void` | Устанавливает категорию и CSS-класс |
| `set image(value: string): void` | Устанавливает изображение |

**Событие:** `card:select` (клик по карточке)

---

### `CardPreview` — карточка в модальном окне

**Наследует:** `Card`

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `_category` | `HTMLElement \| null` | Элемент с категорией |
| `_image` | `HTMLImageElement \| null` | Элемент с изображением |
| `_text` | `HTMLElement \| null` | Элемент с описанием |
| `_button` | `HTMLButtonElement \| null` | Кнопка действия |

**Методы (сеттеры):**

| Сеттер | Описание |
|--------|----------|
| `set category(value: string): void` | Устанавливает категорию и CSS-класс |
| `set image(value: string): void` | Устанавливает изображение |
| `set description(value: string): void` | Устанавливает описание |
| `set buttonText(value: string): void` | Текст на кнопке |
| `set disabled(value: boolean): void` | Блокировка кнопки |

**Событие:** `card:toggle` (клик по кнопке)

---

### `CardBasket` — карточка в корзине

**Наследует:** `Card`

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `_index` | `HTMLElement \| null` | Элемент с порядковым номером |
| `_deleteButton` | `HTMLButtonElement \| null` | Кнопка удаления |

**Методы (сеттеры):**

| Сеттер | Описание |
|--------|----------|
| `set index(value: number): void` | Устанавливает порядковый номер |

**Событие:** `basket:remove` (клик по кнопке удаления)

---

### `Catalog` — галерея товаров

**Наследует:** `Component<{ items: HTMLElement[] }>`

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `_gallery` | `HTMLElement \| null` | Контейнер галереи |

**Методы (сеттеры):**

| Сеттер | Описание |
|--------|----------|
| `set items(cards: HTMLElement[]): void` | Отображает карточки в галерее |

---

### `Basket` — корзина

**Наследует:** `Component<object>`

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `_basketList` | `HTMLElement \| null` | Список товаров |
| `_basketPrice` | `HTMLElement \| null` | Общая сумма |
| `_basketButton` | `HTMLButtonElement \| null` | Кнопка «Оформить» |

**Методы (сеттеры):**

| Сеттер | Описание |
|--------|----------|
| `set items(cards: HTMLElement[]): void` | Отображает товары или «Корзина пуста» |
| `set total(value: number): void` | Обновляет общую сумму |
| `set disabled(value: boolean): void` | Блокирует кнопку «Оформить» |

**Событие:** `basket:checkout` (клик по кнопке «Оформить»)

---

### `Header` — шапка сайта

**Наследует:** `Component<{ counter: number }>`

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `_counter` | `HTMLElement \| null` | Счётчик корзины |
| `_basketButton` | `HTMLButtonElement \| null` | Кнопка корзины |

**Методы (сеттеры):**

| Сеттер | Описание |
|--------|----------|
| `set counter(value: number): void` | Обновляет счётчик корзины |

**Событие:** `basket:open` (клик по иконке корзины)

---

### `Modal` — модальное окно

**Наследует:** `Component<object>`

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `_modal` | `HTMLElement \| null` | Корневой элемент модалки |
| `_content` | `HTMLElement \| null` | Контейнер контента |
| `_closeButton` | `HTMLButtonElement \| null` | Кнопка закрытия |

**Методы:**

| Метод | Описание |
|-------|----------|
| `open(): void` | Открыть модальное окно |
| `close(): void` | Закрыть модальное окно |
| `set content(content: HTMLElement): void` | Вставить контент |
| `get isOpen(): boolean` | Проверить, открыто ли окно |

---

### `Form` — базовый класс для форм

**Наследует:** `Component<object>`

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `_submitButton` | `HTMLButtonElement \| null` | Кнопка отправки |
| `_errorsContainer` | `HTMLElement \| null` | Контейнер для ошибок |
| `onSubmitCallback` | `(() => void) \| undefined` | Колбэк отправки |

**Методы:**

| Метод | Описание |
|-------|----------|
| `set errors(value: string): void` | Показать ошибку |
| `set valid(value: boolean): void` | Управление кнопкой отправки |
| `set onSubmit(callback: () => void): void` | Установить колбэк отправки |
| `render(): HTMLElement` | Получить корневой элемент формы |

---

### `OrderForm` — форма первого шага

**Наследует:** `Form<object>`

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `_cardButton` | `HTMLButtonElement \| null` | Кнопка «Онлайн» |
| `_cashButton` | `HTMLButtonElement \| null` | Кнопка «При получении» |
| `_addressInput` | `HTMLInputElement \| null` | Поле ввода адреса |

**Методы (сеттеры):**

| Сеттер | Описание |
|--------|----------|
| `set payment(value: 'card' \| 'cash' \| null): void` | Подсветка выбранного способа оплаты |
| `set address(value: string): void` | Установка адреса |

**События:** `order:change`, `order:submit`

---

### `ContactsForm` — форма второго шага

**Наследует:** `Form<object>`

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `_emailInput` | `HTMLInputElement \| null` | Поле ввода email |
| `_phoneInput` | `HTMLInputElement \| null` | Поле ввода телефона |

**Методы (сеттеры):**

| Сеттер | Описание |
|--------|----------|
| `set email(value: string): void` | Установка email |
| `set phone(value: string): void` | Установка телефона |

**События:** `contacts:change`, `contacts:submit`

---

### `Success` — сообщение об успехе

**Наследует:** `Component<object>`

**Поля:**

| Поле | Тип | Описание |
|------|-----|----------|
| `_closeButton` | `HTMLButtonElement \| null` | Кнопка закрытия |
| `_description` | `HTMLElement \| null` | Элемент с описанием списания |

**Методы (сеттеры):**

| Сеттер | Описание |
|--------|----------|
| `set total(value: number): void` | Устанавливает сумму списания |

---

## Событийная модель

### События от представлений

| Событие | Источник | Данные |
|---------|----------|--------|
| `card:select` | `CardCatalog` | `{ id: string }` |
| `card:toggle` | `CardPreview` | `{ id: string }` |
| `basket:remove` | `CardBasket` | `{ id: string }` |
| `basket:open` | `Header` | — |
| `basket:checkout` | `Basket` | — |
| `order:change` | `OrderForm` | `{ field: string, value: string }` |
| `order:submit` | `OrderForm` | — |
| `contacts:change` | `ContactsForm` | `{ field: string, value: string }` |
| `contacts:submit` | `ContactsForm` | — |

### События от моделей

| Событие | Источник | Данные |
|---------|----------|--------|
| `products:changed` | `ProductCatalog` | `IProduct[]` |
| `product:changed` | `ProductCatalog` | `IProduct` |
| `cart:changed` | `Cart` | `IProduct[]` |
| `customer:changed` | `Customer` | `IBuyer` |

---

## Типы данных

### `IProduct` — объект товара

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | `string` | Уникальный идентификатор |
| `title` | `string` | Название товара |
| `description` | `string` | Описание |
| `image` | `string` | Путь к изображению |
| `category` | `string` | Категория |
| `price` | `number \| null` | Цена (null — бесплатно) |

### `IBuyer` — данные покупателя

| Поле | Тип | Описание |
|------|-----|----------|
| `payment` | `TPayment` | Способ оплаты |
| `email` | `string` | Электронная почта |
| `phone` | `string` | Номер телефона |
| `address` | `string` | Адрес доставки |

### Дополнительные типы

| Тип | Описание |
|-----|----------|
| `TPayment` | `'cash' \| 'card' \| ''` |
| `ValidationErrors` | Ошибки валидации (поля опциональны) |
| `ObjWithProducts` | `{ total: number; items: IProduct[] }` |
| `IOrderData` | `extends IBuyer { total: number; items: string[] }` |
| `IOrderResponse` | `{ id: string; total: number }` |
| `IApi` | `{ get<T>(uri: string): Promise<T>; post<T>(uri: string, data: object): Promise<T> }` |
| `ApiPostMethods` | `'POST' \| 'PUT' \| 'DELETE'` |


