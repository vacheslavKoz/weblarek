import { Component } from '../base/Component';

export class Modal extends Component<object> {
    private _modal: HTMLElement | null;
    private _content: HTMLElement | null;
    private _closeButton: HTMLButtonElement | null;

    constructor(container: HTMLElement) {
        super(container);

        this._modal = this.container.querySelector('.modal');
        if (this._modal) {
            this._modal.addEventListener('click', (e) => {
                if (e.target === this._modal) {
                    this.close();
                }
            });
        }

        this._content = this.container.querySelector('.modal__content');
        this._closeButton = this.container.querySelector('.modal__close');
        if (this._closeButton) {
            this._closeButton.addEventListener('click', () => this.close());
        }
    }

    open(type?: 'preview' | 'form'): void {
        if (this._modal) {
            this._modal.classList.remove('modal_preview', 'modal_form');

            if (type === 'preview') {
                this._modal.classList.add('modal_preview');
            }
            if (type === 'form') {
                this._modal.classList.add('modal_form');
            }

            this._modal.classList.add('modal_active');
        }
    }

   // close(): void {
      //  if (this._modal) {
         //   this._modal.classList.remove('modal_active');
        //    this._modal.classList.remove('modal_preview', 'modal_form');
       // }
   // }
  // close(): void {
   // if (this._modal) {
      //  this._modal.classList.remove('modal_active');
      //  this._modal.classList.remove('modal_preview', 'modal_form');
      //  // НЕ ОЧИЩАЕМ this._content.innerHTML
    //}
//}
close(): void {
    if (this._modal) {
        console.log('Закрытие модалки');
        console.log('Содержимое _content до очистки:', this._content?.innerHTML);
        
        this._modal.classList.remove('modal_active', 'modal_preview', 'modal_form');
        
        console.log('Содержимое _content после снятия классов:', this._content?.innerHTML);
    }
}
    set content(content: HTMLElement) {
        if (this._content) {
            this._content.replaceChildren(content);
        }
    }

    get content(): HTMLElement {
        return this._content?.firstChild as HTMLElement;
    }

    get isOpen(): boolean {
        return this._modal?.classList.contains('modal_active') || false;
    }
}