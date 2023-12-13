FROM node:20-alpine

ARG ENV="TEST"
ARG PORT="4200"
ARG API_URL=""

WORKDIR /app

COPY . .

RUN npm ci \
    && npm install -g @angular/cli@^16.2.7 \
    && npm cache clean --force

EXPOSE $PORT

RUN chmod +x entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]
