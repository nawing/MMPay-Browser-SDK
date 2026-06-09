# MyanMyanPay Browser Plugin Or No-code SDK
## 💳 Introduction
Welcome to the **MyanMyanPay Browser Plugin No Code SDK**! This library provides a secure and seamless way to integrate QR Code and Bank Redirect payments into any e-commerce checkout flow.
Developed using **TypeScript**, the SDK offers a clean, type-safe interface and handles complex tasks like API communication, UI rendering, and asynchronous payment status polling automatically.

---


### 1. Code Implementation


##### Step 1: 🛠️  Plugin or SDK Installation
The MyanMyanPay SDK is distributed as a single JavaScript file, ready for direct inclusion.

Embed the following `<script>` tag into the `<head>` or before the closing `</body>` tag of your checkout page.

```html
<script src="https://cdn.jsdelivr.net/npm/mmpay-browser-sdk@latest/dist/mmpay-sdk.js"></script>
```


##### Step 2: 🚀 Initialize Your App
The `MMPaySDK` class provides two distinct methods to suit different integration needs.

#### **Example Implementation**
```javascript
const MMPayApp = new MMPaySDK('pk_live_YOUR_KEY', {
    merchantName:  'Your Shop Name',
    design: {
        mode: 'dark', // dark | dark-translucent | light | light-translucent
        color: '#DE3163' // #color code
    }
});
```

##### Step 3: 🚀 Call Modal Object
### `pay()` (Recommended: UI + Polling)

#### **Method Signature**
```typescript
pay(orderId: string, onComplete: Function ): Promise<void>
```

#### **Example Implementation**
```javascript
MMPayApp.pay('Order-ID-111111', (result) => console.log(result));
```

#### **All Support Events**

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
```

##### Step 4: 🚀 Creating The Order ID & Paymennt Ref
### `MMPay.pay()` [Establishing Source of Truth Secretly]

Do this at your backend server, it is important to create a source of truth in this manner to avoid payload manipulation

```bash
npm install mmpay-node-sdk --save
```

#### **Backend Integration**
```typescript
// Express JS Server
// Never expose your secret key
import { MMPaySDK } from 'mmpay-node-sdk';

const MMPay = new MMPaySDK({
  appId: "MMxxxxxxx",
  publishableKey: "pk_live_abcxxxxx",
  secretKey: "sk_live_abcxxxxx",
  apiBaseUrl: "https://xxxxxx"
})

app.post('/create-order', async (req: Request, res: Response) => {
    const { amount, orderId } = req.body;
    const { qr, transactionRefId } = await MMPay.pay({ amount, orderId });
    res.json({ qr, orderId, amount, transactionRefId })
});
```

#### **Frontend Integration**
```html
<script src="https://cdn.jsdelivr.net/npm/mmpay-browser-sdk@latest/dist/mmpay-sdk.js"></script>
```

#### **Example Implementation**
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
        // Redirdect to Success Page or do SUCCESS thing
    }
})
```



##### Step 4: 🚀 Call Modal Object
### `showPaymentModal()` (Not Recommended: UI + Polling)

**Do this only for user input amount, like donation acception. Your order id and amount may not match and is prone to payload maipulation attacks**

This is the easiest way to integrate. This method **initiates the transaction**, **renders the UI** (QR code/Redirect link) into your container, and automatically **polls your gateway** for payment completion status, executing a callback when the payment is final.

#### **Method Signature**
```typescript
showPaymentModal(paymentData: PaymentData, onComplete: Function): Promise<void>
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
```

##### Step 4: 🚀 Putting All Together

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
    }
});

MMPayApp.pay('Order-ID-111111', (result) => { // This Order Must Be Created WIth Our Sdks or Backend Api
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



// Use this only for donation and other usecases where order id and amount is not strict and user input
MMPayApp.showPaymentModal({
    amount: 50000,
    orderId: 'ORD-' + new Date().getTime(),
    customMessage: 'Your custom message here', // Optional
    callbackUrl: 'https://yoursite.com/confirmation' // Optional [Default callback input in our console will be called if no specified]
}, (result) => {
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
```

---


### 2. Error Codes

| Code | Description |
| :--- | :--- |
| **`R000`** | Internal Server Error ( Talk to our support immediately fot this ) |
| **`R001`** | Wrong publishable Key |
| **`R002`** | Key Not Live Yet |
| **`R003`** | Origin Whitelist Not Allowed |
| **`R004`** | Origin Requires SSL |
| **`429`** | Ratelimit hit only 1000 request / minute allowed |


---

### 3. Angular Framework Implementation

#### **Example Implementation**

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


### 4. React Framework Implementation

#### **Example Implementation**

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
        pay(5000, `ORD-${Date.now()}`);
    };

    return (
        <button onClick={handlePayment}>
            Pay with MyanMyanPay
        </button>
    );
};
```


### 5. Vue Framework Implementation

#### **Example Implementation**

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
    pay(5000, `ORD-${Date.now()}`);
};
</script>

<template>
    <button @click="handlePayment">
        Pay with MyanMyanPay
    </button>
</template>

```
