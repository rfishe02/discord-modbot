# discord-modbot

## Recommended bot configuration

This application requires the `Privileged Gateway Intents` `SERVER MEMBERS` and `MESSAGE CONTENT`. These can be found in the application settings of the Discord developer portal.

## Setting up application configuration files

1. This project uses the `config.json` file to store confidential information like API keys. You will need to create your own. 

An example `config.json` file:
```
{
	"token": "your-token-goes-here",
	"clientId": "your-application-id-goes-here",
	"guildId": "your-server-id-goes-here"
}
```

2. This project also uses the Google Cloud Vision API to analyze images. It requires the environment variable `GOOGLE_APPLICATION_CREDENTIALS` set to the location of the service account key.

```
export GOOGLE_APPLICATION_CREDENTIALS=""
```

## Running the application

This project uses Docker to run the application. The `v` and `e` flags allow the service to use a local service account key.

```
docker build --tag discord-modbot .
docker run -v $GOOGLE_APPLICATION_CREDENTIALS:/tmp/keys/service_account_key.json:ro -e GOOGLE_APPLICATION_CREDENTIALS=/tmp/keys/service_account_key.json discord-modbot
```