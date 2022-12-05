# FROM node:19.2-slim as debugger

# WORKDIR /app

# COPY ["package.json", "package-lock.json", "./"]

# RUN npm ci --production
# RUN npm install -g nodemon

# COPY ./src/ .


# ENV NODE_ENV=production \
#     HOST=0.0.0.0 \
#     PORT=3000 \
#     URL_K8S=http://127.0.0.1:8001



# # ENTRYPOINT [ "nodemon", "--inspect=0.0.0.0", "./index.js" ]

# # FROM node:19.2-slim

# # WORKDIR /app

# # COPY --from=debugger /app /app

# # COPY ./src/ /app/

# # ENV NODE_ENV=production \
# #     HOST=0.0.0.0 \
# #     PORT=3000 \
# #     URL_K8S=http://127.0.0.1:8001



# # CMD ["node", "index.js"]


FROM node:19.2-slim as debug

WORKDIR /work/

# COPY ./src/package.json /work/package.json
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci
RUN npm install -g nodemon

COPY ./src/ .

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    URL_K8S=http://127.0.0.1:8001

ENTRYPOINT [ "nodemon","--inspect=0.0.0.0","./index.js" ]

FROM node:19.2-slim as prod

WORKDIR /work/

# COPY ./src/package.json /work/package.json
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci --production
COPY ./src/ /work/

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    URL_K8S=http://127.0.0.1:8001

CMD node .
