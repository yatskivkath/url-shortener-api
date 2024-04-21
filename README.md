# URL Shortener API

![GitHub stars](https://img.shields.io/github/stars/yatskivkath/url-shortener-api?style=flat-square)
![GitHub license](https://img.shields.io/github/license/yatskivkath/url-shortener-api?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/yatskivkath/url-shortener-api?style=flat-square)

## Overview

This is a simple URL shortener API built with [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/). It allows users to shorten long URLs into concise, easy-to-share links. Service also provide user registration, URL managment and analitics.

[Shorten your URLs!](https://url-shortener-api-wruy.onrender.com).

## Features

- Shorten long URLs into concise links.
- Redirect to original URLs from shortened links.
- Customizable URL expiration settings.
- Create a user account.
- Manage your urls.
- View statistics.

## Installation

To run this project locally, follow these steps:

1. Clone this repository.
2. Install dependencies using npm:

   ```
   npm install
   ```
3. Start postgres locally
   ```
   brew services start postgresql
   ```
4. Start Redis locally
    ```
    brew services start redis
    ```
5. Set up .env file
6. Run sequelize migrations and seeders
   ```
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```
7. Start the server:

   ```
   npm start
   ```

## Usage

Once the server is running, you can access the Web service for shorten long URLs running on `process.envport.PORT`. Visit [localhost:3001](http://localhost:3001/).

For detailed API documentation, refer to [API Documentation](http://localhost:3001/).

## API Documentation

For detailed information on API endpoints and usage, refer to [API Documentation](https://url-shortener-api-wruy.onrender.com/api/docs/).

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and test them thoroughly.
4. Submit a pull request with a clear description of your changes.

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).

## Contact

For any questions or feedback, feel free to contact the project maintainer at [yatskivkathwork@gmail.com](mailto:yatskivkathwork@gmail.com).
