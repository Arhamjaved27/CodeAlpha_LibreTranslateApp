from pathlib import Path
from typing import Optional

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"


class TranslateRequest(BaseModel):
    text: str
    source: Optional[str] = "auto"
    target: str


app = FastAPI(title="Language Translation Tool")

# Enable CORS broadly to simplify local dev and possible static hosting scenarios
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (CSS/JS)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/")
async def root_index():
    index_file = STATIC_DIR / "index.html"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="index.html not found")
    return FileResponse(index_file, media_type="text/html")


@app.post("/api/translate")
async def translate(req: TranslateRequest):
    text = (req.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="'text' must not be empty")

    source_lang = (req.source or "auto").strip() or "auto"
    target_lang = (req.target or "").strip()
    if not target_lang:
        raise HTTPException(status_code=400, detail="'target' language is required")

    base_url = os.getenv("LIBRETRANSLATE_URL", "https://libretranslate.com")
    translate_url = base_url.rstrip("/") + "/translate"
    
    # Get API key from environment (optional, for self-hosted instances)
    api_key = os.getenv("LIBRETRANSLATE_API_KEY", "")

    payload = {
        "q": text,
        "source": source_lang,
        "target": target_lang,
        "format": "text",
    }
    
    # Add API key if provided
    if api_key:
        payload["api_key"] = api_key

    timeout = httpx.Timeout(15.0, connect=10.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        try:
            resp = await client.post(translate_url, data=payload, headers={"Accept": "application/json"})
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=502, detail=f"Translation service error: {exc}")

    if resp.status_code != 200:
        # Try to provide upstream error details when possible
        try:
            err_json = resp.json()
        except Exception:
            err_json = {"error": resp.text}
        raise HTTPException(status_code=resp.status_code, detail={"upstream": err_json})

    try:
        data = resp.json()
        translated = data.get("translatedText")
    except Exception:
        raise HTTPException(status_code=502, detail="Invalid response from translation service")

    if not translated:
        raise HTTPException(status_code=502, detail="Missing translatedText from translation service")

    return JSONResponse({"translatedText": translated})


