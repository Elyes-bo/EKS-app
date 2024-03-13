FROM node:14-slim 
WORKDIR /app
COPY . .
# Install dependencies and PM2
RUN npm install 
EXPOSE 3000
CMD [ "node", "app.js" ]


