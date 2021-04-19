# movies-explorer-api

[Ссылка на поддомен сс api](http://api.movies-explorer.nomoredomains.icu)

### Описание

Бекенд для проекта Movies-explorer 

Отвечает за авторизицию пользователей на сайте. Сохранение данных пользователя и фильмов в базе mongoDB. 
Взаимодействие с базой данных происходит с помощью mongoose. Для валидации запросов используется celebrate. Пароли шифруются bcryptjs.
Централизованная обработка ошибок.

### Стек

- Javascript
- Node.js
- Express.js
- mongoose
- MongoDB

### Запуск приложения

- Клонировать репозиторий
    ```bash
    $ git clone https://github.com/romanlesnoy/movies-explorer-api.git
    ```
- Перейти в директорию проекта и установить записимости
    ```bash
    $ cd movies-explorer-api && npm install
    ```
- Запустить приложение в режиме разработчика
    ```bash
    npm run dev
    ```
