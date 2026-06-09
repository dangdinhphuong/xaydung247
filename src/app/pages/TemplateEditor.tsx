import { useEffect, useMemo, useRef, useState } from 'react';
import { useBlocker, useNavigate } from 'react-router';
import { ArrowLeft, Save, RotateCcw, Loader2, Code2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { useSettings, useUpdateSettings } from '../hooks/queries';
import { useAuth } from '../auth/AuthContext';
import { LoadingState, ErrorState } from '../components/QueryStates';
import { getErrorMessage } from '../lib/errors';
import {
  DEFAULT_INVOICE_TEMPLATE_HTML,
  SAMPLE_INVOICE,
  TEMPLATE_PLACEHOLDER_GROUPS,
} from '../lib/invoiceTemplate';
import { buildInvoiceHtml } from '../lib/printInvoice';

const ITEMS_BLOCK_SNIPPET = `{{#items}}
  <tr>
    <td>{{STT}}</td>
    <td>{{Ten_Hang}}</td>
    <td>{{Don_Vi}}</td>
    <td>{{So_Luong}}</td>
    <td>{{Don_Gia}}</td>
    <td>{{Giam_Gia}}</td>
    <td>{{Thanh_Tien}}</td>
  </tr>
{{/items}}`;

export default function TemplateEditor() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canEdit = hasRole('ADMIN');

  const { data: settings, isLoading, isError, error, refetch } = useSettings();
  const updateMut = useUpdateSettings();

  const [html, setHtml] = useState<string>('');
  const [initialHtml, setInitialHtml] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Khởi tạo nội dung từ settings (lần đầu có dữ liệu)
  useEffect(() => {
    if (settings) {
      const tpl = settings.invoiceTemplateHtml ?? '';
      setHtml(tpl);
      setInitialHtml(tpl);
    }
  }, [settings]);

  const isDirty = html !== initialHtml;

  // Cảnh báo khi đóng/refresh tab nếu có thay đổi chưa lưu
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

  // Chặn điều hướng trong app khi có thay đổi chưa lưu
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  );
  useEffect(() => {
    if (blocker.state === 'blocked') {
      const ok = window.confirm(
        'Bạn có thay đổi chưa lưu. Rời khỏi trang và bỏ các thay đổi?',
      );
      if (ok) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);

  const previewHtml = useMemo(
    () =>
      settings
        ? buildInvoiceHtml(SAMPLE_INVOICE, { ...settings, invoiceTemplateHtml: html })
        : '',
    [settings, html],
  );

  const insertAtCursor = (text: string) => {
    if (!canEdit) return;
    const el = textareaRef.current;
    if (!el) {
      setHtml((prev) => prev + text);
      return;
    }
    const start = el.selectionStart ?? html.length;
    const end = el.selectionEnd ?? html.length;
    const next = html.slice(0, start) + text + html.slice(end);
    setHtml(next);
    // Đặt lại con trỏ sau đoạn vừa chèn
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + text.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleSave = async () => {
    try {
      await updateMut.mutateAsync({ invoiceTemplateHtml: html });
      setInitialHtml(html);
      toast.success('Đã lưu mẫu in hóa đơn');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm('Bỏ các thay đổi chưa lưu và quay lại?')) return;
    // Đặt initial = html để blocker không chặn lần điều hướng này
    setInitialHtml(html);
    navigate('/settings');
  };

  if (isLoading) return <LoadingState label="Đang tải mẫu in hóa đơn..." />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Mẫu in hóa đơn</h1>
            <p className="mt-1 text-sm text-gray-500">
              Chỉnh sửa bố cục in bằng HTML + placeholder
              {isDirty && <span className="ml-2 text-orange-600">• Có thay đổi chưa lưu</span>}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>Hủy</Button>
          {canEdit && (
            <>
              <Button
                variant="outline"
                onClick={() => setHtml(DEFAULT_INVOICE_TEMPLATE_HTML)}
                title="Thay bằng mẫu mặc định"
              >
                <RotateCcw className="mr-2 h-4 w-4" />Mẫu mặc định
              </Button>
              <Button
                className="bg-[#1E88E5] hover:bg-[#1976D2]"
                onClick={handleSave}
                disabled={updateMut.isPending || !isDirty}
              >
                {updateMut.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang lưu...</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" />Lưu mẫu</>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {!canEdit && (
        <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
          Bạn chỉ có quyền xem. Chỉ quản trị viên (ADMIN) mới được chỉnh sửa và lưu mẫu in.
        </div>
      )}

      {/* Toolbar chèn placeholder */}
      {canEdit && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Code2 className="h-4 w-4 text-[#1E88E5]" />
              Chèn placeholder (đặt con trỏ trong ô HTML rồi bấm)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {TEMPLATE_PLACEHOLDER_GROUPS.map((g) => (
              <div key={g.group}>
                <p className="text-xs font-semibold text-gray-500">{g.group}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {g.items.map((it) => (
                    <button
                      key={it}
                      type="button"
                      onClick={() => insertAtCursor(`{{${it}}}`)}
                      className="rounded bg-gray-100 px-2 py-1 text-xs text-[#1E88E5] ring-1 ring-gray-200 hover:bg-blue-50"
                    >
                      {`{{${it}}}`}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold text-gray-500">Vùng lặp sản phẩm</p>
              <button
                type="button"
                onClick={() => insertAtCursor(ITEMS_BLOCK_SNIPPET)}
                className="mt-1 rounded bg-gray-100 px-2 py-1 text-xs text-[#1E88E5] ring-1 ring-gray-200 hover:bg-blue-50"
              >
                {'{{#items}} ... {{/items}}'}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editor + Preview */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader className="pb-3"><CardTitle className="text-base">Mã HTML</CardTitle></CardHeader>
          <CardContent className="flex-1">
            <Textarea
              ref={textareaRef}
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              disabled={!canEdit}
              spellCheck={false}
              className="h-[60vh] w-full resize-none font-mono text-xs"
              placeholder="Dán hoặc soạn mã HTML mẫu hóa đơn tại đây..."
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="pb-3"><CardTitle className="text-base">Xem trước (dữ liệu mẫu)</CardTitle></CardHeader>
          <CardContent className="flex-1">
            <iframe
              title="Xem trước hóa đơn"
              srcDoc={previewHtml}
              className="h-[60vh] w-full rounded border bg-white"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
