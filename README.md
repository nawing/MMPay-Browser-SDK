# MyanMyanPay Browser Plugin Or No-code SDK

Welcome to the **MyanMyanPay Browser Plugin No Code SDK**! This library provides a secure and seamless way to integrate QR Code and Bank Redirect payments into any e-commerce checkout flow.
Developed using **TypeScript**, the SDK offers a clean, type-safe interface and handles complex tasks like API communication, UI rendering, and asynchronous payment status polling automatically.

---


## 1: 🛠️  Plugin or SDK Installation
The MyanMyanPay SDK is distributed as a single JavaScript file, ready for direct inclusion.
Embed the following `<script>` tag into the `<head>` or before the closing `</body>` tag of your checkout page.

**Implementation**

```html
<script src="https://cdn.jsdelivr.net/npm/mmpay-browser-sdk@latest/dist/mmpay-sdk.js"></script>
```

---

## 2: 🚀 Initialize Your App
The `MMPaySDK` class provides two distinct methods to suit different integration needs.

**Implementation**
```javascript
const MMPayApp = new MMPaySDK('pk_live_YOUR_KEY', {
    merchantName:  'Your Shop Name',
    design: {
        mode: 'dark', // dark | dark-translucent | light | light-translucent
        color: '#DE3163' // #color code
    }
});
```

---

## 3: 🚀 Making Payments

##### Approach 1 [Browser Site Order Creation] `showPaymentModal()`

This function is a simple way where an MMQR Reference No and QR to be created on the browser site, but you must verify the source of truth in our webhooks to avoid payload manipulation.

**Method Signature**
```typescript
showPaymentModal({orderId: string, amount: number}, onComplete: Function ): Promise<void>
```

**Browser Plugin Implementation**
```javascript
const MMPayApp = new MMPaySDK('pk_live_YOUR_KEY', {
    merchantName:  'Your Shop Name',
    design: {
        mode: 'dark', // dark | dark-translucent | light | light-translucent
        color: '#DE3163' // #color code
    }
});

MMPayApp.showPaymentModal({
    orderId: 'Order-ID-111111',
    amount: 2800
}, (result) => {
    if (result.success) {
        console.log('Success: ' + result.orderId + ' : Transaction : ' + result.transactionId);
    }
})
```

**Verifying Source of Truth**
Do this at your backend to verify source of truth. If there are any payload manipulation that does not match your amount, the order can be 'CANCELLED' instanly via our api.

```typescript
// Example of callback handling in the backend
import { MMPaySDK } from 'mmpay-node-sdk';

const MMPay = new MMPaySDK({
  appId: "MMxxxxxxx",
  publishableKey: "pk_live_abcxxxxx",
  secretKey: "sk_live_abcxxxxx",
  apiBaseUrl: "https://xxxxxx"
})

MMPay
  .onTxCreate((tx) => {
    const { amount } = await DB.getOrderId(tx.orderId) // get your source of truth from your database
    if (tx.amount !== amount ) {
      await MMPay.cancel(tx.orderId) // cancel order
    }
  })
  .onTxSuccess((tx) => console.log('Success:', tx.orderId))
  .onTxFail((tx) => console.log('Failed:', tx.orderId))
  .onTxRefund((tx) => console.log('Refunded:', tx.orderId))
  .onTxCancel((tx) => console.log('Cancelled:', tx.orderId))
  .onTxExpire((tx) => console.log('Expired:', tx.orderId))
  .onHeartbeat((tx) => console.log('Heartbeat:', tx.orderId))
  .on('error', (err) => console.error(err));

// Listening Callback
app.post('/webhooks/mmpay-callback', async (req: Request, res: Response) => {
  const payload = JSON.stringify(req.body);
  const nonce = req.headers['x-mmpay-nonce'] as string;
  const signature = req.headers['x-mmpay-signature'] as string;
  await MMPaySandbox.listen(payload, nonce, signature);
  res.json({ received: true }); // please respond with 200 status
});
```


##### Approach 2 [Backend Site Order Creation] `pay()`

This function is a simple way where an MMQR Reference No and QR to be created at backend with secret key securely, and putting the order ID in our plugin to make POP UP appear in your browser.

**Method Signature**
```typescript
pay(orderId: string, onComplete: Function ): Promise<void>
```

**Establishing a Source of Truth**
Do this at your backend server, it is important to create a source of truth in this manner.

```bash
npm install mmpay-node-sdk --save
```

**Backend Integration**
```typescript
import { MMPaySDK } from 'mmpay-node-sdk';

const MMPay = new MMPaySDK({
  appId: "MMxxxxxxx",
  publishableKey: "pk_live_abcxxxxx",
  secretKey: "sk_live_abcxxxxx",
  apiBaseUrl: "https://xxxxxx"
})

const { qr, orderId } = await MMPay.pay({ amount, orderId });
// get your order Id to your browser
```

**Browser Plugin Implementation**
```javascript
const MMPayApp = new MMPaySDK('pk_live_YOUR_KEY', {
    merchantName:  'Your Shop Name',
    design: {
        mode: 'dark', // dark | dark-translucent | light | light-translucent
        color: '#DE3163' // #color code
    }
});

MMPayApp.pay('Order-ID-111111', (result) => {
    if (result.success) {
        console.log('Success: ' + result.orderId + ' : Transaction : ' + result.transactionId);
    }
})
```

