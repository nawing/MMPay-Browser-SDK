# MyanMyanPay No-code SDK
## 💳 Introduction
Welcome to the **MyanMyanPay No Code SDK**! This library provides a secure and seamless way to integrate QR Code and Bank Redirect payments into any e-commerce checkout flow.
Developed using **TypeScript**, the SDK offers a clean, type-safe interface and handles complex tasks like API communication, UI rendering, and asynchronous payment status polling automatically.

---

## 🛠️ Installation
The MyanMyanPay SDK is distributed as a single JavaScript file, ready for direct inclusion.

### Step 1: Include the SDK
Embed the following `<script>` tag into the `<head>` or before the closing `</body>` tag of your checkout page.
```html
<script src="https://cdn.jsdelivr.net/npm/mmpay-browser-sdk@latest/dist/mmpay-sdk.js"></script>
```
---
## 🚀 Usage
The `MMPaySDK` class provides two distinct methods to suit different integration needs.

#### **Example Implementation**
```javascript
const MMPayApp = new MMPaySDK('pk_live_YOUR_KEY', {
    baseUrl:  'https://xxx.myanmyanpay.com', // Sign up with us and ask our team
    merchantName:  'Your Shop Name',
    design: {
        mode: 'dark', // dark | dark-translucent | light | light-translucent
        color: '#DE3163' // #color code
    }
});
```

### 1. `showPaymentModal()` (Recommended: UI + Polling)
This is the easiest way to integrate. This method **initiates the transaction**, **renders the UI** (QR code/Redirect link) into your container, and automatically **polls your gateway** for payment completion status, executing a callback when the payment is final.

#### **Method Signature**
```typescript
showPaymentModal(paymentData: PaymentData): Promise<CreatePaymentResponse>
```

#### **Example Implementation**
```javascript
MMPayApp.showPaymentModal({
    amount: 50000,
    orderId: 'ORD-' + new Date().getTime(),
    customMessage: 'Your custom message here', // Optional
    callbackUrl: 'https://yoursite.com/confirmation' // Optional [Default callback input in our console will be called if no specified]
}, (result) => {
    if (result.success) {
        console.log('Transaction ID: ' + result.transactionId);
    } else {
        console.error('Failed: ' + result.message);
    }
});
```


#### ** All Together Implementation**

```html
<script src="https://cdn.jsdelivr.net/npm/mmpay-browser-sdk@latest/dist/mmpay-sdk.js"></script>
```

```javascript
const MMPayApp = new MMPaySDK('pk_live_YOUR_KEY', {
    baseUrl:  'https://xxx.myanmyanpay.com', // Sign up with us and ask our team
    merchantName:  'Your Shop Name',
    design: {
        mode: 'light', // dark | dark-translucent | light | light-translucent
        color: '#0000000' // #color code
    },
});
MMPayApp.showPaymentModal({
    amount: 50000,
    orderId: 'ORD-' + new Date().getTime(),
    customMessage: 'Your custom message here', // Optional
    callbackUrl: 'https://yoursite.com/confirmation' // Optional [Default callback input in our console will be called if no specified]
}, (result) => {
    if (result.success) {
        console.log('Redirect Some where');
    }
});
```



### 2. `createPayment()` (Advanced: JSON Only)
Use this method if you need to build a fully **custom user interface** or if you are only initiating the request from the client and handling polling/UI on your server. This method returns MMQR string in JSON format.

#### **Method Signature**
```typescript
createPayment(paymentData: PaymentData): Promise<CreatePaymentResponse>
```

#### **Example Implementation**
```javascript
MMPayApp.createPayment({
    amount: 50000,
    orderId: 'ORD-' + new Date().getTime(),
    customMessage: 'Your custom message here', // Optional
    callbackUrl: 'https://yoursite.com/confirmation' // Optional [Default callback input in our console will be called if no specified]
}).then((result) => {
    if (result.qr) {
        console.log('Transaction ID: ' + result.qr);
    }
});
```

### Error Codes

| Code | Description |
| :--- | :--- |
| **`R000`** | Internal Server Error ( Talk to our support immediately fot this ) |
| **`R001`** | Wrong publishable Key |
| **`R002`** | Key Not Live Yet |
| **`R003`** | Origin Whitelist Not Allowed |
| **`R004`** | Origin Requires SSL |
| **`429`** | Ratelimit hit only 1000 request / minute allowed |


### 3. Angular Framework Implementation

