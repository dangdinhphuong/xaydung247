import { useEffect, useMemo, useState } from 'react';
import { Save, FileText, Eye, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
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
import type { AppSettings } from '../types';

export default function Settings() {
  const { hasRole } = useAuth();
  const canEdit = hasRole('ADMIN');
  const { data, isLoading, isError, error, refetch } = useSettings();
  const updateMut = useUpdateSettings();
  const [form, setForm] = useState<AppSettings | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  // HTML xem trước, render template hiện tại (hoặc mẫu mặc định) với hóa đơn mẫu.
  const previewHtml = useMemo(
    () => (form ? buildInvoiceHtml(SAMPLE_INVOICE, form) : ''),
    [form],
  );

  if (isLoading) return <LoadingState label="Đang tải cài đặt..." />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (!form) return null;

  const set = <K extends keyof AppSettings>(k: K, v: AppSettings[K]) =>
    setForm({ ...form, [k]: v });

  const save = async (fields: (keyof AppSettings)[]) => {
    const payload: Partial<AppSettings> = {};
    for (const f of fields) (payload as any)[f] = form[f];
    try {
      await updateMut.mutateAsync(payload);
      toast.success('Đã lưu thay đổi');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6 lg:space-y-6 lg:bg-white">
      <div className="sticky top-0 z-30 border-b bg-white px-4 py-4 lg:hidden">
        <h1 className="text-lg font-semibold text-gray-900">Cài đặt</h1>
        <p className="text-sm text-gray-500">Quản lý cấu hình hệ thống</p>
      </div>
      <div className="hidden lg:block">
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
        <p className="mt-1 text-sm text-gray-500">Quản lý cấu hình hệ thống</p>
      </div>

      <div className="space-y-3 px-4 lg:space-y-6 lg:px-0">
        {!canEdit && (
          <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
            Bạn chỉ có quyền xem cài đặt. Chỉ quản trị viên (ADMIN) mới có thể chỉnh sửa.
          </div>
        )}

        <Card className="border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader className="px-4 pb-3 pt-4 lg:px-6 lg:pb-6 lg:pt-6">
            <CardTitle className="text-base lg:text-xl">Cài đặt nhanh</CardTitle>
            <CardDescription>Truy cập nhanh các tính năng cài đặt</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
            <div className="grid gap-3 md:grid-cols-2">
              <Link to="/settings/templates" className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50 active:bg-gray-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E88E5]/10">
                  <FileText className="h-5 w-5 text-[#1E88E5]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Mẫu hóa đơn</p>
                  <p className="text-sm text-gray-500">Tùy chỉnh mẫu in hóa đơn</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin công ty</CardTitle>
            <CardDescription>Cập nhật thông tin công ty xuất hiện trên hóa đơn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Tên công ty</Label>
                <Input id="companyName" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} disabled={!canEdit} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxCode">Mã số thuế</Label>
                <Input id="taxCode" value={form.companyTaxCode} onChange={(e) => set('companyTaxCode', e.target.value)} disabled={!canEdit} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input id="address" value={form.companyAddress} onChange={(e) => set('companyAddress', e.target.value)} disabled={!canEdit} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" value={form.companyPhone} onChange={(e) => set('companyPhone', e.target.value)} disabled={!canEdit} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.companyEmail} onChange={(e) => set('companyEmail', e.target.value)} disabled={!canEdit} />
              </div>
            </div>
            {canEdit && (
              <Button className="bg-[#1E88E5] hover:bg-[#1976D2]" disabled={updateMut.isPending}
                onClick={() => save(['companyName', 'companyTaxCode', 'companyAddress', 'companyPhone', 'companyEmail'])}>
                <Save className="mr-2 h-4 w-4" />Lưu thay đổi
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Invoice Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt hóa đơn</CardTitle>
            <CardDescription>Tùy chỉnh cài đặt liên quan đến hóa đơn và báo giá</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Tiền tố hóa đơn</Label>
                <Input id="invoicePrefix" value={form.invoicePrefix} onChange={(e) => set('invoicePrefix', e.target.value.toUpperCase())} disabled={!canEdit} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quotationPrefix">Tiền tố báo giá</Label>
                <Input id="quotationPrefix" value={form.quotationPrefix} onChange={(e) => set('quotationPrefix', e.target.value.toUpperCase())} disabled={!canEdit} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultDueDays">Số ngày đến hạn mặc định</Label>
                <Input id="defaultDueDays" type="number" min="0" max="365" value={form.defaultDueDays} onChange={(e) => set('defaultDueDays', Number(e.target.value))} disabled={!canEdit} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Thuế suất mặc định (%)</Label>
                <Input id="taxRate" type="number" min="0" max="100" value={form.defaultTaxRate} onChange={(e) => set('defaultTaxRate', Number(e.target.value))} disabled={!canEdit} />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tự động tính thuế</Label>
                <p className="text-sm text-gray-500">Tự động áp dụng thuế VAT cho hóa đơn mới khi không nhập thuế</p>
              </div>
              <Switch checked={form.autoTax} onCheckedChange={(v) => set('autoTax', v)} disabled={!canEdit} />
            </div>
            {canEdit && (
              <Button className="bg-[#1E88E5] hover:bg-[#1976D2]" disabled={updateMut.isPending}
                onClick={() => save(['invoicePrefix', 'quotationPrefix', 'defaultDueDays', 'defaultTaxRate', 'autoTax'])}>
                <Save className="mr-2 h-4 w-4" />Lưu thay đổi
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Mẫu in hóa đơn (HTML) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#1E88E5]" />
              Mẫu in hóa đơn (HTML)
            </CardTitle>
            <CardDescription>
              Tùy chỉnh bố cục in hóa đơn bằng HTML. Trường nào có trong mẫu sẽ được thay bằng
              dữ liệu thật; trường không có thì bỏ qua. Bạn không bắt buộc phải dùng đủ các trường.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={form.invoiceTemplateHtml}
              onChange={(e) => set('invoiceTemplateHtml', e.target.value)}
              disabled={!canEdit}
              rows={16}
              className="font-mono text-xs"
              placeholder="Dán mã HTML mẫu hóa đơn vào đây..."
            />

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setPreviewOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />Xem trước
              </Button>
              {canEdit && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => set('invoiceTemplateHtml', DEFAULT_INVOICE_TEMPLATE_HTML)}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />Dùng mẫu mặc định
                  </Button>
                  <Button
                    className="bg-[#1E88E5] hover:bg-[#1976D2]"
                    disabled={updateMut.isPending}
                    onClick={() => save(['invoiceTemplateHtml'])}
                  >
                    <Save className="mr-2 h-4 w-4" />Lưu mẫu
                  </Button>
                </>
              )}
            </div>

            <div className="rounded-lg bg-gray-50 p-4 text-sm">
              <p className="mb-2 font-medium text-gray-700">Placeholder gợi ý (không bắt buộc dùng hết):</p>
              <div className="space-y-2">
                {TEMPLATE_PLACEHOLDER_GROUPS.map((g) => (
                  <div key={g.group}>
                    <p className="text-xs font-semibold text-gray-500">{g.group}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {g.items.map((it) => (
                        <code key={it} className="rounded bg-white px-1.5 py-0.5 text-xs text-[#1E88E5] ring-1 ring-gray-200">
                          {'{{'}{it}{'}}'}
                        </code>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="pt-1 text-xs text-gray-500">
                  Vùng lặp sản phẩm: bọc trong <code className="text-[#1E88E5]">{'{{#items}} ... {{/items}}'}</code> (hoặc <code className="text-[#1E88E5]">{'{{#each items}} ... {{/each}}'}</code>).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Xem trước mẫu in với dữ liệu hóa đơn mẫu */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Xem trước mẫu in</DialogTitle>
            <DialogDescription>Hiển thị mẫu hiện tại với dữ liệu hóa đơn mẫu.</DialogDescription>
          </DialogHeader>
          <iframe
            title="Xem trước hóa đơn"
            srcDoc={previewHtml}
            className="h-[70vh] w-full rounded border bg-white"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
