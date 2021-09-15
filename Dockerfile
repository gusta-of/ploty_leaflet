FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY /dist/www/ /app/www/
RUN cd /app/www/ && ls -la

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]