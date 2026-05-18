import { useState } from 'react';
import { Search, Plus, Edit, Package, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';
import { products } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

export default function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Mặt hàng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tổng cộng {filteredProducts.length} sản phẩm
          </p>
        </div>
        <Button className="hidden bg-[#1E88E5] hover:bg-[#1976D2] lg:flex">
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
        {/* Mobile: Floating Action Button */}
        <Button
          size="icon"
          className="fixed bottom-24 right-4 z-10 h-14 w-14 rounded-full bg-[#1E88E5] shadow-lg hover:bg-[#1976D2] lg:hidden"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile: Card Layout */}
      <div className="lg:hidden">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Danh sách sản phẩm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters - Bottom Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    {categoryFilter === 'all' ? 'Tất cả danh mục' : categoryFilter}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto">
                <SheetHeader>
                  <SheetTitle>Lọc theo danh mục</SheetTitle>
                  <SheetDescription>Chọn danh mục sản phẩm</SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  <Button
                    variant={categoryFilter === 'all' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setCategoryFilter('all')}
                  >
                    Tất cả danh mục
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={categoryFilter === category ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Product List Items */}
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 rounded-lg border bg-white p-3 transition-colors hover:bg-gray-50"
                >
                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 line-clamp-2">
                      {product.name}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                      <span>{product.category}</span>
                      <span>•</span>
                      <span>{product.unit}</span>
                      <span>•</span>
                      <span className="font-medium text-[#1E88E5]">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="py-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">Không tìm thấy sản phẩm</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop: Table Layout */}
      <Card className="hidden lg:block">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead className="text-right">Đơn giá</TableHead>
                <TableHead className="text-right">Tồn kho</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        product.stock < 100
                          ? 'font-medium text-red-600'
                          : 'text-gray-900'
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-gray-600">
                    {product.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
