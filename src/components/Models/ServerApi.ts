import { ObjWithProducts, IOrderData, IOrderResponse, IApi } from '../../types';

export class ServerApi {
  protected objectForWorkwithServer: IApi;

  constructor(object: IApi) {
    this.objectForWorkwithServer = object;
  }

  async getAllProducts(): Promise<ObjWithProducts> {
    return await this.objectForWorkwithServer.get<ObjWithProducts>("/product/");
  }

  async sendDataOnServer(data: IOrderData): Promise<IOrderResponse> {
    return await this.objectForWorkwithServer.post<IOrderResponse>("/order/",data);
  }
}
