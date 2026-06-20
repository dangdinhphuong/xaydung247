import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useBlocker, useNavigate } from 'react-router';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Editor from '@monaco-editor/react';
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Loader2,
  Code2,
  Printer,
  Settings2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Layout,
  Eye,
  EyeOff,
  Trash2,
  Move,
  Plus,
  X,
  FileText,
  User,
  Calendar,
  Table,
  DollarSign,
  CreditCard,
  PenTool,
  MessageSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignJustify,
  List,
  ListOrdered,
  Type,
  Palette,
  Image as ImageIcon,
  Grid,
  QrCode,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import { useSettings, useUpdateSettings } from '../hooks/queries';
import { useAuth } from '../auth/AuthContext';
import { LoadingState, ErrorState } from '../components/QueryStates';
import { getErrorMessage } from '../lib/errors';
import {
  DEFAULT_INVOICE_TEMPLATE_A5,
  DEFAULT_INVOICE_TEMPLATE_A5_COMPACT,
  DEFAULT_INVOICE_TEMPLATE_A4,
  DEFAULT_INVOICE_TEMPLATE_K80,
  SAMPLE_INVOICE,
  TEMPLATE_PLACEHOLDER_GROUPS,
} from '../lib/invoiceTemplate';
import { buildInvoiceHtml, printInvoiceFromTemplate } from '../lib/printInvoice';
import type { TemplateSchema, TemplateBlock, BlockType } from '../types/template';
import { defaultTemplateSchema, sampleData } from '../utils/defaultTemplate';
import { schemaToHTML, extractSchemaFromHTML } from '../utils/templateConverter';

// KiotViet tokens grouped for WYSIWYG dropdown
const kiotVietTokenGroups = [
  {
    group: 'Cửa hàng',
    tokens: [
      { key: 'Logo_Cua_Hang', label: 'Logo cửa hàng' },
      { key: 'Ten_Cua_Hang', label: 'Tên cửa hàng' },
      { key: 'Dia_Chi_Chi_Nhanh', label: 'Địa chỉ cửa hàng' },
      { key: 'Dien_Thoai_Chi_Nhanh', label: 'Số điện thoại cửa hàng' },
    ],
  },
  {
    group: 'Hóa đơn',
    tokens: [
      { key: 'Tieu_De_In', label: 'Tiêu đề in (ví dụ: HÓA ĐƠN BÁN HÀNG)' },
      { key: 'Ma_Don_Hang', label: 'Mã số hóa đơn' },
      { key: 'Ngay', label: 'Ngày tạo' },
      { key: 'Thang', label: 'Tháng tạo' },
      { key: 'Nam', label: 'Năm tạo' },
    ],
  },
  {
    group: 'Khách hàng',
    tokens: [
      { key: 'Khach_Hang', label: 'Tên khách hàng' },
      { key: 'So_Dien_Thoai', label: 'Số điện thoại khách' },
      { key: 'Dia_Chi_Khach_Hang', label: 'Địa chỉ khách hàng' },
    ],
  },
  {
    group: 'Hàng hóa (Dùng trong bảng)',
    tokens: [
      { key: 'Ten_Hang_Hoa', label: 'Tên hàng hóa' },
      { key: 'Don_Gia_Chiet_Khau', label: 'Đơn giá sau chiết khấu' },
      { key: 'So_Luong', label: 'Số lượng' },
      { key: 'Thanh_Tien', label: 'Thành tiền hàng' },
    ],
  },
  {
    group: 'Thanh toán',
    tokens: [
      { key: 'Tong_Tien_Hang', label: 'Tổng tiền hàng' },
      { key: 'Chiet_Khau_Hoa_Don_Phan_Tram', label: 'Chiết khấu HĐ (%)' },
      { key: 'Chiet_Khau_Hoa_Don', label: 'Tổng tiền chiết khấu HĐ' },
      { key: 'Tong_Cong', label: 'Tổng tiền phải thanh toán' },
      { key: 'Tong_Cong_Bang_Chu', label: 'Tiền bằng chữ' },
    ],
  },
  {
    group: 'Thanh toán khác',
    tokens: [
      { key: 'Ma_QR', label: 'QR Code chuyển khoản' },
    ],
  },
];

const blockCategories = [
  {
    label: 'Đầu trang',
    blocks: [
      { type: 'header' as BlockType, icon: FileText, title: 'Thông tin cửa hàng', description: 'Logo, tên công ty, MST...' },
      { type: 'invoice-title' as BlockType, icon: FileText, title: 'Tiêu đề hóa đơn', description: 'HÓA ĐƠN BÁN HÀNG' },
    ],
  },
  {
    label: 'Khách hàng',
    blocks: [
      { type: 'customer-info' as BlockType, icon: User, title: 'Thông tin khách hàng', description: 'Tên khách, SĐT, ĐC...' },
      { type: 'invoice-meta' as BlockType, icon: Calendar, title: 'Thông tin hóa đơn', description: 'Mã HĐ, ngày lập, ngày hẹn...' },
    ],
  },
  {
    label: 'Nội dung',
    blocks: [
      { type: 'items-table' as BlockType, icon: Table, title: 'Bảng hàng hóa', description: 'Danh sách sản phẩm mua hàng' },
      { type: 'totals' as BlockType, icon: DollarSign, title: 'Tổng thanh toán', description: 'Tổng cộng, chiết khấu, VAT...' },
    ],
  },
  {
    label: 'Chân trang',
    blocks: [
      { type: 'payment-info' as BlockType, icon: CreditCard, title: 'Thông tin thanh toán', description: 'Số TK, QR chuyển tiền' },
      { type: 'signature' as BlockType, icon: PenTool, title: 'Chữ ký hóa đơn', description: 'Chữ ký người mua & bán' },
      { type: 'footer' as BlockType, icon: MessageSquare, title: 'Lời cảm ơn / ghi chú', description: 'Lời chào, điều khoản...' },
    ],
  },
];