---


## 4: All Supported Events

**Browser Plugin Implementation Display All Event Types**

```javascript
MMPayApp.pay('Order-ID-111111', (result) => {
    if (result.success) {
        console.log('Success: ' + result.orderId + ' : Transaction : ' + result.transactionId);
    }
    if (result.created) {
        console.log('Created: ' + result.orderId);
    }
    if (result.cancelled) {
        console.log('Cancelled: ' + result.orderId);
    }
    if (result.expired) {
        console.log('Expoired: ' + result.orderId);
    }
})

MMPayApp.showPaymentModal({ orderId, amount }, (result) => {
    if (result.success) {
        console.log('Success: ' + result.orderId + ' : Transaction : ' + result.transactionId);
    }
    if (result.created) {
        console.log('Created: ' + result.orderId);
    }
    if (result.cancelled) {
        console.log('Cancelled: ' + result.orderId);
    }
    if (result.expired) {
        console.log('Expoired: ' + result.orderId);
    }
})
```
---

## 5: Error Codes

| Code | Description |
| :--- | :--- |
| **`R000`** | Internal Server Error ( Talk to our support immediately fot this ) |
| **`R001`** | Wrong publishable Key |
| **`R002`** | Key Not Live Yet |
| **`R003`** | Origin Whitelist Not Allowed |
| **`R004`** | Origin Requires SSL |
| **`429`** | Ratelimit hit only 1000 request / minute allowed |

---

## 6: Angular Framework Implementation

**Example Implementation**

```typescript
import {Injectable} from '@angular/core';

interface ModalResponse {
    success: boolean,
    created: boolean,
    cancelled: boolean,
    expired: boolean,
    orderId: string;
    transactionRefId: string;
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
    pay(orderId: string ) {
        this.mmpay.pay(orderId, (result: ModalResponse) => {
            if (result.success) {
                console.log('Success: ' + result.orderId + ' : Transaction : ' + result.transactionId);
            }
            if (result.created) {
                console.log('Created: ' + result.orderId);
            }
            if (result.cancelled) {
                console.log('Cancelled: ' + result.orderId);
            }
            if (result.expired) {
                console.log('Expoired: ' + result.orderId);
            }
        });
    }
}
```

---


## 7. React Framework Implementation

**Example Implementation**

```tsx
import React, { useEffect, useRef } from 'react';

interface ModalResponse {
    success: boolean,
    created: boolean,
    cancelled: boolean,
    expired: boolean,
    orderId: string;
    transactionRefId: string;
}

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

  const pay = (orderId: string) => {
    if (!mmpayRef.current) return;

    mmpayRef.current.pay(orderId, (result: ModalResponse) => {
        if (result.success) {
            console.log('Success: ' + result.orderId + ' : Transaction : ' + result.transactionId);
            // Redirect Somewhere
        }
        if (result.created) {
            console.log('Created: ' + result.orderId);
        }
        if (result.cancelled) {
            console.log('Cancelled: ' + result.orderId);
        }
        if (result.expired) {
            console.log('Expoired: ' + result.orderId);
        }
    });
  };

  return { pay };
};

export const Checkout = () => {
    const { pay } = useMMPay();

    const handlePayment = () => {
        pay(`ORD-${Date.now()}`);
    };

    return (
        <button onClick={handlePayment}>
            Pay with MyanMyanPay
        </button>
    );
};
```

---


## 8. Vue Framework Implementation

**Example Implementation**

```vue

<script setup>
import { onMounted, ref } from 'vue';

interface ModalResponse {
    success: boolean,
    created: boolean,
    cancelled: boolean,
    expired: boolean,
    orderId: string;
    transactionRefId: string;
}

const mmpay = ref(null);

onMounted(() => {
    const MMPaySDK = window.MMPaySDK;

    if (!MMPaySDK) {
        console.error('SDK not loaded attached to window');
        return;
    }

    mmpay.value = new MMPaySDK('pk_test_123', {
        baseUrl: 'https://xxx.myanmyanpay.com',
        merchantName: 'Test Shop',
        design: {
            mode: 'light', // dark | dark-translucent | light | light-translucent
            color: '#BF40BF' // #color code
        }
    });
});

const pay = ( orderId: string ) => {
    if (!mmpay.value) return;

    mmpay.value.pay(orderId, (result: ModalResponse) => {
        if (result.success) {
            console.log('Success: ' + result.orderId + ' : Transaction : ' + result.transactionId);
            // Redirect Somewhere
        }
        if (result.created) {
            console.log('Created: ' + result.orderId);
        }
        if (result.cancelled) {
            console.log('Cancelled: ' + result.orderId);
        }
        if (result.expired) {
            console.log('Expoired: ' + result.orderId);
        }
    });
};

const handlePayment = () => {
    pay(`ORD-${Date.now()}`);
};
</script>

<template>
    <button @click="handlePayment">
        Pay with MyanMyanPay
    </button>
</template>
```

---


## License

MIT
