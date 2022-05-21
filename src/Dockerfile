FROM node:16.3.0-alpine as build
WORKDIR /nodesrc
COPY . .

RUN npm install
RUN npm run build


FROM node:16.3.0-alpine
RUN npm install -g serve@12.0.0

COPY --from=build /nodesrc/build /app

WORKDIR /app
EXPOSE 5000
CMD ["serve", "-p", "5000", "-n", "."]