#### **Example Implementation**
```typescript
import {Injectable} from '@angular/core';

interface PayResponse {
    _id: string;
    amount: number;
    orderId: string;
    currency?: string;
    transactionRefId: string;
    qr: string;
}

interface ModalResponse {
    success: boolean,
    transaction: {
        orderId: string;
        transactionRefId: string;
        status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';
    }
}

@Injectable({
  providedIn: 'root'
})
export class MMPayService {
    mmpay: any;
    constructor() {
        const MMPaySDK = (window as any).MMPaySDK;
        if (!MMPaySDK) {
            console.error('SDK not loaded attached to window');
            return;
        }
        this.mmpay = new MMPaySDK('pk_test_123', {
            baseUrl:  'https://xxx.myanmyanpay.com', // Sign up with us and ask our tea
            merchantName: 'Test Shop',
            design: {
                mode: 'light-translucent', // dark | dark-translucent | light | light-translucent
                color: '#9CA6EB' // #color code
            }
        });
    }
    /**
     * @param {number} amount
     * @param {string} orderId
     * @param {string} callbackUrl
     * @param {string} customMessage
     */
    modalPay(amount: number, orderId: string, callbackUrl?: string, customMessage?: string) {
        this.mmpay.showPaymentModal({
            amount,
            orderId,
            callbackUrl,
            customMessage,
        }, (result: ModalResponse) => {
            if (result.success) {
                console.log('Redirect Some where');
            }
        });
    }
    /**
     * @param {number} amount
     * @param {string} orderId
     * @param {string} callbackUrl
     * @param {string} customMessage
     */
    pay(amount: number, orderId: string, callbackUrl?: string, customMessage?: string) {
        this.mmpay.createPayment({
            amount,
            orderId,
            callbackUrl,
            customMessage,
        })
        .then((result: PayResponse) => {
            if (result.qr) {
                console.log('Transaction ID: ' + result.qr);
            }
        });
    }
}

```



### 4. React Framework Implementation

#### **Example Implementation**
```tsx
import React, { useEffect, useRef } from 'react';

export const useMMPay = () => {
  const mmpayRef = useRef(null);

  useEffect(() => {
    const MMPaySDK = window.MMPaySDK;

    if (!MMPaySDK) {
      console.error('SDK not loaded attached to window');
      return;
    }

    mmpayRef.current = new MMPaySDK('pk_test_123', {
      baseUrl: 'https://xxx.myanmyanpay.com',
      merchantName: 'Test Shop',
    design: {
        mode: 'dark-translucent', // dark | dark-translucent | light | light-translucent
        color: '#E1A284' // #color code
    }
    });
  }, []);

  const modalPay = (amount, orderId, callbackUrl, customMessage) => {
    if (!mmpayRef.current) return;

    mmpayRef.current.showPaymentModal({
      amount,
      orderId,
      callbackUrl,
      customMessage,
    }, (result) => {
      if (result.success) {
        console.log('Redirect Some where');
      }
    });
  };

  const pay = (amount, orderId, callbackUrl, customMessage) => {
    if (!mmpayRef.current) return;

    mmpayRef.current.createPayment({
      amount,
      orderId,
      callbackUrl,
      customMessage,
    })
    .then((result) => {
      if (result.qr) {
        console.log('Transaction ID: ' + result.qr);
      }
    });
  };

  return { modalPay, pay };
};

export const Checkout = () => {
  const { modalPay } = useMMPay();

  const handlePayment = () => {
    modalPay(5000, `ORD-${Date.now()}`);
  };

  return (
    <button onClick={handlePayment}>
      Pay with MyanMyanPay
    </button>
  );
};
```


### 4. Vue Framework Implementation

#### **Example Implementation**
```vue

<script setup>
import { onMounted, ref } from 'vue';

const mmpay = ref(null);

onMounted(() => {
  const MMPaySDK = window.MMPaySDK;

  if (!MMPaySDK) {
    console.error('SDK not loaded attached to window');
    return;
  }

  mmpay.value = new MMPaySDK('pk_test_123', {
    baseUrl: 'https://xxx.myanmyanpay.com',
    merchantName: 'Test Shop'
  });
});

const modalPay = (amount, orderId, callbackUrl, customMessage) => {
  if (!mmpay.value) return;

  mmpay.value.showPaymentModal({
    amount,
    orderId,
    callbackUrl,
    customMessage,
  }, (result) => {
    if (result.success) {
      console.log('Redirect Some where');
    }
  });
};

const pay = (amount, orderId, callbackUrl, customMessage) => {
  if (!mmpay.value) return;

  mmpay.value.createPayment({
    amount,
    orderId,
    callbackUrl,
    customMessage,
  }).then((result) => {
    if (result.qr) {
      console.log('Transaction ID: ' + result.qr);
    }
  });
};

const handlePayment = () => {
  modalPay(5000, `ORD-${Date.now()}`);
};
</script>

<template>
  <button @click="handlePayment">
    Pay with MyanMyanPay
  </button>
</template>

```
