# WICM API

This the cluster management and authentication + authorization API for the [WICM](https://github.com/rmvs/wicm) web app.

```sh
DKCR_HOST=
DCKR_PORT=
DB_URL=
SECRET=
PORT=
SWARM_NETWORK_ID=
APP_URL=
```

You can install dependencies using

```sh
npm install
```

To build this project

```sh
npm run build
```

or

```sh
yarn build
```

To run this application:

First, migrate the database. This will also run the seed script and populate the database with default users and roles.

```sh
npx prisma migrate dev
```

```sh
npm run dev
```
