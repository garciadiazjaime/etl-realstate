Install
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
