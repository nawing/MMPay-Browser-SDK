import { IDesignOptions } from './types';
export declare class MMPayUI {
    private overlayElement;
    private design;
    private readonly QR_SIZE;
    constructor(design: IDesignOptions);
    getOverlay(): HTMLDivElement | null;
    createAndRenderModal(contentHtml: string, bindHandlers: any): HTMLDivElement;
    renderPreloadScreen(bindHandlers: any): void;
    renderQrModalContent(apiResponse: any, orderId: string, merchantName: string, bindHandlers: any): void;
    showTerminalMessage(orderId: string, status: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'CANCELLED', messageHtml: string, bindHandlers: any): void;
    showCancelConfirmationModal(): void;
    reRenderPendingModalInstance(): void;
    cleanupModal(restoreBodyScroll: boolean): void;
    private handleQRDownload;
    private injectQrScript;
}
