# Инструкция по запуску на сервере

## Прямой запуск на сервере (без Docker)

### Требования
- Node.js 18.20.2+ или 20.9.0+
- pnpm 9+ или 10+
- PostgreSQL база данных

### Шаги деплоя

1. **Клонируйте репозиторий:**
```bash
git clone git@github.com:BaczQ/payload-cms-site.git
cd payload-cms-site
```

2. **Создайте файл `.env` с переменными окружения:**
```bash
# Обязательные переменные
PAYLOAD_SECRET=ваш-секретный-ключ-минимум-32-символа
DATABASE_URI=postgresql://user:password@host:5432/database
NEXT_PUBLIC_SERVER_URL=https://ваш-домен.com

# Опционально - для отправки email
EMAIL_FROM_ADDRESS=noreply@ваш-домен.com
EMAIL_FROM_NAME=BF News
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-password

# Для cron задач (опционально)
CRON_SECRET=ваш-секрет-для-cron
```

3. **Установите зависимости:**
```bash
pnpm install
```

4. **Соберите проект:**
```bash
pnpm build
```

5. **Запустите production сервер:**
```bash
pnpm start
```

Приложение будет доступно на `http://localhost:4000`

### Использование PM2 для управления процессом

```bash
# Установите PM2 глобально
npm install -g pm2

# Запустите приложение через PM2
pm2 start npm --name "payload-cms" -- start

# Сохраните конфигурацию PM2
pm2 save

# Настройте автозапуск при перезагрузке сервера
pm2 startup
```

## Вариант 3: Использование Nginx как reverse proxy

1. **Установите Nginx:**
```bash
sudo apt update
sudo apt install nginx
```

2. **Создайте конфигурацию Nginx:**
```nginx
# /etc/nginx/sites-available/payload-cms
server {
    listen 80;
    server_name ваш-домен.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **Активируйте конфигурацию:**
```bash
sudo ln -s /etc/nginx/sites-available/payload-cms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

4. **Настройте SSL с Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ваш-домен.com
```

## Важные замечания

1. **PAYLOAD_SECRET** - должен быть длинным случайным строкой (минимум 32 символа). Сгенерируйте его:
```bash
openssl rand -base64 32
```

2. **DATABASE_URI** - строка подключения к PostgreSQL:
```
postgresql://username:password@host:port/database
```

3. **NEXT_PUBLIC_SERVER_URL** - должен быть полным URL вашего сайта (с https://)

4. **После первого запуска** перейдите на `/admin` и создайте первого администратора

5. **Для production** убедитесь, что:
   - Все переменные окружения установлены
   - База данных доступна
   - Порт 4000 открыт (или используйте reverse proxy)
   - SSL сертификат настроен

## Проверка работоспособности

После запуска проверьте:
- Главная страница: `http://ваш-домен.com`
- Админ панель: `http://ваш-домен.com/admin`
- API: `http://ваш-домен.com/api`

## Обновление приложения

```bash
# Остановите приложение
pm2 stop payload-cms

# Получите последние изменения
git pull

# Пересоберите
pnpm build
pm2 restart payload-cms
```
