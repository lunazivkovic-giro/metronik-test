export interface Order {
  omsId: string;
  expectedCompletionTime: string;
  orderId: string;
  products: OrderProduct[];
  orderDetails?: OrderDetails;
}

export interface OrderProduct {
  gtin: string;
  quantity: number;
  serialNumberType: string;
  serialNumbers?: string[];
  templateId: string;
}

export interface OrderDetails {
  factoryId: string;
  factoryName?: string;
  factoryAddress?: string;
  factoryCountry: string;
  productionLineId: string;
  productCode: string;
  productDescription: string;
  poNumber?: string;
  expectedStartDate?: string;
}
