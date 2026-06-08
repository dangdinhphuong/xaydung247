# Setup Guide — MVP v1

## Yêu cầu hệ thống

- Node.js 20 LTS
- pnpm 8+
- MongoDB 6+ (local hoặc Docker)
- Docker + docker-compose (cho production deploy)

---

## Local development

### 1. Clone & install
```bash
git clone <repo>
cd invoice-pro
pnpm install
```

### 2. Start MongoDB local

Option A — Docker:
```bash
docker run -d --name invoicepro-mongo -p 27017:27017 -v invoicepro-mongo-data:/data/db mongo:6
```

Option B — local install (xem MongoDB docs).

### 3. Setup backend
```bash
cd apps/backend
cp .env.example .env
# Edit .env: SESSION_SECRET (openssl rand -hex 32), MONGODB_URI=mongodb://localhost:27017/invoicepro
pnpm seed                                # tạo admin user + settings
pnpm seed --demo                         # (optional) thêm demo data
pnpm dev                                 # NestJS dev server :3000
```

### 4. Setup frontend
```bash
cd apps/frontend
cp .env.example .env
# Edit .env: VITE_API_BASE_URL=http://localhost:3000/api
pnpm dev                                 # Vite dev server :5173
```

### 5. Login
- Mở http://localhost:5173
- Login với admin email/password đã setup trong seed.

---

## Production deploy (on-prem)

### 1. Server requirements
- Linux Ubuntu 22.04+ hoặc tương tự
- 2 CPU + 2GB RAM tối thiểu (cho 5 user đồng thời)
- 20GB disk
- Public IP hoặc internal LAN
- Domain (`shop.example.com`) + TLS cert (Let's Encrypt qua certbot)

### 2. Cấu hình env

```env
# apps/backend/.env
NODE_ENV=production
PORT=3000
TZ=Asia/Ho_Chi_Minh
MONGODB_URI=mongodb://mongo:27017/invoicepro
SESSION_SECRET=<openssl rand -hex 32>

# apps/frontend/.env (build-time)
VITE_API_BASE_URL=/api
```

### 3. docker-compose

Đã định nghĩa trong `architecture/system-architecture.md` §3. Đặt file ở root repo.

```bash
docker compose build
docker compose up -d
```

### 4. Init data

Chạy seed 1 lần:
```bash
docker compose exec backend pnpm seed
# Prompt admin email + password
```

### 5. Backup

Cron host:
```bash
# /etc/cron.d/invoicepro-backup
0 2 * * * root docker exec invoicepro-mongo-1 mongodump --db invoicepro --out /backup/$(date +\%Y\%m\%d) && find /backup -mtime +30 -delete
```

Setup volume `/backup` mount vào container mongo.

### 6. TLS cert

```bash
certbot --nginx -d shop.example.com
```

Update `nginx.conf` với cert path:
```nginx
listen 443 ssl;
ssl_certificate /etc/letsencrypt/live/shop.example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/shop.example.com/privkey.pem;
```

---

## Cập nhật phiên bản mới

```bash
git pull
docker compose build
docker compose up -d --no-deps backend frontend
```

Nếu có schema migration:
```bash
docker compose exec backend pnpm migrate
```

---

## Troubleshooting

### Backend connect Mongo fail
```bash
docker compose logs backend
# Check MONGODB_URI hostname (phải là 'mongo' nếu cùng compose, hoặc 'localhost' nếu local)
```

### Session không persist
- Check cookie `connect.sid` trong browser DevTools.
- Check `connect-mongo` đã tạo collection `sessions` trong MongoDB.
- Check `Secure` cookie chỉ chạy trên HTTPS (set `secure: false` khi dev local HTTP).

### CSRF EBADCSRFTOKEN
- FE phải fetch `/api/auth/csrf` trước mọi mutation.
- Cookie session phải được gửi kèm (`credentials: 'include'`).

### TZ sai
- Check `TZ=Asia/Ho_Chi_Minh` đã set trong container backend.
- `docker exec backend date` phải trả về VN time.

---

## Development workflow

1. Tạo feature branch: `git checkout -b feature/add-customer-bulk-import`
2. Code + test
3. `pnpm lint && pnpm test`
4. PR review
5. Merge → CI build → deploy staging → manual smoke test → deploy prod
