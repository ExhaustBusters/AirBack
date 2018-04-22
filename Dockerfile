FROM node:8-stretch

WORKDIR /
RUN git clone https://github.com/ExhaustBusters/AirBack
WORKDIR /AirBack
RUN npm install --save
CMD "node" "app.js"
EXPOSE 3000