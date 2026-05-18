import { Save, FileText } from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50 pb-6 lg:space-y-6 lg:bg-white">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b bg-white px-4 py-4 lg:hidden">
        <h1 className="text-lg font-semibold text-gray-900">Cài đặt</h1>
        <p className="text-sm text-gray-500">Quản lý cấu hình hệ thống</p>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý cấu hình hệ thống
        </p>
      </div>

      <div className="space-y-3 px-4 lg:space-y-6 lg:px-0">
        {/* Quick Links */}
        <Card className="border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader className="px-4 pb-3 pt-4 lg:px-6 lg:pb-6 lg:pt-6">
            <CardTitle className="text-base lg:text-xl">Cài đặt nhanh</CardTitle>
            <CardDescription>
              Truy cập nhanh các tính năng cài đặt
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
            <div className="grid gap-3 md:grid-cols-2">
              <Link
                to="/settings/templates"
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
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
            <CardDescription>
              Cập nhật thông tin công ty xuất hiện trên hóa đơn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Tên công ty</Label>
                <Input id="companyName" defaultValue="Công ty TNHH Vật Liệu Xây Dựng ABC" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxCode">Mã số thuế</Label>
                <Input id="taxCode" defaultValue="0123456789" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input id="address" defaultValue="123 Đường Võ Văn Tần, Q.3, TP.HCM" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" defaultValue="028 1234 5678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="info@vlxdabc.vn" />
              </div>
            </div>

            <Button className="bg-[#1E88E5] hover:bg-[#1976D2]">
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </Button>
          </CardContent>
        </Card>

        {/* Invoice Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt hóa đơn</CardTitle>
            <CardDescription>
              Tùy chỉnh cài đặt liên quan đến hóa đơn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Tiền tố hóa đơn</Label>
                <Input id="invoicePrefix" defaultValue="HD-" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextNumber">Số hóa đơn tiếp theo</Label>
                <Input id="nextNumber" type="number" defaultValue="009" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultDueDays">Số ngày đến hạn mặc định</Label>
                <Input id="defaultDueDays" type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Thuế suất mặc định (%)</Label>
                <Input id="taxRate" type="number" defaultValue="10" />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tự động tính thuế</Label>
                  <p className="text-sm text-gray-500">
                    Tự động áp dụng thuế VAT cho hóa đơn mới
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Gửi email tự động</Label>
                  <p className="text-sm text-gray-500">
                    Tự động gửi hóa đơn qua email cho khách hàng
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nhắc nhở thanh toán</Label>
                  <p className="text-sm text-gray-500">
                    Gửi nhắc nhở khi hóa đơn sắp đến hạn
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <Button className="bg-[#1E88E5] hover:bg-[#1976D2]">
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Thông báo</CardTitle>
            <CardDescription>
              Cấu hình thông báo hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thông báo hóa đơn mới</Label>
                <p className="text-sm text-gray-500">
                  Nhận thông báo khi có hóa đơn mới được tạo
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thông báo thanh toán</Label>
                <p className="text-sm text-gray-500">
                  Nhận thông báo khi có thanh toán mới
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thông báo hóa đơn quá hạn</Label>
                <p className="text-sm text-gray-500">
                  Nhận thông báo khi có hóa đơn quá hạn
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Button className="bg-[#1E88E5] hover:bg-[#1976D2]">
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}