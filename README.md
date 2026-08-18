# Expense Tracker API

REST API для учёта личных расходов и доходов: кошельки, категории, транзакции и бюджеты с контролем лимитов.

## 🛠 Стек технологий

- **Runtime:** Node.js, TypeScript
- **Framework:** Express
- **База данных:** PostgreSQL + Prisma ORM
- **Валидация:** Zod
- **Аутентификация:** JWT (access + refresh токены с ротацией), bcrypt
- **Документация API:** Swagger (OpenAPI)
- **Инфраструктура:** Docker, Docker Compose
- **CI/CD:** GitHub Actions
- **Безопасность:** Helmet, CORS, rate limiting
- **Качество кода:** ESLint, Prettier, Husky, lint-staged

## ✨ Функциональность

- **Auth** - регистрация, вход, refresh-токены с ротацией (HttpOnly cookie)
- **Wallets** - управление кошельками пользователя
- **Categories** - категории доходов/расходов
- **Transactions** - операции с фильтрацией, пагинацией и сортировкой
- **Budgets** - лимиты по категориям с контролем расходов

## 🏗 Архитектура

Feature-Based Layered Architecture: `router → service → repository`

Каждый модуль (auth, wallets, categories, transactions, budgets) изолирован и содержит свой роутер, сервис и репозиторий.

## 🚀 Быстрый старт

### Требования
- Node.js (версия 24+)
- Docker и Docker Compose
- Yarn

### Установка

1. Клонировать репозиторий
```bash
git clone https://github.com/adikssl/expense-tracker-api.git
cd expense-tracker-api
```

2. Создать `.env` на основе примера
```bash
cp .env.example .env
```
Заполнить переменные:
```dotenv
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
JWT_SECRET=your_jwt_secret_here_mustbe32symbols
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
CLIENT_URL=http://localhost:5173
```

3. Установить зависимости
```bash
yarn install
```

4. Запустить PostgreSQL через Docker
```bash
docker-compose up -d
```

5. Применить миграции Prisma
```bash
yarn prisma migrate dev
```

6. Запустить проект
```bash
yarn dev
```

## 📖 API документация

После запуска Swagger UI доступен по адресу: http://localhost:3000/api-docs

## ✅ CI/CD

При каждом пуше/PR запускается GitHub Actions workflow: установка зависимостей, генерация Prisma client, линтинг и сборка проекта.
