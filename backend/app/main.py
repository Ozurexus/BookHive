import uvicorn
from config import get_config

if __name__ == '__main__':
    config = get_config()

    uvicorn.run("api:app",
                port=int(config.BackendConfig.port),
                host=config.BackendConfig.host,
                log_level=config.BackendConfig.log_level)
