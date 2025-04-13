FROM node:23-slim AS base

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm run build

FROM base AS release

RUN corepack enable

WORKDIR /usr/src/app

COPY --from=prod-deps /usr/src/app/node_modules ./node_modules

COPY --from=prod-deps /usr/src/app/package.json ./package.json

COPY --from=build /usr/src/app/build ./build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
