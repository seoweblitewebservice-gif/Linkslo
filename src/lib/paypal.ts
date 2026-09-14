/**
 * PayPal JS SDK client ID (public identifier, safe to ship in client-side code —
 * this is not a secret key). Used to render Buy Now buttons that create and
 * capture a PayPal order entirely in the browser.
 */
export const PAYPAL_CLIENT_ID =
  "BAAuTWFMvROziaGuxjd5eMTcS9YHb1Yuzh0ily3fZTSOr48HLGcjMmboB-Xlf_sUyICaAKqk4QeasV_AXQ";

export const PAYPAL_CURRENCY = "USD";

export const PAYPAL_SDK_SRC = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${PAYPAL_CURRENCY}&intent=capture&components=buttons`;
