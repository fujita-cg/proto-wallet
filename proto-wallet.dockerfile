FROM cryptogarageinc/endnode-base:latest AS base
FROM node:12.14.1-buster-slim

COPY --from=base /usr/bin/bitcoin* /usr/bin/
COPY --from=base /usr/bin/elements* /usr/bin/

RUN apt update && apt install -y \
    build-essential \
    python \
    git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /tmp/cmake
RUN git clone https://github.com/Kitware/CMake.git . \
  && git checkout tags/v3.15.6 \
  && ./bootstrap \
  && make \
  && make install

# copy package.json file
WORKDIR /opt/proto-wallet
COPY ./package.json ./package-lock.json ./
RUN npm install

COPY . .

# TODO: set ENTRYPOINT