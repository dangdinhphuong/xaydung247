# Simple POS (Point of Sale) System

## 🛠 Tech Stack
- **Frontend:** Vue 3 (Composition API) + Vite
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose)

## 🚀 Features
- Thêm sản phẩm mới với các trường: tên, giá bán, giá vốn, tồn kho, đơn vị
- Hiển thị danh sách sản phẩm
- Toast thông báo khi thêm sản phẩm thành công/thất bại

## 📁 Project Structure
```
POS/
  backend/
    controllers/
    models/
    routes/
    server.js
    package.json
    .env
  frontend/
    src/
      components/
      services/
      App.vue
    package.json
    vite.config.js
```

## ⚙️ Cài đặt & Chạy dự án

### 1. Backend
```bash
cd backend
npm install
# Tạo file .env và chỉnh sửa MONGODB_URI nếu cần
npm run dev
```

- Mặc định backend chạy ở `http://localhost:5000`
- File `.env` ví dụ:
  ```
  MONGODB_URI=mongodb://localhost:27017/pos_db
  PORT=5000
  ```

### 2. Frontend (Development)
```bash
cd frontend
npm install
npm run dev
```
- Mặc định frontend chạy ở `http://localhost:5173`

### 3. Build & Deploy Frontend (Production)
#### Build project
```bash
cd frontend
npm run build
```
- Thư mục `dist` sẽ được tạo ra.

#### Dùng serve để chạy thử bản build
```bash
npm install -g serve
serve -s dist
```
- Mặc định chạy ở http://localhost:3000

#### Deploy lên server thực tế (Nginx/Apache...)
- Copy toàn bộ thư mục `dist` lên server.
- Cấu hình web server trỏ root về thư mục `dist`.

**Ví dụ cấu hình Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/project/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🌐 API Endpoints
- `GET /api/products` — Lấy danh sách sản phẩm
- `POST /api/products` — Thêm sản phẩm mới

## 📋 Ghi chú
- Đảm bảo MongoDB đã chạy trên máy bạn.
- Đã bật CORS cho phép frontend truy cập backend.

---

Made with ❤️ by AI 