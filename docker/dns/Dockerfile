FROM alpine:3.18.4

RUN apk update
RUN apk upgrade
RUN apk add bash dnsmasq
RUN rm -rf /var/cache/apk/*
RUN mkdir -p /etc/default/
RUN echo -e "ENABLED=1\nIGNORE_RESOLVCONF=yes" > /etc/default/dnsmasq

CMD ["dnsmasq","--no-daemon"]
