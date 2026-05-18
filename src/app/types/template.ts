export type BlockType =
  | 'header'
  | 'invoice-title'
  | 'customer-info'
  | 'invoice-meta'
  | 'items-table'
  | 'totals'
  | 'payment-info'
  | 'signature'
  | 'footer';

export type Alignment = 'left' | 'center' | 'right';
export type HeaderLayout = 'logo-left' | 'logo-center' | 'logo-right';
export type TotalsAlign = 'left' | 'right';

export interface BlockStyle {
  marginTop?: number;
  marginBottom?: number;
  paddingTop?: number;
  paddingBottom?: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'bold';
  textAlign?: Alignment;
  color?: string;
  backgroundColor?: string;
}

export interface HeaderBlock {
  type: 'header';
  id: string;
  visible: boolean;
  layout: HeaderLayout;
  showLogo: boolean;
  showCompanyName: boolean;
  showAddress: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showTaxCode: boolean;
  style: BlockStyle;
}

export interface InvoiceTitleBlock {
  type: 'invoice-title';
  id: string;
  visible: boolean;
  title: string; // "HÓA ĐƠN BÁN HÀNG" or "BÁO GIÁ"
  showInvoiceCode: boolean;
  showBorder: boolean;
  style: BlockStyle;
}

export interface CustomerInfoBlock {
  type: 'customer-info';
  id: string;
  visible: boolean;
  showName: boolean;
  showAddress: boolean;
  showPhone: boolean;
  showTaxCode: boolean;
  style: BlockStyle;
}

export interface InvoiceMetaBlock {
  type: 'invoice-meta';
  id: string;
  visible: boolean;
  showCreatedDate: boolean;
  showDueDate: boolean;
  showSalesperson: boolean;
  layout: 'single-column' | 'two-columns';
  style: BlockStyle;
}

export interface ItemsTableBlock {
  type: 'items-table';
  id: string;
  visible: boolean;
  columns: {
    stt: boolean;
    name: boolean;
    unit: boolean;
    quantity: boolean;
    price: boolean;
    discount: boolean;
    tax: boolean;
    amount: boolean;
  };
  showHeader: boolean;
  showBorders: boolean;
  headerColor?: string;
  headerTextColor?: string;
  style: BlockStyle;
}

export interface TotalsBlock {
  type: 'totals';
  id: string;
  visible: boolean;
  align: TotalsAlign;
  showSubtotal: boolean;
  showDiscount: boolean;
  showTax: boolean;
  showShipping: boolean;
  showGrandTotal: boolean;
  showPaid: boolean;
  showRemaining: boolean;
  showInWords: boolean;
  width?: number; // in pixels, default 300
  style: BlockStyle;
}

export interface PaymentInfoBlock {
  type: 'payment-info';
  id: string;
  visible: boolean;
  showBankInfo: boolean;
  showQRCode: boolean;
  style: BlockStyle;
}

export interface SignatureBlock {
  type: 'signature';
  id: string;
  visible: boolean;
  showSellerSignature: boolean;
  showCustomerSignature: boolean;
  layout: 'single-column' | 'two-columns';
  style: BlockStyle;
}

export interface FooterBlock {
  type: 'footer';
  id: string;
  visible: boolean;
  showThankYou: boolean;
  showTerms: boolean;
  customText?: string;
  style: BlockStyle;
}

export type TemplateBlock =
  | HeaderBlock
  | InvoiceTitleBlock
  | CustomerInfoBlock
  | InvoiceMetaBlock
  | ItemsTableBlock
  | TotalsBlock
  | PaymentInfoBlock
  | SignatureBlock
  | FooterBlock;

export interface TemplateSchema {
  id: string;
  name: string;
  version: string;
  paperSize: 'A4' | 'A5';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  primaryColor: string;
  blocks: TemplateBlock[];
  customHTML?: string; // If user adds custom HTML, store it here
  isCustomHTML?: boolean; // Flag to indicate custom HTML mode
}

export interface TemplateSampleData {
  // Company
  Ten_Cong_Ty: string;
  Dia_Chi_Cong_Ty: string;
  So_Dien_Thoai_Cong_Ty: string;
  Email_Cong_Ty: string;
  Ma_So_Thue_Cong_Ty: string;
  
  // Customer
  Khach_Hang: string;
  So_Dien_Thoai: string;
  Dia_Chi_Khach_Hang: string;
  Ma_So_Thue_Khach: string;
  
  // Invoice
  Ma_Hoa_Don: string;
  Ngay_Tao: string;
  Ngay_Den_Han: string;
  
  // Amounts
  Tong_Tien: string;
  Chiet_Khau: string;
  Thue: string;
  Phi_Van_Chuyen: string;
  Tong_Cong: string;
  Da_Thanh_Toan: string;
  Con_Lai: string;
  Tien_Bang_Chu: string;
  
  // Items
  items: Array<{
    STT: string;
    Ten_Hang: string;
    Don_Vi: string;
    So_Luong: string;
    Don_Gia: string;
    Chiet_Khau: string;
    Thue: string;
    Thanh_Tien: string;
  }>;
}
