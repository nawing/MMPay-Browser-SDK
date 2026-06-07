(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MMPaySDK = {}));
})(this, (function (exports) { 'use strict';

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


    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

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

    var MMPayAPI = /** @class */ (function () {
        function MMPayAPI(baseUrl, environment, publishableKey) {
            this.tokenKey = null;
            this.baseUrl = baseUrl;
            this.environment = environment;
            this.publishableKey = publishableKey;
        }
        MMPayAPI.prototype.setToken = function (token) {
            this.tokenKey = token;
        };
        MMPayAPI.prototype.getToken = function () {
            return this.tokenKey;
        };
        MMPayAPI.prototype.call = function (endpoint_1) {
            return __awaiter(this, arguments, void 0, function (endpoint, data) {
                var headers, response, errorText;
                if (data === void 0) { data = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(this.publishableKey)
                            };
                            if (this.tokenKey) {
                                headers['X-MMPay-Btoken'] = this.tokenKey;
                            }
                            return [4 /*yield*/, fetch("".concat(this.baseUrl).concat(endpoint), {
                                    method: 'POST',
                                    headers: headers,
                                    body: JSON.stringify(data)
                                })];
                        case 1:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 3];
                            return [4 /*yield*/, response.text()];
                        case 2:
                            errorText = _a.sent();
                            throw new Error("API Error (".concat(response.status, "): ").concat(response.statusText, ". Details: ").concat(errorText));
                        case 3: return [2 /*return*/, response.json()];
                    }
                });
            });
        };
        MMPayAPI.prototype.createToken = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var endpoint;
                return __generator(this, function (_a) {
                    endpoint = "/xpayments/".concat(this.environment, "-token-request");
                    return [2 /*return*/, this.call(endpoint, payload)];
                });
            });
        };
        MMPayAPI.prototype.createPayment = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var endpoint;
                return __generator(this, function (_a) {
                    endpoint = "/xpayments/".concat(this.environment, "-payment-create");
                    return [2 /*return*/, this.call(endpoint, payload)];
                });
            });
        };
        MMPayAPI.prototype.showPayment = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var endpoint;
                return __generator(this, function (_a) {
                    endpoint = "/xpayments/".concat(this.environment, "-payment-show");
                    return [2 /*return*/, this.call(endpoint, payload)];
                });
            });
        };
        MMPayAPI.prototype.cancelPayment = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var endpoint;
                return __generator(this, function (_a) {
                    endpoint = "/xpayments/".concat(this.environment, "-payment-cancel");
                    return [2 /*return*/, this.call(endpoint, payload)];
                });
            });
        };
        MMPayAPI.prototype.pollPayment = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var endpoint;
                return __generator(this, function (_a) {
                    endpoint = "/xpayments/".concat(this.environment, "-payment-polling");
                    return [2 /*return*/, this.call(endpoint, payload)];
                });
            });
        };
        return MMPayAPI;
    }());

    function _getContentCancelModal(design) {
        return "\n<div id=\"mmpay-cancel-view-container\" class=\"mmpay-card\" style=\"padding: 64px 24px 32px 24px; box-sizing: border-box; width: 100%;\">\n    <div class=\"mmpay-toggle-container\">\n        <button class=\"mmpay-toggle-btn btn-en\" onclick=\"MMPayToggleLang('en')\">EN</button>\n        <button class=\"mmpay-toggle-btn btn-mm\" onclick=\"MMPayToggleLang('mm')\">MM</button>\n    </div>\n    <div style=\"margin: 0 auto 24px auto; width: 64px; height: 64px; border-radius: 50%; background-color: var(--mmp-warn-bg); display: flex; align-items: center; justify-content: center; color: #ff9500;\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2.5\">\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z\"/>\n        </svg>\n    </div>\n    <h2 style=\"font-size: 1.3rem; font-weight: 700; color: var(--mmp-text-main); margin: 0 0 12px 0;\">\n        <span class=\"en-text\">Cancel Transaction?</span>\n        <span class=\"mm-text\">\u101C\u103D\u103E\u1032\u1015\u103C\u1031\u102C\u1004\u103A\u1038\u1019\u103E\u102F\u1000\u102D\u102F \u1015\u101A\u103A\u1016\u103B\u1000\u103A\u1019\u101C\u102C\u1038</span>\n    </h2>\n    <p style=\"color: var(--mmp-text-sub); margin-top: 0; margin-bottom: 32px; font-size: 0.95rem; line-height: 1.5;\">\n        <span class=\"en-text\">If you haven't paid yet, you can safely cancel this process.</span>\n        <span class=\"mm-text\">\u101E\u1004\u103A\u101E\u100A\u103A \u1004\u103D\u1031\u1015\u1031\u1038\u1001\u103B\u1031\u1019\u103E\u102F \u1019\u1015\u103C\u102F\u101C\u102F\u1015\u103A\u101B\u101E\u1031\u1038\u1015\u102B\u1000 \u101C\u102F\u1015\u103A\u1004\u1014\u103A\u1038\u1005\u1009\u103A\u1021\u102C\u1038 \u1016\u103B\u1000\u103A\u101E\u102D\u1019\u103A\u1038\u1014\u102D\u102F\u1004\u103A\u1015\u102B\u101E\u100A\u103A\u104B</span>\n    </p>\n    <div style=\"display: flex; gap: 10px; flex-direction: column;\">\n        <button class=\"mmpay-button mmpay-button-danger\" onclick=\"MMPayCloseModal(true)\">\n            <span class=\"en-text\">Stop Process</span>\n            <span class=\"mm-text\">\u101C\u102F\u1015\u103A\u1004\u1014\u103A\u1038\u1005\u1009\u103A \u101B\u1015\u103A\u1010\u1014\u1037\u103A\u1019\u100A\u103A</span>\n        </button>\n        <button class=\"mmpay-button mmpay-button-secondary\" onclick=\"MMPayReRenderModal()\">\n            <span class=\"en-text\">Go Back</span>\n            <span class=\"mm-text\">\u1021\u1014\u1031\u102C\u1000\u103A\u101E\u102D\u102F\u1037 \u1015\u103C\u1014\u103A\u101E\u103D\u102C\u1038\u1019\u100A\u103A</span>\n        </button>\n    </div>\n</div>";
    }
    function _getContentCoreCss(design) {
        var mode = (design === null || design === void 0 ? void 0 : design.mode) || 'light';
        var isDark = mode.includes('dark');
        var isTranslucent = mode.includes('translucent');
        var cardBg = isDark ? '#1c1c1e' : '#ffffff';
        if (isTranslucent) {
            cardBg = isDark ? 'rgba(28, 28, 30, 0.75)' : 'rgba(255, 255, 255, 0.75)';
        }
        var backdrop = isTranslucent ? 'blur(20px)' : 'none';
        return "\n@import url('https://fonts.googleapis.com/css2?family=Padauk:wght@400;700&display=swap');\n#mmpay-full-modal {\n  --mmp-card-bg: ".concat(cardBg, ";\n  --mmp-card-backdrop: ").concat(backdrop, ";\n  --mmp-text-main: ").concat(isDark ? '#f5f5f7' : '#1d1d1f', ";\n  --mmp-text-sub: ").concat(isDark ? 'rgba(235, 235, 245, 0.6)' : '#86868b', ";\n  --mmp-border: ").concat(isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', ";\n  --mmp-btn-main-bg: ").concat(isDark ? '#ffffff' : '#3a3a3c', ";\n  --mmp-btn-main-text: ").concat(isDark ? '#000000' : '#ffffff', ";\n  --mmp-btn-sec-bg: ").concat(isDark ? '#2c2c2e' : '#ffffff', ";\n  --mmp-btn-sec-text: ").concat(isDark ? '#f5f5f7' : '#1d1d1f', ";\n  --mmp-btn-sec-border: ").concat(isDark ? '#3a3a3c' : '#e5e5ea', ";\n  --mmp-detail-bg: ").concat(isDark ? '#2c2c2e' : '#f9f9fb', ";\n  --mmp-toggle-bg: ").concat(isDark ? '#2c2c2e' : '#f5f5f7', ";\n  --mmp-toggle-btn-active: ").concat(isDark ? '#636366' : '#ffffff', ";\n  --mmp-toggle-btn-text: ").concat(isDark ? '#ffffff' : '#1d1d1f', ";\n  --mmp-progress-track: ").concat(isDark ? '#2c2c2e' : '#f1f5f9', ";\n  --mmp-progress-ind: ").concat(isDark ? 'linear-gradient(90deg, transparent, #ffffff, transparent)' : 'linear-gradient(90deg, transparent, #0f172a, transparent)', ";\n  --mmp-success-bg: ").concat(isDark ? 'rgba(52, 199, 89, 0.2)' : '#e8f8ec', ";\n  --mmp-fail-bg: ").concat(isDark ? 'rgba(255, 59, 48, 0.2)' : '#fce8e6', ";\n  --mmp-warn-bg: ").concat(isDark ? 'rgba(255, 149, 0, 0.2)' : '#fff4e5', ";\n  --mmp-close-btn-hover: ").concat(isDark ? '#3a3a3c' : '#e5e5ea', ";\n\n  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;\n  background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);\n  z-index: 99999; display: flex; align-items: center; justify-content: center;\n  transition: opacity 0.2s ease; box-sizing: border-box; padding: 16px;\n  font-family: -apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, 'Padauk';\n}\n.mmpay-lang-en .mm-text { display: none !important; }\n.mmpay-lang-mm .en-text { display: none !important; }\n.mmpay-toggle-container {\n  position: absolute; top: 16px; left: 16px; display: flex; background: var(--mmp-toggle-bg);\n  border-radius: 10px; padding: 3px; z-index: 10; border: 1px solid var(--mmp-border);\n}\n.mmpay-toggle-btn {\n  font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 0.75rem; font-weight: 600;\n  padding: 5px 10px; border-radius: 8px; cursor: pointer; color: var(--mmp-text-sub); border: none; background: transparent; transition: all 0.2s ease;\n}\n.mmpay-lang-en .btn-en, .mmpay-lang-mm .btn-mm { background: var(--mmp-toggle-btn-active); color: var(--mmp-toggle-btn-text); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }\n.mmpay-overlay-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }\n.mmpay-card {\n  background: var(--mmp-card-bg); backdrop-filter: var(--mmp-card-backdrop); -webkit-backdrop-filter: var(--mmp-card-backdrop);\n  border-radius: 24px; box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px var(--mmp-border);\n  text-align: center; animation: mmpayFadeIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); box-sizing: border-box;\n  position: relative; width: 100%; max-width: 360px; overflow: hidden; display: flex; flex-direction: column;\n}\n@keyframes mmpayFadeIn { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }\n.mmpay-close-btn {\n  position: absolute; top: 16px; right: 16px; background: var(--mmp-toggle-bg); border: none; cursor: pointer; padding: 0;\n  color: var(--mmp-text-sub); border-radius: 50%; transition: all 0.2s ease; z-index: 10; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;\n}\n.mmpay-close-btn:hover { background-color: var(--mmp-close-btn-hover); color: var(--mmp-text-main); }\n.mmpay-button {\n  background: var(--mmp-btn-main-bg); color: var(--mmp-btn-main-text); border: none; padding: 14px 20px; border-radius: 14px;\n  font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 10px; transition: all 0.2s ease; width: 100%; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n.mmpay-button:hover { filter: brightness(1.1); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); }\n.mmpay-button:active { transform: scale(0.98); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }\n.mmpay-button-secondary { background: var(--mmp-btn-sec-bg); color: var(--mmp-btn-sec-text); border: 1px solid var(--mmp-btn-sec-border); box-shadow: none; }\n.mmpay-button-secondary:hover { background: var(--mmp-toggle-bg); box-shadow: none;}\n.mmpay-button-danger { background: var(--mmp-fail-bg); color: #ff3b30; box-shadow: none; }\n.mmpay-button-danger:hover { filter: brightness(0.95); box-shadow: none;}\n");
    }
    function _getContentQRDisplay(qrContainerId, merchantName, formattedAmount, apiResponse, design) {
        var downloadBtnColor = (design === null || design === void 0 ? void 0 : design.color) || '#000000';
        return "\n      <style>\n        .mmpay-qr-view { padding: 64px 20px 24px 20px; box-sizing: border-box; width: 100%; display: flex; flex-direction: column; justify-content: center; }\n        .mmpay-header { color: var(--mmp-text-sub); font-size: 1rem; font-weight: 500; margin-bottom: 6px; }\n        .mmpay-amount-wrapper { margin: 0 auto 16px auto; display: flex; align-items: baseline; justify-content: center; gap: 6px; }\n        .mmpay-amount-value { font-size: 1.85rem; font-weight: 700; color: var(--mmp-text-main); letter-spacing: -0.5px; line-height: 1; }\n        .mmpay-amount-currency { font-size: 0.95rem; font-weight: 600; color: var(--mmp-text-sub); text-transform: uppercase; letter-spacing: 0.5px; }\n        .mmpay-qr-container { width: 220px; height: 220px; padding: 12px; margin: 0 auto; display: flex; justify-content: center; align-items: center; background: #ffffff; border-radius: 16px; border: 1px solid var(--mmp-border); box-shadow: 0 8px 24px rgba(0,0,0,0.04); box-sizing: border-box; overflow: hidden; }\n        #".concat(qrContainerId, " { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n        #").concat(qrContainerId, " canvas, #").concat(qrContainerId, " img { max-width: 100%; max-height: 100%; object-fit: contain; }\n        .mmpay-powered-text { font-size: 0.75rem; color: var(--mmp-text-sub); font-weight: 500; margin: 12px auto 8px auto;}\n        .mmpay-detail-box { background: var(--mmp-detail-bg); border-radius: 14px; padding: 14px 16px; margin-bottom: 20px; border: 1px solid var(--mmp-border); }\n        .mmpay-detail { font-size: 0.85rem; color: var(--mmp-text-sub); margin: 6px 0; display: flex; justify-content: space-between; align-items: center; }\n        .mmpay-detail strong { color: var(--mmp-text-main); font-weight: 600; text-align: right; }\n        .mmpay-detail span { text-align: left; }\n        .mmpay-timer-badge { color: #d93025; background: var(--mmp-fail-bg); padding: 5px 12px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 6px; margin: 0 auto 16px auto; }\n        .mmpay-timer-icon { width: 14px; height: 14px; fill: currentColor; }\n      </style>\n      <div class=\"mmpay-card mmpay-qr-view\">\n          <div class=\"mmpay-toggle-container\">\n              <button class=\"mmpay-toggle-btn btn-en\" onclick=\"MMPayToggleLang('en')\">EN</button>\n              <button class=\"mmpay-toggle-btn btn-mm\" onclick=\"MMPayToggleLang('mm')\">MM</button>\n          </div>\n          <button class=\"mmpay-close-btn\" onclick=\"MMPayCloseModal(false)\">\n              <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2.5\">\n                  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M6 18L18 6M6 6l12 12\"/>\n              </svg>\n          </button>\n          <div style=\"margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center;\">\n            <img src=\"https://motephoe.com/images/mmqr.webp\" alt=\"MyanMyanPay Logo\" style=\"height: 40px; width: auto; object-fit: contain;\">\n          </div>\n          <div class=\"mmpay-header\">").concat(merchantName, "</div>\n          <div class=\"mmpay-amount-wrapper\">\n              <span class=\"mmpay-amount-value\">").concat(formattedAmount, "</span>\n              <span class=\"mmpay-amount-currency\">MMK</span>\n          </div>\n          <div class=\"mmpay-qr-container\">\n              <div id=\"").concat(qrContainerId, "\"></div>\n          </div>\n          <div class=\"mmpay-powered-text\">\n              <span class=\"en-text\">Payment powered by MyanMyanPay</span>\n              <span class=\"mm-text\">MyanMyanPay \u1016\u103C\u1004\u1037\u103A \u1004\u103D\u1031\u1015\u1031\u1038\u1001\u103B\u1031\u1019\u103E\u102F\u1000\u102D\u102F \u1011\u1031\u102C\u1000\u103A\u1015\u1036\u1037\u1011\u102C\u1038\u101E\u100A\u103A</span>\n          </div>\n          <div class=\"mmpay-timer-badge\" id=\"mmpay-timer-badge\">\n             <svg class=\"mmpay-timer-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">\n               <path d=\"M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z\"/>\n               <path d=\"M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z\"/>\n             </svg>\n             <span id=\"mmpay-countdown-text\">05:00</span>\n          </div>\n          <div class=\"mmpay-detail-box\">\n              <div class=\"mmpay-detail\">\n                  <span><span class=\"en-text\">Order ID</span><span class=\"mm-text\">\u1019\u103E\u102C\u101A\u1030\u1019\u103E\u102F\u1014\u1036\u1015\u102B\u1010\u103A</span></span>\n                  <strong>").concat(apiResponse.orderId, "</strong>\n              </div>\n              <div class=\"mmpay-detail\" style=\"margin-top: 8px;\">\n                  <span><span class=\"en-text\">Transaction Ref</span><span class=\"mm-text\">\u1004\u103D\u1031\u1015\u1031\u1038\u1004\u103D\u1031\u101A\u1030\u1014\u1036\u1015\u102B\u1010\u103A</span></span>\n                  <strong>").concat(apiResponse.transactionRefId, "</strong>\n              </div>\n          </div>\n          <button class=\"mmpay-button\" style=\"background-color: ").concat(downloadBtnColor, " !important; color: #ffffff !important;\" onclick=\"MMPayDownloadQR()\">\n              <span class=\"en-text\">Download QR Code</span>\n              <span class=\"mm-text\">QR \u1000\u102F\u1012\u103A\u1000\u102D\u102F \u101E\u102D\u1019\u103A\u1038\u1006\u100A\u103A\u1038\u1019\u100A\u103A</span>\n          </button>\n      </div>\n    ");
    }
    function _getContentAfterModal(isSuccess, orderId, messageHtml, design) {
        var iconColor = isSuccess ? '#34c759' : '#ff3b30';
        var iconBgVar = isSuccess ? 'var(--mmp-success-bg)' : 'var(--mmp-fail-bg)';
        var isExpired = messageHtml.toLowerCase().includes('expire') || messageHtml.includes('သတ်မှတ်ချိန်ကုန်');
        var iconSvg;
        var statusTextEn;
        var statusTextMm;
        if (isSuccess) {
            statusTextEn = 'Success';
            statusTextMm = 'အောင်မြင်ပါသည်';
            iconSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"36\" height=\"36\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"".concat(iconColor, "\" stroke-width=\"3\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M5 13l4 4L19 7\" /></svg>");
        }
        else {
            statusTextEn = isExpired ? 'Expired' : 'Failed';
            statusTextMm = isExpired ? 'အချိန်ကျော်လွန်သွားပါပြီ' : 'မအောင်မြင်ပါ';
            iconSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"36\" height=\"36\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"".concat(iconColor, "\" stroke-width=\"3\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M6 18L18 6M6 6l12 12\" /></svg>");
        }
        return "\n<div class=\"mmpay-card\" style=\"padding: 64px 24px 32px 24px; box-sizing: border-box; width: 100%;\">\n    <div class=\"mmpay-toggle-container\">\n        <button class=\"mmpay-toggle-btn btn-en\" onclick=\"MMPayToggleLang('en')\">EN</button>\n        <button class=\"mmpay-toggle-btn btn-mm\" onclick=\"MMPayToggleLang('mm')\">MM</button>\n    </div>\n    <div style=\"margin: 0 auto 24px auto; width: 72px; height: 72px; border-radius: 50%; background: ".concat(iconBgVar, "; display: flex; align-items: center; justify-content: center;\">\n        ").concat(iconSvg, "\n    </div>\n    <h2 style=\"font-size: 1.4rem; font-weight: 700; color: var(--mmp-text-main); margin: 0 0 10px 0;\">\n        <span class=\"en-text\">").concat(statusTextEn, "</span>\n        <span class=\"mm-text\">").concat(statusTextMm, "</span>\n    </h2>\n    <div style=\"background: var(--mmp-detail-bg); padding: 8px 14px; border-radius: 10px; border: 1px solid var(--mmp-border); display: inline-block; margin-bottom: 24px;\">\n        <p style=\"color: var(--mmp-text-sub); font-size: 0.85rem; margin: 0; font-weight: 600;\">ID: ").concat(orderId, "</p>\n    </div>\n    <p style=\"color: var(--mmp-text-sub); margin-top: 0; margin-bottom: 32px; font-size: 0.95rem; line-height: 1.5;\">\n        ").concat(messageHtml, "\n    </p>\n    <button class=\"mmpay-button\" onclick=\"MMPayCloseModal(true)\">\n        <span class=\"en-text\">Close</span>\n        <span class=\"mm-text\">\u1015\u102D\u1010\u103A\u1019\u100A\u103A</span>\n    </button>\n</div>");
    }
    function _getPreloadScreen(design) {
        return "\n      <style>\n        @keyframes mmpayGodSweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }\n        @keyframes mmpayPulseSoft { 0%, 100% { opacity: 0.9; transform: scale(1); } 50% { opacity: 1; transform: scale(1.04); filter: drop-shadow(0 8px 16px rgba(0,0,0,0.06)); } }\n        .mmpay-preload-wrapper { padding: 56px 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 290px; }\n        .mmpay-brand-core { position: relative; margin-bottom: 40px; display: flex; align-items: center; justify-content: center; }\n        .mmpay-loader-img { width: 65px; height: auto; position: relative; z-index: 2; animation: mmpayPulseSoft 2.5s ease-in-out infinite; }\n        .mmpay-progress-track { width: 160px; height: 2px; background: var(--mmp-progress-track); border-radius: 2px; overflow: hidden; position: relative; margin-bottom: 24px; }\n        .mmpay-progress-indicator { position: absolute; top: 0; left: 0; bottom: 0; width: 40%; background: var(--mmp-progress-ind); animation: mmpayGodSweep 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }\n        .mmpay-preload-text { font-size: 0.85rem; font-weight: 700; color: var(--mmp-text-main); letter-spacing: 1px; text-transform: uppercase; }\n        .mmpay-preload-subtext { font-size: 0.8rem; color: var(--mmp-text-sub); margin-top: 6px; font-weight: 500; }\n      </style>\n      <div class=\"mmpay-card mmpay-preload-wrapper\">\n          <div class=\"mmpay-brand-core\">\n              <img src=\"https://myanmyanpay.com/_next/image?url=%2Fmmp-logo.png&w=1920&q=75\" alt=\"MMPay\" class=\"mmpay-loader-img\" />\n          </div>\n          <div class=\"mmpay-progress-track\">\n              <div class=\"mmpay-progress-indicator\"></div>\n          </div>\n          <div class=\"mmpay-preload-text\">\n              <span class=\"en-text\">Securing Transaction</span>\n              <span class=\"mm-text\">\u101C\u102F\u1036\u1001\u103C\u102F\u1036\u101E\u1031\u102C \u1001\u103B\u102D\u1010\u103A\u1006\u1000\u103A\u1019\u103E\u102F</span>\n          </div>\n          <div class=\"mmpay-preload-subtext\">\n              <span class=\"en-text\">Establishing end-to-end encryption...</span>\n              <span class=\"mm-text\">\u101C\u102F\u1036\u1001\u103C\u102F\u1036\u101B\u1031\u1038\u1005\u1014\u1005\u103A\u1019\u103B\u102C\u1038\u1000\u102D\u102F \u1001\u103B\u102D\u1010\u103A\u1006\u1000\u103A\u1014\u1031\u101E\u100A\u103A...</span>\n          </div>\n      </div>";
    }

    var MMPayUI = /** @class */ (function () {
        function MMPayUI(design) {
            this.overlayElement = null;
            this.QR_SIZE = 290;
            this.design = design;
        }
        MMPayUI.prototype.getOverlay = function () {
            return this.overlayElement;
        };
        MMPayUI.prototype.createAndRenderModal = function (contentHtml, bindHandlers) {
            this.cleanupModal(false);
            var overlay = document.createElement('div');
            overlay.id = 'mmpay-full-modal';
            overlay.className = 'mmpay-lang-en';
            document.body.appendChild(overlay);
            this.overlayElement = overlay;
            var style = document.createElement('style');
            style.innerHTML = _getContentCoreCss(this.design);
            overlay.appendChild(style);
            Object.assign(window, bindHandlers);
            overlay.innerHTML += "<div class=\"mmpay-overlay-content\">".concat(contentHtml, "</div>");
            document.body.style.overflow = 'hidden';
            return overlay;
        };
        MMPayUI.prototype.renderPreloadScreen = function (bindHandlers) {
            this.createAndRenderModal(_getPreloadScreen(this.design), bindHandlers);
        };
        MMPayUI.prototype.renderQrModalContent = function (apiResponse, orderId, merchantName, bindHandlers) {
            var _this = this;
            var formattedAmount = apiResponse.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            var qrContainerId = 'mmpayQrContainerBox';
            var extendedHandlers = __assign(__assign({}, bindHandlers), { MMPayDownloadQR: function () { return _this.handleQRDownload(qrContainerId, orderId); } });
            var qrContentHtml = _getContentQRDisplay(qrContainerId, merchantName, formattedAmount, apiResponse, this.design);
            this.createAndRenderModal(qrContentHtml, extendedHandlers);
            this.injectQrScript(apiResponse.qr, qrContainerId);
        };
        MMPayUI.prototype.showTerminalMessage = function (orderId, status, messageHtml, bindHandlers) {
            this.cleanupModal(true);
            var isSuccess = status === 'SUCCESS';
            var content = _getContentAfterModal(isSuccess, orderId, messageHtml, this.design);
            this.createAndRenderModal(content, bindHandlers);
        };
        MMPayUI.prototype.showCancelConfirmationModal = function () {
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
            var content = _getContentCancelModal(this.design);
            overlayContent.insertAdjacentHTML('beforeend', content);
        };
        MMPayUI.prototype.reRenderPendingModalInstance = function () {
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
        MMPayUI.prototype.cleanupModal = function (restoreBodyScroll) {
            if (this.overlayElement && this.overlayElement.parentNode) {
                this.overlayElement.parentNode.removeChild(this.overlayElement);
                this.overlayElement = null;
            }
            if (restoreBodyScroll) {
                document.body.style.overflow = '';
            }
            delete window.MMPayCloseModal;
            delete window.MMPayReRenderModal;
            delete window.MMPayDownloadQR;
            delete window.MMPayToggleLang;
        };
        MMPayUI.prototype.handleQRDownload = function (qrContainerId, orderId) {
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
            }
        };
        MMPayUI.prototype.injectQrScript = function (qrData, qrContainerId) {
            var _this = this;
            var initQR = function () {
                var container = document.getElementById(qrContainerId);
                if (!container)
                    return;
                if (typeof window.QRCode !== 'undefined' && typeof window.QRCode.toCanvas === 'function') {
                    container.innerHTML = '';
                    var canvas = document.createElement('canvas');
                    container.appendChild(canvas);
                    window.QRCode.toCanvas(canvas, qrData, {
                        width: _this.QR_SIZE,
                        margin: 1,
                        color: { dark: "#000000", light: "#ffffff" },
                        errorCorrectionLevel: 'M'
                    });
                }
            };
            if (typeof window.QRCode !== 'undefined' && typeof window.QRCode.toCanvas === 'function') {
                setTimeout(initQR, 50);
                return;
            }
            if (typeof window.QRCode !== 'undefined') {
                try {
                    delete window.QRCode;
                }
                catch (e) { }
            }
            var cdnUrls = [
                "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js",
                "https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.1/qrcode.min.js"
            ];
            var currentCdnIndex = 0;
            var loadNextCdn = function () {
                if (currentCdnIndex >= cdnUrls.length)
                    return;
                var script = document.createElement('script');
                script.src = cdnUrls[currentCdnIndex];
                script.onload = function () { return setTimeout(initQR, 50); };
                script.onerror = function () {
                    currentCdnIndex++;
                    loadNextCdn();
                };
                document.head.appendChild(script);
            };
            loadNextCdn();
        };
        return MMPayUI;
    }());

    var MMPaySDK = /** @class */ (function () {
        function MMPaySDK(publishableKey, options) {
            if (options === void 0) { options = {}; }
            var _a, _b;
            this.TIMEOUT_SECONDS = 300;
            this.CACHE_KEY = 'mmpay_pending_tx';
            this.onCompleteCallback = null;
            this.pollIntervalId = undefined;
            this.countdownIntervalId = undefined;
            this.pendingApiResponse = null;
            this.pendingPaymentPayload = null;
            if (!publishableKey) {
                throw new Error("A Publishable Key is required to initialize [MMPaySDK].");
            }
            if (publishableKey.includes('pk_test')) {
                this.environment = 'sandbox';
            }
            else if (publishableKey.includes('pk_live')) {
                this.environment = 'production';
            }
            else {
                this.environment = options.environment || 'production';
            }
            var baseUrl = options.baseUrl || 'https://api.mm-pay.com';
            this.merchantName = options.merchantName || 'Your Merchant';
            this.POLL_INTERVAL_MS = options.pollInterval || 5000;
            this.api = new MMPayAPI(baseUrl, this.environment, publishableKey);
            this.ui = new MMPayUI({
                mode: ((_a = options.design) === null || _a === void 0 ? void 0 : _a.mode) || 'light',
                color: ((_b = options.design) === null || _b === void 0 ? void 0 : _b.color) || '#000000'
            });
            if (typeof window !== 'undefined') {
                this._checkAndAutoResume();
            }
        }
        MMPaySDK.prototype._getGlobalHandlers = function (isTerminal) {
            var _this = this;
            if (isTerminal === void 0) { isTerminal = false; }
            return {
                MMPayToggleLang: function (lang) {
                    var modal = document.getElementById('mmpay-full-modal');
                    if (modal)
                        modal.className = 'mmpay-lang-' + lang;
                },
                MMPayReRenderModal: function () { return _this.ui.reRenderPendingModalInstance(); },
                MMPayCloseModal: function () {
                    var args_1 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args_1[_i] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (forceClose) {
                        if (forceClose === void 0) { forceClose = false; }
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(isTerminal || forceClose)) return [3 /*break*/, 6];
                                    if (!(forceClose && !isTerminal && this.pendingPaymentPayload)) return [3 /*break*/, 5];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, this.api.cancelPayment({
                                            orderId: this.pendingPaymentPayload.orderId,
                                            nonce: new Date().getTime().toString() + '_cancel'
                                        })];
                                case 2:
                                    _a.sent();
                                    this._triggerEvent({
                                        cancelled: true,
                                        orderId: this.pendingPaymentPayload.orderId
                                    });
                                    return [3 /*break*/, 4];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 4:
                                    this._clearCache();
                                    _a.label = 5;
                                case 5:
                                    if (isTerminal) {
                                        this._clearCache();
                                    }
                                    this._cleanup();
                                    return [3 /*break*/, 7];
                                case 6:
                                    this.ui.showCancelConfirmationModal();
                                    _a.label = 7;
                                case 7: return [2 /*return*/];
                            }
                        });
                    });
                }
            };
        };
        MMPaySDK.prototype._triggerEvent = function (eventData) {
            if (this.onCompleteCallback) {
                try {
                    this.onCompleteCallback(eventData);
                }
                catch (e) { }
            }
        };
        MMPaySDK.prototype._cleanup = function () {
            if (this.pollIntervalId !== undefined) {
                window.clearInterval(this.pollIntervalId);
                this.pollIntervalId = undefined;
            }
            if (this.countdownIntervalId !== undefined) {
                window.clearInterval(this.countdownIntervalId);
                this.countdownIntervalId = undefined;
            }
            this.ui.cleanupModal(true);
        };
        MMPaySDK.prototype._clearCache = function () {
            localStorage.removeItem(this.CACHE_KEY);
        };
        MMPaySDK.prototype._checkAndAutoResume = function () {
            var cachedData = localStorage.getItem(this.CACHE_KEY);
            if (!cachedData)
                return;
            try {
                var parsed = JSON.parse(cachedData);
                if (parsed.environment !== this.environment || Date.now() >= parsed.expireAt) {
                    this._clearCache();
                    return;
                }
                this.api.setToken(parsed.token);
                this._resumePaymentState(parsed.apiResponse, parsed.payload, parsed.expireAt);
            }
            catch (e) {
                this._clearCache();
            }
        };
        MMPaySDK.prototype._resumePaymentState = function (apiResponse, payload, expireAt) {
            this.pendingPaymentPayload = payload;
            this.pendingApiResponse = apiResponse;
            this.ui.renderQrModalContent(apiResponse, payload.orderId, this.merchantName, this._getGlobalHandlers());
            this._startPolling(payload);
            this._startCountdown(payload.orderId, expireAt);
            this._triggerEvent({
                created: true,
                orderId: payload.orderId,
                transactionId: apiResponse.transactionRefId,
                transactionRefId: apiResponse.transactionRefId
            });
        };
        MMPaySDK.prototype.createPayment = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var nonce, tokenResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            nonce = new Date().getTime().toString() + '_mmp';
                            return [4 /*yield*/, this.api.createToken({ amount: params.amount, orderId: params.orderId, nonce: nonce })];
                        case 1:
                            tokenResponse = _a.sent();
                            this.api.setToken(tokenResponse.token);
                            return [2 /*return*/, this.api.createPayment(__assign(__assign({}, params), { nonce: nonce }))];
                    }
                });
            });
        };
        MMPaySDK.prototype.showPaymentModal = function (params, onComplete) {
            return __awaiter(this, void 0, void 0, function () {
                var cachedData, parsed, expireAt, startTime, nonce, tokenResponse, paymentPayload, apiResponse, elapsed_1, error_1, errMessage, terminalMsg;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.onCompleteCallback = onComplete;
                            cachedData = localStorage.getItem(this.CACHE_KEY);
                            if (cachedData) {
                                try {
                                    parsed = JSON.parse(cachedData);
                                    if (parsed.environment === this.environment && Date.now() < parsed.expireAt) {
                                        this.api.setToken(parsed.token);
                                        this._resumePaymentState(parsed.apiResponse, parsed.payload, parsed.expireAt);
                                        return [2 /*return*/];
                                    }
                                    else {
                                        this._clearCache();
                                    }
                                }
                                catch (e) {
                                    this._clearCache();
                                }
                            }
                            this.ui.renderPreloadScreen(this._getGlobalHandlers());
                            expireAt = Date.now() + (this.TIMEOUT_SECONDS * 1000);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            startTime = Date.now();
                            nonce = new Date().getTime().toString() + '_mmp';
                            return [4 /*yield*/, this.api.createToken({ amount: params.amount, orderId: params.orderId, nonce: nonce })];
                        case 2:
                            tokenResponse = _a.sent();
                            this.api.setToken(tokenResponse.token);
                            paymentPayload = __assign(__assign({}, params), { nonce: nonce });
                            return [4 /*yield*/, this.api.createPayment(paymentPayload)];
                        case 3:
                            apiResponse = _a.sent();
                            elapsed_1 = Date.now() - startTime;
                            if (!(elapsed_1 < 1500)) return [3 /*break*/, 5];
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500 - elapsed_1); })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            if (apiResponse && apiResponse.qr && apiResponse.transactionRefId) {
                                localStorage.setItem(this.CACHE_KEY, JSON.stringify({
                                    payload: paymentPayload,
                                    apiResponse: apiResponse,
                                    expireAt: expireAt,
                                    token: this.api.getToken(),
                                    environment: this.environment
                                }));
                                this._resumePaymentState(apiResponse, paymentPayload, expireAt);
                            }
                            else {
                                throw new Error("Invalid API Response: Missing QR Data or Reference ID.");
                            }
                            return [3 /*break*/, 7];
                        case 6:
                            error_1 = _a.sent();
                            this.api.setToken(null);
                            errMessage = (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Error occurred while starting payment.';
                            terminalMsg = "<span class=\"en-text\">".concat(errMessage, "</span><span class=\"mm-text\">\u1004\u103D\u1031\u1015\u1031\u1038\u1001\u103B\u1031\u1019\u103E\u102F \u1005\u1010\u1004\u103A\u1005\u1009\u103A \u1021\u1019\u103E\u102C\u1038\u1021\u101A\u103D\u1004\u103A\u1038 \u1016\u103C\u1005\u103A\u1015\u103D\u102C\u1038\u101E\u100A\u103A\u104B</span>");
                            this.ui.showTerminalMessage(params.orderId || 'N/A', 'FAILED', terminalMsg, this._getGlobalHandlers(true));
                            this._triggerEvent({ failed: true, orderId: params.orderId });
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        MMPaySDK.prototype.pay = function (orderId, onComplete) {
            return __awaiter(this, void 0, void 0, function () {
                var cachedData, parsed, showPayload, expireAt, startTime, apiResponse, elapsed_2, mappedPaymentResponse, mappedPaymentPayload, error_2, errMessage, terminalMsg;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.onCompleteCallback = onComplete;
                            cachedData = localStorage.getItem(this.CACHE_KEY);
                            if (cachedData) {
                                try {
                                    parsed = JSON.parse(cachedData);
                                    if (parsed.environment === this.environment && Date.now() < parsed.expireAt && parsed.payload.orderId === orderId) {
                                        this.api.setToken(parsed.token);
                                        this._resumePaymentState(parsed.apiResponse, parsed.payload, parsed.expireAt);
                                        return [2 /*return*/];
                                    }
                                    else {
                                        this._clearCache();
                                    }
                                }
                                catch (e) {
                                    this._clearCache();
                                }
                            }
                            this.ui.renderPreloadScreen(this._getGlobalHandlers());
                            showPayload = { orderId: orderId, nonce: new Date().getTime().toString() + '_show' };
                            expireAt = Date.now() + (this.TIMEOUT_SECONDS * 1000);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            startTime = Date.now();
                            return [4 /*yield*/, this.api.showPayment(showPayload)];
                        case 2:
                            apiResponse = _a.sent();
                            elapsed_2 = Date.now() - startTime;
                            if (!(elapsed_2 < 1500)) return [3 /*break*/, 4];
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500 - elapsed_2); })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            if (apiResponse && apiResponse.qr && apiResponse.transactionRefId) {
                                mappedPaymentResponse = {
                                    amount: apiResponse.amount,
                                    orderId: apiResponse.orderId,
                                    transactionRefId: apiResponse.transactionRefId,
                                    qr: apiResponse.qr
                                };
                                mappedPaymentPayload = { amount: apiResponse.amount, orderId: apiResponse.orderId, nonce: showPayload.nonce };
                                localStorage.setItem(this.CACHE_KEY, JSON.stringify({
                                    payload: mappedPaymentPayload,
                                    apiResponse: mappedPaymentResponse,
                                    expireAt: expireAt,
                                    token: this.api.getToken(),
                                    environment: this.environment
                                }));
                                this._resumePaymentState(mappedPaymentResponse, mappedPaymentPayload, expireAt);
                            }
                            else {
                                throw new Error("Invalid API Response: Missing QR Data or Reference ID.");
                            }
                            return [3 /*break*/, 6];
                        case 5:
                            error_2 = _a.sent();
                            this.api.setToken(null);
                            errMessage = (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || 'Error occurred while loading payment.';
                            terminalMsg = "<span class=\"en-text\">".concat(errMessage, "</span><span class=\"mm-text\">\u1004\u103D\u1031\u1015\u1031\u1038\u1001\u103B\u1031\u1019\u103E\u102F \u1005\u1010\u1004\u103A\u1005\u1009\u103A \u1021\u1019\u103E\u102C\u1038\u1021\u101A\u103D\u1004\u103A\u1038 \u1016\u103C\u1005\u103A\u1015\u103D\u102C\u1038\u101E\u100A\u103A\u104B</span>");
                            this.ui.showTerminalMessage(orderId || 'N/A', 'FAILED', terminalMsg, this._getGlobalHandlers(true));
                            this._triggerEvent({ failed: true, orderId: orderId });
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        MMPaySDK.prototype._startPolling = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var checkStatus;
                var _this = this;
                return __generator(this, function (_a) {
                    if (this.pollIntervalId !== undefined) {
                        window.clearInterval(this.pollIntervalId);
                    }
                    checkStatus = function () { return __awaiter(_this, void 0, void 0, function () {
                        var response, status_1, success, messageHtml;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.api.pollPayment(payload)];
                                case 1:
                                    response = _a.sent();
                                    status_1 = (response.status || '').toUpperCase();
                                    if (status_1 === 'SUCCESS' || status_1 === 'FAILED' || status_1 === 'EXPIRED') {
                                        this._cleanup();
                                        this._clearCache();
                                        success = status_1 === 'SUCCESS';
                                        messageHtml = success ?
                                            "<span class=\"en-text\">Payment successful.<br>Ref: ".concat(response.transactionRefId || 'N/A', "</span>\n             <span class=\"mm-text\">\u1004\u103D\u1031\u1015\u1031\u1038\u1001\u103B\u1031\u1019\u103E\u102F \u1021\u1031\u102C\u1004\u103A\u1019\u103C\u1004\u103A\u1015\u102B\u1015\u103C\u102E\u104B<br>\u101B\u100A\u103A\u100A\u103D\u103E\u1014\u103A\u1038\u1014\u1036\u1015\u102B\u1010\u103A: ").concat(response.transactionRefId || 'N/A', "</span>") :
                                            "<span class=\"en-text\">Payment ".concat(status_1 === 'FAILED' ? 'failed' : 'expired', ".</span>\n             <span class=\"mm-text\">\u1004\u103D\u1031\u1015\u1031\u1038\u1001\u103B\u1031\u1019\u103E\u102F ").concat(status_1 === 'FAILED' ? 'မအောင်မြင်ပါ' : 'သက်တမ်းကုန်သွားပါပြီ', "\u104B</span>");
                                        this.ui.showTerminalMessage(response.orderId || 'N/A', status_1, messageHtml, this._getGlobalHandlers(true));
                                        this.api.setToken(null);
                                        this._triggerEvent({
                                            success: status_1 === 'SUCCESS',
                                            failed: status_1 === 'FAILED',
                                            expired: status_1 === 'EXPIRED',
                                            orderId: response.orderId,
                                            transactionId: response.transactionRefId,
                                            transactionRefId: response.transactionRefId
                                        });
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    _a.sent();
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
            this.countdownIntervalId = window.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    currentRemaining = updateDisplay();
                    if (currentRemaining <= 0) {
                        this._cleanup();
                        this._clearCache();
                        this.ui.showTerminalMessage(orderId, 'EXPIRED', '<span class="en-text">Time expired.</span><span class="mm-text">သတ်မှတ်ချိန်ကုန်သွားပါပြီ။</span>', this._getGlobalHandlers(true));
                        this._triggerEvent({ expired: true, orderId: orderId });
                    }
                    return [2 /*return*/];
                });
            }); }, 1000);
        };
        return MMPaySDK;
    }());
    if (typeof window !== 'undefined') {
        window.MMPaySDK = MMPaySDK;
    }

    exports.MMPaySDK = MMPaySDK;

}));
