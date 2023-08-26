import { OrderStatus } from './types';

type INotification = {
  title: string;
  body: string;
};

export const ORDER_STATUS_NOTIFICATION_MAPPER: Record<
  OrderStatus,
  INotification
> = {
  [OrderStatus.CONFIRMED]: {
    title: 'Order confirmed',
    body: 'Your order has been confirmed. It will be shipped soon',
  },
  [OrderStatus.REJECTED]: {
    title: 'Order rejected',
    body: 'Sorry, your order has been rejected. There might be no available items in stock now. Please, contant support to understand more',
  },
  [OrderStatus.SHIPPED]: {
    title: 'Order shipped',
    body: 'Your order has been shipped. You will receive it soon',
  },
  [OrderStatus.DELIVERED]: {
    title: 'Order delivered',
    body: 'Congrats, Your order has been delivered. Waiting to see your review on the products',
  },
  [OrderStatus.CANCELLED_BY_ADMIN]: {
    title: 'Order cancelled',
    body: 'Sorry, your order has been cancelled by Admin. Please, contant support to understand more',
  },
  [OrderStatus.CANCELLED_BY_DRIVER]: {
    title: 'Order cancelled',
    body: 'Sorry, your order has been cancelled by driver. Please, contant support to understand more',
  },
  [OrderStatus.CANCELLED_BY_CLIENT]: {
    title: 'Order cancelled',
    body: 'Your order has been cancelled by your side',
  },
  [OrderStatus.PENDING_CONFIRMATION]: {
    title: '',
    body: '',
  },
};
