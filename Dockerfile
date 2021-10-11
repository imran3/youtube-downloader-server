FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

# Bundle app source
COPY . .

EXPOSE 5000
CMD [ "node", "src/index.js" ]