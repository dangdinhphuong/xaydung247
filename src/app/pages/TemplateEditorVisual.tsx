import { useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import {
  ArrowLeft,
  Save,
  Eye,
  FileDown,
  Code2,
  Layout,
  GripVertical,
  Settings2,
  Trash2,
  EyeOff,
  Plus,
  FileText,
  User,
  Calendar,
  Table,
  DollarSign,
  CreditCard,
  PenTool,
  MessageSquare,
  ZoomIn,
  ZoomOut,
  Copy,
  Move,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Slider } from '../components/ui/slider';
import { cn } from '../components/ui/utils';
import { TemplatePreview } from '../components/TemplatePreview';
import { FilteredLink } from '../components/FilteredLink';
import type { TemplateSchema, TemplateBlock, BlockType } from '../types/template';
import { defaultTemplateSchema, sampleData } from '../utils/defaultTemplate';
import { schemaToHTML } from '../utils/templateConverter';

type EditorMode = 'visual' | 'html';
type ZoomLevel = 50 | 75 | 100 | 'fit';

const blockCategories = [
  {
    label: 'Đầu trang',
    blocks: [
      { type: 'header' as BlockType, icon: FileText, title: 'Thông tin đơn vị', description: 'Logo, tên công ty' },
      { type: 'invoice-title' as BlockType, icon: FileText, title: 'Tiêu đề hóa đơn', description: 'HÓA ĐƠN BÁN HÀNG' },
    ],
  },
  {
    label: 'Khách hàng',
    blocks: [
      { type: 'customer-info' as BlockType, icon: User, title: 'Thông tin khách', description: 'Tên, địa chỉ' },
      { type: 'invoice-meta' as BlockType, icon: Calendar, title: 'Thông tin HĐ', description: 'Mã, ngày' },
    ],
  },
  {
    label: 'Nội dung',
    blocks: [
      { type: 'items-table' as BlockType, icon: Table, title: 'Bảng mặt hàng', description: 'Danh sách SP' },
      { type: 'totals' as BlockType, icon: DollarSign, title: 'Tổng tiền', description: 'Tổng cộng' },
    ],
  },
  {
    label: 'Chân trang',
    blocks: [
      { type: 'payment-info' as BlockType, icon: CreditCard, title: 'TT thanh toán', description: 'Ngân hàng' },
      { type: 'signature' as BlockType, icon: PenTool, title: 'Chữ ký', description: 'Ký tên' },
      { type: 'footer' as BlockType, icon: MessageSquare, title: 'Ghi chú', description: 'Lời cảm ơn' },
    ],
  },
];

interface DraggableLibraryBlockProps {
  blockConfig: {
    type: BlockType;
    icon: any;
    title: string;
    description: string;
  };
  onAdd: () => void;
}

function DraggableLibraryBlock({ blockConfig, onAdd }: DraggableLibraryBlockProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'NEW_BLOCK',
    item: { blockType: blockConfig.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const Icon = blockConfig.icon;

  return (
    <button
      ref={drag}
      onClick={onAdd}
      className={cn(
        'group flex w-full items-center gap-2.5 rounded-lg border bg-white p-2.5 text-left transition-all duration-200 hover:border-[#1E88E5] hover:shadow-lg hover:-translate-y-0.5',
        isDragging ? 'opacity-50 scale-95 shadow-lg ring-2 ring-[#1E88E5]/30' : 'border-gray-200 shadow-sm'
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 transition-all duration-200 group-hover:bg-blue-100 group-hover:scale-110">
        <Icon className="h-4 w-4 text-[#1E88E5]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-900">
          {blockConfig.title}
        </div>
        <div className="text-[10px] text-gray-500 truncate">
          {blockConfig.description}
        </div>
      </div>
      <Plus className="h-3.5 w-3.5 text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-110" />
    </button>
  );
}

interface DraggableBlockProps {
  block: TemplateBlock;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}

function DraggableBlock({
  block,
  index,
  isSelected,
  onSelect,
  onMove,
  onDelete,
  onToggleVisibility,
}: DraggableBlockProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'BLOCK',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'BLOCK',
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

  const getBlockTitle = (type: BlockType): string => {
    const titles: Record<BlockType, string> = {
      header: 'Thông tin đơn vị',
      'invoice-title': 'Tiêu đề hóa đơn',
      'customer-info': 'Thông tin khách hàng',
      'invoice-meta': 'Thông tin hóa đơn',
      'items-table': 'Bảng mặt hàng',
      totals: 'Tổng tiền',
      'payment-info': 'Thông tin thanh toán',
      signature: 'Chữ ký',
      footer: 'Chân trang',
    };
    return titles[type];
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      onClick={onSelect}
      className={cn(
        'group relative cursor-pointer rounded-lg border bg-white p-2.5 transition-all hover:shadow-md',
        isSelected ? 'border-[#1E88E5] shadow-md ring-2 ring-[#1E88E5]/20' : 'border-gray-200',
        isDragging && 'opacity-50',
        !block.visible && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-2">
        <div className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50">
          <Icon className="h-4 w-4 text-[#1E88E5]" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-xs">{getBlockTitle(block.type)}</h4>
          <p className="mt-0.5 text-[10px] text-gray-500">
            {block.visible ? 'Hiển thị' : 'Ẩn'}
          </p>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
          >
            {block.visible ? (
              <Eye className="h-3.5 w-3.5 text-gray-500" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 text-gray-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface PreviewDropZoneProps {
  children: React.ReactNode;
  onDrop: (blockType: BlockType, index: number) => void;
  blocks: TemplateBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  zoom: number;
}

function PreviewDropZone({ children, onDrop, blocks, zoom }: PreviewDropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ['NEW_BLOCK', 'BLOCK'],
    drop: (item: { blockType?: BlockType; index?: number }) => {
      if (item.blockType) {
        onDrop(item.blockType, blocks.length);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={cn(
        'relative transition-all duration-200',
        isOver && 'ring-2 ring-[#1E88E5] ring-offset-4'
      )}
      style={{
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top center',
      }}
    >
      {children}
    </div>
  );
}

// Helper function to create default blocks
function createDefaultBlock(type: BlockType): TemplateBlock {
  const id = `${type}-${Date.now()}`;
  const commonStyle = { marginTop: 0, marginBottom: 20 };

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
        layout: 'logo-left',
        showLogo: true,
        showCompanyName: true,
        showAddress: true,
        showPhone: true,
      } as TemplateBlock;

    case 'invoice-title':
      return {
        ...baseBlock,
        align: 'center',
        fontSize: 24,
      } as TemplateBlock;

    case 'customer-info':
      return {
        ...baseBlock,
        layout: 'horizontal',
      } as TemplateBlock;

    case 'invoice-meta':
      return {
        ...baseBlock,
        layout: 'horizontal',
      } as TemplateBlock;

    case 'items-table':
      return {
        ...baseBlock,
        showBorders: true,
        columns: {
          stt: true,
          name: true,
          unit: true,
          quantity: true,
          price: true,
          total: true,
        },
      } as TemplateBlock;

    case 'totals':
      return {
        ...baseBlock,
        align: 'right',
        showSubtotal: true,
        showGrandTotal: true,
        showPaid: true,
        showDue: true,
      } as TemplateBlock;

    case 'payment-info':
      return {
        ...baseBlock,
        showBankInfo: true,
        showQRCode: false,
      } as TemplateBlock;

    case 'signature':
      return {
        ...baseBlock,
        showDate: true,
      } as TemplateBlock;

    case 'footer':
      return {
        ...baseBlock,
        align: 'center',
      } as TemplateBlock;

    default:
      return baseBlock as TemplateBlock;
  }
}

export default function TemplateEditorVisual() {
  const { id } = useParams();
  const [mode, setMode] = useState<EditorMode>('visual');
  const [schema, setSchema] = useState<TemplateSchema>(defaultTemplateSchema);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<ZoomLevel>(100);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  const generatedHTML = schemaToHTML(schema, sampleData);

  const handleModeChange = (newMode: EditorMode) => {
    if (mode === 'visual' && newMode === 'html') {
      setHtmlContent(generatedHTML);
    }
    setMode(newMode);
  };

  const handleAddBlock = (type: BlockType) => {
    const newBlock: TemplateBlock = createDefaultBlock(type);
    setSchema((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    setSelectedBlockId(newBlock.id);
  };

  const handleDropBlock = (blockType: BlockType, index: number) => {
    const newBlock: TemplateBlock = createDefaultBlock(blockType);
    setSchema((prev) => {
      const blocks = [...prev.blocks];
      blocks.splice(index, 0, newBlock);
      return { ...prev, blocks };
    });
    setSelectedBlockId(newBlock.id);
  };

  const handleMoveBlock = useCallback((fromIndex: number, toIndex: number) => {
    setSchema((prev) => {
      const blocks = [...prev.blocks];
      const [movedBlock] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, movedBlock);
      return { ...prev, blocks };
    });
  }, []);

  const handleToggleBlockVisibility = (blockId: string) => {
    setSchema((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.id === blockId ? { ...block, visible: !block.visible } : block
      ),
    }));
  };

  const handleDeleteBlock = (blockId: string) => {
    setSchema((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== blockId),
    }));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const handleUpdateBlock = (updatedBlock: TemplateBlock) => {
    setSchema((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) => (block.id === updatedBlock.id ? updatedBlock : block)),
    }));
  };

  const handleZoomChange = (level: ZoomLevel) => {
    setZoom(level);
  };

  const getZoomPercentage = () => {
    if (zoom === 'fit') return 85;
    return zoom;
  };

  const selectedBlock = schema.blocks.find((block) => block.id === selectedBlockId);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen flex-col bg-white">
        {/* Top Toolbar - Clean & Minimal */}
        <div className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="h-9 w-9">
              <FilteredLink to="/settings/templates">
                <ArrowLeft className="h-4 w-4" />
              </FilteredLink>
            </Button>
            <div>
              <h1 className="text-base font-semibold text-gray-900">
                Thiết kế mẫu hóa đơn
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Tạo mẫu hóa đơn theo phong cách của bạn</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls (Visual Mode Only) */}
            {mode === 'visual' && (
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setZoom((prev) => (prev === 'fit' ? 100 : Math.max(50, prev - 25)) as ZoomLevel)}
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <Select value={zoom.toString()} onValueChange={(v) => handleZoomChange(v as any)}>
                  <SelectTrigger className="h-7 w-20 border-0 bg-transparent text-xs font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50%</SelectItem>
                    <SelectItem value="75">75%</SelectItem>
                    <SelectItem value="100">100%</SelectItem>
                    <SelectItem value="fit">Vừa vặn</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setZoom((prev) => (prev === 'fit' ? 100 : Math.min(100, prev + 25)) as ZoomLevel)}
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            {/* Mode Toggle */}
            <Tabs value={mode} onValueChange={(v) => handleModeChange(v as EditorMode)}>
              <TabsList className="h-9">
                <TabsTrigger value="visual" className="gap-2 text-xs">
                  <Layout className="h-3.5 w-3.5" />
                  Trực quan
                </TabsTrigger>
                <TabsTrigger value="html" className="gap-2 text-xs">
                  <Code2 className="h-3.5 w-3.5" />
                  HTML
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="h-6 w-px bg-gray-200"></div>

            <Button asChild variant="outline" size="sm" className="h-9 text-xs">
              <FilteredLink to={`/settings/templates/${id}/preview`}>
                <Eye className="mr-2 h-3.5 w-3.5" />
                Xem trước
              </FilteredLink>
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs">
              <FileDown className="mr-2 h-3.5 w-3.5" />
              Xuất PDF
            </Button>
            <Button size="sm" className="h-9 bg-[#1E88E5] text-xs hover:bg-[#1976D2]">
              <Save className="mr-2 h-3.5 w-3.5" />
              Lưu thay đổi
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          {mode === 'visual' ? (
            <div className="flex h-full">
              {/* Left Panel: Block Library (260px fixed) */}
              <div className="w-[260px] border-r border-gray-200 bg-gray-50/50 overflow-y-auto">
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Thư viện khối</h3>
                    <p className="mt-1 text-xs text-gray-500">Kéo thả hoặc nhấp để thêm</p>
                  </div>

                  <div className="space-y-5">
                    {blockCategories.map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        <h4 className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          {category.label}
                        </h4>
                        <div className="space-y-2">
                          {category.blocks.map((blockConfig) => (
                            <DraggableLibraryBlock
                              key={blockConfig.type}
                              blockConfig={blockConfig}
                              onAdd={() => handleAddBlock(blockConfig.type)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Panel: Template Structure (260px fixed) */}
              <div className="w-[260px] border-r border-gray-200 bg-white overflow-y-auto">
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Cấu trúc</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {schema.blocks.length} khối
                    </p>
                  </div>

                  {schema.blocks.length === 0 ? (
                    <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
                      <Layout className="mx-auto h-10 w-10 text-gray-300" />
                      <h3 className="mt-3 text-sm font-medium text-gray-900">
                        Chưa có khối nào
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Thêm khối từ thư viện bên trái
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      {schema.blocks.map((block, index) => (
                        <DraggableBlock
                          key={block.id}
                          block={block}
                          index={index}
                          isSelected={selectedBlockId === block.id}
                          onSelect={() => setSelectedBlockId(block.id)}
                          onMove={handleMoveBlock}
                          onDelete={() => handleDeleteBlock(block.id)}
                          onToggleVisibility={() => handleToggleBlockVisibility(block.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Main Canvas - Large Preview Area (Flexible) */}
              <div className="flex-1 flex">
                <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-100 to-gray-50">
                  <div className="flex min-h-full items-start justify-center p-12">
                    <PreviewDropZone
                      onDrop={handleDropBlock}
                      blocks={schema.blocks}
                      selectedBlockId={selectedBlockId}
                      onSelectBlock={setSelectedBlockId}
                      zoom={getZoomPercentage()}
                    >
                      <div className="relative">
                        {/* Soft Shadow Effect */}
                        <div className="absolute -inset-4 rounded-xl bg-black/5 blur-xl"></div>
                        
                        {/* Page Container */}
                        <div className="relative rounded-lg bg-white shadow-2xl ring-1 ring-gray-200/50 overflow-hidden">
                          <TemplatePreview
                            content={generatedHTML}
                            paperSize={schema.paperSize}
                            orientation={schema.orientation}
                            margins={schema.margins}
                          />

                          {/* Interactive Block Overlays */}
                          {schema.blocks.map((block, index) => (
                            <div
                              key={block.id}
                              onClick={() => setSelectedBlockId(block.id)}
                              onMouseEnter={() => setHoveredBlockId(block.id)}
                              onMouseLeave={() => setHoveredBlockId(null)}
                              className={cn(
                                'group absolute inset-x-0 cursor-pointer transition-all duration-200',
                                selectedBlockId === block.id
                                  ? 'ring-2 ring-[#1E88E5] bg-blue-50/10 z-10'
                                  : hoveredBlockId === block.id
                                  ? 'ring-1 ring-blue-300 bg-blue-50/5'
                                  : 'hover:ring-1 hover:ring-gray-300'
                              )}
                              style={{
                                top: `${index * 80}px`,
                                height: '80px',
                              }}
                            >
                              {/* Quick Action Toolbar */}
                              {selectedBlockId === block.id && (
                                <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    title="Di chuyển"
                                  >
                                    <Move className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    title="Sao chép"
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                  <div className="h-4 w-px bg-gray-200"></div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleBlockVisibility(block.id);
                                    }}
                                    title="Ẩn/Hiện"
                                  >
                                    {block.visible ? (
                                      <Eye className="h-3.5 w-3.5" />
                                    ) : (
                                      <EyeOff className="h-3.5 w-3.5" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-red-500 hover:text-red-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteBlock(block.id);
                                    }}
                                    title="Xóa"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </PreviewDropZone>
                  </div>
                </div>

                {/* Right Inspector Panel - Only shows when block is selected */}
                {selectedBlock && (
                  <div className="w-[320px] border-l border-gray-200 bg-white overflow-y-auto shadow-lg">
                    <div className="p-5">
                      {/* Inspector Header */}
                      <div className="mb-6 flex items-start justify-between border-b pb-4">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">Cài đặt khối</h3>
                          <p className="mt-0.5 text-xs text-gray-500 capitalize">
                            {selectedBlock.type.replace(/-/g, ' ')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedBlockId(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Inspector Settings */}
                      <div className="space-y-5">
                        {/* Visibility Toggle */}
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-gray-700">Hiển thị</Label>
                          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <span className="text-xs text-gray-700">Hiển thị khối này</span>
                            <Switch
                              checked={selectedBlock.visible}
                              onCheckedChange={() => handleToggleBlockVisibility(selectedBlock.id)}
                            />
                          </div>
                        </div>

                        {/* Spacing */}
                        <div className="space-y-3">
                          <Label className="text-xs font-semibold text-gray-700">Khoảng cách</Label>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Trên</span>
                              <span className="text-xs font-medium text-gray-900">
                                {selectedBlock.style?.marginTop || 0}px
                              </span>
                            </div>
                            <Slider
                              value={[selectedBlock.style?.marginTop || 0]}
                              onValueChange={([value]) =>
                                handleUpdateBlock({
                                  ...selectedBlock,
                                  style: { ...selectedBlock.style, marginTop: value },
                                })
                              }
                              max={100}
                              step={5}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Dưới</span>
                              <span className="text-xs font-medium text-gray-900">
                                {selectedBlock.style?.marginBottom || 0}px
                              </span>
                            </div>
                            <Slider
                              value={[selectedBlock.style?.marginBottom || 0]}
                              onValueChange={([value]) =>
                                handleUpdateBlock({
                                  ...selectedBlock,
                                  style: { ...selectedBlock.style, marginBottom: value },
                                })
                              }
                              max={100}
                              step={5}
                              className="w-full"
                            />
                          </div>
                        </div>

                        {/* Block-specific settings */}
                        {selectedBlock.type === 'header' && (
                          <>
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold text-gray-700">Bố cục</Label>
                              <Select
                                value={selectedBlock.layout}
                                onValueChange={(value) =>
                                  handleUpdateBlock({ ...selectedBlock, layout: value as any })
                                }
                              >
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="logo-left">Logo bên trái</SelectItem>
                                  <SelectItem value="logo-center">Logo giữa</SelectItem>
                                  <SelectItem value="logo-right">Logo bên phải</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-semibold text-gray-700">Hiển thị</Label>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                                  <span className="text-xs text-gray-700">Logo</span>
                                  <Switch
                                    checked={selectedBlock.showLogo}
                                    onCheckedChange={(checked) =>
                                      handleUpdateBlock({ ...selectedBlock, showLogo: checked })
                                    }
                                  />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                                  <span className="text-xs text-gray-700">Tên công ty</span>
                                  <Switch
                                    checked={selectedBlock.showCompanyName}
                                    onCheckedChange={(checked) =>
                                      handleUpdateBlock({ ...selectedBlock, showCompanyName: checked })
                                    }
                                  />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                                  <span className="text-xs text-gray-700">Địa chỉ</span>
                                  <Switch
                                    checked={selectedBlock.showAddress}
                                    onCheckedChange={(checked) =>
                                      handleUpdateBlock({ ...selectedBlock, showAddress: checked })
                                    }
                                  />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                                  <span className="text-xs text-gray-700">Số điện thoại</span>
                                  <Switch
                                    checked={selectedBlock.showPhone}
                                    onCheckedChange={(checked) =>
                                      handleUpdateBlock({ ...selectedBlock, showPhone: checked })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {selectedBlock.type === 'invoice-title' && (
                          <>
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold text-gray-700">Căn chỉnh</Label>
                              <div className="flex gap-2">
                                <Button
                                  variant={selectedBlock.align === 'left' ? 'default' : 'outline'}
                                  size="sm"
                                  className="flex-1"
                                  onClick={() =>
                                    handleUpdateBlock({ ...selectedBlock, align: 'left' })
                                  }
                                >
                                  <AlignLeft className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant={selectedBlock.align === 'center' ? 'default' : 'outline'}
                                  size="sm"
                                  className="flex-1"
                                  onClick={() =>
                                    handleUpdateBlock({ ...selectedBlock, align: 'center' })
                                  }
                                >
                                  <AlignCenter className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant={selectedBlock.align === 'right' ? 'default' : 'outline'}
                                  size="sm"
                                  className="flex-1"
                                  onClick={() =>
                                    handleUpdateBlock({ ...selectedBlock, align: 'right' })
                                  }
                                >
                                  <AlignRight className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-semibold text-gray-700">Kích thước chữ</Label>
                              <div className="flex items-center gap-2">
                                <Slider
                                  value={[selectedBlock.fontSize || 24]}
                                  onValueChange={([value]) =>
                                    handleUpdateBlock({ ...selectedBlock, fontSize: value })
                                  }
                                  min={16}
                                  max={48}
                                  step={2}
                                  className="flex-1"
                                />
                                <span className="text-xs font-medium text-gray-900 w-10 text-right">
                                  {selectedBlock.fontSize || 24}px
                                </span>
                              </div>
                            </div>
                          </>
                        )}

                        {selectedBlock.type === 'items-table' && (
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-700">Hiển thị cột</Label>
                            <div className="space-y-2">
                              {Object.entries(selectedBlock.columns || {}).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2.5"
                                >
                                  <span className="text-xs text-gray-700 capitalize">
                                    {key === 'stt' ? 'STT' : key === 'name' ? 'Tên' : key === 'unit' ? 'Đơn vị' : key === 'quantity' ? 'Số lượng' : key === 'price' ? 'Đơn giá' : 'Thành tiền'}
                                  </span>
                                  <Switch
                                    checked={value as boolean}
                                    onCheckedChange={(checked) =>
                                      handleUpdateBlock({
                                        ...selectedBlock,
                                        columns: { ...selectedBlock.columns, [key]: checked },
                                      })
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedBlock.type === 'totals' && (
                          <>
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold text-gray-700">Căn chỉnh</Label>
                              <Select
                                value={selectedBlock.align}
                                onValueChange={(value) =>
                                  handleUpdateBlock({ ...selectedBlock, align: value as any })
                                }
                              >
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="left">Trái</SelectItem>
                                  <SelectItem value="right">Phải</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-semibold text-gray-700">Hiển thị</Label>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                                  <span className="text-xs text-gray-700">Tạm tính</span>
                                  <Switch
                                    checked={selectedBlock.showSubtotal}
                                    onCheckedChange={(checked) =>
                                      handleUpdateBlock({ ...selectedBlock, showSubtotal: checked })
                                    }
                                  />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                                  <span className="text-xs text-gray-700">Tổng cộng</span>
                                  <Switch
                                    checked={selectedBlock.showGrandTotal}
                                    onCheckedChange={(checked) =>
                                      handleUpdateBlock({ ...selectedBlock, showGrandTotal: checked })
                                    }
                                  />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                                  <span className="text-xs text-gray-700">Đã thanh toán</span>
                                  <Switch
                                    checked={selectedBlock.showPaid}
                                    onCheckedChange={(checked) =>
                                      handleUpdateBlock({ ...selectedBlock, showPaid: checked })
                                    }
                                  />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                                  <span className="text-xs text-gray-700">Còn lại</span>
                                  <Switch
                                    checked={selectedBlock.showDue}
                                    onCheckedChange={(checked) =>
                                      handleUpdateBlock({ ...selectedBlock, showDue: checked })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {selectedBlock.type === 'payment-info' && (
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-700">Hiển thị</Label>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                                <span className="text-xs text-gray-700">Thông tin ngân hàng</span>
                                <Switch
                                  checked={selectedBlock.showBankInfo}
                                  onCheckedChange={(checked) =>
                                    handleUpdateBlock({ ...selectedBlock, showBankInfo: checked })
                                  }
                                />
                              </div>
                              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                                <span className="text-xs text-gray-700">QR Code</span>
                                <Switch
                                  checked={selectedBlock.showQRCode}
                                  onCheckedChange={(checked) =>
                                    handleUpdateBlock({ ...selectedBlock, showQRCode: checked })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedBlock.type === 'signature' && (
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-700">Hiển thị ngày</Label>
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                              <span className="text-xs text-gray-700">Hiển thị ngày ký</span>
                              <Switch
                                checked={selectedBlock.showDate}
                                onCheckedChange={(checked) =>
                                  handleUpdateBlock({ ...selectedBlock, showDate: checked })
                                }
                              />
                            </div>
                          </div>
                        )}

                        {(selectedBlock.type === 'footer' || selectedBlock.type === 'invoice-title') && (
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-700">Căn chỉnh</Label>
                            <div className="flex gap-2">
                              <Button
                                variant={selectedBlock.align === 'left' ? 'default' : 'outline'}
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  handleUpdateBlock({ ...selectedBlock, align: 'left' })
                                }
                              >
                                <AlignLeft className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant={selectedBlock.align === 'center' ? 'default' : 'outline'}
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  handleUpdateBlock({ ...selectedBlock, align: 'center' })
                                }
                              >
                                <AlignCenter className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant={selectedBlock.align === 'right' ? 'default' : 'outline'}
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  handleUpdateBlock({ ...selectedBlock, align: 'right' })
                                }
                              >
                                <AlignRight className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* HTML Mode */
            <div className="h-full flex">
              <div className="flex-1">
                <Editor
                  height="100%"
                  defaultLanguage="html"
                  value={htmlContent || generatedHTML}
                  onChange={(value) => setHtmlContent(value || '')}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
              <div className="w-[500px] border-l border-gray-200 overflow-auto bg-gray-100 p-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-lg bg-black/5 blur-md"></div>
                    <div className="relative bg-white shadow-2xl">
                      <TemplatePreview
                        content={htmlContent || generatedHTML}
                        paperSize={schema.paperSize}
                        orientation={schema.orientation}
                        margins={schema.margins}
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