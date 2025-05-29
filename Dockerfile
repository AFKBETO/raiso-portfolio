ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && apk update && apk add git
WORKDIR /app

FROM base AS build
COPY --link package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --link . ./
RUN pnpm build

FROM base
COPY --from=build /app/.output /app/dist
EXPOSE 3000
CMD [ "node", "./dist/server/index.mjs" ]