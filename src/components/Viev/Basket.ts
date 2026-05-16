import { Component } from '../base/Component';

export class Basket extends Component<object> {
    private _basketList: HTMLElement | null;
    private _basketPrice: HTMLElement | null;
    private _basketButton: HTMLButtonElement | null;
    private _element: HTMLElement; // сохраняем ссылку на реальный элемент

    constructor(container: HTMLElement, onCheckout?: () => void) {
        super(container);
        
        // Определяем реальный DOM-элемент сразу в конструкторе
        if (this.container instanceof DocumentFragment) {
            this._element = this.container.children[0] as HTMLElement;
        } else {
            this._element = this.container as HTMLElement;
        }
        
        this._basketList = this._element.querySelector('.basket__list');
        this._basketPrice = this._element.querySelector('.basket__price');
        this._basketButton = this._element.querySelector('.basket__button');

        if (this._basketButton && onCheckout) {
            this._basketButton.addEventListener('click', onCheckout);
        }
    }

    set items(cards: HTMLElement[]) {
        if (!this._basketList) return;

        if (cards.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.classList.add('basket__empty');
            emptyMessage.textContent = 'Корзина пуста';
            this._basketList.replaceChildren(emptyMessage);
        } else {
            this._basketList.replaceChildren(...cards);
        }
    }

    set total(value: number) {
        if (this._basketPrice) {
            this._basketPrice.textContent = `${value} синапсов`;
        }
    }

    set disabled(value: boolean) {
        if (this._basketButton) {
            this._basketButton.disabled = value;
        }
    }

    get element(): HTMLElement {
        return this._element;
    }

    render(): HTMLElement {
        return this._element;
    }
}