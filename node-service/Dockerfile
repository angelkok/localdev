FROM node

ARG node_env=production
ENV NODE_ENV ${node_env}

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 8001
CMD [ "node", "src/app.js" ]
