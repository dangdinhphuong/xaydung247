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

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
- Mặc định frontend chạy ở `http://localhost:5173`

## 🌐 API Endpoints
- `GET /api/products` — Lấy danh sách sản phẩm
- `POST /api/products` — Thêm sản phẩm mới

## 📋 Ghi chú
- Đảm bảo MongoDB đã chạy trên máy bạn.
- Đã bật CORS cho phép frontend truy cập backend.

---

Made with ❤️ by AI 