// Helper tạo block mới mặc định
function createDefaultBlock(type: BlockType): TemplateBlock {
  const id = `${type}-${Date.now()}`;
  const commonStyle = { marginTop: 0, marginBottom: 10, fontSize: 11 };

  const baseBlock = {
    id,
    type,
    visible: true,
    style: commonStyle,
  };

  switch (type) {
    case 'header':
      return {
        ...baseBlock,
        layout: 'logo-center',
        showLogo: false,
        showCompanyName: true,
        showAddress: true,
        showPhone: true,
        showEmail: true,
        showTaxCode: true,
        style: { ...commonStyle, fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: '#1E88E5' },
      } as TemplateBlock;
    case 'invoice-title':
      return {
        ...baseBlock,
        title: 'HÓA ĐƠN BÁN HÀNG',
        showInvoiceCode: true,
        showBorder: true,
        style: { ...commonStyle, fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
      } as TemplateBlock;
    case 'customer-info':
      return {
        ...baseBlock,
        showName: true,
        showAddress: true,
        showPhone: true,
        showTaxCode: false,
      } as TemplateBlock;
    case 'invoice-meta':
      return {
        ...baseBlock,
        showCreatedDate: true,
        showDueDate: true,
        showSalesperson: false,
        layout: 'two-columns',
      } as TemplateBlock;
    case 'items-table':
      return {
        ...baseBlock,
        showHeader: true,
        showBorders: true,
        headerColor: '#1E88E5',
        headerTextColor: '#ffffff',
        columns: {
          stt: true,
          name: true,
          unit: true,
          quantity: true,
          price: true,
          discount: false,
          tax: false,
          amount: true,
        },
        style: { ...commonStyle, fontSize: 10 },
      } as TemplateBlock;
    case 'totals':
      return {
        ...baseBlock,
        align: 'right',
        showSubtotal: true,
        showDiscount: true,
        showTax: true,
        showShipping: false,
        showGrandTotal: true,
        showPaid: true,
        showRemaining: true,
        showInWords: true,
        width: 240,
        style: { ...commonStyle, fontSize: 10.5 },
      } as TemplateBlock;
    case 'payment-info':
      return {
        ...baseBlock,
        showBankInfo: true,
        showQRCode: false,
        style: { ...commonStyle, fontSize: 10 },
      } as TemplateBlock;
    case 'signature':
      return {
        ...baseBlock,
        showSellerSignature: true,
        showCustomerSignature: true,
        layout: 'two-columns',
        style: { ...commonStyle, marginTop: 15 },
      } as TemplateBlock;
    case 'footer':
      return {
        ...baseBlock,
        showThankYou: true,
        showTerms: false,
        customText: '',
        style: { ...commonStyle, fontSize: 10, textAlign: 'center' },
      } as TemplateBlock;
    default:
      return baseBlock as TemplateBlock;
  }
}

// component Khối kéo từ thư viện bên trái (Kéo thả)
interface DraggableLibBlockProps {
  type: BlockType;
  title: string;
  description: string;
  icon: any;
  onAdd: () => void;
}
function DraggableLibBlock({ type, title, description, icon: Icon, onAdd }: DraggableLibBlockProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'NEW_BLOCK',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <button
      ref={drag}
      onClick={onAdd}
      className={`group flex w-full items-center gap-2 rounded-lg border bg-white p-2 text-left transition-all ${
        isDragging ? 'opacity-50 scale-95 border-[#1E88E5]' : 'border-gray-200 hover:border-[#1E88E5] hover:shadow-sm'
      }`}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-blue-50 text-[#1E88E5]">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-800 truncate">{title}</div>
        <div className="text-[10px] text-gray-400 truncate">{description}</div>
      </div>
      <Plus className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
    </button>
  );
}

// component Khối trong danh sách Cấu trúc bên trái và sắp xếp thứ tự
interface SortableBlockItemProps {
  block: TemplateBlock;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}
function SortableBlockItem({
  block,
  index,
  isSelected,
  onSelect,
  onMove,
  onDelete,
  onToggleVisibility,
}: SortableBlockItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'CANVAS_BLOCK',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'CANVAS_BLOCK',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  const blockIcons: Record<BlockType, any> = {
    header: FileText,
    'invoice-title': FileText,
    'customer-info': User,
    'invoice-meta': Calendar,
    'items-table': Table,
    totals: DollarSign,
    'payment-info': CreditCard,
    signature: PenTool,
    footer: MessageSquare,
  };
  const Icon = blockIcons[block.type];

  const getBlockName = (type: BlockType): string => {
    const names: Record<BlockType, string> = {
      header: 'Thông tin cửa hàng',
      'invoice-title': 'Tiêu đề hóa đơn',
      'customer-info': 'Thông tin khách',
      'invoice-meta': 'Thông tin HĐ',
      'items-table': 'Bảng hàng hóa',
      totals: 'Tổng thanh toán',
      'payment-info': 'Thanh toán',
      signature: 'Chữ ký',
      footer: 'Ghi chú / Lời chúc',
    };
    return names[type];
  };

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      onClick={onSelect}
      className={`group flex items-center justify-between gap-1.5 p-2 rounded-lg border cursor-pointer select-none ${
        isSelected
          ? 'border-[#1E88E5] bg-blue-50/20 shadow-sm ring-1 ring-[#1E88E5]/30'
          : 'border-gray-200 bg-white hover:border-gray-300'
      } ${isDragging ? 'opacity-40' : ''} ${!block.visible ? 'opacity-60 bg-gray-50' : ''}`}
    >
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <Move className="h-3 w-3 text-gray-400 cursor-grab active:cursor-grabbing shrink-0" />
        <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 shrink-0">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-gray-800 truncate">{getBlockName(block.type)}</div>
          {!block.visible && <div className="text-[9px] text-amber-600 font-medium">Đang ẩn</div>}
        </div>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          title={block.visible ? 'Ẩn khối' : 'Hiện khối'}
        >
          {block.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 text-gray-400 hover:text-red-600 rounded"
          title="Xóa khối"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// component Render khối trực tiếp trên Canvas A5/A4
interface CanvasBlockWrapperProps {
  block: TemplateBlock;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
  primaryColor: string;
}
function CanvasBlockWrapper({
  block,
  index,
  isSelected,
  onSelect,
  onMove,
  onDelete,
  onToggleVisibility,
  primaryColor,
}: CanvasBlockWrapperProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'CANVAS_BLOCK',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'CANVAS_BLOCK',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  // Render nội dung demo trực quan của từng loại khối
  const renderVisualContent = () => {
    const style: React.CSSProperties = {
      textAlign: block.style.textAlign || 'left',
      fontSize: `${block.style.fontSize || 11}px`,
      fontWeight: block.style.fontWeight || 'normal',
      color: block.style.color || '#000000',
      marginTop: `${block.style.marginTop || 0}px`,
      marginBottom: `${block.style.marginBottom || 10}px`,
      paddingTop: `${block.style.paddingTop || 0}px`,
      paddingBottom: `${block.style.paddingBottom || 0}px`,
    };

    switch (block.type) {
      case 'header':
        return (
          <div style={style}>
            {block.showCompanyName && (
              <h1 style={{ color: block.style.color || primaryColor, fontSize: `${block.style.fontSize || 14}px`, fontWeight: 'bold', margin: '0 0 2px 0' }}>
                {sampleData.Ten_Cong_Ty}
              </h1>
            )}
            {block.showAddress && <p className="m-0 text-gray-600">{sampleData.Dia_Chi_Cong_Ty}</p>}
            {(block.showPhone || block.showEmail) && (
              <p className="m-0 text-gray-600">
                {block.showPhone ? `ĐT: ${sampleData.So_Dien_Thoai_Cong_Ty}` : ''}
                {block.showPhone && block.showEmail ? ' · ' : ''}
                {block.showEmail ? `Email: ${sampleData.Email_Cong_Ty}` : ''}
              </p>
            )}
            {block.showTaxCode && <p className="m-0 text-gray-600">MST: {sampleData.Ma_So_Thue_Cong_Ty}</p>}
          </div>
        );
      case 'invoice-title':
        return (
          <div style={{ ...style, textAlign: 'center' }} className={block.showBorder ? 'border-y border-dashed py-2 my-2' : ''}>
            <h2 className="m-0 font-bold text-gray-900" style={{ fontSize: `${block.style.fontSize || 15}px` }}>
              {block.title || 'HÓA ĐƠN BÁN HÀNG'}
            </h2>
            {block.showInvoiceCode && (
              <p className="m-0 font-semibold mt-1" style={{ color: primaryColor }}>
                Số: {sampleData.Ma_Hoa_Don}
              </p>
            )}
          </div>
        );
      case 'customer-info':
        return (
          <div style={style} className="space-y-1">
            {block.showName && (
              <p className="m-0">
                <strong>Khách hàng:</strong> {sampleData.Khach_Hang}
              </p>
            )}
            {block.showAddress && (
              <p className="m-0">
                <strong>Địa chỉ:</strong> {sampleData.Dia_Chi_Khach_Hang}
              </p>
            )}
            {block.showPhone && (
              <p className="m-0">
                <strong>Điện thoại:</strong> {sampleData.So_Dien_Thoai}
              </p>
            )}
            {block.showTaxCode && (
              <p className="m-0">
                <strong>MST:</strong> {sampleData.Ma_So_Thue_Khach}
              </p>
            )}
          </div>
        );
      case 'invoice-meta':
        return (
          <div style={style} className={block.layout === 'two-columns' ? 'grid grid-cols-2 gap-4' : 'space-y-1'}>
            {block.showCreatedDate && (
              <p className="m-0">
                <strong>Ngày tạo:</strong> {sampleData.Ngay_Tao}
              </p>
            )}
            {block.showDueDate && (
              <p className="m-0">
                <strong>Hạn thanh toán:</strong> {sampleData.Ngay_Den_Han}
              </p>
            )}
          </div>
        );
      case 'items-table':
        return (
          <div style={style}>
            <table className={`w-full text-left border-collapse ${block.showBorders ? 'border' : ''}`} style={{ fontSize: `${block.style.fontSize || 10}px` }}>
              {block.showHeader && (
                <thead>
                  <tr style={{ backgroundColor: block.headerColor || primaryColor, color: block.headerTextColor || '#ffffff' }}>
                    {block.columns.stt && <th className="p-1 border text-center font-bold">STT</th>}
                    {block.columns.name && <th className="p-1 border font-bold">Tên hàng</th>}
                    {block.columns.unit && <th className="p-1 border text-center font-bold">ĐVT</th>}
                    {block.columns.quantity && <th className="p-1 border text-right font-bold">SL</th>}
                    {block.columns.price && <th className="p-1 border text-right font-bold">Đơn giá</th>}
                    {block.columns.discount && <th className="p-1 border text-right font-bold">CK</th>}
                    {block.columns.tax && <th className="p-1 border text-right font-bold">Thuế</th>}
                    {block.columns.amount && <th className="p-1 border text-right font-bold">Thành tiền</th>}
                  </tr>
                </thead>
              )}
              <tbody>
                {sampleData.items.map((it) => (
                  <tr key={it.STT}>
                    {block.columns.stt && <td className="p-1 border text-center">{it.STT}</td>}
                    {block.columns.name && <td className="p-1 border">{it.Ten_Hang}</td>}
                    {block.columns.unit && <td className="p-1 border text-center">{it.Don_Vi}</td>}
                    {block.columns.quantity && <td className="p-1 border text-right">{it.So_Luong}</td>}
                    {block.columns.price && <td className="p-1 border text-right">{it.Don_Gia}</td>}
                    {block.columns.discount && <td className="p-1 border text-right">{it.Chiet_Khau}</td>}
                    {block.columns.tax && <td className="p-1 border text-right">{it.Thue}</td>}
                    {block.columns.amount && <td className="p-1 border text-right font-bold">{it.Thanh_Tien}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'totals':
        return (
          <div style={{ ...style, display: 'flex', justifyContent: block.align === 'right' ? 'flex-end' : 'flex-start' }}>
            <div style={{ width: `${block.width || 240}px` }} className="space-y-1">
              {block.showSubtotal && (
                <div className="flex justify-between border-b border-dashed py-0.5">
                  <span>Tổng tiền hàng:</span>
                  <span className="font-medium">{sampleData.Tong_Tien}</span>
                </div>
              )}
              {block.showDiscount && (
                <div className="flex justify-between border-b border-dashed py-0.5">
                  <span>Chiết khấu:</span>
                  <span className="font-medium">-{sampleData.Chiet_Khau}</span>
                </div>
              )}
              {block.showTax && (
                <div className="flex justify-between border-b border-dashed py-0.5">
                  <span>Thuế VAT:</span>
                  <span className="font-medium">{sampleData.Thue}</span>
                </div>
              )}
              {block.showGrandTotal && (
                <div className="flex justify-between py-1 border-y border-gray-900 font-bold" style={{ color: primaryColor, fontSize: `${(block.style.fontSize || 10.5) + 1}px` }}>
                  <span>TỔNG CỘNG:</span>
                  <span>{sampleData.Tong_Cong}</span>
                </div>
              )}
              {block.showPaid && (
                <div className="flex justify-between py-0.5 text-[#2e7d32]">
                  <span>Đã thanh toán:</span>
                  <span className="font-medium">{sampleData.Da_Thanh_Toan}</span>
                </div>
              )}
              {block.showRemaining && (
                <div className="flex justify-between py-0.5 font-bold text-[#ef6c00]">
                  <span>Còn lại:</span>
                  <span>{sampleData.Con_Lai}</span>
                </div>
              )}
              {block.showInWords && (
                <p className="text-gray-500 italic mt-1.5 text-[9.5px]">Số tiền bằng chữ: {sampleData.Tien_Bang_Chu}</p>
              )}
            </div>
          </div>
        );
      case 'payment-info':
        return (
          <div style={style}>
            {block.showBankInfo && (
              <div className="border border-dashed p-2 rounded bg-gray-50/50 mb-1 space-y-0.5">
                <p className="m-0"><strong>Thông tin tài khoản ngân hàng:</strong></p>
                <p className="m-0">Ngân hàng: MB Bank (Ngân hàng Quân Đội)</p>
                <p className="m-0">Số tài khoản: 190200888888</p>
                <p className="m-0">Chủ tài khoản: {sampleData.Ten_Cong_Ty}</p>
              </div>
            )}
            {block.showQRCode && (
              <div className="text-center mt-1">
                <p className="m-0 text-[9px] text-gray-500 italic">Quét mã QR để chuyển khoản nhanh</p>
                <div className="inline-block border p-1 bg-white mt-1">
                  <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-[8px] text-gray-400">QR Code</div>
                </div>
              </div>
            )}
          </div>
        );
      case 'signature':
        return (
          <div style={style} className={block.layout === 'two-columns' ? 'grid grid-cols-2 gap-4 text-center' : 'space-y-4 text-center'}>
            {block.showSellerSignature && (
              <div>
                <p className="m-0 font-bold">Người mua hàng</p>
                <p className="m-0 text-[9px] text-gray-500 italic mt-0.5">(Ký, ghi rõ họ tên)</p>
                <div className="h-10"></div>
              </div>
            )}
            {block.showCustomerSignature && (
              <div>
                <p className="m-0 font-bold">Người bán hàng</p>
                <p className="m-0 text-[9px] text-gray-500 italic mt-0.5">(Ký, ghi rõ họ tên)</p>
                <div className="h-10"></div>
              </div>
            )}
          </div>
        );
      case 'footer':
        return (
          <div style={style}>
            {block.showThankYou && <p className="m-0 italic text-gray-600">Cảm ơn Quý khách đã mua hàng. Hẹn gặp lại!</p>}
            {block.showTerms && <p className="m-0 text-[9px] text-gray-500 mt-1">Điều khoản: Hàng mua rồi vui lòng miễn đổi trả.</p>}
            {block.customText && <p className="m-0 font-bold mt-1 text-gray-700">{block.customText}</p>}
          </div>
        );
      default:
        return <div>Khối in</div>;
    }
  };

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`relative group border-2 my-1 transition-all rounded ${
        isSelected
          ? 'border-[#1E88E5] bg-blue-50/5 ring-1 ring-[#1E88E5]/20'
          : 'border-transparent hover:border-blue-200'
      } ${!block.visible ? 'opacity-35 border-dashed border-gray-300' : ''}`}
    >
      {/* Visual Overlay block name handle */}
      <div className="absolute -top-3.5 left-2 bg-[#1E88E5] text-white text-[9px] font-bold px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1 cursor-grab active:cursor-grabbing">
        <Move className="h-2.5 w-2.5" />
        <span>{block.type.replace(/-/g, ' ').toUpperCase()}</span>
        {!block.visible && <span>(ẨN)</span>}
      </div>

      {/* Action panel inside the canvas */}
      <div className="absolute right-1 top-1 flex items-center gap-0.5 bg-white/95 border shadow-sm rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          className="p-1 hover:bg-gray-100 text-gray-500 rounded"
          title={block.visible ? 'Ẩn khối' : 'Hiện khối'}
        >
          {block.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 hover:bg-red-50 text-red-500 rounded"
          title="Xóa khối"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* Block content rendering */}
      <div className="p-2 min-h-[30px]">{renderVisualContent()}</div>
    </div>
  );
}

// component Dropzone cho canvas kéo thả
interface CanvasDropZoneProps {
  children: React.ReactNode;
  onDrop: (blockType: BlockType, index: number) => void;
  blocks: TemplateBlock[];
}
function CanvasDropZone({ children, onDrop, blocks }: CanvasDropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ['NEW_BLOCK', 'CANVAS_BLOCK'],
    drop: (item: { type?: BlockType; index?: number }, monitor) => {
      const didDropSelf = monitor.didDrop();
      if (didDropSelf) return;

      if (item.type) {
        onDrop(item.type, blocks.length);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <div
      ref={drop}
      className={`min-h-[500px] transition-all rounded-lg p-2 ${
        isOver ? 'bg-blue-50/30 border-2 border-dashed border-[#1E88E5]/50' : ''
      }`}
    >
      {children}
    </div>
  );
}

export function normalizeTemplateHtml(html: string): string {
  if (!html) return '';
  let cleaned = html;
  
  // Clean redundant nested/repeated empty tags
  cleaned = cleaned.replace(/(?:<p[^>]*>\s*<br\s*\/?>\s*<\/p>\s*){2,}/gi, '<p><br></p>');
  cleaned = cleaned.replace(/(?:<div[^>]*>\s*<br\s*\/?>\s*<\/div>\s*){2,}/gi, '<div><br></div>');
  cleaned = cleaned.replace(/(?:<p[^>]*>\s*&nbsp;\s*<\/p>\s*){2,}/gi, '<p>&nbsp;</p>');
  cleaned = cleaned.replace(/(?:<div[^>]*>\s*&nbsp;\s*<\/div>\s*){2,}/gi, '<div>&nbsp;</div>');
  
  // Clean trailing spaces and trailing empty tags
  cleaned = cleaned.replace(/(?:<p[^>]*>\s*<br\s*\/?>\s*<\/p>\s*)+$/gi, '');
  cleaned = cleaned.replace(/(?:<div[^>]*>\s*<br\s*\/?>\s*<\/div>\s*)+$/gi, '');
  
  return cleaned;
}

// WYSIWYG Editor wrapper using standard contenteditable with styling
interface WysiwygEditorProps {
  value: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
  editorRef: React.RefObject<HTMLDivElement | null>;
  onTableSelect: (table: HTMLTableElement | null, cell: HTMLTableCellElement | null) => void;
}
function WysiwygEditor({ value, onChange, readOnly, editorRef, onTableSelect }: WysiwygEditorProps) {
  const isDragging = useRef(false);
  const dragTarget = useRef<HTMLTableCellElement | null>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Đồng bộ từ prop vào innerHTML khi có sự khác biệt thực sự
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value, editorRef]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Traversal Selection to identify if user is inside a table
  const updateSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) {
      onTableSelect(null, null);
      return;
    }
    const anchorNode = selection.anchorNode;
    if (!anchorNode) {
      onTableSelect(null, null);
      return;
    }
    
    let current: Node | null = anchorNode;
    let cell: HTMLTableCellElement | null = null;
    let table: HTMLTableElement | null = null;

    while (current && current !== editorRef.current) {
      if (current.nodeName === 'TD' || current.nodeName === 'TH') {
        cell = current as HTMLTableCellElement;
      }
      if (current.nodeName === 'TABLE') {
        table = current as HTMLTableElement;
        break;
      }
      current = current.parentNode;
    }
    
    onTableSelect(table, cell);
  }, [editorRef, onTableSelect]);

  useEffect(() => {
    const handleSelectionChange = () => {
      updateSelection();
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [updateSelection]);

  // Handle border hover to change cursor to col-resize
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current || readOnly) return;
    const target = (e.target as HTMLElement).closest('td, th') as HTMLTableCellElement;
    if (!target) {
      (e.currentTarget as HTMLElement).style.cursor = '';
      return;
    }
    const rect = target.getBoundingClientRect();
    // Check if mouse is near the right edge of the cell (within 6px)
    const nearRightEdge = (e.clientX > rect.right - 6) && (e.clientX <= rect.right + 2);
    if (nearRightEdge) {
      (e.currentTarget as HTMLElement).style.cursor = 'col-resize';
    } else {
      (e.currentTarget as HTMLElement).style.cursor = '';
    }
  };

  // Handle mouse down to begin resizing column
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return;
    const target = (e.target as HTMLElement).closest('td, th') as HTMLTableCellElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const nearRightEdge = (e.clientX > rect.right - 6) && (e.clientX <= rect.right + 2);
    if (nearRightEdge) {
      e.preventDefault();
      isDragging.current = true;
      dragTarget.current = target;
      startX.current = e.clientX;
      startWidth.current = target.offsetWidth;
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !dragTarget.current) return;
    const deltaX = e.clientX - startX.current;
    const newWidth = Math.max(30, startWidth.current + deltaX);
    
    // Set cell inline style width
    dragTarget.current.style.width = `${newWidth}px`;
    
    // Auto adjust table layout to fixed if we manual resize
    const table = dragTarget.current.closest('table');
    if (table) {
      table.style.tableLayout = 'fixed';
    }
    
    handleInput();
  };

  const handleGlobalMouseUp = () => {
    isDragging.current = false;
    dragTarget.current = null;
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .wysiwyg-editor-content table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          box-sizing: border-box;
          word-break: break-word;
        }
        .wysiwyg-editor-content table:focus-within {
          outline: 2px dashed #1E88E5 !important;
          outline-offset: 3px;
        }
        .wysiwyg-editor-content th, .wysiwyg-editor-content td {
          position: relative;
          word-break: break-word;
        }
      `}} />
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleInput}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        className="wysiwyg-editor-content w-full h-full min-h-[600px] p-6 focus:outline-none overflow-y-auto bg-white border rounded shadow-inner"
        style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', lineHeight: '1.3' }}
      />
    </>
  );
}

export default function TemplateEditor() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canEdit = hasRole('ADMIN');

  const { data: settings, isLoading, isError, error, refetch } = useSettings();
  const updateMut = useUpdateSettings();

  const [mode, setMode] = useState<'editor' | 'visual' | 'html'>('editor');
  const [html, setHtml] = useState<string>('');
  const [initialHtml, setInitialHtml] = useState<string>('');
  
  // Dữ liệu thiết kế Trực quan (Schema)
  const [schema, setSchema] = useState<TemplateSchema>(defaultTemplateSchema);
  const [initialSchemaJson, setInitialSchemaJson] = useState<string>('');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Các thuộc tính soạn thảo khác
  const [templateName, setTemplateName] = useState<string>('Mẫu in hóa đơn bán hàng');
  const [paperSize, setPaperSize] = useState<'A5' | 'A4' | 'K80'>('A5');
  const [initialPaperSize, setInitialPaperSize] = useState<'A5' | 'A4' | 'K80'>('A5');
  const [showTokenSidebar, setShowTokenSidebar] = useState<boolean>(true);

  // States & Refs cho thao tác bảng trong WYSIWYG
  const [activeTable, setActiveTable] = useState<HTMLTableElement | null>(null);
  const [activeCell, setActiveCell] = useState<HTMLTableCellElement | null>(null);
  const editorDivRef = useRef<HTMLDivElement>(null);

  // Nhận diện dữ liệu khi settings được tải về
  useEffect(() => {
    if (settings) {
      const templateHtml = settings.invoiceTemplateHtml ?? '';
      setHtml(templateHtml);
      setInitialHtml(templateHtml);

      const size = (settings.invoiceTemplatePaperSize as 'A5' | 'A4' | 'K80') ?? 'A5';
      setPaperSize(size);
      setInitialPaperSize(size);

      // Thử phân tích xem HTML có chứa dữ liệu schema trực quan không
      const extractedSchema = extractSchemaFromHTML(templateHtml);
      if (extractedSchema) {
        setSchema(extractedSchema);
        setInitialSchemaJson(JSON.stringify(extractedSchema));
      } else {
        // Tạo schema mặc định khớp với khổ giấy hiện tại
        setSchema({
          ...defaultTemplateSchema,
          paperSize: size === 'K80' ? 'A5' : size,
        });
      }
    }
  }, [settings]);

  const isDirty = useMemo(() => {
    const paperSizeDirty = paperSize !== initialPaperSize;
    if (mode === 'editor') {
      return html !== initialHtml || paperSizeDirty;
    } else if (mode === 'visual') {
      return JSON.stringify(schema) !== initialSchemaJson || paperSizeDirty;
    } else {
      return html !== initialHtml || paperSizeDirty;
    }
  }, [mode, html, initialHtml, schema, initialSchemaJson, paperSize, initialPaperSize]);

  // Cảnh báo khi đóng/refresh tab
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Chặn điều hướng trong ứng dụng
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  );
  useEffect(() => {
    if (blocker.state === 'blocked') {
      const ok = window.confirm('Bạn có thay đổi chưa lưu. Rời khỏi trang và bỏ các thay đổi?');
      if (ok) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);

  // Sinh HTML để xem trước trong các chế độ
  const previewHtmlForHtmlAndEditorMode = useMemo(() => {
    if (!settings) return '';
    return buildInvoiceHtml(SAMPLE_INVOICE, {
      ...settings,
      invoiceTemplateHtml: normalizeTemplateHtml(html),
      invoiceTemplatePaperSize: paperSize,
    });
  }, [settings, html, paperSize]);

  const generatedHtmlFromSchema = useMemo(() => {
    return schemaToHTML(schema, sampleData);
  }, [schema]);

  const previewHtmlForVisualMode = useMemo(() => {
    if (!settings) return '';
    return buildInvoiceHtml(SAMPLE_INVOICE, {
      ...settings,
      invoiceTemplateHtml: generatedHtmlFromSchema,
      invoiceTemplatePaperSize: schema.paperSize,
    });
  }, [settings, generatedHtmlFromSchema, schema.paperSize]);

  // Đổi chế độ biên tập
  const handleModeChange = (newMode: 'editor' | 'visual' | 'html') => {
    if (mode === 'visual' && newMode !== 'visual') {
      // Khi thoát Trực quan, sinh HTML tương ứng từ schema hiện tại
      setHtml(generatedHtmlFromSchema);
    } else if (mode !== 'visual' && newMode === 'visual') {
      // Khi chuyển sang Trực quan, kiểm tra xem HTML có chứa schema cũ không
      const ext = extractSchemaFromHTML(html);
      if (ext) {
        setSchema(ext);
      } else {
        const ok = window.confirm(
          'Không tìm thấy dữ liệu thiết kế trực quan trong mã HTML này. Việc chuyển sang thiết kế Trực quan sẽ tải cấu trúc mặc định khổ ' + paperSize + ' và GHI ĐÈ thiết kế hiện tại của bạn khi lưu. Bạn có muốn tiếp tục?',
        );
        if (!ok) return;
        setSchema({
          ...defaultTemplateSchema,
          paperSize: paperSize === 'K80' ? 'A5' : paperSize,
        });
      }
    }
    setMode(newMode);
  };

  // Áp dụng mẫu gợi ý
  const handleSuggestTemplateChange = (presetKey: string) => {
    if (!presetKey) return;
    if (isDirty) {
      const ok = window.confirm(
        'Bạn có thay đổi chưa lưu. Việc đổi sang mẫu gợi ý khác sẽ ghi đè toàn bộ các thay đổi hiện tại. Tiếp tục?',
      );
      if (!ok) return;
    }

    if (presetKey === 'A5_sales') {
      setHtml(DEFAULT_INVOICE_TEMPLATE_A5);
      setPaperSize('A5');
      setSchema({ ...defaultTemplateSchema, paperSize: 'A5' });
      toast.success('Đã tải mẫu gợi ý Khổ A5 - Mẫu bán hàng');
    } else if (presetKey === 'A5_compact') {
      setHtml(DEFAULT_INVOICE_TEMPLATE_A5_COMPACT);
      setPaperSize('A5');
      setSchema({ ...defaultTemplateSchema, paperSize: 'A5' });
      toast.success('Đã tải mẫu gợi ý Khổ A5 - Tối ưu nhiều hàng');
    } else if (presetKey === 'A4_full') {
      setHtml(DEFAULT_INVOICE_TEMPLATE_A4);
      setPaperSize('A4');
      setSchema({ ...defaultTemplateSchema, paperSize: 'A4' });
      toast.success('Đã tải mẫu gợi ý Khổ A4 - Mẫu đầy đủ');
    } else if (presetKey === 'K80_retail') {
      setHtml(DEFAULT_INVOICE_TEMPLATE_K80);
      setPaperSize('K80');
      setSchema({ ...defaultTemplateSchema, paperSize: 'A5' }); // K80 dùng size A5 làm fallback
      toast.success('Đã tải mẫu gợi ý Khổ K80 - Mẫu bán lẻ');
    }
  };

  // Khổ giấy select
  const handlePaperSizeSelect = (size: 'A5' | 'A4' | 'K80') => {
    setPaperSize(size);
    if (mode === 'visual') {
      setSchema((prev) => ({ ...prev, paperSize: size === 'K80' ? 'A5' : size }));
    }
  };

  // Kéo thả & Khối Trực quan
  const handleAddBlock = (type: BlockType) => {
    if (!canEdit) return;
    const newBlock = createDefaultBlock(type);
    setSchema((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    setSelectedBlockId(newBlock.id);
    toast.success('Đã thêm khối mới');
  };

  const handleDropBlock = (type: BlockType, index: number) => {
    if (!canEdit) return;
    const newBlock = createDefaultBlock(type);
    setSchema((prev) => {
      const blocks = [...prev.blocks];
      blocks.splice(index, 0, newBlock);
      return { ...prev, blocks };
    });
    setSelectedBlockId(newBlock.id);
    toast.success('Đã chèn khối mới');
  };

  const handleMoveBlock = useCallback((fromIndex: number, toIndex: number) => {
    if (!canEdit) return;
    setSchema((prev) => {
      const blocks = [...prev.blocks];
      const [moved] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, moved);
      return { ...prev, blocks };
    });
  }, [canEdit]);

  const handleDeleteBlock = (blockId: string) => {
    if (!canEdit) return;
    setSchema((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== blockId),
    }));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const handleToggleBlockVisibility = (blockId: string) => {
    if (!canEdit) return;
    setSchema((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === blockId ? { ...b, visible: !b.visible } : b)),
    }));
  };

  const triggerHtmlChange = () => {
    if (editorDivRef.current) {
      setHtml(editorDivRef.current.innerHTML);
    }
  };

  const handleInsertRowAbove = () => {
    if (!activeCell || !activeTable) return;
    const tr = activeCell.parentElement as HTMLTableRowElement;
    if (!tr) return;
    const rowIndex = tr.rowIndex;
    const newRow = activeTable.insertRow(rowIndex);
    const cellCount = tr.cells.length;
    for (let i = 0; i < cellCount; i++) {
      const newCell = newRow.insertCell();
      newCell.innerHTML = '&nbsp;';
      newCell.style.border = '1px solid #ddd';
      newCell.style.padding = '6px';
    }
    triggerHtmlChange();
    toast.success('Đã thêm dòng phía trên');
  };

  const handleInsertRowBelow = () => {
    if (!activeCell || !activeTable) return;
    const tr = activeCell.parentElement as HTMLTableRowElement;
    if (!tr) return;
    const rowIndex = tr.rowIndex;
    const newRow = activeTable.insertRow(rowIndex + 1);
    const cellCount = tr.cells.length;
    for (let i = 0; i < cellCount; i++) {
      const newCell = newRow.insertCell();
      newCell.innerHTML = '&nbsp;';
      newCell.style.border = '1px solid #ddd';
      newCell.style.padding = '6px';
    }
    triggerHtmlChange();
    toast.success('Đã thêm dòng phía dưới');
  };

  const handleDeleteRow = () => {
    if (!activeCell || !activeTable) return;
    const tr = activeCell.parentElement as HTMLTableRowElement;
    if (!tr) return;
    activeTable.deleteRow(tr.rowIndex);
    setActiveCell(null);
    setActiveTable(null);
    triggerHtmlChange();
    toast.success('Đã xóa dòng');
  };

  const handleInsertColLeft = () => {
    if (!activeCell || !activeTable) return;
    const cellIndex = activeCell.cellIndex;
    for (let i = 0; i < activeTable.rows.length; i++) {
      const row = activeTable.rows[i];
      const newCell = row.insertCell(cellIndex);
      newCell.innerHTML = '&nbsp;';
      newCell.style.border = '1px solid #ddd';
      newCell.style.padding = '6px';
    }
    triggerHtmlChange();
    toast.success('Đã thêm cột bên trái');
  };

  const handleInsertColRight = () => {
    if (!activeCell || !activeTable) return;
    const cellIndex = activeCell.cellIndex;
    for (let i = 0; i < activeTable.rows.length; i++) {
      const row = activeTable.rows[i];
      const newCell = row.insertCell(cellIndex + 1);
      newCell.innerHTML = '&nbsp;';
      newCell.style.border = '1px solid #ddd';
      newCell.style.padding = '6px';
    }
    triggerHtmlChange();
    toast.success('Đã thêm cột bên phải');
  };

  const handleDeleteCol = () => {
    if (!activeCell || !activeTable) return;
    const cellIndex = activeCell.cellIndex;
    for (let i = 0; i < activeTable.rows.length; i++) {
      const row = activeTable.rows[i];
      if (row.cells.length > cellIndex) {
        row.deleteCell(cellIndex);
      }
    }
    setActiveCell(null);
    setActiveTable(null);
    triggerHtmlChange();
    toast.success('Đã xóa cột');
  };

  const handleDeleteTable = () => {
    if (!activeTable) return;
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa toàn bộ bảng này không?');
    if (!confirmDelete) return;
    activeTable.remove();
    setActiveCell(null);
    setActiveTable(null);
    triggerHtmlChange();
    toast.success('Đã xóa bảng');
  };

  const handleSetTableWidth = (width: string) => {
    if (!activeTable) return;
    activeTable.style.width = width;
    triggerHtmlChange();
    toast.success(`Đã đổi chiều rộng bảng thành ${width}`);
  };

  const handleSetTableAlign = (align: 'left' | 'center' | 'right') => {
    if (!activeTable) return;
    if (align === 'center') {
      activeTable.style.marginLeft = 'auto';
      activeTable.style.marginRight = 'auto';
    } else if (align === 'left') {
      activeTable.style.marginLeft = '0';
      activeTable.style.marginRight = 'auto';
    } else {
      activeTable.style.marginLeft = 'auto';
      activeTable.style.marginRight = '0';
    }
    triggerHtmlChange();
    toast.success(`Đã căn lề bảng về bên ${align === 'center' ? 'giữa' : align === 'left' ? 'trái' : 'phải'}`);
  };

  const handleDistributeColumns = () => {
    if (!activeTable) return;
    const firstRow = activeTable.rows[0];
    if (!firstRow) return;
    const colCount = firstRow.cells.length;
    const widthPercentage = 100 / colCount;
    for (let i = 0; i < firstRow.cells.length; i++) {
      firstRow.cells[i].style.width = `${widthPercentage}%`;
    }
    triggerHtmlChange();
    toast.success('Đã chia đều chiều rộng các cột');
  };

  const handleOptimizeForA5 = () => {
    if (!activeTable) return;
    activeTable.style.width = '100%';
    activeTable.style.tableLayout = 'fixed';
    
    const firstRow = activeTable.rows[0];
    if (!firstRow) return;
    
    const cells = Array.from(firstRow.cells);
    const colCount = cells.length;
    
    cells.forEach((cell, idx) => {
      const text = (cell.textContent || '').toLowerCase().trim();
      if (text.includes('stt') || text === 'nđ' || text === 'no' || (idx === 0 && colCount > 3)) {
        cell.style.width = '8%';
      } else if (text.includes('tên') || text.includes('hàng') || text.includes('sản phẩm') || text.includes('dịch vụ') || idx === 1) {
        cell.style.width = '45%';
      } else if (text.includes('sl') || text.includes('số lượng') || text.includes('qty')) {
        cell.style.width = '10%';
      } else if (text.includes('đơn giá') || text.includes('giá') || text.includes('price')) {
        cell.style.width = '17%';
      } else if (text.includes('thành tiền') || text.includes('tổng cộng') || text.includes('amount')) {
        cell.style.width = '20%';
      } else {
        cell.style.width = '10%';
      }
    });
    
    for (let r = 0; r < activeTable.rows.length; r++) {
      const row = activeTable.rows[r];
      for (let c = 0; c < row.cells.length; c++) {
        const cell = row.cells[c];
        cell.style.wordBreak = 'break-word';
        cell.style.fontSize = '10.5px';
        cell.style.padding = '5px 4px';
      }
    }
    
    triggerHtmlChange();
    toast.success('Đã tối ưu hóa bố cục bảng cho khổ giấy A5');
  };

  // Lưu thiết lập
  const handleSave = async () => {
    try {
      if (mode === 'visual') {
        const finalHtml = schemaToHTML(schema, sampleData);
        const cleanHtml = normalizeTemplateHtml(finalHtml);
        await updateMut.mutateAsync({
          invoiceTemplateHtml: cleanHtml,
          invoiceTemplatePaperSize: paperSize,
        });
        setInitialHtml(cleanHtml);
        setInitialSchemaJson(JSON.stringify(schema));
      } else {
        const cleanHtml = normalizeTemplateHtml(html);
        await updateMut.mutateAsync({
          invoiceTemplateHtml: cleanHtml,
          invoiceTemplatePaperSize: paperSize,
        });
        setInitialHtml(cleanHtml);
        
        const parsed = extractSchemaFromHTML(cleanHtml);
        if (parsed) setInitialSchemaJson(JSON.stringify(parsed));
      }
      setInitialPaperSize(paperSize);
      toast.success('Đã lưu mẫu in hóa đơn bán hàng thành công');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Khôi phục mặc định
  const handleRestoreDefault = () => {
    if (!canEdit) return;
    const ok = window.confirm(
      'Bạn có chắc chắn muốn khôi phục thiết kế mặc định cho khổ giấy hiện tại?',
    );
    if (!ok) return;

    if (paperSize === 'A4') {
      setHtml(DEFAULT_INVOICE_TEMPLATE_A4);
      setSchema({ ...defaultTemplateSchema, paperSize: 'A4' });
    } else if (paperSize === 'K80') {
      setHtml(DEFAULT_INVOICE_TEMPLATE_K80);
      setSchema({ ...defaultTemplateSchema, paperSize: 'A5' });
    } else {
      setHtml(DEFAULT_INVOICE_TEMPLATE_A5);
      setSchema({ ...defaultTemplateSchema, paperSize: 'A5' });
    }
    toast.success('Đã khôi phục thiết kế mặc định');
  };

  // In thử
  const handleTestPrint = () => {
    const printHtml = mode === 'visual' ? generatedHtmlFromSchema : html;
    printInvoiceFromTemplate(SAMPLE_INVOICE, {
      companyName: settings?.companyName ?? 'Cửa hàng mẫu',
      companyAddress: settings?.companyAddress ?? 'Địa chỉ mẫu',
      companyPhone: settings?.companyPhone ?? '0123456789',
      companyEmail: settings?.companyEmail ?? 'email@example.com',
      companyTaxCode: settings?.companyTaxCode ?? '0301234567',
      invoiceTemplateHtml: printHtml,
      invoiceTemplatePaperSize: paperSize,
    });
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm('Bỏ các thay đổi chưa lưu và quay lại?')) return;
    setHtml(initialHtml);
    setPaperSize(initialPaperSize);
    navigate('/settings');
  };

  // WYSIWYG command executers
  const execCmd = (cmd: string, val: string = '') => {
    if (mode !== 'editor') return;
    document.execCommand(cmd, false, val);
  };

  const insertHTML = (htmlStr: string) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const el = document.createElement('div');
    el.innerHTML = htmlStr;
    const frag = document.createDocumentFragment();
    let node;
    while ((node = el.firstChild)) {
      frag.appendChild(node);
    }
    range.insertNode(frag);
    // Di chuyển con trỏ sau block vừa chèn
    range.collapse(false);
  };

  const handleInsertToken = (tokenKey: string) => {
    if (mode === 'editor') {
      const spanHtml = `<span class="bg-blue-100 text-blue-800 font-semibold px-1 py-0.5 rounded text-xs select-all mx-0.5 inline-block border border-blue-200" data-token="${tokenKey}" contenteditable="false">{${tokenKey}}</span>&nbsp;`;
      insertHTML(spanHtml);
      // Kích hoạt onInput cho contenteditable
      const editorDiv = document.querySelector('[contenteditable="true"]');
      if (editorDiv) {
        setHtml(editorDiv.innerHTML);
      }
    } else if (mode === 'html') {
      insertAtCursor(`{${tokenKey}}`);
    }
  };

  const handleInsertTable = () => {
    const rows = Number(prompt('Nhập số hàng cho bảng:', '4') || 4);
    const cols = Number(prompt('Nhập số cột cho bảng:', '4') || 4);
    if (!rows || !cols) return;

    let tableHtml = '<table style="width:100%; border-collapse:collapse; margin:10px 0; font-size:11px;"><thead><tr style="background:#f2f2f2;">';
    for (let c = 0; c < cols; c++) {
      tableHtml += '<th style="border:1px solid #ddd; padding:6px; font-weight:bold;">Tiêu đề</th>';
    }
    tableHtml += '</tr></thead><tbody>';
    for (let r = 0; r < rows; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < cols; c++) {
        tableHtml += '<td style="border:1px solid #ddd; padding:6px;">Ô dữ liệu</td>';
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table>';

    if (mode === 'editor') {
      insertHTML(tableHtml);
      const editorDiv = document.querySelector('[contenteditable="true"]');
      if (editorDiv) setHtml(editorDiv.innerHTML);
    } else if (mode === 'html') {
      insertAtCursor(tableHtml);
    }
  };

  const handleInsertImage = () => {
    const url = prompt('Nhập đường dẫn ảnh URL:', 'https://picsum.photos/120/60');
    if (!url) return;
    const imgHtml = `<img src="${url}" style="max-width:120px; max-height:60px; display:inline-block; vertical-align:middle;" />`;
    if (mode === 'editor') {
      insertHTML(imgHtml);
      const editorDiv = document.querySelector('[contenteditable="true"]');
      if (editorDiv) setHtml(editorDiv.innerHTML);
    } else if (mode === 'html') {
      insertAtCursor(imgHtml);
    }
  };

  const insertAtCursor = (text: string) => {
    if (!canEdit) return;
    if (textareaRef.current) {
      const el = textareaRef.current;
      const start = el.selectionStart ?? html.length;
      const end = el.selectionEnd ?? html.length;
      const next = html.slice(0, start) + text + html.slice(end);
      setHtml(next);
      requestAnimationFrame(() => {
        el.focus();
        const pos = start + text.length;
        el.setSelectionRange(pos, pos);
      });
    } else {
      setHtml((prev) => prev + text);
    }
  };

  const selectedBlock = useMemo(() => {
    return schema.blocks.find((b) => b.id === selectedBlockId);
  }, [schema.blocks, selectedBlockId]);

  if (isLoading) return <LoadingState label="Đang tải mẫu in hóa đơn..." />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-h-screen bg-gray-50 overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b bg-white px-6 py-3 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900">Mẫu in hóa đơn bán hàng</h1>
                {isDirty && (
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 animate-pulse">
                    Có thay đổi chưa lưu
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">Tùy chỉnh thông tin, bố cục và kích thước in theo nhu cầu cửa hàng.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mode Switch tabs */}
            <div className="flex p-0.5 bg-gray-100 rounded-lg border">
              <button
                type="button"
                onClick={() => handleModeChange('editor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  mode === 'editor' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Soạn thảo
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('visual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  mode === 'visual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Layout className="h-3.5 w-3.5" />
                Kéo thả
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('html')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  mode === 'html' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                HTML
              </button>
            </div>

            <div className="h-6 w-px bg-gray-200"></div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Hủy
              </Button>
              {canEdit && (
                <>
                  <Button variant="outline" size="sm" onClick={handleRestoreDefault}>
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5 text-gray-500" />
                    Khôi phục mặc định
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestPrint}
                    className="text-[#1E88E5] hover:text-[#1565C0] hover:bg-blue-50 border-[#1E88E5]/30"
                  >
                    <Printer className="mr-1.5 h-3.5 w-3.5" />
                    In thử
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={updateMut.isPending || !isDirty}
                    className="bg-[#1E88E5] hover:bg-[#1565C0] text-white font-medium shadow-sm"
                  >
                    {updateMut.isPending ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="mr-1.5 h-3.5 w-3.5" />
                        Lưu mẫu
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {!canEdit && (
          <div className="bg-amber-50 px-6 py-1.5 text-xs text-amber-800 shrink-0 border-b border-amber-100">
            ⚠️ Bạn đang ở chế độ xem. Chỉ quản trị viên (ADMIN) mới có quyền chỉnh sửa và lưu mẫu in.
          </div>
        )}

        {/* Configuration settings bar (Tên mẫu, gợi ý, khổ giấy) */}
        <div className="bg-white border-b px-6 py-2 flex flex-wrap items-center gap-4 shrink-0 shadow-sm text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">Tên mẫu in:</span>
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="h-8 text-xs w-48 bg-gray-50"
              placeholder="Tên mẫu in hóa đơn..."
              disabled={!canEdit}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">Mẫu gợi ý:</span>
            <select
              onChange={(e) => handleSuggestTemplateChange(e.target.value)}
              defaultValue=""
              className="h-8 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={!canEdit}
            >
              <option value="" disabled>-- Chọn mẫu gợi ý --</option>
              <option value="A5_sales">Khổ A5 - Mẫu bán hàng</option>
              <option value="A5_compact">Khổ A5 - Tối ưu nhiều hàng</option>
              <option value="A4_full">Khổ A4 - Mẫu đầy đủ</option>
              <option value="K80_retail">Khổ K80 - Mẫu bán lẻ</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">Khổ giấy in:</span>
            <select
              value={paperSize}
              onChange={(e) => handlePaperSizeSelect(e.target.value as any)}
              className="h-8 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={!canEdit}
            >
              <option value="A5">A5</option>
              <option value="A4">A4</option>
              <option value="K80">K80 (Hóa đơn nhiệt)</option>
            </select>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {mode === 'editor' ? (
            /* =================================================================
               1. CHẾ ĐỘ SOẠN THẢO WYSIWYG (WYSIWYG MODE)
               ================================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0 overflow-y-auto lg:overflow-hidden p-4 bg-gray-100/50 w-full">
              {/* Left Column: Toolbar + Editor Canvas */}
              <div className="flex flex-col min-w-0 h-[600px] lg:h-full bg-white rounded-lg border shadow-sm overflow-hidden">
                {/* Text Formatting Toolbar */}
                <div className="w-full bg-white border-b p-2 flex flex-wrap items-center gap-1 shrink-0 z-20 shadow-sm">
                  
                  {/* Font Select */}
                  <select
                    onChange={(e) => execCmd('fontName', e.target.value)}
                    className="h-7 border rounded text-[10px] px-1 bg-gray-50 focus:outline-none"
                    title="Font chữ"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Inter">Inter</option>
                  </select>

                  {/* Size Select */}
                  <select
                    onChange={(e) => execCmd('fontSize', e.target.value)}
                    className="h-7 border rounded text-[10px] px-1 bg-gray-50 focus:outline-none"
                    title="Cỡ chữ"
                  >
                    <option value="2">Nhỏ (10px)</option>
                    <option value="3">Vừa (12px)</option>
                    <option value="4">Lớn (14px)</option>
                    <option value="5">Rất lớn (18px)</option>
                    <option value="6">Tiêu đề (24px)</option>
                  </select>

                  <div className="h-5 w-px bg-gray-200 mx-1"></div>

                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => execCmd('bold')} title="Chữ đậm"><Bold className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => execCmd('italic')} title="Chữ nghiêng"><Italic className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => execCmd('underline')} title="Gạch chân"><Underline className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => execCmd('strikeThrough')} title="Gạch ngang"><Strikethrough className="h-3.5 w-3.5" /></Button>
                  
                  <div className="h-5 w-px bg-gray-200 mx-1"></div>

                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => execCmd('justifyLeft')} title="Căn trái"><AlignLeft className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => execCmd('justifyCenter')} title="Căn giữa"><AlignCenter className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => execCmd('justifyRight')} title="Căn phải"><AlignRight className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => execCmd('justifyFull')} title="Căn đều"><AlignJustify className="h-3.5 w-3.5" /></Button>

                  <div className="h-5 w-px bg-gray-200 mx-1"></div>

                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => execCmd('insertUnorderedList')} title="Danh sách chấm"><List className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => execCmd('insertOrderedList')} title="Danh sách số"><ListOrdered className="h-3.5 w-3.5" /></Button>

                  <div className="h-5 w-px bg-gray-200 mx-1"></div>

                  {/* Font Color select */}
                  <select
                    onChange={(e) => execCmd('foreColor', e.target.value)}
                    className="h-7 border rounded text-[10px] px-1 bg-gray-50 focus:outline-none"
                    title="Màu chữ"
                  >
                    <option value="#000000">Màu chữ: Đen</option>
                    <option value="#555555">Xám</option>
                    <option value="#d32f2f">Đỏ</option>
                    <option value="#1976d2">Xanh dương</option>
                    <option value="#2e7d32">Xanh lá</option>
                    <option value="#ed6c02">Cam</option>
                  </select>

                  {/* Back Color select */}
                  <select
                    onChange={(e) => execCmd('hiliteColor', e.target.value)}
                    className="h-7 border rounded text-[10px] px-1 bg-gray-50 focus:outline-none"
                    title="Màu nền"
                  >
                    <option value="transparent">Nền: Không màu</option>
                    <option value="#fff9c4">Vàng nhạt</option>
                    <option value="#e3f2fd">Xanh nhạt</option>
                    <option value="#e8f5e9">Lá nhạt</option>
                    <option value="#f5f5f5">Xám nhạt</option>
                  </select>

                  <div className="h-5 w-px bg-gray-200 mx-1"></div>

                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleInsertTable} title="Chèn bảng"><Grid className="h-3.5 w-3.5" /></Button>

                  {/* Dropdown Menu thao tác Bảng */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!activeTable}
                        className={`h-7 px-2 text-[10px] font-semibold flex items-center gap-1 transition-all ${
                          activeTable ? 'border-blue-500/50 text-blue-600 bg-blue-50/50 hover:bg-blue-100/70' : 'text-gray-400 border-gray-200'
                        }`}
                        title="Các thao tác điều chỉnh bảng"
                      >
                        <Table className="h-3.5 w-3.5" />
                        Bảng
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 text-xs bg-white border shadow-md rounded-md p-1 z-30">
                      <DropdownMenuItem onClick={handleInsertColLeft} className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 rounded">Thêm cột bên trái</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleInsertColRight} className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 rounded">Thêm cột bên phải</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDeleteCol} className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 text-red-600 rounded">Xóa cột hiện tại</DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1 border-t" />
                      <DropdownMenuItem onClick={handleInsertRowAbove} className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 rounded">Thêm dòng phía trên</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleInsertRowBelow} className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 rounded">Thêm dòng phía dưới</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDeleteRow} className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 text-red-600 rounded">Xóa dòng hiện tại</DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1 border-t" />
                      
                      <DropdownMenuItem onClick={() => handleSetTableWidth('100%')} className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 rounded">Bản rộng 100% (Vừa khổ)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSetTableWidth('90%')} className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 rounded">Chiều rộng 90%</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSetTableWidth('80%')} className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 rounded">Chiều rộng 80%</DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1 border-t" />
                      <DropdownMenuItem onClick={() => handleSetTableAlign('left')} className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 rounded">Căn trái bảng</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSetTableAlign('center')} className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 rounded">Căn giữa bảng</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSetTableAlign('right')} className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 rounded">Căn phải bảng</DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1 border-t" />
                      <DropdownMenuItem onClick={handleDistributeColumns} className="cursor-pointer px-2 py-1.5 hover:bg-gray-100 rounded">Chia đều các cột</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleOptimizeForA5} className="cursor-pointer px-2 py-1.5 hover:bg-blue-50 text-blue-600 font-semibold rounded bg-blue-50/20">
                        ⚡ Tối ưu cho A5
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1 border-t" />
                      <DropdownMenuItem onClick={handleDeleteTable} className="cursor-pointer px-2 py-1.5 hover:bg-red-50 text-red-600 font-semibold rounded bg-red-50/20">
                        Xóa bảng này
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleInsertImage} title="Chèn ảnh"><ImageIcon className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleInsertToken('Ma_QR')} title="Chèn QR Code"><QrCode className="h-3.5 w-3.5" /></Button>

                  {/* Insert token select */}
                  <select
                    onChange={(e) => {
                      handleInsertToken(e.target.value);
                      e.target.value = ''; // Reset select
                    }}
                    value=""
                    className="h-7 border rounded text-[10px] px-1.5 bg-blue-50 text-blue-800 font-bold focus:outline-none ml-auto"
                    title="Chèn dữ liệu"
                  >
                    <option value="" disabled>+ Chèn dữ liệu</option>
                    {kiotVietTokenGroups.map((g) => (
                      <optgroup key={g.group} label={g.group}>
                        {g.tokens.map((t) => (
                          <option key={t.key} value={t.key}>{t.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Editor Container simulating paper page */}
                <div className="flex-1 bg-gray-100/50 p-4 overflow-y-auto flex justify-center items-start">
                  <div
                    className={`bg-white shadow-lg border border-gray-300 transition-all rounded p-1 mx-auto relative shrink-0 w-full ${
                      paperSize === 'A5' 
                        ? 'max-w-[500px] min-h-[700px]' 
                        : paperSize === 'A4' 
                        ? 'max-w-[620px] min-h-[850px]' 
                        : 'max-w-[320px] min-h-[500px]'
                    }`}
                  >
                    <WysiwygEditor 
                      value={html} 
                      onChange={setHtml} 
                      readOnly={!canEdit} 
                      editorRef={editorDivRef}
                      onTableSelect={(table, cell) => {
                        setActiveTable(table);
                        setActiveCell(cell);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Preview Model */}
              <div className="flex flex-col min-w-0 h-[600px] lg:h-full bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between shrink-0 shadow-sm">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Xem trước mẫu in</span>
                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">Dữ liệu mẫu</span>
                </div>

                <div className="flex-1 bg-gray-100/50 p-4 overflow-y-auto flex justify-center items-start">
                  <div
                    className={`bg-white shadow-xl border border-gray-300 transition-all rounded p-1 mx-auto relative shrink-0 w-full ${
                      paperSize === 'A4'
                        ? 'max-w-[580px] aspect-[210/297]'
                        : paperSize === 'K80'
                        ? 'w-[300px]'
                        : 'max-w-[480px] aspect-[148/210]'
                    }`}
                  >
                    <iframe
                      title="Xem trước WYSIWYG"
                      srcDoc={previewHtmlForHtmlAndEditorMode}
                      className="w-full h-full border-0 bg-white"
                      style={{
                        minHeight: paperSize === 'K80' ? '550px' : '100%',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : mode === 'visual' ? (
            /* =================================================================
               2. CHẾ ĐỘ THIẾT KẾ KÉO THẢ (VISUAL BLOCK MODE)
               ================================================================= */
            <>
              {/* SIDEBAR LEFT: Block categories */}
              <div className="w-[280px] border-r bg-gray-50/50 flex flex-col overflow-y-auto shrink-0 p-4">
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                    Thư viện khối mẫu in
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1">Kéo thả khối vào canvas hoặc click để thêm.</p>
                </div>

                <div className="space-y-4">
                  {blockCategories.map((cat) => (
                    <div key={cat.label} className="space-y-1.5">
                      <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-wider px-1">{cat.label}</h4>
                      <div className="grid gap-1.5">
                        {cat.blocks.map((b) => (
                          <DraggableLibBlock
                            key={b.type}
                            type={b.type}
                            title={b.title}
                            description={b.description}
                            icon={b.icon}
                            onAdd={() => handleAddBlock(b.type)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sắp xếp cấu trúc */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                    Cấu trúc bản in ({schema.blocks.length} khối)
                  </h3>
                  <div className="space-y-1.5">
                    {schema.blocks.map((b, idx) => (
                      <SortableBlockItem
                        key={b.id}
                        block={b}
                        index={idx}
                        isSelected={selectedBlockId === b.id}
                        onSelect={() => setSelectedBlockId(b.id)}
                        onMove={handleMoveBlock}
                        onDelete={() => handleDeleteBlock(b.id)}
                        onToggleVisibility={() => handleToggleBlockVisibility(b.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* CANVAS (Middle columns) */}
              <div className="flex-1 bg-gray-100 overflow-y-auto p-6 flex justify-center items-start shadow-inner">
                <div className="w-full max-w-[420px] relative">
                  {/* Paper Frame */}
                  <div
                    className={`bg-white shadow-xl border border-gray-300 transition-all rounded p-1 mx-auto relative ${
                      schema.paperSize === 'A5' ? 'aspect-[148/210] w-[380px]' : 'aspect-[210/297] w-[410px]'
                    }`}
                  >
                    {/* Safe margins indicator lines */}
                    <div
                      className="absolute inset-0 border border-dashed border-blue-200 pointer-events-none"
                      style={{
                        top: `${schema.margins.top}px`,
                        right: `${schema.margins.right}px`,
                        bottom: `${schema.margins.bottom}px`,
                        left: `${schema.margins.left}px`,
                      }}
                    />

                    {/* Safe area label */}
                    <div className="absolute right-2 top-2 bg-blue-50 text-blue-600 text-[8px] font-bold px-1 py-0.5 rounded border border-blue-200 pointer-events-none">
                      VÙNG IN AN TOÀN ({schema.paperSize})
                    </div>

                    {/* Rendered content with margins */}
                    <div
                      className="w-full h-full overflow-y-auto"
                      onClick={() => setSelectedBlockId(null)}
                      style={{
                        paddingTop: `${schema.margins.top}px`,
                        paddingRight: `${schema.margins.right}px`,
                        paddingBottom: `${schema.margins.bottom}px`,
                        paddingLeft: `${schema.margins.left}px`,
                        fontFamily: 'Arial, sans-serif',
                      }}
                    >
                      <CanvasDropZone onDrop={handleDropBlock} blocks={schema.blocks}>
                        {schema.blocks.map((b, idx) => (
                          <CanvasBlockWrapper
                            key={b.id}
                            block={b}
                            index={idx}
                            isSelected={selectedBlockId === b.id}
                            onSelect={() => setSelectedBlockId(b.id)}
                            onMove={handleMoveBlock}
                            onDelete={() => handleDeleteBlock(b.id)}
                            onToggleVisibility={() => handleToggleBlockVisibility(b.id)}
                            primaryColor={schema.primaryColor}
                          />
                        ))}
                      </CanvasDropZone>
                    </div>
                  </div>
                </div>
              </div>

              {/* INSPECTOR RIGHT: Block Properties */}
              <div className="w-[300px] border-l bg-white flex flex-col overflow-y-auto shrink-0 shadow-lg p-5">
                {selectedBlock ? (
                  <div className="space-y-6">
                    {/* Inspector Title */}
                    <div className="border-b pb-3 flex justify-between items-center">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Thuộc tính khối</h3>
                        <p className="text-sm font-bold text-gray-800 capitalize mt-0.5">
                          {selectedBlock.type.replace(/-/g, ' ')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedBlockId(null)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Spacing & alignment */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Khoảng cách trên</span>
                          <span className="font-semibold text-gray-900">{selectedBlock.style.marginTop || 0}px</span>
                        </div>
                        <Slider
                          value={[selectedBlock.style.marginTop || 0]}
                          onValueChange={([val]) => handleUpdateBlock({ ...selectedBlock, style: { ...selectedBlock.style, marginTop: val } })}
                          max={60}
                          step={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Khoảng cách dưới</span>
                          <span className="font-semibold text-gray-900">{selectedBlock.style.marginBottom || 0}px</span>
                        </div>
                        <Slider
                          value={[selectedBlock.style.marginBottom || 0]}
                          onValueChange={([val]) => handleUpdateBlock({ ...selectedBlock, style: { ...selectedBlock.style, marginBottom: val } })}
                          max={60}
                          step={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Cỡ chữ hiển thị</span>
                          <span className="font-semibold text-gray-900">{selectedBlock.style.fontSize || 11}px</span>
                        </div>
                        <Slider
                          value={[selectedBlock.style.fontSize || 11]}
                          onValueChange={([val]) => handleUpdateBlock({ ...selectedBlock, style: { ...selectedBlock.style, fontSize: val } })}
                          min={8}
                          max={22}
                          step={0.5}
                        />
                      </div>

                      {['header', 'invoice-title', 'footer', 'totals'].includes(selectedBlock.type) && (
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-gray-700">Căn lề chữ</Label>
                          <div className="flex gap-1">
                            {(['left', 'center', 'right'] as const).map((align) => (
                              <Button
                                key={align}
                                size="sm"
                                variant={selectedBlock.style.textAlign === align ? 'default' : 'outline'}
                                className="flex-1 py-1"
                                onClick={() => handleUpdateBlock({ ...selectedBlock, style: { ...selectedBlock.style, textAlign: align } })}
                              >
                                {align === 'left' && <AlignLeft className="h-3.5 w-3.5" />}
                                {align === 'center' && <AlignCenter className="h-3.5 w-3.5" />}
                                {align === 'right' && <AlignRight className="h-3.5 w-3.5" />}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Block specific settings */}
                    <div className="border-t pt-4 space-y-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Cấu hình nội dung</h4>

                      {selectedBlock.type === 'header' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Tên cửa hàng</span>
                            <Switch checked={selectedBlock.showCompanyName} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showCompanyName: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Địa chỉ</span>
                            <Switch checked={selectedBlock.showAddress} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showAddress: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện SĐT liên hệ</span>
                            <Switch checked={selectedBlock.showPhone} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showPhone: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Email</span>
                            <Switch checked={selectedBlock.showEmail} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showEmail: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Mã số thuế</span>
                            <Switch checked={selectedBlock.showTaxCode} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showTaxCode: v })} />
                          </div>
                        </div>
                      )}

                      {selectedBlock.type === 'invoice-title' && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] text-gray-500">Tiêu đề lớn</Label>
                            <Input value={selectedBlock.title || ''} onChange={(e) => handleUpdateBlock({ ...selectedBlock, title: e.target.value })} className="h-8 text-xs" />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Mã hóa đơn</span>
                            <Switch checked={selectedBlock.showInvoiceCode} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showInvoiceCode: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Viền nét đứt y-axis</span>
                            <Switch checked={selectedBlock.showBorder} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showBorder: v })} />
                          </div>
                        </div>
                      )}

                      {selectedBlock.type === 'customer-info' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Tên khách</span>
                            <Switch checked={selectedBlock.showName} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showName: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Địa chỉ</span>
                            <Switch checked={selectedBlock.showAddress} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showAddress: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Số điện thoại</span>
                            <Switch checked={selectedBlock.showPhone} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showPhone: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện MST khách</span>
                            <Switch checked={selectedBlock.showTaxCode} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showTaxCode: v })} />
                          </div>
                        </div>
                      )}

                      {selectedBlock.type === 'invoice-meta' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Ngày tạo</span>
                            <Switch checked={selectedBlock.showCreatedDate} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showCreatedDate: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Ngày đến hạn</span>
                            <Switch checked={selectedBlock.showDueDate} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showDueDate: v })} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-gray-500">Bố cục hiển thị</Label>
                            <div className="grid grid-cols-2 gap-1 mt-1 p-0.5 bg-gray-100 rounded border text-xs">
                              <button
                                type="button"
                                onClick={() => handleUpdateBlock({ ...selectedBlock, layout: 'single-column' })}
                                className={`py-1 text-[10px] font-semibold rounded ${
                                  selectedBlock.layout === 'single-column' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                              >
                                1 Cột dọc
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateBlock({ ...selectedBlock, layout: 'two-columns' })}
                                className={`py-1 text-[10px] font-semibold rounded ${
                                  selectedBlock.layout === 'two-columns' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                              >
                                2 Cột ngang
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedBlock.type === 'items-table' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện header bảng</span>
                            <Switch checked={selectedBlock.showHeader} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showHeader: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện viền ô (border)</span>
                            <Switch checked={selectedBlock.showBorders} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showBorders: v })} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-gray-500">Các cột hiển thị</Label>
                            <div className="border rounded p-2 space-y-1.5 text-xs bg-gray-50">
                              <div className="flex items-center justify-between">
                                <span>Cột STT</span>
                                <Switch checked={selectedBlock.columns.stt} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, columns: { ...selectedBlock.columns, stt: v } })} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Cột Tên hàng</span>
                                <Switch checked={selectedBlock.columns.name} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, columns: { ...selectedBlock.columns, name: v } })} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Cột Đơn vị</span>
                                <Switch checked={selectedBlock.columns.unit} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, columns: { ...selectedBlock.columns, unit: v } })} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Cột Số lượng</span>
                                <Switch checked={selectedBlock.columns.quantity} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, columns: { ...selectedBlock.columns, quantity: v } })} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Cột Đơn giá</span>
                                <Switch checked={selectedBlock.columns.price} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, columns: { ...selectedBlock.columns, price: v } })} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Cột Giảm giá (CK)</span>
                                <Switch checked={selectedBlock.columns.discount} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, columns: { ...selectedBlock.columns, discount: v } })} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Cột Thuế VAT</span>
                                <Switch checked={selectedBlock.columns.tax} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, columns: { ...selectedBlock.columns, tax: v } })} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Cột Thành tiền</span>
                                <Switch checked={selectedBlock.columns.amount} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, columns: { ...selectedBlock.columns, amount: v } })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedBlock.type === 'totals' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Tạm tính</span>
                            <Switch checked={selectedBlock.showSubtotal} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showSubtotal: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Giảm giá</span>
                            <Switch checked={selectedBlock.showDiscount} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showDiscount: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Thuế VAT</span>
                            <Switch checked={selectedBlock.showTax} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showTax: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Phí vận chuyển</span>
                            <Switch checked={selectedBlock.showShipping} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showShipping: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Tổng cộng</span>
                            <Switch checked={selectedBlock.showGrandTotal} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showGrandTotal: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Đã thanh toán</span>
                            <Switch checked={selectedBlock.showPaid} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showPaid: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện Còn lại</span>
                            <Switch checked={selectedBlock.showRemaining} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showRemaining: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Đọc số tiền bằng chữ</span>
                            <Switch checked={selectedBlock.showInWords} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showInWords: v })} />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>Độ rộng tổng số ({selectedBlock.width || 240}px)</span>
                            </div>
                            <Slider
                              value={[selectedBlock.width || 240]}
                              onValueChange={([val]) => handleUpdateBlock({ ...selectedBlock, width: val })}
                              min={120}
                              max={320}
                              step={10}
                            />
                          </div>
                        </div>
                      )}

                      {selectedBlock.type === 'payment-info' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện TK Ngân hàng</span>
                            <Switch checked={selectedBlock.showBankInfo} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showBankInfo: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Hiện QR chuyển tiền</span>
                            <Switch checked={selectedBlock.showQRCode} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showQRCode: v })} />
                          </div>
                        </div>
                      )}

                      {selectedBlock.type === 'signature' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span>Ký của Người mua hàng</span>
                            <Switch checked={selectedBlock.showSellerSignature} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showSellerSignature: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Ký của Người bán hàng</span>
                            <Switch checked={selectedBlock.showCustomerSignature} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showCustomerSignature: v })} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-gray-500">Hiển thị ký tên</Label>
                            <div className="grid grid-cols-2 gap-1 mt-1 p-0.5 bg-gray-100 rounded border text-xs">
                              <button
                                type="button"
                                onClick={() => handleUpdateBlock({ ...selectedBlock, layout: 'single-column' })}
                                className={`py-1 text-[10px] font-semibold rounded ${
                                  selectedBlock.layout === 'single-column' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                              >
                                Chồng dọc
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateBlock({ ...selectedBlock, layout: 'two-columns' })}
                                className={`py-1 text-[10px] font-semibold rounded ${
                                  selectedBlock.layout === 'two-columns' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                              >
                                Song song
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedBlock.type === 'footer' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span>Lời cảm ơn mặc định</span>
                            <Switch checked={selectedBlock.showThankYou} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showThankYou: v })} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Điều khoản đổi trả hàng</span>
                            <Switch checked={selectedBlock.showTerms} onCheckedChange={(v) => handleUpdateBlock({ ...selectedBlock, showTerms: v })} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-gray-500">Ghi chú riêng</Label>
                            <Input value={selectedBlock.customText || ''} onChange={(e) => handleUpdateBlock({ ...selectedBlock, customText: e.target.value })} className="h-8 text-xs" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-6 space-y-3">
                    <Settings2 className="h-8 w-8 text-gray-300" />
                    <div>
                      <p className="text-xs font-bold text-gray-700">Thiết lập thuộc tính</p>
                      <p className="text-[10px] mt-1 text-gray-400">Chọn một khối bất kỳ trên canvas để tiến hành tinh chỉnh thuộc tính chi tiết.</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* =================================================================
               3. CHẾ ĐỘ BIÊN TẬP HTML (HTML EDITOR MODE)
               ================================================================= */
            <div className="flex flex-1 min-h-0 overflow-hidden relative w-full">
              {/* SIDEBAR LEFT: Token list */}
              {showTokenSidebar && (
                <div className="w-[280px] border-r bg-white flex flex-col overflow-y-auto shrink-0 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5 text-blue-500" />
                      Chèn Token Placeholder
                    </h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowTokenSidebar(false)} title="Ẩn danh sách token">
                      <X className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                  </div>

                  <div className="space-y-3 flex-1">
                    {TEMPLATE_PLACEHOLDER_GROUPS.map((g) => {
                      const groupTitle = g.group.split(' — ')[0];
                      return (
                        <div key={g.group} className="border rounded-md overflow-hidden bg-gray-50/30">
                          <div className="bg-gray-100/50 px-2 py-1 text-[10px] font-bold text-gray-600 uppercase border-b">{groupTitle}</div>
                          <div className="p-2 flex flex-wrap gap-1">
                            {g.items.map((it) => (
                              <button
                                key={it}
                                type="button"
                                onClick={() => insertAtCursor(`{{${it}}}`)}
                                className="text-[10px] font-mono text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-100 hover:border-blue-600 px-1.5 py-0.5 rounded transition-all"
                                title={`Chèn {{${it}}}`}
                              >
                                {`{{${it}}}`}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    <div className="border rounded-md p-2 bg-amber-50/30 border-amber-100 space-y-1.5">
                      <div className="text-[10px] font-bold text-amber-700 uppercase">Khối lặp danh sách sản phẩm</div>
                      <button
                        type="button"
                        onClick={() => insertAtCursor(ITEMS_BLOCK_SNIPPET)}
                        className="w-full text-left font-mono text-[9px] text-amber-800 bg-amber-50 hover:bg-amber-100 p-2 rounded border border-amber-200 transition-all block whitespace-pre-wrap break-all"
                      >
                        {`{{#items}}...{{/items}}`}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 50/50 responsive grid split for Editor and Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0 overflow-y-auto lg:overflow-hidden p-4 bg-gray-100/50">
                {/* EDITOR COLUMN */}
                <div className="flex flex-col min-w-0 h-[600px] lg:h-full bg-white rounded-lg border shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      {!showTokenSidebar && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowTokenSidebar(true)}
                          className="h-7 px-2 text-[10px] font-semibold border-blue-500/30 text-blue-600 hover:bg-blue-50"
                          title="Hiện danh sách token"
                        >
                          <ChevronRight className="mr-1 h-3.5 w-3.5" />
                          Hiện Token
                        </Button>
                      )}
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Trình soạn mã HTML</span>
                    </div>
                    <span className="text-[9px] text-gray-400">Trình soạn thảo mã nguồn có cú pháp đầy đủ màu sắc.</span>
                  </div>
                  <div className="flex-1 min-h-0 relative">
                    <Editor
                      height="100%"
                      defaultLanguage="html"
                      value={html}
                      onChange={(val) => setHtml(val || '')}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 12,
                        wordWrap: 'on',
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </div>

                {/* PREVIEW COLUMN */}
                <div className="flex flex-col min-w-0 h-[600px] lg:h-full bg-white rounded-lg border shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between shrink-0 shadow-sm">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Xem trước bản in</span>
                    <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">Mẫu thật</span>
                  </div>

                  <div className="flex-1 bg-gray-100/50 p-4 overflow-y-auto flex justify-center items-start">
                    <div
                      className={`bg-white shadow-xl border border-gray-300 transition-all rounded p-1 mx-auto relative shrink-0 w-full ${
                        paperSize === 'A4'
                          ? 'max-w-[580px] aspect-[210/297]'
                          : paperSize === 'K80'
                          ? 'w-[300px]'
                          : 'max-w-[480px] aspect-[148/210]'
                      }`}
                    >
                      <iframe
                        title="Xem trước hóa đơn HTML"
                        srcDoc={previewHtmlForHtmlAndEditorMode}
                        className="w-full h-full border-0 bg-white"
                        style={{
                          minHeight: paperSize === 'K80' ? '550px' : '100%',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </DndProvider>
  );
}
