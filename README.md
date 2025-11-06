# Language Translation Tool

A modern, web-based language translation application built with FastAPI and LibreTranslate. This tool provides a user-friendly interface for translating text between multiple languages using a self-hosted or cloud-based translation service.

**Developed by:** Arham

---

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

- **Multi-language Support**: Translate text between 30+ languages
- **Auto-detection**: Automatically detect the source language
- **Self-hosted Option**: Use your own LibreTranslate instance for privacy and unlimited translations
- **Modern UI**: Clean, responsive web interface
- **Fast API**: Built with FastAPI for high performance
- **Copy to Clipboard**: Easy copy functionality for translated text
- **Real-time Translation**: Instant translation results
- **Error Handling**: Comprehensive error messages and user feedback

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9+** - [Download Python](https://www.python.org/downloads/)
- **Docker Desktop** (for self-hosting LibreTranslate) - [Download Docker](https://www.docker.com/products/docker-desktop/)
- **Git** (optional, for cloning the repository)

---

## 📦 Installation

### Step 1: Clone or Download the Project

If you have the project in a Git repository:
```bash
git clone https://github.com/Arhamjaved27/CodeAlpha_LibreTranslateApp.git
cd translate-app
```

Or simply navigate to the project directory if you already have it.

### Step 2: Create a Virtual Environment

Create a Python virtual environment to isolate project dependencies:

**Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
python -m venv .venv
.venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Step 3: Install Dependencies

Install all required Python packages:

```bash
pip install -r requirements.txt
```

This will install:
- `fastapi` - Modern web framework
- `uvicorn` - ASGI server
- `httpx` - HTTP client library
- `jinja2` - Template engine
- `python-dotenv` - Environment variable management

### Step 4: Set Up LibreTranslate (Self-Hosted)

#### Option A: Run LibreTranslate with Docker (Recommended)

1. **Start LibreTranslate without API key requirement** (for local development):
   ```bash
   docker run -d -p 5000:5000 --name libretranslate -e LT_API_KEYS=false libretranslate/libretranslate
   ```

2. **Or with API key** (for production):
   ```bash
   docker run -d -p 5000:5000 --name libretranslate -e LT_API_KEYS=true -e LT_API_KEY=your-secret-key-here libretranslate/libretranslate
   ```

3. **Verify LibreTranslate is running**:
   ```bash
   docker ps
   ```
   You should see a container named `libretranslate` running on port 5000.

4. **Test the LibreTranslate API**:
   ```bash
   curl http://localhost:5000/languages
   ```
   Or visit `http://localhost:5000` in your browser.

#### Option B: Use Public LibreTranslate Instance

You can skip Docker setup and use the public instance at `https://libretranslate.com` (note: may have rate limits).

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root directory:

```env
LIBRETRANSLATE_URL=http://localhost:5000
LIBRETRANSLATE_API_KEY=
```

**Configuration Options:**

- `LIBRETRANSLATE_URL`: The URL of your LibreTranslate instance
  - Default: `https://libretranslate.com`
  - For self-hosted: `http://localhost:5000`
  
- `LIBRETRANSLATE_API_KEY`: API key for LibreTranslate (optional, only if your instance requires it)
  - Leave empty if API keys are disabled
  - Set to your key if using API key authentication

### Example `.env` File

**For self-hosted without API key:**
```env
LIBRETRANSLATE_URL=http://localhost:5000
LIBRETRANSLATE_API_KEY=
```

**For self-hosted with API key:**
```env
LIBRETRANSLATE_URL=http://localhost:5000
LIBRETRANSLATE_API_KEY=your-secret-key-here
```

**For public instance:**
```env
LIBRETRANSLATE_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=
```

---

## 🚀 Usage

### Starting the Application

1. **Activate your virtual environment** (if not already activated):
   ```powershell
   # Windows PowerShell
   .\.venv\Scripts\Activate.ps1
   ```

2. **Start the FastAPI server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

### Using the Web Interface

1. **Select Source Language**: Choose the source language from the dropdown (or select "Auto" for automatic detection)
2. **Select Target Language**: Choose the language you want to translate to
3. **Enter Text**: Type or paste the text you want to translate in the text area
4. **Click Translate**: Click the "Translate" button to get the translation
5. **Copy Result**: Use the "Copy" button to copy the translated text to your clipboard

### API Usage

You can also use the API directly:

```bash
curl -X POST "http://localhost:8000/api/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, world!",
    "source": "auto",
    "target": "es"
  }'
```

Response:
```json
{
  "translatedText": "¡Hola, mundo!"
}
```

---

## 📁 Project Structure

```
translate-app/
├── app/
│   ├── __pycache__/
│   └── main.py              # FastAPI application and API endpoints
├── static/
│   ├── index.html           # Main HTML interface
│   ├── app.js               # Frontend JavaScript logic
│   └── styles.css           # Styling and CSS
├── .env                     # Environment variables (create this)
├── requirements.txt         # Python dependencies
└── README.md                # This file
```

### Key Files

- **`app/main.py`**: Main FastAPI application with translation API endpoint
- **`static/index.html`**: User interface HTML structure
- **`static/app.js`**: Frontend logic for language selection and translation
- **`static/styles.css`**: Styling for the web interface
- **`requirements.txt`**: Python package dependencies
- **`.env`**: Environment configuration (create this file)

---

## 📚 API Documentation

### Endpoints

#### `GET /`
Serves the main HTML interface.

#### `POST /api/translate`
Translates text from one language to another.

**Request Body:**
```json
{
  "text": "Text to translate",
  "source": "auto",  // Optional: language code or "auto" for detection
  "target": "es"     // Required: target language code
}
```

**Response:**
```json
{
  "translatedText": "Translated text"
}
```

**Error Responses:**

- `400 Bad Request`: Missing or invalid input
- `502 Bad Gateway`: Translation service error

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/translate" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "source": "auto", "target": "fr"}'
```

### Supported Language Codes

Common language codes supported by LibreTranslate:
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `zh` - Chinese
- `ar` - Arabic
- And many more...

Visit `http://localhost:5000/languages` (or your LibreTranslate instance) to see all supported languages.

---

## 🛠️ Technologies Used

- **FastAPI** - Modern, fast web framework for building APIs
- **Uvicorn** - Lightning-fast ASGI server
- **LibreTranslate** - Open-source machine translation service
- **Docker** - Containerization for LibreTranslate
- **Python 3.9+** - Programming language
- **JavaScript** - Frontend interactivity
- **HTML/CSS** - User interface

---

## 🔍 Troubleshooting

### Issue: "Visit https://portal.libretranslate.com to get an API key"

**Solution:** Your LibreTranslate instance requires an API key. Either:
1. Restart LibreTranslate without API keys:
   ```bash
   docker stop libretranslate
   docker rm libretranslate
   docker run -d -p 5000:5000 --name libretranslate -e LT_API_KEYS=false libretranslate/libretranslate
   ```
2. Or add the API key to your `.env` file:
   ```env
   LIBRETRANSLATE_API_KEY=your-api-key-here
   ```

### Issue: Port 5000 already in use

**Solution:** Use a different port for LibreTranslate:
```bash
docker run -d -p 5001:5000 --name libretranslate libretranslate/libretranslate
```
Then update `.env`:
```env
LIBRETRANSLATE_URL=http://localhost:5001
```

### Issue: Cannot connect to LibreTranslate

**Solution:**
1. Check if Docker is running: `docker ps`
2. Verify LibreTranslate container is running: `docker ps --filter "name=libretranslate"`
3. Check logs: `docker logs libretranslate`
4. Test the endpoint: `curl http://localhost:5000/languages`

### Issue: ModuleNotFoundError: No module named 'dotenv'

**Solution:** Install dependencies:
```bash
pip install -r requirements.txt
```

### Issue: Translation service error

**Solution:**
1. Verify LibreTranslate is running and accessible
2. Check your `.env` file has the correct `LIBRETRANSLATE_URL`
3. Restart your FastAPI application
4. Check LibreTranslate logs: `docker logs libretranslate`

### Useful Docker Commands

- **Stop LibreTranslate:**
  ```bash
  docker stop libretranslate
  ```

- **Start LibreTranslate:**
  ```bash
  docker start libretranslate
  ```

- **View logs:**
  ```bash
  docker logs libretranslate
  ```

- **Remove container:**
  ```bash
  docker rm libretranslate
  ```

---

## 📝 Notes

- Public LibreTranslate instances may rate-limit heavy use. Self-hosting eliminates this issue.
- Source language can be set to `auto` for automatic detection.
- First run of LibreTranslate may take time as it downloads language models.
- The application supports CORS for cross-origin requests.
- Translation quality depends on the language pair and model used by LibreTranslate.

---

## 👨‍💻 Developer

**Developed by:** Arham

---

## 📄 License

This project is open source and available for personal and educational use.

---

## 🙏 Acknowledgments

- [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) - Open-source translation service
- [FastAPI](https://fastapi.tiangolo.com/) - Web framework
- All contributors and the open-source community

---

For more information or support, please refer to the project documentation or create an issue in the repository.
