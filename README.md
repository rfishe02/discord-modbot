# discord-modbot

## Recommended bot configuration

This application requires the `Privileged Gateway Intents` `SERVER MEMBERS` and `MESSAGE CONTENT`. These can be found in the application settings of the Discord developer portal.

## Setting up application configuration files

This project uses `.env` and `config.json` files to store confidential information like API keys. You will need to create your own.

An example `config.json` file:
```
{
	"token": "your-token-goes-here",
	"clientId": "your-application-id-goes-here",
	"guildId": "your-server-id-goes-here"
}
```

## Running the application

This project uses Docker to run the application.

```
docker build --tag discord-modbot .
docker run discord-modbot
```