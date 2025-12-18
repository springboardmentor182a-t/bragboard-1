"""Entry point for the BragBoard Admin API."""
import uvicorn
from .app import app
from .config import HOST, PORT

if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)

