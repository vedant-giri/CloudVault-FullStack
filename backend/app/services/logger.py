import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

# Create logs directory if it doesn't exist
log_dir = Path("logs")
log_dir.mkdir(exist_ok=True)

# Create logger
logger = logging.getLogger("cloudvault")
logger.setLevel(logging.INFO)

# Prevent duplicate handlers if the app reloads
if not logger.handlers:
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(message)s"
    )

    # Console output
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    # File output with rotation
    file_handler = RotatingFileHandler(
        "logs/cloudvault.log",
        maxBytes=1024 * 1024,   # 1 MB
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setFormatter(formatter)

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)