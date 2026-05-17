import { Component } from '../base/Component';

export class Catalog extends Component<{ items: HTMLElement[] }> {
    private _gallery: HTMLElement | null;
   

    constructor(container: HTMLElement) {
        super(container);
        this._gallery = container.querySelector('.gallery');
      
    }

    set items(cards: HTMLElement[]) {
        if (this._gallery) {
            this._gallery.replaceChildren(...cards);
        }
    }

   
}