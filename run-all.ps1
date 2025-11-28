# run-all.ps1
# Script build & run toàn bộ hệ thống LongDistanceBus

$ErrorActionPreference = "Stop"

# Thư mục gốc của project (chính là nơi đặt file này)
$root = $PSScriptRoot
Write-Host "Project root: $root" -ForegroundColor Green

# ===== 1. Build gateway =====
Write-Host "`n=== [1/4] mvn clean install - gateway ===" -ForegroundColor Cyan
Push-Location "$root\gateway"
mvn clean install
Pop-Location

# ===== 2. Build user-service =====
Write-Host "`n=== [2/4] mvn clean install - user-service ===" -ForegroundColor Cyan
Push-Location "$root\services\user-service"
mvn clean install
Pop-Location

# ===== 3. Run gateway & user-service ở 2 cửa sổ riêng =====
Write-Host "`n=== [3/4] Starting gateway & user-service ===" -ForegroundColor Cyan

Start-Process powershell -ArgumentList `
  "-NoExit", `
  "-Command", "cd `"$root\gateway`"; mvn spring-boot:run"

Start-Process powershell -ArgumentList `
  "-NoExit", `
  "-Command", "cd `"$root\services\user-service`"; mvn spring-boot:run"

# ===== 4. FE: npm install (nếu cần) + npm run dev =====
Write-Host "`n=== [4/4] Frontend: npm install (nếu thiếu) + npm run dev ===" -ForegroundColor Cyan
Push-Location "$root\frontend"

if (-not (Test-Path "node_modules")) {
  Write-Host "Chưa có node_modules → chạy npm install..." -ForegroundColor Yellow
  npm install
} else {
  Write-Host "Đã có node_modules → bỏ qua npm install." -ForegroundColor Yellow
}

npm run dev

Pop-Location
