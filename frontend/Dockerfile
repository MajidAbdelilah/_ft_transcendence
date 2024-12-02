FROM node:18-bullseye
WORKDIR /app
COPY . /app/frontend/
WORKDIR /app/frontend
RUN npm install
CMD ["npm", "run", "dev"]