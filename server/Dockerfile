FROM node:16-alpine AS build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY prisma/ /app/prisma

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:16-alpine AS prod

ARG DATABASE_URL=postgresql://root:root@postgres:5432/todo-app?schema=public
ENV DATABASE_URL $DATABASE_URL

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

CMD ["npm", "run", "start:prod"]
