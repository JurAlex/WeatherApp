# WeatherApp

Тестовое веб-приложение с UI и backend.

## О проекте

- **Backend:** ASP.NET Web API (.NET Framework 4.7.2), проект `WeatherApp.Api`
- **Frontend:** Angular 21, проект `WeatherApp.Client`
- **Локация:** фиксированная Москва (`LAT,LON`), задается в конфиге backend
- **Источник данных:** [WeatherAPI](https://www.weatherapi.com/)
- **Кэширование:** данные на backend кэшируются на 10 минут

## Функциональность (по ТЗ)

- Один экран с погодной информацией:
  - текущая погода
  - почасовой прогноз (остаток текущего дня + все часы следующего дня)
  - прогноз на 3 дня
- Состояние загрузки
- Показ ошибки и кнопка повторного запроса

## Структура репозитория

- `WeatherApp.Api` - ASP.NET Web API
- `WeatherApp.Client` - Angular-приложение
- `WeatherApp.sln` - solution для Visual Studio

## Требования

- Windows
- Visual Studio 2022 (или совместимая версия) с поддержкой .NET Framework веб-проектов
- .NET Framework 4.7.2 Developer Pack
- Node.js 20+ и npm

## Конфигурация

Для локальной настройки:

1. Скопируйте `WeatherApp.Api/Web.config.example` в `WeatherApp.Api/Web.config`
2. Заполните нужные значения в `appSettings`

Настройки backend в `WeatherApp.Api/Web.config`:

- `WeatherApiKey` - ключ WeatherAPI
- `WeatherLocationLatLon` - координаты локации в формате `LAT,LON`

Пример:

```xml
<appSettings>
  <add key="WeatherApiKey" value="YOUR_WEATHER_API_KEY" />
  <add key="WeatherLocationLatLon" value="55.7558,37.6176" />
</appSettings>
```

Важно:

- `WeatherApp.Api/Web.config` добавлен в `.gitignore` и не должен попадать в репозиторий
- В репозиторий коммитится только шаблон `WeatherApp.Api/Web.config.example`

## Быстрый старт (локально)

### Перед первым запуском (чеклист)

- Установлен Node.js 20+ и npm
- Установлен Visual Studio с поддержкой .NET Framework веб-проектов
- Создан `WeatherApp.Api/Web.config` из `WeatherApp.Api/Web.config.example`
- В `WeatherApp.Api/Web.config` заполнен `WeatherApiKey`
- Backend порт совпадает с прокси frontend (`https://localhost:44327`)

### 1) Запуск backend

1. Откройте `WeatherApp.sln` в Visual Studio
2. Запустите проект `WeatherApp.Api`
3. Убедитесь, что API доступен по `https://localhost:44327/api/weather`

> Порт `44327` используется в текущей конфигурации проекта.

### 2) Запуск frontend

```bash
cd WeatherApp.Client
npm install
npm run start
```

Откройте: `http://localhost:4200`

## Важные детали интеграции

- Frontend использует прокси `WeatherApp.Client/proxy.conf.json`:
  - `/api` -> `https://localhost:44327`
- Если backend работает на другом порту, обновите `target` в `proxy.conf.json`.

## Сборка frontend

```bash
cd WeatherApp.Client
npm run build
```
