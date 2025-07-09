declare module "@woocommerce/woocommerce-rest-api" {
  export default class WooCommerceRestApi {
    constructor(options: {
      url: string;
      consumerKey: string;
      consumerSecret: string;
      version?: string;
      queryStringAuth?: boolean;
      axiosConfig?: object;
    });

    get(endpoint: string, params?: object): Promise<any>;
    post(endpoint: string, data: object, params?: object): Promise<any>;
    put(endpoint: string, data: object, params?: object): Promise<any>;
    delete(endpoint: string, params?: object): Promise<any>;
  }
}
