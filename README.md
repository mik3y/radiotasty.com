# radiotasty.com

Sources to the `radiotasty.com` homepage. This is a tiny ReactJS app, bundled with Parcel.

## Developer instructions

### Local install

```
### Install main dependencies
$ yarn install

### Install pre-commit hooks for formatting (recommended)
$ pre-commit install
```

### Running the server

```
$ yarn start
Server running at http://localhost:1234
```

### Production deploy

The site is deployed to Cloudflare Pages. It is automatically rebuilt and re-deployed on every merge to the `main` branch.

You can run the same command to test the prod build:

```
$ yarn build-prod
```
