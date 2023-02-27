# discord-modbot

## Setting up configuration files

This project uses `.env` and `config.json` files to store confidential information like API keys. You will need to create your own.

An example `.env` file:
```
DISCORD_TOKEN=your-token-here
```

## Running the application

This project uses Docker to run the application.

`docker build --tag discord-modbot`
`docker run discord-modbot`