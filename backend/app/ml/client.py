import json
import logging
import urllib
from typing import List


class MlClient:
    def __init__(self, ml_addr: str):
        self.ml_addr = ml_addr

    def get_recommendations(self, user_id: int, limit: int = None) -> List[int]:
        dst_url = f"{self.ml_addr}/books/recommendations/{user_id}"
        if not limit is None:
            dst_url += f"?limit={limit}"
        try:
            req = urllib.request.Request(dst_url, method='GET')
            resp = urllib.request.urlopen(req)
            books_ids = json.loads(resp.read())
            return books_ids
        except urllib.error.HTTPError as e:
            logging.error(f"http error: error={e}")
        except urllib.error.URLError as e:
            logging.error(f"url error: error={e}")
        except Exception as e:
            logging.error(f"unknown error={e}")

    def retrain_model(self):
        dst_url = f"{self.ml_addr}/model/retrain"
        try:
            req = urllib.request.Request(dst_url, method='GET')
            resp = urllib.request.urlopen(req)
            logging.debug(resp.getcode())
        except urllib.error.HTTPError as e:
            logging.error(f"http error: error={e}")
        except urllib.error.URLError as e:
            logging.error(f"url error: error={e}")
        except Exception as e:
            logging.error(f"unknown error={e}")
