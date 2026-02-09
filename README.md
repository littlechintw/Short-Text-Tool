# Short Text Tool

一個基於 Vue.js 的短網址生成工具，可以將文字內容轉換為短網址，並支援在螢幕上顯示內容。

## 功能特色

- 📝 **文字轉短網址** - 將任何文字內容轉換為易於分享的短網址
- 🔗 **自動生成短碼** - 系統自動生成唯一的短網址代碼
- 📋 **一鍵複製** - 支援複製短網址和原始內容
- 🌐 **螢幕顯示** - 整合外部螢幕顯示服務
- 🎨 **現代化 UI** - 採用玻璃擬態設計風格
- 📱 **響應式設計** - 支援桌面和移動設備
- 🔒 **安全 API** - 使用 Google Apps Script 作為後端
- ⚡ **快速載入** - Vite 建構，優化性能
- 🌍 **多語言支援** - 介面包含中英文說明

## 技術棧

- **前端框架**: Vue 3 + Composition API
- **建構工具**: Vite 4
- **路由管理**: Vue Router 4
- **狀態管理**: Vuex 4
- **UI 框架**: Vuetify 3
- **HTTP 客戶端**: Fetch API (原生)
- **後端 API**: Google Apps Script
- **部署平台**: GitHub Pages
- **程式碼檢查**: ESLint

## 專案設定

### 環境需求

- Node.js 18+
- npm 或 yarn

### 安裝依賴

```bash
npm install
```

### 環境變數配置

1. 複製環境變數範例檔案：
```bash
cp .env.example .env.local
```

2. 編輯 `.env.local` 並設定您的 Google Apps Script URL：
```
VITE_GAS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

> **注意**: `.env.local` 文件不會被提交到 Git，請妥善保管您的 API URL。

### 開發環境

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 上運行。

### 生產建構

```bash
npm run build
```

### 程式碼檢查

```bash
npm run lint
```

### 預覽生產建構

```bash
npm run preview
```

## 使用說明

### 建立短網址

1. 在首頁的文字框中輸入您的內容（最多 1500 字元）
2. 點擊 "Short it!" 按鈕
3. 系統會生成短網址並顯示在結果區域

### 訪問短網址

1. 複製生成的短網址（如: `https://s.littlechin.tw/abc123`）
2. 在瀏覽器中訪問該網址
3. 系統會顯示原始內容和相關操作按鈕

### 螢幕顯示

在結果頁面點擊 "Show on Screen" 按鈕，可以在外部螢幕服務上顯示內容。

## 部署

專案使用 GitHub Actions 工作流程自動部署到 GitHub Pages，並配置自訂域名 s.littlechin.tw。

### 部署設定

1. **啟用 GitHub Pages**
   - 前往 GitHub 倉庫的 Settings > Pages
   - 在 "Source" 下拉選單中選擇 "GitHub Actions"
   - **重要**: 必須選擇 "GitHub Actions" 而非 "Deploy from a branch"，才能使用新的部署方式

2. **設定自訂域名**
   - 在倉庫的 `public` 目錄中已有 `CNAME` 文件，內容為 `s.littlechin.tw`
   - 確保域名 `s.littlechin.tw` 的 DNS 記錄正確設定：
     - 類型: CNAME
     - 名稱: s
     - 值: littlechintw.github.io
   - 或使用 A 記錄指向 GitHub Pages 的 IP 地址

3. **設定環境變數**
   - 在 GitHub 倉庫的 Settings > Secrets and variables > Actions
   - 新增 `VITE_GAS_URL` 秘密變數，設定為您的 Google Apps Script URL

4. **觸發部署**
   - 推送程式碼到 `main` 分支
   - GitHub Actions 會自動執行建構和部署
   - 部署完成後，網站將可在 https://s.littlechin.tw 訪問

### 環境變數說明

- `VITE_GAS_URL`: Google Apps Script API 端點 URL
  - 開發環境：從 `.env.local` 讀取
  - 生產環境：從 GitHub Secrets 讀取

### 工作流程說明

專案使用現代化的 GitHub Pages 部署方式：
- 使用官方的 `actions/configure-pages`、`actions/upload-pages-artifact` 和 `actions/deploy-pages` actions
- 分離建構和部署階段，提供更好的控制和錯誤處理
- 自動設定必要的權限和並發控制
- CNAME 文件會自動從 `public/` 目錄複製到建構輸出，確保自訂域名正確配置

## 專案結構

```
src/
├── assets/           # 靜態資源（圖片、字體等）
├── components/       # 可重用 Vue 組件
├── plugins/          # 插件配置（Vuetify 等）
├── router/           # Vue Router 配置
├── store/            # Vuex 狀態管理
├── views/            # 頁面級組件
│   ├── Home.vue      # 首頁（建立短網址）
│   └── Result.vue    # 結果頁面（顯示內容）
├── App.vue           # 根組件
├── main.js           # 應用程式入口
└── registerServiceWorker.js

public/               # 公共靜態文件
├── _redirects        # SPA 路由重定向規則
├── CNAME            # 自訂域名配置
├── favicon.ico      # 網站圖標
├── index.html       # HTML 模板
└── robots.txt       # 搜索引擎配置

GAS/                  # Google Apps Script 相關文件
.github/
└── workflows/        # GitHub Actions 配置
    └── deploy.yml    # 自動部署工作流程
```

## 貢獻

歡迎提交 Issue 和 Pull Request！

1. Fork 此專案
2. 建立功能分支：`git checkout -b feature/amazing-feature`
3. 提交變更：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 開啟 Pull Request

