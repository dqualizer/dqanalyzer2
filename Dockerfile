FROM --platform=$BUILDPLATFORM node:19-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM --platform=$BUILDPLATFORM nginx:1.22-alpine AS runtime 
COPY --from=builder /app/dist/app /usr/share/nginx/html

# Adding the env-File and the Shell-Script
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

COPY entrypoint.sh /usr/bin/

# Adding nginx-config
COPY nginx.conf  /etc/nginx/nginx.conf

RUN chmod +x /usr/bin/entrypoint.sh

# Add bash
RUN apk add --no-cache bash

RUN chmod +x env.sh

# Executing the Shell-Skript
CMD ["entrypoint.sh"]