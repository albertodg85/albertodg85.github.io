
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScriptRequest(BaseModel):
    script_name: str

AVAILABLE_SCRIPTS = {
    "hola": "scripts/hola.py",
    "procesar": "scripts/procesar_datos.py",
    "resumen": "scripts/generar_resumen.py"
}

@app.post("/run")
def run_script(req: ScriptRequest):
    script_path = AVAILABLE_SCRIPTS.get(req.script_name)
    if not script_path:
        return {"output": "Script no encontrado"}
    try:
        result = subprocess.run(["python3", script_path], capture_output=True, text=True)
        return {"output": result.stdout or result.stderr}
    except Exception as e:
        return {"output": str(e)}
