# Next.js + FastAPI ONNX 推理平台

本專案整合 Next.js 前端與 FastAPI 後端，支援 ONNX 檔案上傳、推理與結果顯示。

---

## 專案架構

- **前端**：Next.js，提供 ONNX 檔案上傳表單與推理結果顯示。
- **後端**：FastAPI，負責接收 ONNX 檔案、執行推理並回傳結果。

---

## 快速開始

### 1. 啟動 FastAPI 後端

```bash
# 進入後端目錄（如有）
uvicorn main:app --reload
# 或
python main.py
```

### 2. 啟動 Next.js 前端

```bash
npm install
npm run dev
```

瀏覽器開啟 [http://localhost:3000](http://localhost:3000) 使用前端介面。

---

## 功能說明

1. 上傳 ONNX 檔案至後端。
2. 後端自動執行推理，回傳結果。
3. 前端即時顯示推理 output。

---

## 注意事項

- FastAPI 與 Next.js 預設皆為本地端開發環境，請確認兩者 port 設定無衝突。
- 若 ONNX 模型有特殊 input 格式，請依需求調整後端推理邏輯。

---

如需協助，請聯絡專案維護者。
