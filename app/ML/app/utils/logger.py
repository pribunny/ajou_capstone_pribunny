# logger
import logging

logger = logging.getLogger("app_logger")
logger.setLevel(logging.INFO)

if not logger.hasHandlers():  # 중복 방지
    console_handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(levelname)s] %(asctime)s - %(message)s")
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)