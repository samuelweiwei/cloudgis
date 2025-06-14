// Custom types for your application
export interface OrderMessage {
  action: 'process_order';
  orderId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  timestamp: string;
}

export interface NotificationMessage {
  action: 'send_notification';
  type: 'email' | 'sms' | 'push';
  recipient: string;
  subject?: string;
  message: string;
  timestamp: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export type MessagePayload = OrderMessage | NotificationMessage;

export interface LambdaResponse {
  batchItemFailures?: Array<{
    itemIdentifier: string;
  }>;
}