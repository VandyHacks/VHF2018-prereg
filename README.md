VandyHacks 2018 landing page
==

Installing
---

    npm install
    npm install --only=dev

Running
---

    npm run build	# npm run build:prod for production
    npm start

Create a .env file and add:

    MC_INSTANCE_ID = {region/instance}
    MC_LIST_ID = {list id}
    MC_API_KEY = {api key}
    MG_PUBLIC_KEY = {mailgun public api key}

Dev
---
Running:

    npm i -g nodemon
    npm run watch:start

Linting:

    npm run lint

Disclaimer: recycled and updated from [last year](https://github.com/VandyHacks/VHF2017-prereg).
