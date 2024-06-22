FROM fnwharbor.enncloud.cn/fnw/nginx-brotli:latest
ADD default.conf /etc/nginx/conf.d/
ADD dist/. /usr/share/nginx/html/

CMD ["sh", "-c", "echo $(cp -f /usr/share/nginx/html/env/\"$ENV\".js /usr/share/nginx/html/env_config.js); nginx -g \"daemon off;\""]
