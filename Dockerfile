FROM node:alpine as build

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g

RUN mkdir /app
WORKDIR /app

COPY . /app
RUN npm install
RUN ls -la /app

FROM node:alpine

COPY --from=build /app /app
RUN ls -la /app
WORKDIR /app
RUN node -v
RUN npm -v

CMD ["npm","run","start"]
