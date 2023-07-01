import logging
import time
from io import BytesIO
from typing import Optional, List

from ml.client import MlClient
from db import DB
from config import get_config

import pandas as pd

from html.parser import HTMLParser


if __name__ == "__main__":
    pass
    # config = get_config()
    # logging.basicConfig(
    #     level=logging.DEBUG,
    #     format=(
    #         "%(filename)s: "
    #         "%(levelname)s: "
    #         "%(funcName)s(): "
    #         "%(lineno)d:\t"
    #         "%(message)s"
    #     ),
    # )
    # db = DB(config.PostgresConfig)
    #
    # clq = MlClient(db.conn)
    #
    # now = time.time()
    # print(clq.get_recommendations(1, 4))
    # print('needed_time=', time.time() - now)
    #
    # print(clq.get_recommendations(1, 4))
    # print("OK")
