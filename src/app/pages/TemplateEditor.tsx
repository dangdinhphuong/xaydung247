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
  ChevronDown,
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
  Maximize2,
  GripHorizontal,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
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
      { type: 'header' as BlockType, icon: FileText, title: 'Thông tin đơn vị', description: 'Logo, tên, địa chỉ công ty' },
      { type: 'invoice-title' as BlockType, icon: FileText, title: 'Tiêu đề hóa đơn', description: 'HÓA ĐƠN BÁN HÀNG' },
    ],
  },
  {
    label: 'Thông tin khách hàng',
    blocks: [
      { type: 'customer-info' as BlockType, icon: User, title: 'Thông tin khách', description: 'Tên, địa chỉ, điện thoại' },
      { type: 'invoice-meta' as BlockType, icon: Calendar, title: 'Thông tin hóa đơn', description: 'Mã, ngày tạo, hạn thanh toán' },
    ],
  },
  {
    label: 'Bảng mặt hàng',
    blocks: [
      { type: 'items-table' as BlockType, icon: Table, title: 'Bảng mặt hàng', description: 'Danh sách sản phẩm/dịch vụ' },
      { type: 'totals' as BlockType, icon: DollarSign, title: 'Tổng tiền', description: 'Tổng cộng, đã thanh toán' },
    ],
  },
  {
    label: 'Thông tin thanh toán',
    blocks: [
      { type: 'payment-info' as BlockType, icon: CreditCard, title: 'Thông tin TT', description: 'Ngân hàng, QR code' },
      { type: 'signature' as BlockType, icon: PenTool, title: 'Chữ ký', description: 'Người bán & khách hàng' },
      { type: 'footer' as BlockType, icon: MessageSquare, title: 'Chân trang', description: 'Lời cảm ơn, điều khoản' },
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
        'group flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-left transition-all hover:border-[#1E88E5] hover:shadow-sm',
        isDragging && 'opacity-50'
      )}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 transition-colors group-hover:bg-blue-100">
        <Icon className="h-3.5 w-3.5 text-[#1E88E5]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-900">
          {blockConfig.title}
        </div>
        <div className="text-[10px] text-gray-500 truncate">
          {blockConfig.description}
        </div>
      </div>
      <Plus className="h-3.5 w-3.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
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
        'group relative cursor-pointer rounded-lg border bg-white p-2.5 transition-all hover:shadow-sm',
        isSelected ? 'border-[#1E88E5] shadow-sm ring-1 ring-[#1E88E5]/20' : 'border-gray-200',
        isDragging && 'opacity-50',
        !block.visible && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-2">
        <div className="cursor-grab">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50">
          <Icon className="h-3.5 w-3.5 text-[#1E88E5]" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-xs">{getBlockTitle(block.type)}</h4>
          <p className="mt-0.5 text-[10px] text-gray-500">
            {block.visible ? 'Hiển thị' : 'Ẩn'}
          </p>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
          >
            {block.visible ? (
              <Eye className="h-3 w-3 text-gray-500" />
            ) : (
              <EyeOff className="h-3 w-3 text-gray-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3 text-red-500" />
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

function PreviewDropZone({ children, onDrop, blocks, selectedBlockId, onSelectBlock, zoom }: PreviewDropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ['NEW_BLOCK', 'BLOCK'],
    drop: (item: { blockType?: BlockType; index?: number }) => {
      if (item.blockType) {
        // New block from library
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
        'relative transition-all',
        isOver && 'ring-2 ring-[#1E88E5] ring-opacity-50'
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

export default function TemplateEditor() {
  const { id } = useParams();
  const [mode, setMode] = useState<EditorMode>('visual');
  const [schema, setSchema] = useState<TemplateSchema>(defaultTemplateSchema);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<ZoomLevel>(100);

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
    if (zoom === 'fit') return 100;
    return zoom;
  };

  const selectedBlock = schema.blocks.find((block) => block.id === selectedBlockId);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen flex-col bg-[#F8FAFC]">
        {/* Top Toolbar */}
        <div className="flex items-center justify-between border-b bg-white px-4 py-2.5 shadow-sm">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <FilteredLink to="/settings/templates">
                <ArrowLeft className="h-4 w-4" />
              </FilteredLink>
            </Button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Trình chỉnh sửa mẫu hóa đơn
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls (Visual Mode Only) */}
            {mode === 'visual' && (
              <div className="flex items-center gap-1 border-r pr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setZoom((prev) => (prev === 'fit' ? 100 : Math.max(50, prev - 25)) as ZoomLevel)}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Select value={zoom.toString()} onValueChange={(v) => handleZoomChange(v as any)}>
                  <SelectTrigger className="h-8 w-20 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50%</SelectItem>
                    <SelectItem value="75">75%</SelectItem>
                    <SelectItem value="100">100%</SelectItem>
                    <SelectItem value="fit">Fit</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setZoom((prev) => (prev === 'fit' ? 100 : Math.min(100, prev + 25)) as ZoomLevel)}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Mode Toggle */}
            <Tabs value={mode} onValueChange={(v) => handleModeChange(v as EditorMode)}>
              <TabsList className="h-8">
                <TabsTrigger value="visual" className="gap-1.5 text-xs">
                  <Layout className="h-3.5 w-3.5" />
                  Visual
                </TabsTrigger>
                <TabsTrigger value="html" className="gap-1.5 text-xs">
                  <Code2 className="h-3.5 w-3.5" />
                  HTML
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="outline" size="sm" className="h-8 text-xs">
              <FileDown className="mr-1.5 h-3.5 w-3.5" />
              Xuất PDF
            </Button>
            <Button size="sm" className="h-8 bg-[#1E88E5] text-xs hover:bg-[#1976D2]">
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Lưu
            </Button>
          </div>
        </div>

        {/* Main Content with Resizable Panels */}
        <div className="flex-1 overflow-hidden">
          {mode === 'visual' ? (
            <PanelGroup direction="horizontal">
              {/* Left Panel: Block Library (260px fixed) */}
              <Panel defaultSize={15} minSize={12} maxSize={20} className="bg-[#F8FAFC]">
                <div className="h-full overflow-y-auto border-r">
                  <div className="p-3">
                    <div className="mb-3">
                      <h3 className="text-xs font-semibold text-gray-900">Thư viện khối</h3>
                      <p className="mt-0.5 text-[10px] text-gray-500">Kéo hoặc nhấp để thêm</p>
                    </div>

                    <div className="space-y-4">
                      {blockCategories.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                          <h4 className="mb-2 text-[10px] font-semibold uppercase text-gray-500">
                            {category.label}
                          </h4>
                          <div className="space-y-1.5">
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
              </Panel>

              {/* Resize Handle */}
              <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-[#1E88E5] transition-colors" />

              {/* Middle Panel: Template Structure (300px, resizable) */}
              <Panel defaultSize={18} minSize={15} maxSize={25} className="bg-white">
                <div className="h-full overflow-y-auto border-r">
                  <div className="p-3">
                    <div className="mb-3">
                      <h3 className="text-xs font-semibold text-gray-900">Cấu trúc mẫu</h3>
                      <p className="mt-0.5 text-[10px] text-gray-500">
                        Kéo để sắp xếp
                      </p>
                    </div>

                    {schema.blocks.length === 0 ? (
                      <Card className="border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                        <Layout className="mx-auto h-8 w-8 text-gray-300" />
                        <h3 className="mt-2 text-xs font-semibold text-gray-900">
                          Chưa có khối
                        </h3>
                        <p className="mt-1 text-[10px] text-gray-500">
                          Thêm khối từ thư viện
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
              </Panel>

              {/* Resize Handle */}
              <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-[#1E88E5] transition-colors" />

              {/* Right Panel: Live Preview (Largest, flexible) */}
              <Panel defaultSize={67} minSize={50}>
                <div className="h-full overflow-auto bg-gray-100">
                  <div className="p-6">
                    {/* Preview Header */}
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Xem trước trực tiếp</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Eye className="h-3.5 w-3.5" />
                        <span>
                          {schema.paperSize} - {schema.orientation === 'portrait' ? 'Dọc' : 'Ngang'}
                        </span>
                      </div>
                    </div>

                    {/* Preview Canvas */}
                    <div className="flex justify-center">
                      <PreviewDropZone
                        onDrop={handleDropBlock}
                        blocks={schema.blocks}
                        selectedBlockId={selectedBlockId}
                        onSelectBlock={setSelectedBlockId}
                        zoom={getZoomPercentage()}
                      >
                        <div className="relative">
                          {/* Page Shadow */}
                          <div className="absolute -inset-3 rounded-lg bg-black/5 blur-md"></div>

                          {/* Actual Preview */}
                          <div className="relative bg-white shadow-2xl">
                            <TemplatePreview
                              content={generatedHTML}
                              paperSize={schema.paperSize}
                              orientation={schema.orientation}
                              margins={schema.margins}
                            />

                            {/* Margin Safe Area Indicator */}
                            <div
                              className="pointer-events-none absolute border border-dashed border-blue-300 opacity-20"
                              style={{
                                top: `${schema.margins.top}mm`,
                                right: `${schema.margins.right}mm`,
                                bottom: `${schema.margins.bottom}mm`,
                                left: `${schema.margins.left}mm`,
                              }}
                            />

                            {/* Block Hover Overlay */}
                            {schema.blocks.map((block, index) => (
                              <div
                                key={block.id}
                                onClick={() => setSelectedBlockId(block.id)}
                                className={cn(
                                  'absolute inset-x-0 cursor-pointer transition-all',
                                  selectedBlockId === block.id
                                    ? 'ring-2 ring-[#1E88E5] ring-offset-2'
                                    : 'hover:ring-1 hover:ring-gray-300'
                                )}
                                style={{
                                  top: `${index * 60}px`, // Approximate positioning
                                  height: '60px',
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </PreviewDropZone>
                    </div>
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          ) : (
            /* HTML Mode */
            <PanelGroup direction="horizontal">
              <Panel defaultSize={60} minSize={40}>
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
              </Panel>
              <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-[#1E88E5] transition-colors" />
              <Panel defaultSize={40} minSize={30}>
                <div className="h-full overflow-auto bg-gray-100 p-6">
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
              </Panel>
            </PanelGroup>
          )}
        </div>

        {/* Bottom Inspector Panel (Fixed Height, Collapsible) */}
        {selectedBlock && mode === 'visual' && (
          <div className="border-t bg-white">
            <Collapsible defaultOpen={true}>
              <div className="flex items-center justify-between border-b px-4 py-2">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Cài đặt khối</h3>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="max-h-[300px] overflow-y-auto p-4">
                  <div className="mx-auto max-w-4xl">
                    <div className="grid grid-cols-4 gap-4">
                      {/* Visibility */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-700">
                          Hiển thị
                        </Label>
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2">
                          <span className="text-xs text-gray-900">Hiển thị khối</span>
                          <Switch
                            checked={selectedBlock.visible}
                            onCheckedChange={() => handleToggleBlockVisibility(selectedBlock.id)}
                          />
                        </div>
                      </div>

                      {/* Block-specific settings */}
                      {selectedBlock.type === 'header' && (
                        <>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-700">
                              Bố cục
                            </Label>
                            <Select
                              value={selectedBlock.layout}
                              onValueChange={(value) =>
                                handleUpdateBlock({ ...selectedBlock, layout: value as any })
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="logo-left">Logo trái</SelectItem>
                                <SelectItem value="logo-center">Logo giữa</SelectItem>
                                <SelectItem value="logo-right">Logo phải</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-700">
                              Logo
                            </Label>
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2">
                              <span className="text-xs text-gray-900">Hiển thị</span>
                              <Switch
                                checked={selectedBlock.showLogo}
                                onCheckedChange={(checked) =>
                                  handleUpdateBlock({ ...selectedBlock, showLogo: checked })
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-700">
                              Tên công ty
                            </Label>
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2">
                              <span className="text-xs text-gray-900">Hiển thị</span>
                              <Switch
                                checked={selectedBlock.showCompanyName}
                                onCheckedChange={(checked) =>
                                  handleUpdateBlock({ ...selectedBlock, showCompanyName: checked })
                                }
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'items-table' && (
                        <>
                          {Object.entries(selectedBlock.columns || {}).slice(0, 4).map(([key, value]) => (
                            <div key={key} className="space-y-1.5">
                              <Label className="text-xs font-semibold text-gray-700 capitalize">
                                {key}
                              </Label>
                              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2">
                                <span className="text-xs text-gray-900">Hiển thị</span>
                                <Switch
                                  checked={value}
                                  onCheckedChange={(checked) =>
                                    handleUpdateBlock({
                                      ...selectedBlock,
                                      columns: { ...selectedBlock.columns, [key]: checked },
                                    })
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </>
                      )}

                      {selectedBlock.type === 'totals' && (
                        <>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-700">
                              Căn chỉnh
                            </Label>
                            <Select
                              value={selectedBlock.align}
                              onValueChange={(value) =>
                                handleUpdateBlock({ ...selectedBlock, align: value as any })
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">Trái</SelectItem>
                                <SelectItem value="right">Phải</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-700">
                              Tạm tính
                            </Label>
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2">
                              <span className="text-xs text-gray-900">Hiển thị</span>
                              <Switch
                                checked={selectedBlock.showSubtotal}
                                onCheckedChange={(checked) =>
                                  handleUpdateBlock({ ...selectedBlock, showSubtotal: checked })
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-gray-700">
                              Tổng cộng
                            </Label>
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2">
                              <span className="text-xs text-gray-900">Hiển thị</span>
                              <Switch
                                checked={selectedBlock.showGrandTotal}
                                onCheckedChange={(checked) =>
                                  handleUpdateBlock({ ...selectedBlock, showGrandTotal: checked })
                                }
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Paper Settings Drawer */}
        <Collapsible defaultOpen={false}>
          <div className="border-t bg-white">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center gap-2 rounded-none py-2"
              >
                <Settings2 className="h-3.5 w-3.5" />
                Cài đặt khổ giấy
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-t p-3">
                <div className="mx-auto max-w-4xl">
                  <div className="grid grid-cols-6 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Tên mẫu</Label>
                      <Input
                        className="h-8 text-xs"
                        value={schema.name}
                        onChange={(e) => setSchema((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Nhập tên mẫu"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Khổ giấy</Label>
                      <Select
                        value={schema.paperSize}
                        onValueChange={(value: 'A4' | 'A5') =>
                          setSchema((prev) => ({ ...prev, paperSize: value }))
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A4">A4</SelectItem>
                          <SelectItem value="A5">A5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Hướng giấy</Label>
                      <Select
                        value={schema.orientation}
                        onValueChange={(value: 'portrait' | 'landscape') =>
                          setSchema((prev) => ({ ...prev, orientation: value }))
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait">Dọc</SelectItem>
                          <SelectItem value="landscape">Ngang</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3 space-y-1">
                      <Label className="text-xs">Lề trang (mm)</Label>
                      <div className="grid grid-cols-4 gap-2">
                        <Input
                          className="h-8 text-xs"
                          type="number"
                          placeholder="Trên"
                          value={schema.margins.top}
                          onChange={(e) =>
                            setSchema((prev) => ({
                              ...prev,
                              margins: { ...prev.margins, top: Number(e.target.value) },
                            }))
                          }
                        />
                        <Input
                          className="h-8 text-xs"
                          type="number"
                          placeholder="Phải"
                          value={schema.margins.right}
                          onChange={(e) =>
                            setSchema((prev) => ({
                              ...prev,
                              margins: { ...prev.margins, right: Number(e.target.value) },
                            }))
                          }
                        />
                        <Input
                          className="h-8 text-xs"
                          type="number"
                          placeholder="Dưới"
                          value={schema.margins.bottom}
                          onChange={(e) =>
                            setSchema((prev) => ({
                              ...prev,
                              margins: { ...prev.margins, bottom: Number(e.target.value) },
                            }))
                          }
                        />
                        <Input
                          className="h-8 text-xs"
                          type="number"
                          placeholder="Trái"
                          value={schema.margins.left}
                          onChange={(e) =>
                            setSchema((prev) => ({
                              ...prev,
                              margins: { ...prev.margins, left: Number(e.target.value) },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </DndProvider>
  );
}

// Helper function to create default blocks
function createDefaultBlock(type: BlockType): TemplateBlock {
  const id = `${type}-${Date.now()}`;
  const commonStyle = { marginTop: 0, marginBottom: 20 };

  switch (type) {
    case 'header':
      return {
        type: 'header',
        id,
        visible: true,
        layout: 'logo-center',
        showLogo: false,
        showCompanyName: true,
        showAddress: true,
        showPhone: true,
        showEmail: true,
        showTaxCode: true,
        style: { ...commonStyle, textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: '#1E88E5' },
      };

    case 'invoice-title':
      return {
        type: 'invoice-title',
        id,
        visible: true,
        title: 'HÓA ĐƠN BÁN HÀNG',
        showInvoiceCode: true,
        showBorder: true,
        style: { ...commonStyle, textAlign: 'center', fontSize: 24, fontWeight: 'bold' },
      };

    case 'customer-info':
      return {
        type: 'customer-info',
        id,
        visible: true,
        showName: true,
        showAddress: true,
        showPhone: true,
        showTaxCode: false,
        style: commonStyle,
      };

    case 'invoice-meta':
      return {
        type: 'invoice-meta',
        id,
        visible: true,
        showCreatedDate: true,
        showDueDate: true,
        showSalesperson: false,
        layout: 'two-columns',
        style: commonStyle,
      };

    case 'items-table':
      return {
        type: 'items-table',
        id,
        visible: true,
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
        showHeader: true,
        showBorders: true,
        headerColor: '#1E88E5',
        headerTextColor: '#ffffff',
        style: commonStyle,
      };

    case 'totals':
      return {
        type: 'totals',
        id,
        visible: true,
        align: 'right',
        showSubtotal: true,
        showDiscount: false,
        showTax: false,
        showShipping: false,
        showGrandTotal: true,
        showPaid: true,
        showRemaining: true,
        showInWords: false,
        width: 300,
        style: { marginTop: 30 },
      };

    case 'payment-info':
      return {
        type: 'payment-info',
        id,
        visible: true,
        showBankInfo: true,
        showQRCode: false,
        style: commonStyle,
      };

    case 'signature':
      return {
        type: 'signature',
        id,
        visible: true,
        showSellerSignature: true,
        showCustomerSignature: true,
        layout: 'two-columns',
        style: { marginTop: 50 },
      };

    case 'footer':
      return {
        type: 'footer',
        id,
        visible: true,
        showThankYou: true,
        showTerms: false,
        style: { ...commonStyle, textAlign: 'center' },
      };

    default:
      throw new Error(`Unknown block type: ${type}`);
  }
}