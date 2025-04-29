from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import onnxruntime as ort
import numpy as np
import uvicorn
import json

app = FastAPI()

# 允許跨域（可根據需求調整）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = "uploaded_models"
MODEL_PATH = os.path.join(MODEL_DIR, "model.onnx")

if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

@app.post("/upload_model")
async def upload_model(file: UploadFile = File(...)):
    if not file.filename.endswith(".onnx"):
        raise HTTPException(status_code=400, detail="只接受 .onnx 檔案")
    with open(MODEL_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"message": "模型上傳成功"}

@app.post("/run_inference")
async def run_inference(input_data: dict):
    if not os.path.exists(MODEL_PATH):
        raise HTTPException(status_code=404, detail="尚未上傳模型")
    try:
        session = ort.InferenceSession(MODEL_PATH)
        input_names = [inp.name for inp in session.get_inputs()]
        # 假設 input_data 的 key 與模型輸入名稱一致
        inputs = {name: np.array(input_data[name]) for name in input_names}
        outputs = session.run(None, inputs)
        # 輸出格式化
        output_names = [out.name for out in session.get_outputs()]
        result = {name: outputs[i].tolist() for i, name in enumerate(output_names)}
        return JSONResponse(content={"result": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"推理失敗: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 