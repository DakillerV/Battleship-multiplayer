# Setup and build the client

FROM node:16 

WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY ./ ./
WORKDIR /app/client
COPY client/ ./
RUN npm install -f
RUN npm run build
WORKDIR /app
EXPOSE 3000

CMD ["node", "index.js"]
