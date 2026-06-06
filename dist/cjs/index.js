'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function _getContentCancelModal() {
    return "\n<div id=\"mmpay-cancel-view-container\" class=\"mmpay-card\" style=\"padding: 64px 24px 32px 24px; box-sizing: border-box; width: 100%;\">\n\n    <div class=\"mmpay-toggle-container\">\n        <button class=\"mmpay-toggle-btn btn-en\" onclick=\"MMPayToggleLang('en')\">EN</button>\n        <button class=\"mmpay-toggle-btn btn-mm\" onclick=\"MMPayToggleLang('mm')\">MM</button>\n    </div>\n\n    <div style=\"\n                margin: 0 auto 24px auto;\n                width: 64px;\n                height: 64px;\n                border-radius: 50%;\n                background-color: #fff4e5;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                color: #ff9500;\n            \">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2.5\">\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z\"/>\n        </svg>\n    </div>\n    <h2 style=\"font-size: 1.3rem; font-weight: 700; color: #1d1d1f; margin: 0 0 12px 0;\">\n        <span class=\"en-text\">Cancel Transaction?</span>\n        <span class=\"mm-text\">\u101C\u103D\u103E\u1032\u1015\u103C\u1031\u102C\u1004\u103A\u1038\u1019\u103E\u102F\u1000\u102D\u102F \u1015\u101A\u103A\u1016\u103B\u1000\u103A\u1019\u101C\u102C\u1038</span>\n    </h2>\n    <p style=\"color: #86868b; margin-top: 0; margin-bottom: 32px; font-size: 0.95rem; line-height: 1.5;\">\n        <span class=\"en-text\">If you haven't paid yet, you can safely cancel this process.</span>\n        <span class=\"mm-text\">\u101E\u1004\u103A\u101E\u100A\u103A \u1004\u103D\u1031\u1015\u1031\u1038\u1001\u103B\u1031\u1019\u103E\u102F \u1019\u1015\u103C\u102F\u101C\u102F\u1015\u103A\u101B\u101E\u1031\u1038\u1015\u102B\u1000 \u101C\u102F\u1015\u103A\u1004\u1014\u103A\u1038\u1005\u1009\u103A\u1021\u102C\u1038 \u1016\u103B\u1000\u103A\u101E\u102D\u1019\u103A\u1038\u1014\u102D\u102F\u1004\u103A\u1015\u102B\u101E\u100A\u103A\u104B</span>\n    </p>\n\n    <div style=\"display: flex; gap: 10px; flex-direction: column;\">\n        <button class=\"mmpay-button mmpay-button-danger\" onclick=\"MMPayCloseModal(true)\">\n            <span class=\"en-text\">Stop Process</span>\n            <span class=\"mm-text\">\u101C\u102F\u1015\u103A\u1004\u1014\u103A\u1038\u1005\u1009\u103A \u101B\u1015\u103A\u1010\u1014\u1037\u103A\u1019\u100A\u103A</span>\n        </button>\n        <button class=\"mmpay-button mmpay-button-secondary\" onclick=\"MMPayReRenderModal()\">\n            <span class=\"en-text\">Go Back</span>\n            <span class=\"mm-text\">\u1021\u1014\u1031\u102C\u1000\u103A\u101E\u102D\u102F\u1037 \u1015\u103C\u1014\u103A\u101E\u103D\u102C\u1038\u1019\u100A\u103A</span>\n        </button>\n    </div>\n</div>";
}
function _getContentCoreCss() {
    return "\n@import url('https://fonts.googleapis.com/css2?family=Padauk:wght@400;700&display=swap');\n\n#mmpay-full-modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background-color: rgba(0, 0, 0, 0.4);\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n  z-index: 99999;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: opacity 0.2s ease;\n  box-sizing: border-box;\n  padding: 16px;\n  font-family: -apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, 'Padauk';\n}\n\n.mmpay-lang-en .mm-text { display: none !important; }\n.mmpay-lang-mm .en-text { display: none !important; }\n\n.mmpay-toggle-container {\n  position: absolute;\n  top: 16px;\n  left: 16px;\n  display: flex;\n  background: #f5f5f7;\n  border-radius: 10px;\n  padding: 3px;\n  z-index: 10;\n  border: 1px solid rgba(0,0,0,0.04);\n}\n.mmpay-toggle-btn {\n  font-family: -apple-system, BlinkMacSystemFont, sans-serif;\n  font-size: 0.75rem;\n  font-weight: 600;\n  padding: 5px 10px;\n  border-radius: 8px;\n  cursor: pointer;\n  color: #86868b;\n  border: none;\n  background: transparent;\n  transition: all 0.2s ease;\n}\n.mmpay-lang-en .btn-en { background: #ffffff; color: #1d1d1f; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }\n.mmpay-lang-mm .btn-mm { background: #ffffff; color: #1d1d1f; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }\n\n.mmpay-overlay-content {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    height: 100%;\n}\n\n.mmpay-card {\n  background: #ffffff;\n  border-radius: 24px;\n  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0,0,0,0.02);\n  text-align: center;\n  animation: mmpayFadeIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);\n  box-sizing: border-box;\n  position: relative;\n  width: 100%;\n  max-width: 360px;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n@keyframes mmpayFadeIn {\n  from { opacity: 0; transform: translateY(20px) scale(0.97); }\n  to { opacity: 1; transform: translateY(0) scale(1); }\n}\n\n.mmpay-close-btn {\n    position: absolute;\n    top: 16px;\n    right: 16px;\n    background: #f5f5f7;\n    border: none;\n    cursor: pointer;\n    padding: 0;\n    color: #86868b;\n    border-radius: 50%;\n    transition: all 0.2s ease;\n    z-index: 10;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 32px;\n    height: 32px;\n}\n.mmpay-close-btn:hover {\n    background-color: #e5e5ea;\n    color: #1d1d1f;\n}\n\n.mmpay-button {\n  background: #3a3a3c;\n  color: #ffffff;\n  border: none;\n  padding: 14px 20px;\n  border-radius: 14px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  margin-top: 10px;\n  transition: all 0.2s ease;\n  width: 100%;\n  -webkit-tap-highlight-color: transparent;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n.mmpay-button:hover {\n  background: #48484a;\n  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);\n}\n.mmpay-button:active { transform: scale(0.98); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }\n\n.mmpay-button-secondary {\n  background: #ffffff;\n  color: #1d1d1f;\n  border: 1px solid #e5e5ea;\n  box-shadow: none;\n}\n.mmpay-button-secondary:hover { background: #f5f5f7; box-shadow: none;}\n\n.mmpay-button-danger {\n  background: #fff0f0;\n  color: #ff3b30;\n  box-shadow: none;\n}\n.mmpay-button-danger:hover { background: #ffe5e5; box-shadow: none;}\n";
}
function _getContentQRDisplay(qrContainerId, merchantName, formattedAmount, apiResponse) {
    return "\n      <style>\n        .mmpay-qr-view { padding: 64px 20px 24px 20px; box-sizing: border-box; width: 100%; display: flex; flex-direction: column; justify-content: center; }\n        .mmpay-header { color: #86868b; font-size: 1rem; font-weight: 500; margin-bottom: 6px; }\n\n        .mmpay-amount-wrapper {\n            margin: 0 auto 16px auto;\n            display: flex;\n            align-items: baseline;\n            justify-content: center;\n            gap: 6px;\n        }\n        .mmpay-amount-value {\n            font-size: 1.85rem;\n            font-weight: 700;\n            color: #1d1d1f;\n            letter-spacing: -0.5px;\n            line-height: 1;\n        }\n        .mmpay-amount-currency {\n            font-size: 0.95rem;\n            font-weight: 600;\n            color: #86868b;\n            text-transform: uppercase;\n            letter-spacing: 0.5px;\n        }\n\n        .mmpay-qr-container {\n            width: 220px;\n            height: 220px;\n            padding: 12px;\n            margin: 0 auto;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            background: #ffffff;\n            border-radius: 16px;\n            border: 1px solid rgba(0,0,0,0.06);\n            box-shadow: 0 8px 24px rgba(0,0,0,0.04);\n            box-sizing: border-box;\n            overflow: hidden;\n        }\n        #".concat(qrContainerId, " {\n            width: 100%;\n            height: 100%;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n        }\n        /* Fix: Let the library handle the display property natively so they don't stack */\n        #").concat(qrContainerId, " canvas, #").concat(qrContainerId, " img {\n            max-width: 100%;\n            max-height: 100%;\n            object-fit: contain;\n        }\n\n        .mmpay-powered-text { font-size: 0.75rem; color: #86868b; font-weight: 500; margin: 12px auto 8px auto;}\n\n        .mmpay-detail-box {\n            background: #f9f9fb;\n            border-radius: 14px;\n            padding: 14px 16px;\n            margin-bottom: 20px;\n            border: 1px solid rgba(0,0,0,0.03);\n        }\n        .mmpay-detail { font-size: 0.85rem; color: #86868b; margin: 6px 0; display: flex; justify-content: space-between; align-items: center; }\n        .mmpay-detail strong { color: #1d1d1f; font-weight: 600; text-align: right; }\n        .mmpay-detail span { text-align: left; }\n\n        .mmpay-timer-badge {\n            color: #d93025;\n            background: #fce8e6;\n            padding: 5px 12px;\n            border-radius: 10px;\n            font-size: 0.85rem;\n            font-weight: 600;\n            display: inline-flex;\n            align-items: center;\n            justify-content: center;\n            gap: 6px;\n            margin: 0 auto 16px auto;\n        }\n        .mmpay-timer-icon {\n            width: 14px;\n            height: 14px;\n            fill: currentColor;\n        }\n      </style>\n\n      <div class=\"mmpay-card mmpay-qr-view\">\n\n          <div class=\"mmpay-toggle-container\">\n              <button class=\"mmpay-toggle-btn btn-en\" onclick=\"MMPayToggleLang('en')\">EN</button>\n              <button class=\"mmpay-toggle-btn btn-mm\" onclick=\"MMPayToggleLang('mm')\">MM</button>\n          </div>\n\n          <button class=\"mmpay-close-btn\" onclick=\"MMPayCloseModal(false)\" aria-label=\"Close\">\n              <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2.5\">\n                  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M6 18L18 6M6 6l12 12\"/>\n              </svg>\n          </button>\n\n          <div style=\"margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center;\">\n            <img src=\"https://motephoe.com/images/mmqr.webp\" alt=\"MyanMyanPay Logo\" style=\"height: 40px; width: auto; object-fit: contain;\">\n          </div>\n\n          <div class=\"mmpay-header\">\n              ").concat(merchantName, "\n          </div>\n\n          <div class=\"mmpay-amount-wrapper\">\n              <span class=\"mmpay-amount-value\">").concat(formattedAmount, "</span>\n              <span class=\"mmpay-amount-currency\">MMK</span>\n          </div>\n\n          <div class=\"mmpay-qr-container\">\n              <div id=\"").concat(qrContainerId, "\"></div>\n          </div>\n\n          <div class=\"mmpay-powered-text\">\n              <span class=\"en-text\">Payment powered by MyanMyanPay</span>\n              <span class=\"mm-text\">MyanMyanPay \u1016\u103C\u1004\u1037\u103A \u1004\u103D\u1031\u1015\u1031\u1038\u1001\u103B\u1031\u1019\u103E\u102F\u1000\u102D\u102F \u1011\u1031\u102C\u1000\u103A\u1015\u1036\u1037\u1011\u102C\u1038\u101E\u100A\u103A</span>\n          </div>\n\n          <div class=\"mmpay-timer-badge\" id=\"mmpay-timer-badge\">\n             <svg class=\"mmpay-timer-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">\n               <path d=\"M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z\"/>\n               <path d=\"M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z\"/>\n             </svg>\n             <span id=\"mmpay-countdown-text\">05:00</span>\n          </div>\n\n          <div class=\"mmpay-detail-box\">\n              <div class=\"mmpay-detail\">\n                  <span>\n                    <span class=\"en-text\">Order ID</span>\n                    <span class=\"mm-text\">\u1019\u103E\u102C\u101A\u1030\u1019\u103E\u102F\u1014\u1036\u1015\u102B\u1010\u103A</span>\n                  </span>\n                  <strong>").concat(apiResponse.orderId, "</strong>\n              </div>\n              <div class=\"mmpay-detail\" style=\"margin-top: 8px;\">\n                  <span>\n                    <span class=\"en-text\">Transaction Ref</span>\n                    <span class=\"mm-text\">\u1004\u103D\u1031\u1015\u1031\u1038\u1004\u103D\u1031\u101A\u1030\u1014\u1036\u1015\u102B\u1010\u103A</span>\n                  </span>\n                  <strong>").concat(apiResponse.transactionRefId, "</strong>\n              </div>\n          </div>\n\n          <button class=\"mmpay-button\" onclick=\"MMPayDownloadQR()\">\n              <span class=\"en-text\">Download QR Code</span>\n              <span class=\"mm-text\">QR \u1000\u102F\u1012\u103A\u1000\u102D\u102F \u101E\u102D\u1019\u103A\u1038\u1006\u100A\u103A\u1038\u1019\u100A\u103A</span>\n          </button>\n      </div>\n    ");
}
function _getContentAfterModal(isSuccess, orderId, messageHtml) {
    var iconColor = isSuccess ? '#34c759' : '#ff3b30';
    var iconBg = isSuccess ? '#e8f8ec' : '#fce8e6';
    var iconSvg;
    var statusTextEn;
    var statusTextMm;
    if (isSuccess) {
        statusTextEn = 'Success';
        statusTextMm = 'အောင်မြင်ပါသည်';
        iconSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"36\" height=\"36\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"".concat(iconColor, "\" stroke-width=\"3\">\n                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M5 13l4 4L19 7\" />\n                 </svg>");
    }
    else {
        statusTextEn = status === 'FAILED' ? 'Failed' : 'Expired';
        statusTextMm = status === 'FAILED' ? 'မအောင်မြင်ပါ' : 'အချိန်ကျော်လွန်သွားပါပြီ';
        iconSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"36\" height=\"36\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"".concat(iconColor, "\" stroke-width=\"3\">\n                    <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M6 18L18 6M6 6l12 12\" />\n                 </svg>");
    }
    return "\n<div class=\"mmpay-card\" style=\"padding: 64px 24px 32px 24px; box-sizing: border-box; width: 100%;\">\n\n    <div class=\"mmpay-toggle-container\">\n        <button class=\"mmpay-toggle-btn btn-en\" onclick=\"MMPayToggleLang('en')\">EN</button>\n        <button class=\"mmpay-toggle-btn btn-mm\" onclick=\"MMPayToggleLang('mm')\">MM</button>\n    </div>\n\n    <div style=\"\n                margin: 0 auto 24px auto;\n                width: 72px;\n                height: 72px;\n                border-radius: 50%;\n                background: ".concat(iconBg, ";\n                display: flex;\n                align-items: center;\n                justify-content: center;\n            \">\n                ").concat(iconSvg, "\n    </div>\n\n    <h2 style=\"font-size: 1.4rem; font-weight: 700; color: #1d1d1f; margin: 0 0 10px 0;\">\n        <span class=\"en-text\">").concat(statusTextEn, "</span>\n        <span class=\"mm-text\">").concat(statusTextMm, "</span>\n    </h2>\n\n    <div style=\"background: #f9f9fb; padding: 8px 14px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.03); display: inline-block; margin-bottom: 24px;\">\n        <p style=\"color: #86868b; font-size: 0.85rem; margin: 0; font-weight: 600;\">\n                    ID: ").concat(orderId, "\n        </p>\n    </div>\n\n    <p style=\"color: #86868b; margin-top: 0; margin-bottom: 32px; font-size: 0.95rem; line-height: 1.5;\">\n                ").concat(messageHtml, "\n    </p>\n\n    <button class=\"mmpay-button\" onclick=\"MMPayCloseModal(true)\">\n        <span class=\"en-text\">Close</span>\n        <span class=\"mm-text\">\u1015\u102D\u1010\u103A\u1019\u100A\u103A</span>\n    </button>\n</div>\n");
}
function _getPreloadScreen() {
    return "\n      <style>\n        @keyframes mmpayGodSweep {\n          0% { transform: translateX(-100%); }\n          100% { transform: translateX(200%); }\n        }\n        @keyframes mmpayPulseSoft {\n          0%, 100% { opacity: 0.9; transform: scale(1); }\n          50% { opacity: 1; transform: scale(1.04); filter: drop-shadow(0 8px 16px rgba(0,0,0,0.06)); }\n        }\n        .mmpay-preload-wrapper {\n          padding: 56px 24px;\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: center;\n          min-height: 290px;\n          background-color: #ffffff;\n        }\n        .mmpay-brand-core {\n          position: relative;\n          margin-bottom: 40px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n        }\n        .mmpay-loader-img {\n          width: 65px; /* Scaled down significantly for a premium feel */\n          height: auto;\n          position: relative;\n          z-index: 2;\n          animation: mmpayPulseSoft 2.5s ease-in-out infinite;\n        }\n        .mmpay-progress-track {\n          width: 160px;\n          height: 2px;\n          background: #f1f5f9;\n          border-radius: 2px;\n          overflow: hidden;\n          position: relative;\n          margin-bottom: 24px;\n        }\n        .mmpay-progress-indicator {\n          position: absolute;\n          top: 0; left: 0; bottom: 0;\n          width: 40%;\n          background: linear-gradient(90deg, transparent, #0f172a, transparent);\n          animation: mmpayGodSweep 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;\n        }\n        .mmpay-preload-text {\n          font-size: 0.85rem;\n          font-weight: 700;\n          color: #0f172a;\n          letter-spacing: 1px;\n          text-transform: uppercase;\n        }\n        .mmpay-preload-subtext {\n          font-size: 0.8rem;\n          color: #86868b;\n          margin-top: 6px;\n          font-weight: 500;\n        }\n      </style>\n\n      <div class=\"mmpay-card mmpay-preload-wrapper\">\n          <div class=\"mmpay-brand-core\">\n              <img src=\"https://myanmyanpay.com/_next/image?url=%2Fmmp-logo.png&w=1920&q=75\" alt=\"MMPay\" class=\"mmpay-loader-img\" />\n          </div>\n          <div class=\"mmpay-progress-track\">\n              <div class=\"mmpay-progress-indicator\"></div>\n          </div>\n          <div class=\"mmpay-preload-text\">\n              <span class=\"en-text\">Securing Transaction</span>\n              <span class=\"mm-text\">\u101C\u102F\u1036\u1001\u103C\u102F\u1036\u101E\u1031\u102C \u1001\u103B\u102D\u1010\u103A\u1006\u1000\u103A\u1019\u103E\u102F</span>\n          </div>\n          <div class=\"mmpay-preload-subtext\">\n              <span class=\"en-text\">Establishing end-to-end encryption...</span>\n              <span class=\"mm-text\">\u101C\u102F\u1036\u1001\u103C\u102F\u1036\u101B\u1031\u1038\u1005\u1014\u1005\u103A\u1019\u103B\u102C\u1038\u1000\u102D\u102F \u1001\u103B\u102D\u1010\u103A\u1006\u1000\u103A\u1014\u1031\u101E\u100A\u103A...</span>\n          </div>\n      </div>";
}

