# SPA Runner

SPA que permite lanzar scripts Python desde un menú web.

## Estructura
- `/backend`: FastAPI para ejecutar scripts
- `/frontend`: React con Tailwind para SPA

## Cómo ejecutar

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```