import logging

import uvicorn
from config import get_config

if __name__ == "__main__":
    config = get_config()
    logging.basicConfig(
        level=config.BackendConfig.log_level.upper(),
        format=(
            "%(filename)s: "
            "%(levelname)s: "
            "%(funcName)s(): "
            "%(lineno)d:\t"
            "%(message)s"
        ),
    )

    uvicorn.run(
        "api:app",
        port=int(config.BackendConfig.port),
        host=config.BackendConfig.host,
        log_level=config.BackendConfig.log_level,
    )
