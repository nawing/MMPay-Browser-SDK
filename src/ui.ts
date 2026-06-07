import {
  _getContentAfterModal,
  _getContentCancelModal,
  _getContentCoreCss,
  _getContentQRDisplay,
  _getPreloadScreen
} from './templates';
import {IDesignOptions} from './types';

export class MMPayUI {
  private overlayElement: HTMLDivElement | null = null;
  private design: IDesignOptions;
  private readonly QR_SIZE: number = 290;

  constructor(design: IDesignOptions) {
    this.design = design;
  }

  public getOverlay(): HTMLDivElement | null {
    return this.overlayElement;
  }

  public createAndRenderModal(contentHtml: string, bindHandlers: any): HTMLDivElement {
    this.cleanupModal(false);

    const overlay = document.createElement('div');
    overlay.id = 'mmpay-full-modal';
    overlay.className = 'mmpay-lang-en';
    document.body.appendChild(overlay);
    this.overlayElement = overlay;

    const style = document.createElement('style');
    style.innerHTML = _getContentCoreCss(this.design);
    overlay.appendChild(style);

    Object.assign(window, bindHandlers);

    overlay.innerHTML += `<div class="mmpay-overlay-content">${contentHtml}</div>`;
    document.body.style.overflow = 'hidden';

    return overlay;
  }

  public renderPreloadScreen(bindHandlers: any): void {
    this.createAndRenderModal(_getPreloadScreen(this.design), bindHandlers);
  }

  public renderQrModalContent(apiResponse: any, orderId: string, merchantName: string, bindHandlers: any): void {
    const formattedAmount = apiResponse.amount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    const qrContainerId = 'mmpayQrContainerBox';

    const extendedHandlers = {
      ...bindHandlers,
      MMPayDownloadQR: () => this.handleQRDownload(qrContainerId, orderId)
    };

    const qrContentHtml = _getContentQRDisplay(qrContainerId, merchantName, formattedAmount, apiResponse, this.design);
    this.createAndRenderModal(qrContentHtml, extendedHandlers);
    this.injectQrScript(apiResponse.qr, qrContainerId);
  }

  public showTerminalMessage(orderId: string, status: 'SUCCESS' | 'FAILED' | 'EXPIRED', messageHtml: string, bindHandlers: any): void {
    this.cleanupModal(true);
    const isSuccess = status === 'SUCCESS';
    const content = _getContentAfterModal(isSuccess, orderId, messageHtml, this.design);
    this.createAndRenderModal(content, bindHandlers);
  }

  public showCancelConfirmationModal(): void {
    const overlayContent = this.overlayElement?.querySelector('.mmpay-overlay-content');
    if (!overlayContent) return;

    const qrView = overlayContent.querySelector('.mmpay-qr-view') as HTMLElement;
    if (qrView) {
      qrView.style.display = 'none';
    }

    const cancelView = document.getElementById('mmpay-cancel-view-container');
    if (cancelView) {
      cancelView.style.display = 'flex';
      return;
    }

    const content = _getContentCancelModal(this.design);
    overlayContent.insertAdjacentHTML('beforeend', content);
  }

  public reRenderPendingModalInstance(): void {
    const cancelView = document.getElementById('mmpay-cancel-view-container');
    if (cancelView) {
      cancelView.style.display = 'none';
    }
    const overlayContent = this.overlayElement?.querySelector('.mmpay-overlay-content');
    if (overlayContent) {
      const qrView = overlayContent.querySelector('.mmpay-qr-view') as HTMLElement;
      if (qrView) {
        qrView.style.display = 'flex';
      }
    }
  }

  public cleanupModal(restoreBodyScroll: boolean): void {
    if (this.overlayElement && this.overlayElement.parentNode) {
      this.overlayElement.parentNode.removeChild(this.overlayElement);
      this.overlayElement = null;
    }
    if (restoreBodyScroll) {
      document.body.style.overflow = '';
    }
    delete (window as any).MMPayCloseModal;
    delete (window as any).MMPayReRenderModal;
    delete (window as any).MMPayDownloadQR;
    delete (window as any).MMPayToggleLang;
  }

  private handleQRDownload(qrContainerId: string, orderId: string): void {
    const container = document.getElementById(qrContainerId);
    if (!container) return;
    const canvas = container.querySelector('canvas');
    const img = container.querySelector('img');
    try {
      let dataURL = '';
      if (canvas) {
        dataURL = canvas.toDataURL('image/png');
      } else if (img) {
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
    } catch (e) {
    }
  }

  private injectQrScript(qrData: string, qrContainerId: string): void {
    const initQR = () => {
      const container = document.getElementById(qrContainerId);
      if (!container) return;
      if (typeof (window as any).QRCode !== 'undefined' && typeof (window as any).QRCode.toCanvas === 'function') {
        container.innerHTML = '';
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        (window as any).QRCode.toCanvas(canvas, qrData, {
          width: this.QR_SIZE,
          margin: 1,
          color: {dark: "#000000", light: "#ffffff"},
          errorCorrectionLevel: 'M'
        });
      }
    };

    if (typeof (window as any).QRCode !== 'undefined' && typeof (window as any).QRCode.toCanvas === 'function') {
      setTimeout(initQR, 50);
      return;
    }

    if (typeof (window as any).QRCode !== 'undefined') {
      try {
        delete (window as any).QRCode;
      } catch (e) { }
    }

    const cdnUrls = [
      "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js",
      "https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.1/qrcode.min.js"
    ];

    let currentCdnIndex = 0;

    const loadNextCdn = () => {
      if (currentCdnIndex >= cdnUrls.length) return;
      const script = document.createElement('script');
      script.src = cdnUrls[currentCdnIndex];
      script.onload = () => setTimeout(initQR, 50);
      script.onerror = () => {
        currentCdnIndex++;
        loadNextCdn();
      };
      document.head.appendChild(script);
    };

    loadNextCdn();
  }
}
