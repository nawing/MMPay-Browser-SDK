import {IDesignOptions} from './types';

export function _getContentCancelModal(design?: IDesignOptions): string {
  return `
<div id="mmpay-cancel-view-container" class="mmpay-card" style="padding: 64px 24px 32px 24px; box-sizing: border-box; width: 100%;">
    <div class="mmpay-toggle-container">
        <button class="mmpay-toggle-btn btn-en" onclick="MMPayToggleLang('en')">EN</button>
        <button class="mmpay-toggle-btn btn-mm" onclick="MMPayToggleLang('mm')">MM</button>
    </div>
    <div style="margin: 0 auto 24px auto; width: 64px; height: 64px; border-radius: 50%; background-color: var(--mmp-warn-bg); display: flex; align-items: center; justify-content: center; color: #ff9500;">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
    </div>
    <h2 style="font-size: 1.3rem; font-weight: 700; color: var(--mmp-text-main); margin: 0 0 12px 0;">
        <span class="en-text">Cancel Transaction?</span>
        <span class="mm-text">လွှဲပြောင်းမှုကို ပယ်ဖျက်မလား</span>
    </h2>
    <p style="color: var(--mmp-text-sub); margin-top: 0; margin-bottom: 32px; font-size: 0.95rem; line-height: 1.5;">
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
</div>`;
}

