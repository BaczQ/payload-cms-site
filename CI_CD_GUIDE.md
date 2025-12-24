# Что такое CI/CD и как его настроить

## Простыми словами

**CI/CD** — это автоматизация процесса деплоя. Вместо того, чтобы вручную заходить на сервер и выполнять команды, всё происходит автоматически при push в Git.

### Как это работает сейчас (без CI/CD):

1. Вы делаете изменения в коде
2. Коммитите и пушите в Git
3. **Вручную** заходите на сервер
4. **Вручную** делаете `git pull`
5. **Вручную** запускаете `./scripts/deploy.sh`
6. Ждёте 1-2 минуты пока всё соберётся

### Как будет работать с CI/CD:

1. Вы делаете изменения в коде
2. Коммитите и пушите в Git
3. **Автоматически** GitHub собирает проект
4. **Автоматически** загружает на сервер
5. **Автоматически** перезапускает приложение
6. Всё готово за ~30 секунд!

## Что такое CI и CD?

- **CI (Continuous Integration)** — непрерывная интеграция
  - Автоматическая сборка проекта при каждом push
  - Проверка, что код компилируется
  - Запуск тестов (если есть)

- **CD (Continuous Deployment)** — непрерывное развёртывание
  - Автоматическая загрузка на сервер
  - Автоматический деплой
  - Автоматический перезапуск

## Настройка для вашего проекта

У вас уже есть репозиторий на GitHub: `BaczQ/payload-cms-site`

### Шаг 1: Создать файл конфигурации

Создайте файл `.github/workflows/deploy.yml` в корне проекта:

```bash
mkdir -p .github/workflows
cp .github/workflows/deploy.yml.example .github/workflows/deploy.yml
```

### Шаг 2: Настроить секреты в GitHub

1. Откройте ваш репозиторий на GitHub: https://github.com/BaczQ/payload-cms-site
2. Перейдите в **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **New repository secret**
4. Добавьте следующие секреты:

#### Обязательные секреты:

**PAYLOAD_SECRET**
- Значение: ваш секретный ключ (минимум 32 символа)
- Можно сгенерировать: `openssl rand -base64 32`

**DATABASE_URI**
- Значение: строка подключения к PostgreSQL
- Формат: `postgresql://user:password@host:5432/database`

**NEXT_PUBLIC_SERVER_URL**
- Значение: `https://bfnews.ru`

**SERVER_HOST**
- Значение: IP-адрес или домен вашего сервера
- Пример: `123.45.67.89` или `bfnews.ru`

**SERVER_USER**
- Значение: имя пользователя для SSH
- Обычно: `root` или ваш пользователь

**SSH_PRIVATE_KEY**
- Значение: приватный SSH ключ для доступа к серверу
- Как получить:
  ```bash
  # На сервере создайте ключ (если нет)
  ssh-keygen -t rsa -b 4096 -C "github-actions"
  
  # Скопируйте приватный ключ
  cat ~/.ssh/id_rsa
  # Скопируйте ВЕСЬ вывод (включая -----BEGIN и -----END)
  ```

### Шаг 3: Настроить SSH на сервере

Убедитесь, что GitHub Actions может подключиться к серверу:

```bash
# На сервере добавьте публичный ключ в authorized_keys
# (если используете существующий ключ, добавьте его публичную часть)
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Шаг 4: Проверить работу

1. Сделайте небольшое изменение в коде
2. Закоммитьте и запушьте:
   ```bash
   git add .
   git commit -m "Test CI/CD"
   git push origin main
   ```
3. Перейдите на GitHub в раздел **Actions**
4. Вы увидите запущенный процесс сборки и деплоя
5. Через 1-2 минуты изменения будут на сервере!

## Альтернативные варианты CI/CD

### GitHub Actions (рекомендуется)
- ✅ Бесплатно для публичных репозиториев
- ✅ Интегрирован с GitHub
- ✅ Простая настройка

### GitLab CI/CD
Если используете GitLab, создайте `.gitlab-ci.yml`:

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

### Jenkins
Если используете Jenkins, создайте Jenkinsfile (Pipeline).

## Преимущества CI/CD

✅ **Скорость**: Деплой за 30 секунд вместо 2-3 минут  
✅ **Надёжность**: Автоматическая проверка перед деплоем  
✅ **Удобство**: Не нужно заходить на сервер вручную  
✅ **История**: Все деплои логируются в GitHub Actions  
✅ **Откат**: Можно легко откатить к предыдущей версии  

## Что происходит при каждом push

1. **GitHub получает код** из репозитория
2. **Собирает проект** в чистой среде (Ubuntu + Node.js 20)
3. **Создаёт артефакты** (.next/standalone, .next/static, public)
4. **Загружает на сервер** через SSH
5. **Выполняет миграции** базы данных
6. **Перезапускает приложение** через PM2

## Отладка проблем

### Если деплой не работает:

1. Проверьте логи в GitHub Actions:
   - Откройте репозиторий → **Actions** → выберите последний запуск
   - Посмотрите, на каком шаге произошла ошибка

2. Проверьте SSH подключение:
   ```bash
   # На вашем компьютере
   ssh -i ~/.ssh/id_rsa SERVER_USER@SERVER_HOST
   ```

3. Проверьте права на скрипт:
   ```bash
   # На сервере
   chmod +x /var/www/bf-news/scripts/deploy-production.sh
   ```

4. Проверьте переменные окружения:
   - Убедитесь, что все секреты правильно настроены в GitHub

## Безопасность

⚠️ **Важно**: Никогда не коммитьте секреты в Git!

- Используйте GitHub Secrets для хранения паролей и ключей
- `.env` файл должен быть в `.gitignore`
- SSH ключи храните только в GitHub Secrets

## Дополнительные возможности

### Деплой только при изменении определённых файлов:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'package.json'
      - '.github/workflows/deploy.yml'
```

### Деплой в разные окружения:

```yaml
# Деплой на staging при push в develop
# Деплой на production при push в main
```

### Уведомления:

```yaml
# Отправка уведомлений в Telegram/Slack при успешном/неуспешном деплое
```

## Резюме

CI/CD — это автоматизация деплоя. Вместо ручных действий на сервере, всё происходит автоматически при push в Git. Это экономит время, снижает риск ошибок и делает процесс более надёжным.

**Следующий шаг**: Создайте `.github/workflows/deploy.yml` и настройте секреты в GitHub!

