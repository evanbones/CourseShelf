FROM node:22-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:22-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:22-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npx prisma generate 
RUN npm run build

FROM node:22-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules

COPY --from=build-env /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build-env /app/node_modules/@prisma/client /app/node_modules/@prisma/client
COPY --from=build-env /app/prisma.config.ts /app/

COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/prisma /app/prisma 
WORKDIR /app
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm run start"]