FROM node:16-alpine
WORKDIR /app
COPY . /app
RUN npm install --legacy-peer-deps
EXPOSE 5000
CMD ["npm", "start"]
