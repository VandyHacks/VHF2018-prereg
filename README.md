VandyHacks 2018 landing page
==

Installing
---

    npm install
    npm install --only=dev

Prod
---

    npm run prod    # builds files
    npm start       # starts server

Create a .env file and add:

    MC_INSTANCE_ID = {region/instance}
    MC_LIST_ID = {list id}
    MC_API_KEY = {api key}
    MG_PUBLIC_KEY = {mailgun public api key}

Dev
---
Running:

    npm run dev     # starts webpack dev server, with hot reload

    ### NOTE: todo: proxy webpack-dev-server to our own server?
    ### The webpack-dev-server doesn't write to disk. It serves the result from memory.

Linting:

    npm run lint

Check for outdated deps:

    npm outdated

Disclaimer: recycled and updated from [last year](https://github.com/VandyHacks/VHF2017-prereg).
