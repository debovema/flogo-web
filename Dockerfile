FROM golang:1.6.2-alpine
MAINTAINER Aditya Wagle

VOLUME "./docker-shared"

WORKDIR /tmp/flogo-web

COPY . /tmp/flogo-web

## INSTALL NODE
RUN apk --no-cache add make nodejs python bash git g++ && \
    node --version && \
    cd /tmp/flogo-web/build/server && \
    echo "### RUNNING npm install ### " && \
    # progress=false is reported to increase npm install speed (https://github.com/npm/npm/issues/11283)
    npm set progress=false && \
    npm install --production && \
    echo "### RUNNING npm cache clear ### " && \
    npm cache clear && \
    echo "### CLEANING libraries ### " && \
    apk --no-cache del make python g++ && \
    chmod 777 /tmp/flogo-web/docker-start.sh && \
    echo "Installing GB" && \
    go get github.com/constabulary/gb/...

WORKDIR /tmp/flogo-web

EXPOSE 3010

ENTRYPOINT /tmp/flogo-web/docker-start.sh