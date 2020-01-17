FROM ubuntu:18.04

# install dependencies
RUN apt update && apt install -y \
    gpg \
    wget \
  && rm -rf /var/lib/apt/lists/*

# setup bitcoin
ARG BITCOIN_VERSION=0.18.1
ENV BITCOIN_TARBALL bitcoin-$BITCOIN_VERSION-x86_64-linux-gnu.tar.gz
ENV BITCOIN_URL https://bitcoincore.org/bin/bitcoin-core-$BITCOIN_VERSION/$BITCOIN_TARBALL
ENV BITCOIN_ASC_URL https://bitcoincore.org/bin/bitcoin-core-$BITCOIN_VERSION/SHA256SUMS.asc
ENV BITCOIN_PGP_KEY 01EA5486DE18A882D4C2684590C8019E36C2E964

WORKDIR /tmp
RUN wget -qO $BITCOIN_TARBALL "$BITCOIN_URL" \
    && gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys "$BITCOIN_PGP_KEY" \
    && wget -qO SHA256SUMS.asc "$BITCOIN_ASC_URL" \
    && gpg --verify SHA256SUMS.asc \
    && sha256sum --ignore-missing --check SHA256SUMS.asc \
    && tar -xzvf $BITCOIN_TARBALL \
    && cp bitcoin-$BITCOIN_VERSION/bin/bitcoin* /usr/bin/ \
    && rm -rf $BITCOIN_TARBALL bitcoin-$BITCOIN_VERSION

# setup elements
ARG ELEMENTS_VERSION=0.18.1.3
ENV ELEMENTS_TARBALL elements-$ELEMENTS_VERSION-x86_64-linux-gnu.tar.gz
ENV ELEMENTS_URL https://github.com/ElementsProject/elements/releases/download/elements-$ELEMENTS_VERSION/$ELEMENTS_TARBALL
ENV ELEMENTS_ASC_URL https://github.com/ElementsProject/elements/releases/download/elements-$ELEMENTS_VERSION/SHA256SUMS.asc
ENV ELEMENTS_PGP_KEY 17A985E3CF2C185F6FA87E95F3F68E2D86A48FDB

RUN wget -qO $ELEMENTS_TARBALL "$ELEMENTS_URL" \
  && gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys "$ELEMENTS_PGP_KEY" \
  && wget -qO SHA256SUMS.asc "$ELEMENTS_ASC_URL" \
  && gpg --verify SHA256SUMS.asc \
  && sha256sum --ignore-missing --check SHA256SUMS.asc \
  && tar -xzvf $ELEMENTS_TARBALL \
  && cp elements-$ELEMENTS_VERSION/bin/elements* /usr/bin/ \
  && rm -rf $ELEMENTS_TARBALL elements-$ELEMENTS_VERSION