FROM node:19.2-slim as build

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm ci --omit=dev 

FROM node:19.2-slim

WORKDIR /app

COPY --from=build /app .

COPY ./src/ .

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    URL_K8S=http://127.0.0.1:8001

CMD ["node", "index.js"]
