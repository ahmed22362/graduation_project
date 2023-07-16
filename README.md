# City Mall Backend

City Mall Backend is the backend server application for the City Mall application. It is built with Node.js and Sequelize, providing the necessary APIs and database functionality to support the City Mall frontend.

## Features

- User Authentication: Provides user registration, login, and authentication using JSON Web Tokens (JWT).
- User Authorization: Implements role-based access control (RBAC) to authorize user actions based on their role (e.g., admin, customer).
- Stores Management: Allows administrators to manage stores in the City Mall, including creating, updating, and deleting store information.
- Products Management: Enables administrators to manage products within each store, including adding, updating, and deleting product details.
- Orders Processing: Supports the processing of customer orders, including order creation, updating order status, and order history retrieval.
- Categories Management: Allows administrators to manage product categories, including creating, updating, and deleting category information.
- Reviews and Ratings: Provides functionality for customers to leave reviews and ratings for stores and products.
- Search Functionality: Enables users to search for stores and products based on various criteria.
- Image Uploads: Supports image uploads for stores, products, and user avatars.
- AI Integration: Integrates with an AI API for advanced features such as read car plate number or intelligent search for people faces.

## Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/ahmed22362/graduation_project.git
   ```

2. Navigate to the project directory:

   ```shell
   cd graduation_project
   ```

3. Install the dependencies:

   ```shell
   npm install
   ```

4. Set up the database:

   - Configure the database connection in the `config/config.js` file.
   - Run the database migrations:
     ```shell
     npx sequelize-cli db:migrate
     ```

5. Start the server:

   ```shell
   npm start
   ```

6. The server should now be running at `http://localhost:3000`.

## Configuration

- Database: Configure the database connection in the `config/config.js` file.
- JWT Secret: Set the JWT secret key in the `.env` file:
  ```
  JWT_SECRET=your_secret_key
  ```

## API Documentation

- The API documentation for City Mall Backend can be found in the [API Documentation](https://documenter.getpostman.com/view/21827899/2s93RNxueP) file.

## Technologies Used

- Node.js: JavaScript runtime environment
- Express.js: Web application framework
- Sequelize: Object-relational mapping (ORM) for database management
- JWT: JSON Web Tokens for user authentication
- Multer: Middleware for handling file uploads
- Bcrypt: Password hashing and encryption

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please create a pull request or submit an issue in the repository.

## License

This project is licensed under the [MIT License](LICENSE).

