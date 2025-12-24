# Быстрая инструкция по деплою

## Обычный деплой (когда изменился код)

```bash
cd /var/www/bf-news
git pull origin main
pnpm install
pnpm build
pnpm migrate
pm2 restart bf-news
```

Или одной командой:

```bash
cd /var/www/bf-news && git pull origin main && pnpm install && pnpm build && pnpm migrate && pm2 restart bf-news
```

## Быстрый перезапуск (когда код не менялся)

```bash
pm2 restart bf-news
```

## Проверка после деплоя

```bash
# Статус
pm2 status

# Логи
pm2 logs bf-news --lines 50

# Проверка сайта
curl -I http://localhost:4000
```

## Что делать если что-то сломалось

```bash
# Посмотреть логи ошибок
pm2 logs bf-news --err

# Перезапустить
pm2 restart bf-news

# Если не помогает - полная пересборка
cd /var/www/bf-news
git pull origin main
pnpm install
pnpm build
pnpm migrate
pm2 restart bf-news
```

Всё! 🚀

