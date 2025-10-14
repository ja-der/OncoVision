FROM node:22-alpine AS build-frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM python:3.11-slim AS build-backend
WORKDIR /app/backend
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server/ .

FROM python:3.11-slim

# Set non-interactive frontend for Debian
# ENV DEBIAN_FRONTEND=noninteractive

# Copy backend and frontend
WORKDIR /app

RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

COPY --from=build-backend /app/backend ./backend
COPY --from=build-frontend /app/client/dist ./frontend

COPY --from=build-backend /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=build-backend /usr/local/bin /usr/local/bin

# Copy nginx config
COPY server/nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 5000

CMD ["sh", "-c", "nginx && python3 backend/app.py"]