export function _getContentCoreCss(design?: IDesignOptions): string {
  const mode = design?.mode || 'light';
  const isDark = mode.includes('dark');
  const isTranslucent = mode.includes('translucent');

  let cardBg = isDark ? '#1c1c1e' : '#ffffff';
  if (isTranslucent) {
    cardBg = isDark ? 'rgba(28, 28, 30, 0.75)' : 'rgba(255, 255, 255, 0.75)';
  }
  const backdrop = isTranslucent ? 'blur(20px)' : 'none';

  return `
@import url('https://fonts.googleapis.com/css2?family=Padauk:wght@400;700&display=swap');
#mmpay-full-modal {
  --mmp-card-bg: ${cardBg};
  --mmp-card-backdrop: ${backdrop};
  --mmp-text-main: ${isDark ? '#f5f5f7' : '#1d1d1f'};
  --mmp-text-sub: ${isDark ? 'rgba(235, 235, 245, 0.6)' : '#86868b'};
  --mmp-border: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'};
  --mmp-btn-main-bg: ${isDark ? '#ffffff' : '#3a3a3c'};
  --mmp-btn-main-text: ${isDark ? '#000000' : '#ffffff'};
  --mmp-btn-sec-bg: ${isDark ? '#2c2c2e' : '#ffffff'};
  --mmp-btn-sec-text: ${isDark ? '#f5f5f7' : '#1d1d1f'};
  --mmp-btn-sec-border: ${isDark ? '#3a3a3c' : '#e5e5ea'};
  --mmp-detail-bg: ${isDark ? '#2c2c2e' : '#f9f9fb'};
  --mmp-toggle-bg: ${isDark ? '#2c2c2e' : '#f5f5f7'};
  --mmp-toggle-btn-active: ${isDark ? '#636366' : '#ffffff'};
  --mmp-toggle-btn-text: ${isDark ? '#ffffff' : '#1d1d1f'};
  --mmp-progress-track: ${isDark ? '#2c2c2e' : '#f1f5f9'};
  --mmp-progress-ind: ${isDark ? 'linear-gradient(90deg, transparent, #ffffff, transparent)' : 'linear-gradient(90deg, transparent, #0f172a, transparent)'};
  --mmp-success-bg: ${isDark ? 'rgba(52, 199, 89, 0.2)' : '#e8f8ec'};
  --mmp-fail-bg: ${isDark ? 'rgba(255, 59, 48, 0.2)' : '#fce8e6'};
  --mmp-warn-bg: ${isDark ? 'rgba(255, 149, 0, 0.2)' : '#fff4e5'};
  --mmp-close-btn-hover: ${isDark ? '#3a3a3c' : '#e5e5ea'};

  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  z-index: 99999; display: flex; align-items: center; justify-content: center;
  transition: opacity 0.2s ease; box-sizing: border-box; padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, 'Padauk';
}
.mmpay-lang-en .mm-text { display: none !important; }
.mmpay-lang-mm .en-text { display: none !important; }
.mmpay-toggle-container {
  position: absolute; top: 16px; left: 16px; display: flex; background: var(--mmp-toggle-bg);
  border-radius: 10px; padding: 3px; z-index: 10; border: 1px solid var(--mmp-border);
}
.mmpay-toggle-btn {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 0.75rem; font-weight: 600;
  padding: 5px 10px; border-radius: 8px; cursor: pointer; color: var(--mmp-text-sub); border: none; background: transparent; transition: all 0.2s ease;
}
.mmpay-lang-en .btn-en, .mmpay-lang-mm .btn-mm { background: var(--mmp-toggle-btn-active); color: var(--mmp-toggle-btn-text); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.mmpay-overlay-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.mmpay-card {
  background: var(--mmp-card-bg); backdrop-filter: var(--mmp-card-backdrop); -webkit-backdrop-filter: var(--mmp-card-backdrop);
  border-radius: 24px; box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px var(--mmp-border);
  text-align: center; animation: mmpayFadeIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); box-sizing: border-box;
  position: relative; width: 100%; max-width: 360px; overflow: hidden; display: flex; flex-direction: column;
}
@keyframes mmpayFadeIn { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
.mmpay-close-btn {
  position: absolute; top: 16px; right: 16px; background: var(--mmp-toggle-bg); border: none; cursor: pointer; padding: 0;
  color: var(--mmp-text-sub); border-radius: 50%; transition: all 0.2s ease; z-index: 10; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;
}
.mmpay-close-btn:hover { background-color: var(--mmp-close-btn-hover); color: var(--mmp-text-main); }
.mmpay-button {
  background: var(--mmp-btn-main-bg); color: var(--mmp-btn-main-text); border: none; padding: 14px 20px; border-radius: 14px;
  font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 10px; transition: all 0.2s ease; width: 100%; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.mmpay-button:hover { filter: brightness(1.1); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); }
.mmpay-button:active { transform: scale(0.98); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
.mmpay-button-secondary { background: var(--mmp-btn-sec-bg); color: var(--mmp-btn-sec-text); border: 1px solid var(--mmp-btn-sec-border); box-shadow: none; }
.mmpay-button-secondary:hover { background: var(--mmp-toggle-bg); box-shadow: none;}
.mmpay-button-danger { background: var(--mmp-fail-bg); color: #ff3b30; box-shadow: none; }
.mmpay-button-danger:hover { filter: brightness(0.95); box-shadow: none;}
`;
}

