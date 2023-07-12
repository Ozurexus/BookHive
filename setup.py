import argparse
import json

DEFAULT_CONFIG_DIR = "./config"
DEFAULT_COMPOSE_PATH = f"{DEFAULT_CONFIG_DIR}/docker-compose.tmpl"
DEFAULT_NGINX_CONF_PATH = f"{DEFAULT_CONFIG_DIR}/nginx.conf.tmpl"
CLIENT_CONFIG_PATH = "./client/src/cfg/config.json"


def setup_compose():
    max_depth = 5
    parser = argparse.ArgumentParser()
    parser.add_argument("-c", "--config")

    args = parser.parse_args()

    config_path = f"{DEFAULT_CONFIG_DIR}/{args.config}.json"
    f = open(config_path, "r")
    config_file = f.read()
    config_dict: dict = json.loads(config_file)

    config_vars = {}

    def read_config_deep(prev_key: str, mapper: dict, cur: int):
        if cur == max_depth:
            return
        for key in mapper.keys():
            val = mapper.get(key)
            if isinstance(val, dict):
                new_val = f"{prev_key}{key}_"
                read_config_deep(new_val, val, cur)
            else:
                config_vars[f"{prev_key}{key}"] = val

    read_config_deep("", config_dict, 0)

    def apply_templater(tmpl_body: str):
        for config_key in config_vars:
            config_val = str(config_vars.get(config_key))
            to_replace = "{{ " + f"{config_key}" + " }}"
            tmpl_body = tmpl_body.replace(to_replace, config_val)
        return tmpl_body

    # docker-compose.yml
    compose_tmpl = open(DEFAULT_COMPOSE_PATH, "r").read()
    compose_tmpl = apply_templater(compose_tmpl)

    # nginx.conf
    nginx_tmpl = open(DEFAULT_NGINX_CONF_PATH, "r").read()
    nginx_tmpl = apply_templater(nginx_tmpl)

    with open("docker-compose.yml", "w") as compose_file:
        compose_file.write(compose_tmpl)

    with open("nginx.conf", "w") as nginx_file:
        nginx_file.write(nginx_tmpl)

    with open("config.json", "w") as core_config:
        core_config.write(config_file)

    with open(CLIENT_CONFIG_PATH, "w") as clint_config:
        clint_config.write(json.dumps(config_dict.get('client')))


if __name__ == "__main__":
    setup_compose()
