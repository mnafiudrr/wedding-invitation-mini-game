# ---- Stage 1: build ----
FROM node:24-alpine AS build
WORKDIR /app

# Install dependencies (production + dev for build)
COPY package.json package-lock.json ./
RUN npm ci

# Build the app
COPY . .
RUN npm run build

# ---- Stage 2: runtime ----
FROM node:24-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Only runtime dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Built output (client assets + server + index.js)
COPY --from=build /app/build ./build

# Config + init scripts referenced at runtime
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/scripts ./scripts
RUN chmod +x scripts/entrypoint.sh

EXPOSE 3000
CMD ["scripts/entrypoint.sh"]