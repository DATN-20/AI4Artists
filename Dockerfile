FROM node:20 as builder

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

FROM node:20

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

RUN npm install --only=production

EXPOSE 8080

CMD ["npm", "run", "start"]