# Etapa 1: Build de la aplicación React con Vite
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servidor NGINX con Fail2ban para producción
FROM nginx:1.27-alpine

# Instalar Fail2ban y dependencias de red
RUN apk add --no-cache fail2ban bash iptables iproute2

# Copiar archivos de la app
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar configuración de Fail2ban
COPY jail.local /etc/fail2ban/jail.local
COPY filter-http-flood.conf /etc/fail2ban/filter.d/http-flood.conf

# Copiar y dar permisos al entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
