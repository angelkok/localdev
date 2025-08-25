FROM node as base

ARG node_env=production
ENV NODE_ENV ${node_env}

WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm i --save-dev @types/swagger-jsdoc
COPY . .

FROM base as production

ENV NODE_PATH=./build
EXPOSE 8002
RUN npm run build
#CMD [ "node", "src/app.ts" ]
