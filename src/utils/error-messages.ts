export const ERROR_MESSAGES = {
  ENTITY_NOT_FOUND: (
    entity: string | { name: string; toString: () => string },
    key: string,
    value: string | { toString: () => string },
  ) => {
    const entityString =
      typeof entity === 'string'
        ? entity
        : entity.name
        ? entity.name
        : entity.toString();
    const valueString = typeof value === 'string' ? value : value.toString();
    return `No ${entityString} found with ${key} = ${valueString}`;
  },
  NO_ENTITIES_AFFECTED: 'No entities affected',
  MULTIPLE_ENTITIES_AFFECTED: 'Attention. Multiple entities affected',
  USER_NOT_FOUND: 'User not found. Email or password is incorrect',
  DUPLICATED_USER_EMAIL: 'User exists with the same email',
  VERIFY_ACCOUNT: 'Please verify your account first',
  ACCOUNT_ALREADY_VERIFIED: 'Account is already verified',
  INCORRECT_OLD_PASSWORD: 'Incorrect old password',
  SAME_PASSWORD: 'New password is the same old password',
  INVALID_VERIFICATION_CODE: 'Invalid verification code',
  EXPIRED_VERIFICATION_CODE: 'Verification code is no longer valid',
  EMAIL_NOT_SENT: 'Email not sent',
  CART_ITEM_EXIST: 'Cart item already exists. You can update its amount',
  AMOUNT_NOT_AVAILABLE: 'Amount requested is not available in stock',
  EMPTY_CART: 'User has emoty cart',
  PRODUCT_ALREADY_FAVORITED: 'Product already favorited by user',
  INVALID_ORDER_STATUS_TRANSITION:
    'Invalid received transition with respect to current order status',
  USER_HAS_NO_PHOTO: 'User has no photo',
  NOTIFICATION_TOKEN_MISSING:
    'notificationToken parameter is required when deviceType exists',
  DEVICE_TYPE_MISSING:
    'deviceType parameter is required when notificationToken exists',
};