var MMPaySDK = /** @class */ (function () {
    function MMPaySDK(publishableKey, options) {
        if (options === void 0) { options = {}; }
        this.pollIntervalId = undefined;
        this.countdownIntervalId = undefined;
        this.onCompleteCallback = null;
        this.overlayElement = null;
        this.pendingApiResponse = null;
        this.pendingPaymentPayload = null;
        this.QR_SIZE = 290;
        this.TIMEOUT_SECONDS = 300;
        this.CACHE_KEY = 'mmpay_pending_tx';
        if (!publishableKey) {
            throw new Error("A Publishable Key is required to initialize [MMPaySDK].");
        }
        this.publishableKey = publishableKey;
        this.environment = options.environment || 'production';
        this.baseUrl = options.baseUrl || 'https://api.mm-pay.com';
        this.merchantName = options.merchantName || 'Your Merchant';
        this.POLL_INTERVAL_MS = options.pollInterval || 5000;
        if (typeof window !== 'undefined') {
            this._checkAndAutoResume();
        }
    }
    MMPaySDK.prototype._checkAndAutoResume = function () {
        var _this = this;
        var cachedData = localStorage.getItem(this.CACHE_KEY);
        if (!cachedData)
            return;
        try {
            var parsed = JSON.parse(cachedData);
            if (Date.now() >= parsed.expireAt) {
                // Fire expiration API if cache expired in the background
                this.tokenKey = parsed.token;
                this._callApiExpirePayment({
                    orderId: parsed.payload.orderId,
                    nonce: new Date().getTime().toString() + '_expire_auto'
                }).catch(function (e) { return console.error("Auto-resume expire call failed:", e); });
                this._clearCache();
                return;
            }
            this.tokenKey = parsed.token;
            this.pendingPaymentPayload = parsed.payload;
            this.pendingApiResponse = parsed.apiResponse;
            this._renderQrModalContent(this.pendingApiResponse, this.pendingPaymentPayload, this.merchantName);
            this._startPolling(this.pendingPaymentPayload, function (res) {
                if (_this.onCompleteCallback) {
                    _this.onCompleteCallback(res);
                }
            });
            this._startCountdown(this.pendingPaymentPayload.orderId, parsed.expireAt);
        }
        catch (e) {
            this._clearCache();
        }
    };
    MMPaySDK.prototype._callApi = function (endpoint_1) {
        return __awaiter(this, arguments, void 0, function (endpoint, data) {
            var config, response, errorText;
            if (data === void 0) { data = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer ".concat(this.publishableKey)
                        };
                        if (this.tokenKey) {
                            config = {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(this.publishableKey),
                                'X-MMPay-Btoken': "".concat(this.tokenKey)
                            };
                        }
                        return [4 /*yield*/, fetch("".concat(this.baseUrl).concat(endpoint), {
                                method: 'POST',
                                headers: config,
                                body: JSON.stringify(data)
                            })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        errorText = _a.sent();
                        throw new Error("API error (".concat(response.status, "): ").concat(response.statusText, ". Details: ").concat(errorText));
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        });
    };
    MMPaySDK.prototype._callApiTokenRequest = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        endpoint = this.environment === 'sandbox'
                            ? '/xpayments/sandbox-token-request'
                            : '/xpayments/production-token-request';
                        return [4 /*yield*/, this._callApi(endpoint, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Token request failed:", error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MMPaySDK.prototype._callApiPaymentRequest = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        endpoint = this.environment === 'sandbox'
                            ? '/xpayments/sandbox-payment-create'
                            : '/xpayments/production-payment-create';
                        return [4 /*yield*/, this._callApi(endpoint, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Payment request failed:", error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MMPaySDK.prototype._callApiCancelPayment = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = this.environment === 'sandbox'
                            ? '/xpayments/sandbox-payment-cancel'
                            : '/xpayments/production-payment-cancel';
                        return [4 /*yield*/, this._callApi(endpoint, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MMPaySDK.prototype._callApiExpirePayment = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = this.environment === 'sandbox'
                            ? '/xpayments/sandbox-payment-expire'
                            : '/xpayments/production-payment-expire';
                        return [4 /*yield*/, this._callApi(endpoint, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MMPaySDK.prototype._clearCache = function () {
        localStorage.removeItem(this.CACHE_KEY);
    };
    MMPaySDK.prototype.createPayment = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenPayload, paymentPayload, tokenResponse, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenPayload = {
                            amount: params.amount,
                            orderId: params.orderId,
                            nonce: new Date().getTime().toString() + '_mmp'
                        };
                        paymentPayload = {
                            amount: params.amount,
                            orderId: params.orderId,
                            callbackUrl: params.callbackUrl,
                            customMessage: params.customMessage,
                            nonce: new Date().getTime().toString() + '_mmp'
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this._callApiTokenRequest(tokenPayload)];
                    case 2:
                        tokenResponse = _a.sent();
                        this.tokenKey = tokenResponse.token;
                        return [4 /*yield*/, this._callApiPaymentRequest(paymentPayload)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_3 = _a.sent();
                        console.error("Payment request failed:", error_3);
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MMPaySDK.prototype.showPaymentModal = function (params, onComplete) {
        return __awaiter(this, void 0, void 0, function () {
            var cachedData, parsed, tokenPayload, paymentPayload, expireAt, apiCallSequence, apiResponse;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.onCompleteCallback = onComplete;
                        cachedData = localStorage.getItem(this.CACHE_KEY);
                        if (cachedData) {
                            try {
                                parsed = JSON.parse(cachedData);
                                if (Date.now() < parsed.expireAt) {
                                    this.tokenKey = parsed.token;
                                    this.pendingPaymentPayload = parsed.payload;
                                    this.pendingApiResponse = parsed.apiResponse;
                                    this._renderQrModalContent(this.pendingApiResponse, this.pendingPaymentPayload, this.merchantName);
                                    this._startPolling(this.pendingPaymentPayload, onComplete);
                                    this._startCountdown(this.pendingPaymentPayload.orderId, parsed.expireAt);
                                    return [2 /*return*/];
                                }
                                else {
                                    // Fire expiration API if cache expired before showing modal again
                                    this.tokenKey = parsed.token;
                                    this._callApiExpirePayment({
                                        orderId: parsed.payload.orderId,
                                        nonce: new Date().getTime().toString() + '_expire_modal'
                                    }).catch(function (e) { return console.error("Modal check expire call failed:", e); });
                                    this._clearCache();
                                }
                            }
                            catch (e) {
                                this._clearCache();
                            }
                        }
                        this._createAndRenderModal(_getPreloadScreen(), false);
                        tokenPayload = {
                            amount: params.amount,
                            orderId: params.orderId,
                            nonce: new Date().getTime().toString() + '_mmp'
                        };
                        paymentPayload = {
                            amount: params.amount,
                            orderId: params.orderId,
                            callbackUrl: params.callbackUrl,
                            customMessage: params.customMessage,
                            nonce: new Date().getTime().toString() + '_mmp'
                        };
                        expireAt = Date.now() + (this.TIMEOUT_SECONDS * 1000);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        apiCallSequence = function () { return __awaiter(_this, void 0, void 0, function () {
                            var tokenResponse;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this._callApiTokenRequest(tokenPayload)];
                                    case 1:
                                        tokenResponse = _a.sent();
                                        this.tokenKey = tokenResponse.token;
                                        return [4 /*yield*/, this._callApiPaymentRequest(paymentPayload)];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        return [4 /*yield*/, Promise.all([
                                apiCallSequence(),
                                new Promise(function (resolve) { return setTimeout(resolve, 1500); })
                            ])];
                    case 2:
                        apiResponse = (_a.sent())[0];
                        if (apiResponse && apiResponse.qr && apiResponse.transactionRefId) {
                            this.pendingApiResponse = apiResponse;
                            this.pendingPaymentPayload = paymentPayload;
                            localStorage.setItem(this.CACHE_KEY, JSON.stringify({
                                payload: paymentPayload,
                                apiResponse: apiResponse,
                                expireAt: expireAt,
                                token: this.tokenKey
                            }));
                            this._renderQrModalContent(apiResponse, paymentPayload, this.merchantName);
                            this._startPolling(paymentPayload, onComplete);
                            this._startCountdown(paymentPayload.orderId, expireAt);
                        }
                        else {
                            this._showTerminalMessage(apiResponse.orderId || 'N/A', 'FAILED', '<span class="en-text">Failed to start payment. No QR data.</span><span class="mm-text">ငွေပေးချေမှု စတင်ရန် မအောင်မြင်ပါ။ QR ဒေတာ မရရှိပါ။</span>');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _a.sent();
                        this.tokenKey = null;
                        this._showTerminalMessage(paymentPayload.orderId || 'N/A', 'FAILED', '<span class="en-text">Error occurred while starting payment.</span><span class="mm-text">ငွေပေးချေမှု စတင်စဉ် အမှားအယွင်း ဖြစ်ပွားသည်။</span>');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MMPaySDK.prototype._createAndRenderModal = function (contentHtml, isTerminal) {
        var _this = this;
        if (isTerminal === void 0) { isTerminal = false; }
        this._cleanupModal(false);
        var overlay = document.createElement('div');
        overlay.id = 'mmpay-full-modal';
        overlay.className = 'mmpay-lang-en';
        document.body.appendChild(overlay);
        this.overlayElement = overlay;
        var style = document.createElement('style');
        style.innerHTML = _getContentCoreCss();
        overlay.appendChild(style);
        window.MMPayToggleLang = function (lang) {
            var modal = document.getElementById('mmpay-full-modal');
            if (modal)
                modal.className = 'mmpay-lang-' + lang;
        };
        window.MMPayCloseModal = function () {
            var args_1 = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args_1[_i] = arguments[_i];
            }
            return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (forceClose) {
                var e_1;
                if (forceClose === void 0) { forceClose = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(isTerminal || forceClose)) return [3 /*break*/, 6];
                            if (!(forceClose && !isTerminal && this.pendingPaymentPayload)) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this._callApiCancelPayment({
                                    orderId: this.pendingPaymentPayload.orderId,
                                    nonce: new Date().getTime().toString() + '_cancel'
                                })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            console.error("Cancel API call failed", e_1);
                            return [3 /*break*/, 4];
                        case 4:
                            this._clearCache();
                            _a.label = 5;
                        case 5:
                            if (isTerminal) {
                                this._clearCache();
                            }
                            this._cleanupModal(true);
                            return [3 /*break*/, 7];
                        case 6:
                            this._showCancelConfirmationModal();
                            _a.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        window.MMPayReRenderModal = function () { return _this._reRenderPendingModalInstance(); };
        overlay.innerHTML += "\n      <div class=\"mmpay-overlay-content\">".concat(contentHtml, "</div>\n    ");
        document.body.style.overflow = 'hidden';
        return overlay;
    };
    MMPaySDK.prototype._renderQrModalContent = function (apiResponse, payload, merchantName) {
        var qrData = apiResponse.qr;
        var formattedAmount = apiResponse.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        var qrContainerId = 'mmpayQrContainerBox';
        var orderId = payload.orderId;
        window.MMPayDownloadQR = function () {
            var container = document.getElementById(qrContainerId);
            if (!container)
                return;
            var canvas = container.querySelector('canvas');
            var img = container.querySelector('img');
            try {
                var dataURL = '';
                if (canvas) {
                    dataURL = canvas.toDataURL('image/png');
                }
                else if (img) {
                    dataURL = img.src;
                }
                if (dataURL) {
                    var link = document.createElement('a');
                    link.href = dataURL;
                    link.download = "MMPay-QR-".concat(orderId, ".png");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
            catch (e) {
                console.error("Failed to download QR image:", e);
            }
        };
        var qrContentHtml = _getContentQRDisplay(qrContainerId, merchantName, formattedAmount, apiResponse);
        this._cleanupModal(false);
        this._createAndRenderModal(qrContentHtml, false);
        this._injectQrScript(qrData, qrContainerId);
    };
    MMPaySDK.prototype._showTerminalMessage = function (orderId, status, messageHtml) {
        this._cleanupModal(true);
        var isSuccess = status === 'SUCCESS';
        var content = _getContentAfterModal(isSuccess, orderId, messageHtml);
        this._createAndRenderModal(content, true);
    };
    MMPaySDK.prototype._showCancelConfirmationModal = function () {
        var _a;
        var overlayContent = (_a = this.overlayElement) === null || _a === void 0 ? void 0 : _a.querySelector('.mmpay-overlay-content');
        if (!overlayContent)
            return;
        var qrView = overlayContent.querySelector('.mmpay-qr-view');
        if (qrView) {
            qrView.style.display = 'none';
        }
        var cancelView = document.getElementById('mmpay-cancel-view-container');
        if (cancelView) {
            cancelView.style.display = 'flex';
            return;
        }
        var content = _getContentCancelModal();
        overlayContent.insertAdjacentHTML('beforeend', content);
    };
    MMPaySDK.prototype._reRenderPendingModalInstance = function () {
        var _a;
        var cancelView = document.getElementById('mmpay-cancel-view-container');
        if (cancelView) {
            cancelView.style.display = 'none';
        }
        var overlayContent = (_a = this.overlayElement) === null || _a === void 0 ? void 0 : _a.querySelector('.mmpay-overlay-content');
        if (overlayContent) {
            var qrView = overlayContent.querySelector('.mmpay-qr-view');
            if (qrView) {
                qrView.style.display = 'flex';
            }
        }
    };
    MMPaySDK.prototype._cleanupModal = function (restoreBodyScroll) {
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
    };
    MMPaySDK.prototype._injectQrScript = function (qrData, qrContainerId) {
        var _this = this;
        var initQR = function () {
            var container = document.getElementById(qrContainerId);
            if (typeof QRCode !== 'undefined' && container) {
                container.innerHTML = '';
                new QRCode(container, {
                    text: qrData,
                    width: _this.QR_SIZE,
                    height: _this.QR_SIZE,
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
            var script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
            script.onload = function () { return setTimeout(initQR, 50); };
            document.head.appendChild(script);
        }
    };
    MMPaySDK.prototype._startPolling = function (payload, onComplete) {
        return __awaiter(this, void 0, void 0, function () {
            var checkStatus;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.pollIntervalId !== undefined) {
                    window.clearInterval(this.pollIntervalId);
                }
                checkStatus = function () { return __awaiter(_this, void 0, void 0, function () {
                    var endpoint, response, status_1, success, messageHtml, error_5;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                endpoint = this.environment === 'sandbox'
                                    ? '/xpayments/sandbox-payment-polling'
                                    : '/xpayments/production-payment-polling';
                                return [4 /*yield*/, this._callApi(endpoint, payload)];
                            case 1:
                                response = _a.sent();
                                status_1 = (response.status || '').toUpperCase();
                                if (status_1 === 'SUCCESS' || status_1 === 'FAILED' || status_1 === 'EXPIRED') {
                                    window.clearInterval(this.pollIntervalId);
                                    this.pollIntervalId = undefined;
                                    this._clearCache();
                                    success = status_1 === 'SUCCESS';
                                    messageHtml = success ?
                                        "<span class=\"en-text\">Payment successful.<br>Ref: ".concat(response.transactionRefId || 'N/A', "</span>\n             <span class=\"mm-text\">\u1004\u103D\u1031\u1015\u1031\u1038\u1001\u103B\u1031\u1019\u103E\u102F \u1021\u1031\u102C\u1004\u103A\u1019\u103C\u1004\u103A\u1015\u102B\u1015\u103C\u102E\u104B<br>\u101B\u100A\u103A\u100A\u103D\u103E\u1014\u103A\u1038\u1014\u1036\u1015\u102B\u1010\u103A: ").concat(response.transactionRefId || 'N/A', "</span>") :
                                        "<span class=\"en-text\">Payment ".concat(status_1 === 'FAILED' ? 'failed' : 'expired', ".</span>\n             <span class=\"mm-text\">\u1004\u103D\u1031\u1015\u1031\u1038\u1001\u103B\u1031\u1019\u103E\u102F ").concat(status_1 === 'FAILED' ? 'မအောင်မြင်ပါ' : 'သက်တမ်းကုန်သွားပါပြီ', "\u104B</span>");
                                    this._showTerminalMessage(response.orderId || 'N/A', status_1, messageHtml);
                                    if (onComplete) {
                                        this.tokenKey = null;
                                        onComplete({ success: success, transaction: response });
                                    }
                                    return [2 /*return*/];
                                }
                                return [3 /*break*/, 3];
                            case 2:
                                error_5 = _a.sent();
                                console.error("Polling error:", error_5);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                checkStatus();
                this.pollIntervalId = window.setInterval(checkStatus, this.POLL_INTERVAL_MS);
                return [2 /*return*/];
            });
        });
    };
    MMPaySDK.prototype._startCountdown = function (orderId, expireAt) {
        var _this = this;
        if (this.countdownIntervalId !== undefined) {
            window.clearInterval(this.countdownIntervalId);
        }
        var updateDisplay = function () {
            var timerElement = document.getElementById('mmpay-countdown-text');
            var remaining = Math.max(0, Math.floor((expireAt - Date.now()) / 1000));
            if (timerElement) {
                var minutes = Math.floor(remaining / 60);
                var seconds = remaining % 60;
                timerElement.innerText = "".concat(minutes.toString().padStart(2, '0'), ":").concat(seconds.toString().padStart(2, '0'));
            }
            return remaining;
        };
        var currentRemaining = updateDisplay();
        // Changed to a synchronous interval to prevent background Promise execution issues
        this.countdownIntervalId = window.setInterval(function () {
            currentRemaining = updateDisplay();
            if (currentRemaining <= 0) {
                window.clearInterval(_this.countdownIntervalId);
                _this.countdownIntervalId = undefined;
                // Execute the API call without blocking the interval
                _this._callApiExpirePayment({
                    orderId: orderId,
                    nonce: new Date().getTime().toString() + '_expire'
                }).catch(function (e) { return console.error("Expire API call failed", e); });
                _this._clearCache();
                _this._showTerminalMessage(orderId, 'EXPIRED', '<span class="en-text">Time expired.</span><span class="mm-text">သတ်မှတ်ချိန်ကုန်သွားပါပြီ။</span>');
            }
        }, 1000);
    };
    return MMPaySDK;
}());
window.MMPaySDK = MMPaySDK;

exports.MMPaySDK = MMPaySDK;
