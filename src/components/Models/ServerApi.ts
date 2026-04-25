import { ObjWithProducts, IOrderData, IOrderResponse, IApi } from '../../types';

export class ServerApi {
  allProducts: ObjWithProducts = { total: 0, items: [] };
  objectForWorkwithServer: IApi;
  receiveAnswerObject!: IOrderResponse;

  constructor(object: IApi) {
    this.objectForWorkwithServer = object;
  }

  async getAllProducts(settingUrl: string): Promise<ObjWithProducts> {
    const allProducts = await this.objectForWorkwithServer.get<ObjWithProducts>(settingUrl);
    this.allProducts = allProducts;
    return this.allProducts;
  }

  async sendDataOnServer(url: string, data: IOrderData): Promise<IOrderResponse> {
    this.receiveAnswerObject = await this.objectForWorkwithServer.post<IOrderResponse>(url, data);
    return this.receiveAnswerObject;
  }
}
