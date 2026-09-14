FROM node:24-alpine AS dependencies

WORKDIR /app

RUN apk add --no-cache curl

COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS development

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

FROM dependencies AS production

ENV NEXT_TELEMETRY_DISABLED=1

ARG BASE_URL
ARG BETTER_AUTH_URL
ARG CLIENT_ID
ARG ISSUER

RUN mkdir -p /app/data && chown node:node /app/data
COPY --chown=node:node . .
RUN --mount=type=secret,id=better_auth_secret,env=BETTER_AUTH_SECRET,required=true \
    --mount=type=secret,id=client_secret,env=CLIENT_SECRET,required=true \
    DATABASE_PATH=:memory: npm run build
RUN npm prune --omit=dev
RUN mkdir -p /app/.next/cache/images \
    && chown -R node:node /app/.next/cache

ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/sqlite.db
USER node

EXPOSE 3000
CMD ["sh", "-c", "npm run auth:migrate && exec npm run start -- --hostname 0.0.0.0"]
