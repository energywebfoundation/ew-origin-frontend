### STAGE 1: Build ###
FROM node:latest as build
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install --silent
COPY . /usr/src/app
RUN npm run build

### STAGE 2: Production Environment ###
FROM nginx:stable-alpine
COPY --from=build /usr/src/app/index.html /usr/src/app/index2.html /usr/share/nginx/html/
COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html/dist
COPY --from=build /usr/src/app/assets/ /usr/share/nginx/html/assets
COPY --from=build /usr/src/app/nginx-default-with-try-files.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
