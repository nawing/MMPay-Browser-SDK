export class MMPaySDK {
    constructor(publishableKey, options = {}) {
        this.pollIntervalId = undefined;
        this.countdownIntervalId = undefined;
        this.onCompleteCallback = null;
        this.overlayElement = null;
        this.pendingApiResponse = null;
        this.pendingPaymentPayload = null;
        this.QR_SIZE = 290;
        this.TIMEOUT_SECONDS = 300;
        if (!publishableKey) {
            throw new Error("A Publishable Key is required to initialize [MMPaySDK].");
        }
        this.publishableKey = publishableKey;
        this.environment = options.environment || 'production';
        this.baseUrl = options.baseUrl || 'https://api.mm-pay.com';
        this.merchantName = options.merchantName || 'Your Merchant';
        this.POLL_INTERVAL_MS = options.pollInterval || 5000;
    }
    async _callApi(endpoint, data = {}) {
        let config = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.publishableKey}`
        };
        if (this.tokenKey) {
            config = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.publishableKey}`,
                'X-MMPay-Btoken': `${this.tokenKey}`
            };
        }
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: config,
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error (${response.status}): ${response.statusText}. Details: ${errorText}`);
        }
        return response.json();
    }
    async _callApiTokenRequest(payload) {
        try {
            const endpoint = this.environment === 'sandbox'
                ? '/xpayments/sandbox-token-request'
                : '/xpayments/production-token-request';
            return await this._callApi(endpoint, payload);
        }
        catch (error) {
            console.error("Token request failed:", error);
            throw error;
        }
    }
    async _callApiPaymentRequest(payload) {
        try {
            const endpoint = this.environment === 'sandbox'
                ? '/xpayments/sandbox-payment-create'
                : '/xpayments/production-payment-create';
            return await this._callApi(endpoint, payload);
        }
        catch (error) {
            console.error("Payment request failed:", error);
            throw error;
        }
    }
    async createPayment(params) {
        const tokenPayload = {
            amount: params.amount,
            orderId: params.orderId,
            nonce: new Date().getTime().toString() + '_mmp'
        };
        const paymentPayload = {
            amount: params.amount,
            orderId: params.orderId,
            callbackUrl: params.callbackUrl,
            customMessage: params.customMessage,
            nonce: new Date().getTime().toString() + '_mmp'
        };
        try {
            const tokenResponse = await this._callApiTokenRequest(tokenPayload);
            this.tokenKey = tokenResponse.token;
            return await this._callApiPaymentRequest(paymentPayload);
        }
        catch (error) {
            console.error("Payment request failed:", error);
            throw error;
        }
    }
    async showPaymentModal(params, onComplete) {
        const initialContent = `
      <div class="mmpay-card" style="padding: 64px 20px; justify-content: center;">
          <div style="text-align: center; color: #1d1d1f; font-weight: 500; font-size: 1.1rem;">
            <span class="en-text">Starting payment...</span>
            <span class="mm-text">ငွေပေးချေမှု စတင်နေသည်...</span>
          </div>
      </div>`;
        this._createAndRenderModal(initialContent, false);
        this.onCompleteCallback = onComplete;
        const tokenPayload = {
            amount: params.amount,
            orderId: params.orderId,
            nonce: new Date().getTime().toString() + '_mmp'
        };
        const paymentPayload = {
            amount: params.amount,
            orderId: params.orderId,
            callbackUrl: params.callbackUrl,
            customMessage: params.customMessage,
            nonce: new Date().getTime().toString() + '_mmp'
        };
        try {
            const tokenResponse = await this._callApiTokenRequest(tokenPayload);
            this.tokenKey = tokenResponse.token;
            const apiResponse = await this._callApiPaymentRequest(paymentPayload);
            if (apiResponse && apiResponse.qr && apiResponse.transactionRefId) {
                this.pendingApiResponse = apiResponse;
                this.pendingPaymentPayload = paymentPayload;
                this._renderQrModalContent(apiResponse, paymentPayload, this.merchantName);
                this._startPolling(paymentPayload, onComplete);
                this._startCountdown(paymentPayload.orderId);
            }
            else {
                this._showTerminalMessage(apiResponse.orderId || 'N/A', 'FAILED', '<span class="en-text">Failed to start payment. No QR data.</span><span class="mm-text">ငွေပေးချေမှု စတင်ရန် မအောင်မြင်ပါ။ QR ဒေတာ မရရှိပါ။</span>');
            }
        }
        catch (error) {
            this.tokenKey = null;
            this._showTerminalMessage(paymentPayload.orderId || 'N/A', 'FAILED', '<span class="en-text">Error occurred while starting payment.</span><span class="mm-text">ငွေပေးချေမှု စတင်စဉ် အမှားအယွင်း ဖြစ်ပွားသည်။</span>');
        }
    }
    _createAndRenderModal(contentHtml, isTerminal = false) {
        this._cleanupModal(false);
        const overlay = document.createElement('div');
        overlay.id = 'mmpay-full-modal';
        overlay.className = 'mmpay-lang-en';
        document.body.appendChild(overlay);
        this.overlayElement = overlay;
        const style = document.createElement('style');
        style.innerHTML = `
          @import url('https://fonts.googleapis.com/css2?family=Padauk:wght@400;700&display=swap');

          #mmpay-full-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s ease;
            box-sizing: border-box;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, 'Padauk';
          }

          .mmpay-lang-en .mm-text { display: none !important; }
          .mmpay-lang-mm .en-text { display: none !important; }

          .mmpay-toggle-container {
            position: absolute;
            top: 16px;
            left: 16px;
            display: flex;
            background: #f5f5f7;
            border-radius: 10px;
            padding: 3px;
            z-index: 10;
            border: 1px solid rgba(0,0,0,0.04);
          }
          .mmpay-toggle-btn {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 5px 10px;
            border-radius: 8px;
            cursor: pointer;
            color: #86868b;
            border: none;
            background: transparent;
            transition: all 0.2s ease;
          }
          .mmpay-lang-en .btn-en { background: #ffffff; color: #1d1d1f; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
          .mmpay-lang-mm .btn-mm { background: #ffffff; color: #1d1d1f; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

          .mmpay-overlay-content {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
          }

          .mmpay-card {
            background: #ffffff;
            border-radius: 24px;
            box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0,0,0,0.02);
            text-align: center;
            animation: mmpayFadeIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            box-sizing: border-box;
            position: relative;
            width: 100%;
            max-width: 360px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          @keyframes mmpayFadeIn {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          .mmpay-close-btn {
              position: absolute;
              top: 16px;
              right: 16px;
              background: #f5f5f7;
              border: none;
              cursor: pointer;
              padding: 0;
              color: #86868b;
              border-radius: 50%;
              transition: all 0.2s ease;
              z-index: 10;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
          }
          .mmpay-close-btn:hover {
              background-color: #e5e5ea;
              color: #1d1d1f;
          }

          .mmpay-button {
            background: #3a3a3c;
            color: #ffffff;
            border: none;
            padding: 14px 20px;
            border-radius: 14px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 10px;
            transition: all 0.2s ease;
            width: 100%;
            -webkit-tap-highlight-color: transparent;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          .mmpay-button:hover {
            background: #48484a;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          }
          .mmpay-button:active { transform: scale(0.98); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }

          .mmpay-button-secondary {
            background: #ffffff;
            color: #1d1d1f;
            border: 1px solid #e5e5ea;
            box-shadow: none;
          }
          .mmpay-button-secondary:hover { background: #f5f5f7; box-shadow: none;}

          .mmpay-button-danger {
            background: #fff0f0;
            color: #ff3b30;
            box-shadow: none;
          }
          .mmpay-button-danger:hover { background: #ffe5e5; box-shadow: none;}
      `;
        overlay.appendChild(style);
        window.MMPayToggleLang = (lang) => {
            const modal = document.getElementById('mmpay-full-modal');
            if (modal)
                modal.className = 'mmpay-lang-' + lang;
        };
        window.MMPayCloseModal = (forceClose = false) => {
            if (isTerminal || forceClose) {
                this._cleanupModal(true);
            }
            else {
                this._showCancelConfirmationModal();
            }
        };
        window.MMPayReRenderModal = () => this._reRenderPendingModalInstance();
        overlay.innerHTML += `
      <div class="mmpay-overlay-content">${contentHtml}</div>
    `;
        document.body.style.overflow = 'hidden';
        return overlay;
    }
    _renderQrModalContent(apiResponse, payload, merchantName) {
        const qrData = apiResponse.qr;
        const formattedAmount = apiResponse.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        const qrContainerId = 'mmpayQrContainerBox';
        const orderId = payload.orderId;
        window.MMPayDownloadQR = function () {
            const container = document.getElementById(qrContainerId);
            if (!container)
                return;
            const canvas = container.querySelector('canvas');
            const img = container.querySelector('img');
            try {
                let dataURL = '';
                if (canvas) {
                    dataURL = canvas.toDataURL('image/png');
                }
                else if (img) {
                    dataURL = img.src;
                }
                if (dataURL) {
                    const link = document.createElement('a');
                    link.href = dataURL;
                    link.download = `MMPay-QR-${orderId}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
            catch (e) {
                console.error("Failed to download QR image:", e);
            }
        };
        const qrContentHtml = `
      <style>
        .mmpay-qr-view { padding: 64px 20px 24px 20px; box-sizing: border-box; width: 100%; display: flex; flex-direction: column; justify-content: center; }
        .mmpay-header { color: #86868b; font-size: 1rem; font-weight: 500; margin-bottom: 6px; }

        .mmpay-amount-wrapper {
            margin: 0 auto 16px auto;
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 6px;
        }
        .mmpay-amount-value {
            font-size: 1.85rem;
            font-weight: 700;
            color: #1d1d1f;
            letter-spacing: -0.5px;
            line-height: 1;
        }
        .mmpay-amount-currency {
            font-size: 0.95rem;
            font-weight: 600;
            color: #86868b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .mmpay-qr-container {
            width: 220px;
            height: 220px;
            padding: 12px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid rgba(0,0,0,0.06);
            box-shadow: 0 8px 24px rgba(0,0,0,0.04);
            box-sizing: border-box;
            overflow: hidden;
        }
        #${qrContainerId} {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        /* Fix: Let the library handle the display property natively so they don't stack */
        #${qrContainerId} canvas, #${qrContainerId} img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .mmpay-powered-text { font-size: 0.75rem; color: #86868b; font-weight: 500; margin: 12px auto 8px auto;}

        .mmpay-detail-box {
            background: #f9f9fb;
            border-radius: 14px;
            padding: 14px 16px;
            margin-bottom: 20px;
            border: 1px solid rgba(0,0,0,0.03);
        }
        .mmpay-detail { font-size: 0.85rem; color: #86868b; margin: 6px 0; display: flex; justify-content: space-between; align-items: center; }
        .mmpay-detail strong { color: #1d1d1f; font-weight: 600; text-align: right; }
        .mmpay-detail span { text-align: left; }

        .mmpay-timer-badge {
            color: #d93025;
            background: #fce8e6;
            padding: 5px 12px;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin: 0 auto 16px auto;
        }
        .mmpay-timer-icon {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }
      </style>

      <div class="mmpay-card mmpay-qr-view">

          <div class="mmpay-toggle-container">
              <button class="mmpay-toggle-btn btn-en" onclick="MMPayToggleLang('en')">EN</button>
              <button class="mmpay-toggle-btn btn-mm" onclick="MMPayToggleLang('mm')">MM</button>
          </div>

          <button class="mmpay-close-btn" onclick="MMPayCloseModal(false)" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
          </button>

          <div style="margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center;">
            <img src="https://motephoe.com/images/mmqr.webp" alt="MyanMyanPay Logo" style="height: 40px; width: auto; object-fit: contain;">
          </div>

          <div class="mmpay-header">
              ${merchantName}
          </div>

          <div class="mmpay-amount-wrapper">
              <span class="mmpay-amount-value">${formattedAmount}</span>
              <span class="mmpay-amount-currency">MMK</span>
          </div>

          <div class="mmpay-qr-container">
              <div id="${qrContainerId}"></div>
          </div>

          <div class="mmpay-powered-text">
              <span class="en-text">Payment powered by MyanMyanPay</span>
              <span class="mm-text">MyanMyanPay ဖြင့် ငွေပေးချေမှုကို ထောက်ပံ့ထားသည်</span>
          </div>

          <div class="mmpay-timer-badge" id="mmpay-timer-badge">
             <svg class="mmpay-timer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
               <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
               <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
             </svg>
             <span id="mmpay-countdown-text">05:00</span>
          </div>

          <div class="mmpay-detail-box">
              <div class="mmpay-detail">
                  <span>
                    <span class="en-text">Order ID</span>
                    <span class="mm-text">မှာယူမှုနံပါတ်</span>
                  </span>
                  <strong>${apiResponse.orderId}</strong>
              </div>
              <div class="mmpay-detail" style="margin-top: 8px;">
                  <span>
                    <span class="en-text">Transaction Ref</span>
                    <span class="mm-text">ငွေပေးငွေယူနံပါတ်</span>
                  </span>
                  <strong>${apiResponse.transactionRefId}</strong>
              </div>
          </div>

          <button class="mmpay-button" onclick="MMPayDownloadQR()">
              <span class="en-text">Download QR Code</span>
              <span class="mm-text">QR ကုဒ်ကို သိမ်းဆည်းမည်</span>
          </button>
      </div>
    `;
        this._cleanupModal(false);
        this._createAndRenderModal(qrContentHtml, false);
        this._injectQrScript(qrData, qrContainerId);
    }
    _showTerminalMessage(orderId, status, messageHtml) {
        this._cleanupModal(true);
        const isSuccess = status === 'SUCCESS';
        const iconColor = isSuccess ? '#34c759' : '#ff3b30';
        const iconBg = isSuccess ? '#e8f8ec' : '#fce8e6';
        let iconSvg;
        let statusTextEn;
        let statusTextMm;
        if (isSuccess) {
            statusTextEn = 'Success';
            statusTextMm = 'အောင်မြင်ပါသည်';
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="${iconColor}" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                 </svg>`;
        }
        else {
            statusTextEn = status === 'FAILED' ? 'Failed' : 'Expired';
            statusTextMm = status === 'FAILED' ? 'မအောင်မြင်ပါ' : 'အချိန်ကျော်လွန်သွားပါပြီ';
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="${iconColor}" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>`;
        }
        const content = `
        <div class="mmpay-card" style="padding: 64px 24px 32px 24px; box-sizing: border-box; width: 100%;">

            <div class="mmpay-toggle-container">
                <button class="mmpay-toggle-btn btn-en" onclick="MMPayToggleLang('en')">EN</button>
                <button class="mmpay-toggle-btn btn-mm" onclick="MMPayToggleLang('mm')">MM</button>
            </div>

            <div style="
                margin: 0 auto 24px auto;
                width: 72px;
                height: 72px;
                border-radius: 50%;
                background: ${iconBg};
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                ${iconSvg}
            </div>

            <h2 style="font-size: 1.4rem; font-weight: 700; color: #1d1d1f; margin: 0 0 10px 0;">
                <span class="en-text">${statusTextEn}</span>
                <span class="mm-text">${statusTextMm}</span>
            </h2>

            <div style="background: #f9f9fb; padding: 8px 14px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.03); display: inline-block; margin-bottom: 24px;">
                <p style="color: #86868b; font-size: 0.85rem; margin: 0; font-weight: 600;">
                    ID: ${orderId}
                </p>
            </div>

            <p style="color: #86868b; margin-top: 0; margin-bottom: 32px; font-size: 0.95rem; line-height: 1.5;">
                ${messageHtml}
            </p>

            <button class="mmpay-button" onclick="MMPayCloseModal(true)">
                <span class="en-text">Close</span>
                <span class="mm-text">ပိတ်မည်</span>
            </button>
        </div>
    `;
        this._createAndRenderModal(content, true);
    }
    _showCancelConfirmationModal() {
        const overlayContent = this.overlayElement?.querySelector('.mmpay-overlay-content');
        if (!overlayContent)
            return;
        const qrView = overlayContent.querySelector('.mmpay-qr-view');
        if (qrView) {
            qrView.style.display = 'none';
        }
        let cancelView = document.getElementById('mmpay-cancel-view-container');
        if (cancelView) {
            cancelView.style.display = 'flex';
            return;
        }
        const content = `
        <div id="mmpay-cancel-view-container" class="mmpay-card" style="padding: 64px 24px 32px 24px; box-sizing: border-box; width: 100%;">

            <div class="mmpay-toggle-container">
                <button class="mmpay-toggle-btn btn-en" onclick="MMPayToggleLang('en')">EN</button>
                <button class="mmpay-toggle-btn btn-mm" onclick="MMPayToggleLang('mm')">MM</button>
            </div>

            <div style="
                margin: 0 auto 24px auto;
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background-color: #fff4e5;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ff9500;
            ">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
            </div>
            <h2 style="font-size: 1.3rem; font-weight: 700; color: #1d1d1f; margin: 0 0 12px 0;">
                <span class="en-text">Cancel Transaction?</span>
                <span class="mm-text">လွှဲပြောင်းမှုကို ပယ်ဖျက်မလား</span>
            </h2>
            <p style="color: #86868b; margin-top: 0; margin-bottom: 32px; font-size: 0.95rem; line-height: 1.5;">
                <span class="en-text">If you haven't paid yet, you can safely cancel this process.</span>
                <span class="mm-text">သင်သည် ငွေပေးချေမှု မပြုလုပ်ရသေးပါက လုပ်ငန်းစဉ်အား ဖျက်သိမ်းနိုင်ပါသည်။</span>
            </p>

            <div style="display: flex; gap: 10px; flex-direction: column;">
                <button class="mmpay-button mmpay-button-danger" onclick="MMPayCloseModal(true)">
                    <span class="en-text">Stop Process</span>
                    <span class="mm-text">လုပ်ငန်းစဉ် ရပ်တန့်မည်</span>
                </button>
                <button class="mmpay-button mmpay-button-secondary" onclick="MMPayReRenderModal()">
                    <span class="en-text">Go Back</span>
                    <span class="mm-text">အနောက်သို့ ပြန်သွားမည်</span>
                </button>
            </div>
        </div>
    `;
        overlayContent.insertAdjacentHTML('beforeend', content);
    }
    _reRenderPendingModalInstance() {
        const cancelView = document.getElementById('mmpay-cancel-view-container');
        if (cancelView) {
            cancelView.style.display = 'none';
        }
        const overlayContent = this.overlayElement?.querySelector('.mmpay-overlay-content');
        if (overlayContent) {
            const qrView = overlayContent.querySelector('.mmpay-qr-view');
            if (qrView) {
                qrView.style.display = 'flex';
            }
        }
    }
    _cleanupModal(restoreBodyScroll) {
        if (this.pollIntervalId !== undefined) {
            window.clearInterval(this.pollIntervalId);
            this.pollIntervalId = undefined;
        }
        if (this.countdownIntervalId !== undefined) {
            window.clearInterval(this.countdownIntervalId);
            this.countdownIntervalId = undefined;
        }
        if (this.overlayElement && this.overlayElement.parentNode) {
            this.overlayElement.parentNode.removeChild(this.overlayElement);
            this.overlayElement = null;
        }
        if (restoreBodyScroll) {
            document.body.style.overflow = '';
        }
        delete window.MMPayCloseModal;
        delete window.MMPayReRenderModal;
    }
    _injectQrScript(qrData, qrContainerId) {
        const initQR = () => {
            const container = document.getElementById(qrContainerId);
            if (typeof QRCode !== 'undefined' && container) {
                container.innerHTML = ''; // clear any existing content
                new QRCode(container, {
                    text: qrData,
                    width: this.QR_SIZE,
                    height: this.QR_SIZE,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
            else {
                console.error('Failed to load qrcode.js or find container.');
            }
        };
        if (typeof QRCode !== 'undefined') {
            setTimeout(initQR, 50);
        }
        else {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
            script.onload = () => setTimeout(initQR, 50);
            document.head.appendChild(script);
        }
    }
    async _startPolling(payload, onComplete) {
        if (this.pollIntervalId !== undefined) {
            window.clearInterval(this.pollIntervalId);
        }
        const checkStatus = async () => {
            try {
                const endpoint = this.environment === 'sandbox'
                    ? '/xpayments/sandbox-payment-polling'
                    : '/xpayments/production-payment-polling';
                const response = await this._callApi(endpoint, payload);
                const status = (response.status || '').toUpperCase();
                if (status === 'SUCCESS' || status === 'FAILED' || status === 'EXPIRED') {
                    window.clearInterval(this.pollIntervalId);
                    this.pollIntervalId = undefined;
                    const success = status === 'SUCCESS';
                    const messageHtml = success ?
                        `<span class="en-text">Payment successful.<br>Ref: ${response.transactionRefId || 'N/A'}</span>
             <span class="mm-text">ငွေပေးချေမှု အောင်မြင်ပါပြီ။<br>ရည်ညွှန်းနံပါတ်: ${response.transactionRefId || 'N/A'}</span>` :
                        `<span class="en-text">Payment ${status === 'FAILED' ? 'failed' : 'expired'}.</span>
             <span class="mm-text">ငွေပေးချေမှု ${status === 'FAILED' ? 'မအောင်မြင်ပါ' : 'သက်တမ်းကုန်သွားပါပြီ'}။</span>`;
                    this._showTerminalMessage(response.orderId || 'N/A', status, messageHtml);
                    if (onComplete) {
                        this.tokenKey = null;
                        onComplete({ success: success, transaction: response });
                    }
                    return;
                }
            }
            catch (error) {
                console.error("Polling error:", error);
            }
        };
        checkStatus();
        this.pollIntervalId = window.setInterval(checkStatus, this.POLL_INTERVAL_MS);
    }
    _startCountdown(orderId) {
        if (this.countdownIntervalId !== undefined) {
            window.clearInterval(this.countdownIntervalId);
        }
        let remaining = this.TIMEOUT_SECONDS;
        const timerElement = document.getElementById('mmpay-countdown-text');
        const updateDisplay = () => {
            if (!timerElement)
                return;
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            timerElement.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };
        this.countdownIntervalId = window.setInterval(() => {
            remaining--;
            updateDisplay();
            if (remaining <= 0) {
                window.clearInterval(this.countdownIntervalId);
                this.countdownIntervalId = undefined;
                this._showTerminalMessage(orderId, 'EXPIRED', '<span class="en-text">Time expired.</span><span class="mm-text">သတ်မှတ်ချိန်ကုန်သွားပါပြီ။</span>');
            }
        }, 1000);
    }
}
window.MMPaySDK = MMPaySDK;
