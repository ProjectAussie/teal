FROM node:current

ADD . client/
WORKDIR client
RUN npm install
RUN npm rebuild

CMD ["npm", "run", "dev"]
