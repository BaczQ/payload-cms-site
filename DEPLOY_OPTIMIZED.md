# Оптимизированный процесс деплоя

## Обзор изменений

Проект был оптимизирован для ускорения деплоя и правильной работы с миграциями:

### ✅ Что было сделано:

1. **Миграции подключены** в `payload.config.ts`
2. **Добавлена команда** `pnpm migrate` для выполнения миграций
3. **Создан оптимизированный скрипт деплоя** `scripts/deploy-production.sh`
4. **Добавлен пример CI/CD конфигурации** `.github/workflows/deploy.yml.example`

## Два варианта деплоя

### Вариант 1: Сборка на сервере (текущий)

Используйте существующий скрипт `scripts/deploy.sh`:

```bash
./scripts/deploy.sh
```

Этот скрипт:
- Устанавливает зависимости (`pnpm install`)
- Собирает проект (`pnpm build`)
- Копирует файлы
- Перезапускает PM2

**Минусы:**
- Медленно (сборка занимает 1-2 минуты)
- Нагружает продакшн-сервер
- Требует установки dev-зависимостей на сервере

### Вариант 2: Сборка в CI/CD (рекомендуется) ⚡

Используйте новый скрипт `scripts/deploy-production.sh`:

```bash
./scripts/deploy-production.sh
```

Этот скрипт:
- Проверяет наличие готовых артефактов
- Выполняет миграции (`pnpm migrate`)
- Копирует файлы
- Перезапускает PM2

**Плюсы:**
- Быстро (только копирование файлов, ~10 секунд)
- Не нагружает продакшн-сервер
- Не требует dev-зависимостей на сервере
- Можно откатить, если что-то пошло не так

## Настройка CI/CD

### GitHub Actions

1. Скопируйте пример конфигурации:
```bash
cp .github/workflows/deploy.yml.example .github/workflows/deploy.yml
```

2. Настройте secrets в GitHub:
   - `PAYLOAD_SECRET`
   - `DATABASE_URI`
   - `NEXT_PUBLIC_SERVER_URL`
   - `SERVER_HOST`
   - `SERVER_USER`
   - `SSH_PRIVATE_KEY`

3. При каждом push в `main`/`master`:
   - Проект соберется в CI
   - Артефакты загрузятся на сервер
   - Выполнится деплой

### GitLab CI/CD

Создайте `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:20
  before_script:
    - npm install -g pnpm@10
  script:
    - pnpm install --frozen-lockfile
    - pnpm build
  artifacts:
    paths:
      - .next/standalone
      - .next/static
      - public
    expire_in: 1 hour

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client rsync
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - rsync -avz --delete .next/standalone/ $SERVER_USER@$SERVER_HOST:/var/www/bf-news/.next/standalone/
    - rsync -avz --delete .next/static/ $SERVER_USER@$SERVER_HOST:/var/www/bf-news/.next/static/
    - rsync -avz --delete public/ $SERVER_USER@$SERVER_HOST:/var/www/bf-news/public/
    - ssh $SERVER_USER@$SERVER_HOST "cd /var/www/bf-news && pnpm install --production --frozen-lockfile && ./scripts/deploy-production.sh"
  only:
    - main
    - master
```

## Миграции базы данных

### Выполнение миграций

Миграции теперь подключены в `payload.config.ts` и могут быть выполнены командой:

```bash
pnpm migrate
```

### Автоматическое выполнение

Миграции автоматически выполняются в скрипте `deploy-production.sh` перед перезапуском приложения.

### Ручное выполнение

Если нужно выполнить миграции вручную:

```bash
cd /var/www/bf-news
pnpm migrate
```

### Создание новой миграции

```bash
pnpm payload migrate:create
```

Это создаст новый файл миграции в `src/migrations/` с временной меткой.

## Рекомендуемый процесс деплоя

1. **Разработка:**
   - Внесите изменения в код
   - Создайте миграции, если изменили схему БД
   - Протестируйте локально

2. **CI/CD:**
   - Push в `main`/`master`
   - CI собирает проект
   - Артефакты загружаются на сервер

3. **Деплой:**
   - Скрипт `deploy-production.sh` выполняется автоматически
   - Миграции выполняются
   - Приложение перезапускается

4. **Проверка:**
   - Проверьте логи: `pm2 logs bf-news`
   - Проверьте статус: `pm2 status`

## Откат изменений

Если что-то пошло не так:

1. Откатите код в Git
2. Пересоберите в CI
3. Загрузите предыдущие артефакты
4. Запустите `deploy-production.sh`

Или вручную:

```bash
cd /var/www/bf-news
git checkout <previous-commit>
./scripts/deploy.sh  # Используйте старый скрипт для полной пересборки
```

## Преимущества оптимизированного подхода

✅ **Скорость:** Деплой занимает ~10 секунд вместо 1-2 минут  
✅ **Надежность:** Сборка в изолированной среде CI  
✅ **Масштабируемость:** Можно деплоить на несколько серверов  
✅ **Безопасность:** Не нужно хранить dev-зависимости на продакшн-сервере  
✅ **Откат:** Легко откатить к предыдущей версии  

## Миграции

Все миграции находятся в `src/migrations/` и автоматически подключаются через `payload.config.ts`.

Текущие миграции:
- `20250220_120000_add_libre_franklin_font.ts`
- `20251218_112446.ts`
- `20251218_184504.ts`
- `20251220_071335_add_news_posts_block.ts`
- `20251223_162014_update_font_settings.ts`
- `20251223_174007.ts`
- `20251224_015519_add_avatar_to_users.ts`

