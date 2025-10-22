# ---- Stage: build (keeps cache hot) ----
FROM node:21-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# If you have a build step (TS, etc.):
# RUN npm run build

# ---- Stage: runtime ----
FROM node:21-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app ./
EXPOSE 3003
# change if your service starts differently:
CMD ["node", "index.js"]
