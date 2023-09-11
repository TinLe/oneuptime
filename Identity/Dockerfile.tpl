#
# OneUptime-identity Dockerfile
#

# Pull base image nodejs image.
FROM node:current-alpine
USER root
RUN mkdir /tmp/npm &&  chmod 2777 /tmp/npm && chown 1000:1000 /tmp/npm && npm config set cache /tmp/npm --global

ARG GIT_SHA
ARG APP_VERSION

ENV GIT_SHA=${GIT_SHA}
ENV APP_VERSION=${APP_VERSION}


# Install bash. 
RUN apk update && apk add bash && apk add curl


# Install python
RUN apk update && apk add --no-cache --virtual .gyp python3 make g++

#Use bash shell by default
SHELL ["/bin/bash", "-c"]


RUN mkdir /usr/src

# Install common
RUN mkdir /usr/src/Common
WORKDIR /usr/src/Common
COPY ./Common/package*.json /usr/src/Common/
RUN npm install
COPY ./Common /usr/src/Common


# Install Model
RUN mkdir /usr/src/Model
WORKDIR /usr/src/Model
COPY ./Model/package*.json /usr/src/Model/
RUN npm install
COPY ./Model /usr/src/Model



# Install CommonServer
RUN mkdir /usr/src/CommonServer
WORKDIR /usr/src/CommonServer
COPY ./CommonServer/package*.json /usr/src/CommonServer/
RUN npm install
COPY ./CommonServer /usr/src/CommonServer



#SET ENV Variables
ENV PRODUCTION=true

RUN mkdir /usr/src/app

WORKDIR /usr/src/app

# Install app dependencies
COPY ./Identity/package*.json /usr/src/app/
RUN npm install

# Expose ports.
#   - 3087: OneUptime-backend
EXPOSE 3087

{{ if eq .Env.ENVIRONMENT "development" }}
#Run the app
CMD [ "npm", "run", "dev" ]
{{ else }}
# Copy app source
COPY ./Identity /usr/src/app
# Bundle app source
RUN npm run compile
#Run the app
CMD [ "npm", "start" ]
{{ end }}

