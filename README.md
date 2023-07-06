# WICM API

Cluster management and authentication + authorization API for the [WICM](https://github.com/rmvs/wicm) web app.

```sh
DKCR_HOST=
DCKR_PORT=
DB_URL=
SECRET=
PORT=
SWARM_NETWORK_ID=
APP_URL=
```

Set the default swarm network ID variable in ```SWARM_NETWORK_ID``` and ```APP_URL``` for the web app. ```DKCR_HOST``` and ```DCKR_PORT``` are the remote/local docker daemon host and port API respectively. If the host is remote, you might need to [secure](https://docs.docker.com/engine/security/protect-access/) the Docker API. Tipically, the socket is tcp://127.0.0.1:2375/ if you prefer to manage locally.

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