export function _getContentQRDisplay(qrContainerId: string, merchantName: string, formattedAmount: string, apiResponse: any, design?: IDesignOptions): string {
  const downloadBtnColor = design?.color || '#000000';
  return `
      <style>
        .mmpay-qr-view { padding: 64px 20px 24px 20px; box-sizing: border-box; width: 100%; display: flex; flex-direction: column; justify-content: center; }
        .mmpay-header { color: var(--mmp-text-sub); font-size: 1rem; font-weight: 500; margin-bottom: 6px; }
        .mmpay-amount-wrapper { margin: 0 auto 16px auto; display: flex; align-items: baseline; justify-content: center; gap: 6px; }
        .mmpay-amount-value { font-size: 1.85rem; font-weight: 700; color: var(--mmp-text-main); letter-spacing: -0.5px; line-height: 1; }
        .mmpay-amount-currency { font-size: 0.95rem; font-weight: 600; color: var(--mmp-text-sub); text-transform: uppercase; letter-spacing: 0.5px; }
        .mmpay-qr-container { width: 220px; height: 220px; padding: 12px; margin: 0 auto; display: flex; justify-content: center; align-items: center; background: #ffffff; border-radius: 16px; border: 1px solid var(--mmp-border); box-shadow: 0 8px 24px rgba(0,0,0,0.04); box-sizing: border-box; overflow: hidden; }
        #${qrContainerId} { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        #${qrContainerId} canvas, #${qrContainerId} img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .mmpay-powered-text { font-size: 0.75rem; color: var(--mmp-text-sub); font-weight: 500; margin: 12px auto 8px auto;}
        .mmpay-detail-box { background: var(--mmp-detail-bg); border-radius: 14px; padding: 14px 16px; margin-bottom: 20px; border: 1px solid var(--mmp-border); }
        .mmpay-detail { font-size: 0.85rem; color: var(--mmp-text-sub); margin: 6px 0; display: flex; justify-content: space-between; align-items: center; }
        .mmpay-detail strong { color: var(--mmp-text-main); font-weight: 600; text-align: right; }
        .mmpay-detail span { text-align: left; }
        .mmpay-timer-badge { color: #d93025; background: var(--mmp-fail-bg); padding: 5px 12px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 6px; margin: 0 auto 16px auto; }
        .mmpay-timer-icon { width: 14px; height: 14px; fill: currentColor; }
      </style>
      <div class="mmpay-card mmpay-qr-view">
          <div class="mmpay-toggle-container">
              <button class="mmpay-toggle-btn btn-en" onclick="MMPayToggleLang('en')">EN</button>
              <button class="mmpay-toggle-btn btn-mm" onclick="MMPayToggleLang('mm')">MM</button>
          </div>
          <button class="mmpay-close-btn" onclick="MMPayCloseModal(false)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
          </button>
          <div style="margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center;">
            <img src="https://motephoe.com/images/mmqr.webp" alt="MyanMyanPay Logo" style="height: 40px; width: auto; object-fit: contain;">
          </div>
          <div class="mmpay-header">${merchantName}</div>
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
                  <span><span class="en-text">Order ID</span><span class="mm-text">မှာယူမှုနံပါတ်</span></span>
                  <strong>${apiResponse.orderId}</strong>
              </div>
              <div class="mmpay-detail" style="margin-top: 8px;">
                  <span><span class="en-text">Transaction Ref</span><span class="mm-text">ငွေပေးငွေယူနံပါတ်</span></span>
                  <strong>${apiResponse.transactionRefId}</strong>
              </div>
          </div>
          <button class="mmpay-button" style="background-color: ${downloadBtnColor} !important; color: #ffffff !important;" onclick="MMPayDownloadQR()">
              <span class="en-text">Download QR Code</span>
              <span class="mm-text">QR ကုဒ်ကို သိမ်းဆည်းမည်</span>
          </button>
      </div>
    `;
}

