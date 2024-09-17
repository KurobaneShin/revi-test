FROM oven/bun:slim as base
WORKDIR /usr/app
ENV CI true
ADD ./package.json ./
ADD ./bun.lockb ./
RUN bun i --frozen-lockfile --no-progress --verbose --ignore-scripts
ADD . ./
RUN bun run build

CMD ["bun", "run", "start"]
