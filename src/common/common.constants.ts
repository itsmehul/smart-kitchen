import { Temperature } from 'src/recipe/entities/recipe.entity';

export const RAZORPAY_AXIOS = 'RAZORPAY_AXIOS';
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
export const PUB_SUB = 'PUB_SUB';
export const SES = 'SES';
export const S3 = 'S3';
export const SNS = 'SNS';
export const NEW_PENDING_ORDER = 'NEW_PENDING_ORDER';
export const NEW_COOKED_ORDER = 'NEW_COOKED_ORDER';
export const NEW_ORDER_UPDATE = 'NEW_ORDER_UPDATE';

export const RAZORPAY_ORDERS_API = 'https://api.razorpay.com/v1/orders';
export const RAZORPAY_PAYMENTS_API = 'https://api.razorpay.com/v1/payments';

export const SHIPROCKET_API = 'https://apiv2.shiprocket.in/v1/external/';
export const SHIPROCKET_CREDS = 'SHIPROCKET_CREDS';

export const SMS_AUTH_KEY = 'SMS_AUTH_KEY';

export const WEBHOOK_SECRET = 'WEBHOOK_SECRET';

export enum EVENTS {
  ORDER_COMPLETED_FOR_GROUP = 'ORDER_COMPLETED_FOR_GROUP',
  ORDERS_IN_PROCESSING = 'ORDERS_IN_PROCESSING',
}

export const BOX_SIZE_CONFIG = (type: Temperature) => {
  const sizes =
    type === Temperature.Hot
      ? {
          big: 24,
          medium: 6,
          small: 4,
        }
      : {
          big: 24,
          medium: 12,
          small: 4,
        };
  return sizes;
};

export const ADDONS_CAT = 'addons';