export function _getContentAfterModal(isSuccess: boolean, orderId: string, messageHtml: string, design?: IDesignOptions): string {
  const iconColor = isSuccess ? '#34c759' : '#ff3b30';
  const iconBgVar = isSuccess ? 'var(--mmp-success-bg)' : 'var(--mmp-fail-bg)';
  const isExpired = messageHtml.toLowerCase().includes('expire') || messageHtml.includes('သတ်မှတ်ချိန်ကုန်');

  let iconSvg: string;
  let statusTextEn: string;
  let statusTextMm: string;

  if (isSuccess) {
    statusTextEn = 'Success';
    statusTextMm = 'အောင်မြင်ပါသည်';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="${iconColor}" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`;
  } else {
    statusTextEn = isExpired ? 'Expired' : 'Failed';
    statusTextMm = isExpired ? 'အချိန်ကျော်လွန်သွားပါပြီ' : 'မအောင်မြင်ပါ';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="${iconColor}" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;
  }

  return `
<div class="mmpay-card" style="padding: 64px 24px 32px 24px; box-sizing: border-box; width: 100%;">
    <div class="mmpay-toggle-container">
        <button class="mmpay-toggle-btn btn-en" onclick="MMPayToggleLang('en')">EN</button>
        <button class="mmpay-toggle-btn btn-mm" onclick="MMPayToggleLang('mm')">MM</button>
    </div>
    <div style="margin: 0 auto 24px auto; width: 72px; height: 72px; border-radius: 50%; background: ${iconBgVar}; display: flex; align-items: center; justify-content: center;">
        ${iconSvg}
    </div>
    <h2 style="font-size: 1.4rem; font-weight: 700; color: var(--mmp-text-main); margin: 0 0 10px 0;">
        <span class="en-text">${statusTextEn}</span>
        <span class="mm-text">${statusTextMm}</span>
    </h2>
    <div style="background: var(--mmp-detail-bg); padding: 8px 14px; border-radius: 10px; border: 1px solid var(--mmp-border); display: inline-block; margin-bottom: 24px;">
        <p style="color: var(--mmp-text-sub); font-size: 0.85rem; margin: 0; font-weight: 600;">ID: ${orderId}</p>
    </div>
    <p style="color: var(--mmp-text-sub); margin-top: 0; margin-bottom: 32px; font-size: 0.95rem; line-height: 1.5;">
        ${messageHtml}
    </p>
    <button class="mmpay-button" onclick="MMPayCloseModal(true)">
        <span class="en-text">Close</span>
        <span class="mm-text">ပိတ်မည်</span>
    </button>
</div>`;
}

export function _getPreloadScreen(design?: IDesignOptions): string {
  return `
      <style>
        @keyframes mmpayGodSweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        @keyframes mmpayPulseSoft { 0%, 100% { opacity: 0.9; transform: scale(1); } 50% { opacity: 1; transform: scale(1.04); filter: drop-shadow(0 8px 16px rgba(0,0,0,0.06)); } }
        .mmpay-preload-wrapper { padding: 56px 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 290px; }
        .mmpay-brand-core { position: relative; margin-bottom: 40px; display: flex; align-items: center; justify-content: center; }
        .mmpay-loader-img { width: 65px; height: auto; position: relative; z-index: 2; animation: mmpayPulseSoft 2.5s ease-in-out infinite; }
        .mmpay-progress-track { width: 160px; height: 2px; background: var(--mmp-progress-track); border-radius: 2px; overflow: hidden; position: relative; margin-bottom: 24px; }
        .mmpay-progress-indicator { position: absolute; top: 0; left: 0; bottom: 0; width: 40%; background: var(--mmp-progress-ind); animation: mmpayGodSweep 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .mmpay-preload-text { font-size: 0.85rem; font-weight: 700; color: var(--mmp-text-main); letter-spacing: 1px; text-transform: uppercase; }
        .mmpay-preload-subtext { font-size: 0.8rem; color: var(--mmp-text-sub); margin-top: 6px; font-weight: 500; }
      </style>
      <div class="mmpay-card mmpay-preload-wrapper">
          <div class="mmpay-brand-core">
              <img src="https://myanmyanpay.com/_next/image?url=%2Fmmp-logo.png&w=1920&q=75" alt="MMPay" class="mmpay-loader-img" />
          </div>
          <div class="mmpay-progress-track">
              <div class="mmpay-progress-indicator"></div>
          </div>
          <div class="mmpay-preload-text">
              <span class="en-text">Securing Transaction</span>
              <span class="mm-text">လုံခြုံသော ချိတ်ဆက်မှု</span>
          </div>
          <div class="mmpay-preload-subtext">
              <span class="en-text">Establishing end-to-end encryption...</span>
              <span class="mm-text">လုံခြုံရေးစနစ်များကို ချိတ်ဆက်နေသည်...</span>
          </div>
      </div>`;
}
