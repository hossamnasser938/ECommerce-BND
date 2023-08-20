import { createMachine, interpret } from 'xstate';

import { OrderStatus, OrderStatusTransition } from './types';

export const orderTrackingStateMachine = createMachine(
  {
    id: 'Order Tracking Status Machine',
    initial: OrderStatus.PENDING_CONFIRMATION,
    states: {
      [OrderStatus.PENDING_CONFIRMATION]: {
        on: {
          [OrderStatusTransition.CONFIRM]: OrderStatus.CONFIRMED,
          [OrderStatusTransition.REJECT]: OrderStatus.REJECTED,
        },
      },
      [OrderStatus.CONFIRMED]: {
        on: {
          [OrderStatusTransition.SHIP]: OrderStatus.SHIPPED,
          [OrderStatusTransition.CANCEL_BY_ADMIN]:
            OrderStatus.CANCELLED_BY_ADMIN,
        },
      },
      [OrderStatus.REJECTED]: {
        type: 'final',
      },
      [OrderStatus.SHIPPED]: {
        on: {
          [OrderStatusTransition.DELIVER]: OrderStatus.DELIVERED,
          [OrderStatusTransition.CANCEL_BY_DRIVER]:
            OrderStatus.CANCELLED_BY_DRIVER,
          [OrderStatusTransition.CANCEL_BY_CLIENT]:
            OrderStatus.CANCELLED_BY_CLIENT,
        },
      },
      [OrderStatus.DELIVERED]: {
        type: 'final',
      },
      [OrderStatus.CANCELLED_BY_ADMIN]: {
        type: 'final',
      },
      [OrderStatus.CANCELLED_BY_CLIENT]: {
        type: 'final',
      },
      [OrderStatus.CANCELLED_BY_DRIVER]: {
        type: 'final',
      },
    },
    schema: {
      context: {} as { value: OrderStatus },
      events: {} as { type: OrderStatusTransition },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {},
    services: {},
    guards: {},
    delays: {},
  },
);

export const orderTrackingStateMachineService = interpret(
  orderTrackingStateMachine,
);
