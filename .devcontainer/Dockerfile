FROM oven/bun:1.0.34 AS build
COPY --from=node:20.11.1 /usr/local/bin/node /usr/local/bin/node

USER bun
WORKDIR /home/bun/app
CMD ["/bin/bash"]
