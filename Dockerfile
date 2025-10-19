# Build Frontend (React + Node)
FROM node:22-alpine AS build-frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Build Backend (Python + Flask)
FROM python:3.11-slim AS build-backend
WORKDIR /app/backend
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server/ .

# Build Final Runtime Image
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends nginx supervisor && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
RUN rm -f /etc/nginx/sites-enabled/default

COPY --from=build-backend /app/backend ./backend
COPY --from=build-frontend /app/client/dist /var/www/html

COPY --from=build-backend /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=build-backend /usr/local/bin /usr/local/bin

COPY server/nginx.conf /etc/nginx/conf.d/default.conf
COPY server/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80 5000

CMD ["/usr/bin/supervisord"]



