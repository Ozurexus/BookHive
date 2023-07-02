import logging

import uvicorn

from util import get_config

if __name__ == "__main__":
    config = get_config()
    logging.basicConfig(
        level=config.ml.log_level.upper(),
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
        port=int(config.ml.port),
        host=config.ml.host,
        log_level=config.ml.log_level,
    )
