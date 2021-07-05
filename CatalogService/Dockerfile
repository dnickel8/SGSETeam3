FROM node:14

# Create app directory
WORKDIR ./

COPY ["package.json", "package-lock.json*", "./"]


RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]