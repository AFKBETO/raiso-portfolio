# Portfolio

This repository is the codebase for the portfolio at [https://buithuhuong.work/](https://buithuhuong.work/).
This is still a work in progress and is subject to change on demand of the website's owner.

## How to deploy on local machine

### Prequisites

1. Git
2. Node.js v22.14.0
3. Download [PNPM](https://pnpm.io/installation).

### Clone and install dependencies
```bash
git clone https://github.com/AFKBETO/raiso-portfolio.git
cd raiso-portfolio
pnpm i
```

### Set up environment variable file

Add a ``.env`` file at the project's root directory.

```
NUXT_MONGO_URI=<your-mongo-connection-string>
NUXT_PUBLIC_CDN_URL=<your-base-cdn-url>
```

### Start the development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm dev
```
