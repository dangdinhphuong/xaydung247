import { useState } from 'react';
import { Plus, Edit2, Copy, Check, FileText, ArrowLeft, Code } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { FilteredLink } from '../components/FilteredLink';

interface Template {
  id: string;
  name: string;
  paperSize: 'A4' | 'A5' | 'A6' | 'Thermal';
  orientation: 'portrait' | 'landscape';
  isDefault: boolean;
  isActive: boolean;
  thumbnail: string;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Mẫu cổ điển',
    paperSize: 'A4',
    orientation: 'portrait',
    isDefault: true,
    isActive: true,
    thumbnail: '/templates/classic.png',
  },
  {
    id: '2',
    name: 'Mẫu hiện đại',
    paperSize: 'A4',
    orientation: 'portrait',
    isDefault: false,
    isActive: false,
    thumbnail: '/templates/modern.png',
  },
  {
    id: '3',
    name: 'Mẫu đơn giản',
    paperSize: 'A5',
    orientation: 'portrait',
    isDefault: false,
    isActive: false,
    thumbnail: '/templates/simple.png',
  },
];

export default function TemplateList() {
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());

  const handleSetDefault = (id: string) => {
    console.log('Set default:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:space-y-6 lg:bg-white lg:pb-0">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-10 w-10 shrink-0">
            <FilteredLink to="/settings">
              <ArrowLeft className="h-5 w-5" />
            </FilteredLink>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold text-gray-900">Mẫu hóa đơn</h1>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden items-center justify-between lg:flex">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mẫu hóa đơn</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tùy chỉnh mẫu in và bố cục hóa đơn
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <FilteredLink to="/settings/templates/new">
              <Plus className="mr-2 h-4 w-4" />
              Trình thiết kế
            </FilteredLink>
          </Button>
          <Button asChild className="bg-[#1E88E5] hover:bg-[#1976D2]">
            <FilteredLink to="/settings/templates/1/edit">
              <Code className="mr-2 h-4 w-4" />
              Chỉnh sửa HTML
            </FilteredLink>
          </Button>
        </div>
      </div>

      {/* Info Cards - Desktop Only */}
      <div className="hidden grid-cols-2 gap-4 lg:grid">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="flex items-start gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Edit2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Trình thiết kế trực quan</h3>
              <p className="mt-1 text-sm text-gray-600">
                Tùy chỉnh mẫu với giao diện kéo thả, điều chỉnh màu sắc, font chữ và bố cục
              </p>
              <Button asChild variant="link" className="mt-2 h-auto p-0 text-blue-600">
                <FilteredLink to="/settings/templates/new">
                  Mở trình thiết kế →
                </FilteredLink>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="flex items-start gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-100">
              <Code className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Chỉnh sửa HTML nâng cao</h3>
              <p className="mt-1 text-sm text-gray-600">
                Chỉnh sửa HTML trực tiếp, chèn biến động và xem trước thời gian thực
              </p>
              <Button asChild variant="link" className="mt-2 h-auto p-0 text-purple-600">
                <FilteredLink to="/settings/templates/1/edit">
                  Mở trình soạn thảo →
                </FilteredLink>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Grid */}
      <div className="grid gap-4 px-4 pt-4 md:grid-cols-2 md:px-0 lg:grid-cols-3 lg:pt-0">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="relative aspect-[210/297] border-b bg-gray-100">
              {/* Template Preview Thumbnail */}
              <div className="flex h-full items-center justify-center p-8">
                <div className="h-full w-full rounded border-2 border-dashed border-gray-300 bg-white p-4">
                  <div className="mb-3 h-8 w-24 rounded bg-[#1E88E5]/10" />
                  <div className="mb-2 h-4 w-full rounded bg-gray-200" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
                  <div className="mb-4 h-4 w-1/2 rounded bg-gray-200" />
                  
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-3 rounded bg-gray-100" />
                    ))}
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <div className="ml-auto h-3 w-1/3 rounded bg-[#1E88E5]/20" />
                    <div className="ml-auto h-4 w-1/2 rounded bg-[#1E88E5]/30" />
                  </div>
                </div>
              </div>
              
              {template.isDefault && (
                <Badge className="absolute right-2 top-2 bg-green-600">
                  <Check className="mr-1 h-3 w-3" />
                  Mặc định
                </Badge>
              )}
              
              {template.isActive && !template.isDefault && (
                <Badge className="absolute right-2 top-2 bg-blue-600">
                  Đang dùng
                </Badge>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Khổ giấy: {template.paperSize} • {template.orientation === 'portrait' ? 'Dọc' : 'Ngang'}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <FilteredLink to={`/settings/templates/${template.id}/preview`}>
                    <Edit2 className="mr-1.5 h-4 w-4" />
                    Xem
                  </FilteredLink>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <FilteredLink to={`/settings/templates/${template.id}/edit`}>
                    <Edit2 className="mr-1.5 h-4 w-4" />
                    Sửa
                  </FilteredLink>
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              {!template.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full text-[#1E88E5]"
                  onClick={() => handleSetDefault(template.id)}
                >
                  Đặt làm mặc định
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {templates.length === 0 && (
        <div className="flex h-96 flex-col items-center justify-center rounded-lg border-2 border-dashed">
          <FileText className="h-16 w-16 text-gray-400" />
          <h3 className="mt-4 font-semibold text-gray-900">Chưa có mẫu hóa đơn</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tạo mẫu hóa đơn đầu tiên của bạn
          </p>
          <Button asChild className="mt-4 bg-[#1E88E5] hover:bg-[#1976D2]">
            <FilteredLink to="/settings/templates/new">
              <Plus className="mr-2 h-4 w-4" />
              Tạo mẫu mới
            </FilteredLink>
          </Button>
        </div>
      )}

      {/* Mobile Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 lg:hidden">
        <Button asChild className="w-full bg-[#1E88E5] text-base font-semibold hover:bg-[#1976D2]">
          <FilteredLink to="/settings/templates/new">
            <Plus className="mr-2 h-5 w-5" />
            Tạo mẫu mới
          </FilteredLink>
        </Button>
      </div>
    </div>
  );
}