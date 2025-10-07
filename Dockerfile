FROM node:22-alpine AS base
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copy .env file first (if it exists)
COPY .env* ./

# Verify .env files were copied (will show in build logs)
RUN ls -la .env* || echo "No .env files found"

# Copy the rest of the application
COPY . .

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy environment files - make sure .env is copied
COPY --from=builder /app/.env* ./

# Verify .env files were copied to the runner stage
RUN ls -la .env* || echo "No .env files found in runner stage"

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
