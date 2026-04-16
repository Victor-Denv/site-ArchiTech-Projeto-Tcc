# Usamos o Nginx, que é um servidor web super rápido e leve
FROM nginx:alpine

# Copiamos todos os arquivos do seu projeto para dentro da pasta do Nginx
# Certifique-se de que o Dockerfile está na pasta principal do projeto
COPY . /usr/share/nginx/html

# Expomos a porta 80 (padrão web)
EXPOSE 80

# O Nginx inicia automaticamente