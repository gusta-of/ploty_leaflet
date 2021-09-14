FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf

COPY /dist/frontend/ /usr/share/nginx/mapa
RUN cd /usr/shared/mapa && ls -la

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]