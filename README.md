# Garita Center

[Reporte de Garitas Tijuana](https://www.garitacenter.com/)

## Feedmetj

[Restaurantes en Tijuana](https://www.feedmetj.com/)

### Noticias México

[Últimas Noticias de México](https://www.noticiasmexico.org/)

### Comprar Casa Tijuana

[Casas en Venta en Tijuana](https://www.comprarcasatijuana.com/)

### El Valle de Guadalupe

[La Ruta del Vino Ensenada](http://www.larutadelvinoensenada.com/)

### Playami

[Restaurantes en Playas de Tijuana](http://www.playami.com/)

### Mint IT Media

[Desarrollo Web en Tijuana](https://www.mintitmedia.com/)

How to Install
====
Install node
```
nvm use
```

Install packages
```
npm i
```

Run
====
```
npm run start
```

Deploy
====
```
npm run deploy
```


Installing Puppeteer
====

Heroku needs a specific buildpacks:add:
```
heroku buildpacks:add jontewks/puppeteer
```


Heroku
====

How to set an environment variable
```
heroku config:set GITHUB_USERNAME=diegorivera
```

Stop app

```
heroku ps:scale web=0
```
