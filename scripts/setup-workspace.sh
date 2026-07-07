#!/usr/bin/env bash
set -euo pipefail

# สร้างโฟลเดอร์แม่แล้ว clone ทุก repo เป็น sibling
# ใช้: ./scripts/setup-workspace.sh [target-dir]
# ตัวอย่าง: ./scripts/setup-workspace.sh ~/projects/fruit-shop

TARGET_DIR="${1:-$HOME/fruit-shop}"
JWT_SECRET="${JWT_SECRET:-fruit-shop-local-dev-jwt-secret-min-32-chars}"
MONGO_URI="mongodb://localhost:27017/fruitshop"

REPOS=(
  commerce-api
  Api-Gateway
  Auth-Service
  notification-service
  fruit-shop-frontend
)

echo "📁 Workspace directory: $TARGET_DIR"
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

for repo in "${REPOS[@]}"; do
  if [ -d "$repo/.git" ]; then
    echo "✓ $repo already cloned"
  else
    echo "⬇️  Cloning $repo..."
    git clone "https://github.com/panapolll/${repo}.git"
  fi
done

# คัดลอก workspace file จาก commerce-api
if [ -f commerce-api/fruit-shop.code-workspace ]; then
  cp commerce-api/fruit-shop.code-workspace ./fruit-shop.code-workspace
  echo "✓ Copied fruit-shop.code-workspace"
fi

write_env() {
  local file="$1"
  shift
  if [ -f "$file" ]; then
    echo "  skip $file (exists)"
  else
    printf '%s\n' "$@" >"$file"
    echo "  created $file"
  fi
}

echo "⚙️  Creating .env files..."

write_env Auth-Service/.env \
  "MONGODB_URI=$MONGO_URI" \
  "JWT_SECRET=$JWT_SECRET" \
  "REFRESH_TOKEN_SECRET=fruit-shop-local-refresh-secret-min-32" \
  "ADMIN_SECRET=local-admin-secret" \
  "PORT=3100"

write_env commerce-api/.env \
  "MONGODB_URI=$MONGO_URI" \
  "JWT_SECRET=$JWT_SECRET" \
  "OMISE_PUBLIC_KEY=pkey_test_xxxxxxxx" \
  "OMISE_SECRET_KEY=skey_test_xxxxxxxx" \
  "NOTIFICATION_SERVICE_URL=http://localhost:3001" \
  "PORT=3000"

write_env notification-service/.env \
  "MONGO_URI=$MONGO_URI" \
  "JWT_SECRET=$JWT_SECRET" \
  "PORT=3001"

write_env Api-Gateway/.env \
  "AUTH_SERVICE_URL=http://localhost:3100" \
  "COMMERCE_API_URL=http://localhost:3000" \
  "NOTIFICATION_SERVICE_URL=http://localhost:3001" \
  "PORT=3004"

write_env fruit-shop-frontend/.env \
  "VITE_API_URL=http://localhost:3004" \
  "VITE_OMISE_PUBLIC_KEY=pkey_test_xxxxxxxx"

echo "📦 Installing dependencies..."
for repo in "${REPOS[@]}"; do
  echo "  → $repo"
  (cd "$repo" && yarn install)
done

echo ""
echo "🐳 Starting MongoDB..."
docker compose -f commerce-api/local-dev/docker-compose.yml up -d

echo ""
echo "🌱 Seeding commerce-api (admin + products)..."
(cd commerce-api && yarn seed) || echo "  (seed skipped — run manually: cd commerce-api && yarn seed)"

echo ""
echo "✅ Done! Open in Cursor Desktop:"
echo "   File → Open Workspace from File → $TARGET_DIR/fruit-shop.code-workspace"
echo ""
echo "Then run task: Terminal → Run Task → 🚀 Start All Services"
echo "Frontend: http://localhost:5173"
