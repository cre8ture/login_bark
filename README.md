# splat! login

## Description
loginpagebark is a Node.js web application for user authentication, featuring a login and registration system. It uses Express.js for handling web routes and API, MySQL for database interactions, and JWT for session management. The server-side HTML rendering is managed with hbs (Handlebars), and user passwords are secured using bcryptjs.

## Prerequisites
Before you begin, ensure you have met the following requirements:
* You have Node.js and npm installed. See [Node.js](https://nodejs.org/) for installation instructions.
* You have MySQL installed and running on your server. See [MySQL](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/) for installation instructions.

## Technologies Used
- **Express.js**: For creating API and web routes and setting up the app backend.
- **MySQL**: For connecting to the MySQL server.
- **dotenv**: For managing environmental variables securely.
- **hbs**: For rendering HTML on the server.
- **Bcryptjs**: For hashing passwords.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/cre8ture/nodeJS-login.git
    cd loginpagebark
    ```

2. Install NPM packages, including nodemon for development convenience:
    ```bash
    npm install
    npm i nodemon --save
    ```

3. In your `package.json` file, under scripts, add the start script:
    ```json
    "scripts": {
      "start": "nodemon app.js"
    }
    ```

4. Create a `.env` file in the root directory of the project and update it with your database configuration and JWT settings:
    ```plaintext
    DATABASE=login_db
    DATABASE_HOST=localhost
    DATABASE_USER=<your db user>
    DATABASE_PASSWORD=<your db password>
    JWT_SECRET=<your jwt secret>
    JWT_EXPIRES_IN=3600  # Expires in 1 hour
    JWT_COOKIE_EXPIRES=90 # Cookie expires in 90 days
    ```

## Setting Up the Database
1. Create a new database in your MySQL environment named `login_db`.
2. Build a users table with the following schema:
   - ID: INT, AUTOINCREMENT
   - Name: VARCHAR
   - Email: VARCHAR
   - Password: VARCHAR
3. Ensure your database schema matches the expected structure for the application.

## Running in Production
1. Ensure all environment variables are set correctly in the `.env` file.
2. Start the application using the start script:
    ```bash
    npm start
    ```
3. Your application should now be running on the defined port.


## Running the Project with Docker (Alternative)

### Prerequisites
- **Docker**: Ensure that Docker and Docker Compose are installed on your machine. If not, you can download and install Docker from [Docker's official website](https://www.docker.com/get-started).

### Steps to Run

1. **Clone the Repository**:
   - If you haven't already, clone the repository to your local machine. Use the following command:
     ```bash
     git clone https://github.com/yourusername/loginpagebark.git
     cd loginpagebark
     ```

2. **Start Docker Containers**:
   - Run the following command in the root directory of the project to start the Node.js application and MySQL services defined in the `docker-compose.yml` file:
     ```bash
     docker-compose up
     ```
   - This command will download the necessary Docker images, build your application, and start the services (Node.js app and MySQL).

3. **Accessing the Application**:
   - Once the containers are up and running, your application should be accessible via a web browser at `http://localhost:3000`.
   - MySQL will be running in its container and can be accessed on the default MySQL port (3306).

4. **Stopping the Containers**:
   - When you're done, you can stop the Docker containers by running:
     ```bash
     docker-compose down
     ```
   - This command stops and removes the containers, networks, and volumes created by `docker-compose up`.

### Note
- The first time you run `docker-compose up`, it might take a bit of time as Docker needs to download the base images and build your application image.
- Ensure that the ports specified in the `docker-compose.yml` file (e.g., 3000 for the app, 3306 for MySQL) are available on your machine.
- Modifications to the environment variables or the database schema may require adjustments in the `.env` file or `docker-compose.yml` file.
- If you encounter any issues with the Docker containers, check the container logs for more information.


## Contributing to splat! login
<!-- Contribution guidelines -->
- please use this as you please
- your suggestions are welcome. Make a pull request or message me at bakukai@gmail.com

## License
This project uses the following license: [MIT](https://opensource.org/licenses/MIT).
