## Как запустить сразу все сервисы

1. Сначала скачайте .env и docker-compose.yml с репозитория:

2. Запустите приложение с помощью docker compose:

   ```bash
   docker-compose up -d
   ```

## Как запустить все по отдельности

1. Сначала склонируйте репозиторий:

   ```bash
   git clone https://github.com/TimurMA/NestJS-backend.git
   ```

2. Перейдите в директорию проекта:

   ```bash
   cd NestJS-backend
   ```

3. Запустите базу данных и мигрируйте схемы в нее:

   ```bash
   docker-compose -f docker-compose-test.yml up -d
   ```

   ```bash
   cd ./gateway && npm run migrate && cd ..
   ```

4. Запустите микросервисы и шлюз:

   ```bash
   cd ./main-app && npm i && npm run start && cd ..
   ```

   ```bash
   cd ./comment-service && npm i && npm run start && cd ..
   ```

   ```bash
   cd ./gateway && npm i && npm run start && cd ..
   ```

## Другие команды

- Тесты микросервисов:

  ```bash
  cd ./comment-service && npm test && cd ..
  ```

  ```bash
  cd ./main-app && npm test && cd ..
  ```

- E2E тесты:

  ```bash
  cd ../gateway && npm run test:e2e && cd ..
  ```
