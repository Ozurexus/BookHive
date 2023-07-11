import json
import logging

import psycopg2

CONFIG_PATH = "./config.json"


class DictObj:
    def __init__(self, in_dict: dict):
        assert isinstance(in_dict, dict)
        for key, val in in_dict.items():
            if isinstance(val, (list, tuple)):
                setattr(
                    self, key, [DictObj(x) if isinstance(x, dict) else x for x in val]
                )
            else:
                setattr(self, key, DictObj(val) if isinstance(val, dict) else val)


class Postgres:
    def __init__(self):
        self.database: str = ""
        self.user: str = ""
        self.password: str = ""
        self.host: str = ""
        self.port: int = 0


class ML:
    def __init__(self):
        self.port: int = 8080
        self.host: str = "0.0.0.0"
        self.log_level: str = "info"
        self.ml_retrain_counter = 5
        self.backend_addr = "http://backend:8080"
        self.public_addr = "http://127.0.0.1:8090"
        self.mock = True


class Config:
    def __init__(self):
        self.pg = Postgres()
        self.ml = ML()


def get_config() -> Config:
    config_file = open(CONFIG_PATH, "r")
    config_json: dict = json.loads(config_file.read())

    config: Config = Config()
    postgres = DictObj(config_json.get("postgres"))
    ml = DictObj(config_json.get("ml"))

    # merging
    config.pg = postgres
    config.ml = ml

    return config


class DB:
    def __init__(self, conf: Config):
        pg_conf = conf.pg
        logging.info("connecting to postgres...")
        self.conn = psycopg2.connect(
            dbname=pg_conf.database,
            user=pg_conf.user,
            password=pg_conf.password,
            host=pg_conf.host,
            port=int(pg_conf.port),
        )
        self.conf = conf
        self.cur = self.conn.cursor()
        logging.info("connected!")
