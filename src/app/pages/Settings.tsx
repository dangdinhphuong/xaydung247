import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Save, FileText, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { useSettings, useUpdateSettings } from '../hooks/queries';
import { useAuth } from '../auth/AuthContext';
import { LoadingState, ErrorState } from '../components/QueryStates';
import { getErrorMessage } from '../lib/errors';
import type { AppSettings } from '../types';

export default function Settings() {
  const { hasRole } = useAuth();
  const canEdit = hasRole('ADMIN');
  const { data, isLoading, isError, error, refetch } = useSettings();
  const updateMut = useUpdateSettings();
  const [form, setForm] = useState<AppSettings | null>(null);
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    if (data) {
      setForm(data);
      setQrError(false);
    }
  }, [data]);

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      toast.error('Kích thước ảnh QR không được vượt quá 500KB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        set('bankQrImageUrl', base64);
        setQrError(false);
        toast.success('Tải ảnh QR lên thành công');
      }
    };
    reader.onerror = () => {
      toast.error('Có lỗi xảy ra khi đọc file ảnh');
    };
    reader.readAsDataURL(file);
  };

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
              <Link to="/settings/templates/new" className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50 active:bg-gray-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E88E5]/10">
                  <FileText className="h-5 w-5 text-[#1E88E5]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Mẫu in hóa đơn bán hàng</p>
                  <p className="text-sm text-gray-500">Thiết lập nội dung, bố cục và thông tin hiển thị khi in hóa đơn.</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
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

        {/* Bank & QR Code Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tài khoản ngân hàng & mã QR thanh toán</CardTitle>
            <CardDescription>Cấu hình tài khoản nhận thanh toán và ảnh QR để hiển thị trên hóa đơn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankName">Ngân hàng</Label>
                <Input
                  id="bankName"
                  placeholder="Ví dụ: Vietcombank, Techcombank, MB Bank"
                  value={form.bankName || ''}
                  onChange={(e) => set('bankName', e.target.value)}
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Số tài khoản</Label>
                <Input
                  id="bankAccountNumber"
                  placeholder="Nhập số tài khoản nhận thanh toán"
                  value={form.bankAccountNumber || ''}
                  onChange={(e) => set('bankAccountNumber', e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankAccountName">Chủ tài khoản</Label>
                <Input
                  id="bankAccountName"
                  placeholder="Nhập tên chủ tài khoản"
                  value={form.bankAccountName || ''}
                  onChange={(e) => set('bankAccountName', e.target.value)}
                  disabled={!canEdit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankBranch">Chi nhánh</Label>
                <Input
                  id="bankBranch"
                  placeholder="Ví dụ: Chi nhánh TP. Hồ Chí Minh"
                  value={form.bankBranch || ''}
                  onChange={(e) => set('bankBranch', e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="bankQrEnabled">Hiển thị mã QR thanh toán trên hóa đơn</Label>
                <p className="text-sm text-gray-500">Tự động chèn mã QR thanh toán vào mẫu in hóa đơn khi cấu hình</p>
              </div>
              <Switch
                id="bankQrEnabled"
                checked={!!form.bankQrEnabled}
                onCheckedChange={(v) => set('bankQrEnabled', v)}
                disabled={!canEdit}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-4 md:col-span-2">
                <div className="space-y-2">
                  <Label htmlFor="bankQrImageUrl">Ảnh mã QR</Label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      id="bankQrImageUrl"
                      placeholder="Dán URL ảnh QR hoặc tải ảnh lên"
                      value={form.bankQrImageUrl || ''}
                      onChange={(e) => {
                        set('bankQrImageUrl', e.target.value);
                        setQrError(false);
                      }}
                      disabled={!canEdit}
                      className="flex-1"
                    />
                    <div className="flex gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!canEdit}
                        onClick={() => document.getElementById('qr-upload-input')?.click()}
                      >
                        Tải ảnh lên
                      </Button>
                      {form.bankQrImageUrl && (
                        <Button
                          type="button"
                          variant="destructive"
                          disabled={!canEdit}
                          onClick={() => {
                            set('bankQrImageUrl', '');
                            setQrError(false);
                          }}
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                    <input
                      id="qr-upload-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleQrUpload}
                      disabled={!canEdit}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankQrNote">Nội dung chuyển khoản mặc định</Label>
                  <Input
                    id="bankQrNote"
                    placeholder="Ví dụ: Thanh toán hóa đơn {{Ma_Hoa_Don}}"
                    value={form.bankQrNote || ''}
                    onChange={(e) => set('bankQrNote', e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center border rounded-lg p-4 bg-gray-50/50 min-h-[160px]">
                <span className="text-xs font-semibold text-gray-500 mb-2">Xem trước mã QR</span>
                {form.bankQrImageUrl ? (
                  qrError ? (
                    <div className="text-xs text-red-500 text-center py-4">
                      Không thể tải ảnh QR
                    </div>
                  ) : (
                    <img
                      src={form.bankQrImageUrl}
                      alt="Xem trước QR"
                      onError={() => setQrError(true)}
                      className="max-h-32 max-w-full object-contain border bg-white p-1 rounded shadow-sm"
                    />
                  )
                ) : (
                  <div className="text-xs text-gray-400 text-center py-4">
                    Chưa có ảnh QR
                  </div>
                )}
              </div>
            </div>

            {canEdit && (
              <Button
                className="bg-[#1E88E5] hover:bg-[#1976D2]"
                disabled={updateMut.isPending}
                onClick={async () => {
                  try {
                    await updateMut.mutateAsync({
                      bankName: form.bankName,
                      bankAccountNumber: form.bankAccountNumber,
                      bankAccountName: form.bankAccountName,
                      bankBranch: form.bankBranch,
                      bankQrEnabled: form.bankQrEnabled,
                      bankQrImageUrl: form.bankQrImageUrl,
                      bankQrNote: form.bankQrNote,
                    });
                    toast.success('Đã lưu thông tin ngân hàng');
                  } catch (err) {
                    toast.error(getErrorMessage(err));
                  }
                }}
              >
                <Save className="mr-2 h-4 w-4" />
                Lưu thông tin ngân hàng
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Mẫu in hóa đơn bán hàng */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#1E88E5]" />
              Mẫu in hóa đơn bán hàng
            </CardTitle>
            <CardDescription>
              Thiết lập nội dung, bố cục và thông tin hiển thị khi in hóa đơn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/settings/templates/new">
                <FileText className="mr-2 h-4 w-4" />
                Mở trình chỉnh sửa mẫu in
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
