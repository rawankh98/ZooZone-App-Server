## my_animal_back

### Description
The Animal API serves as the backend infrastructure for the Animal web application. It provides endpoints for managing animal data, including retrieving, adding, updating, and deleting animal entries in the database. The API is built using Node.js and Express.js, offering a RESTful interface for seamless integration with the frontend client.

### Key Features

- RESTful API: The application exposes RESTful endpoints for performing CRUD operations on animal data.

- Cross-Origin Resource Sharing (CORS): CORS is enabled to allow cross-origin requests from the frontend client, facilitating communication between the client and server without encountering cross-origin restrictions.

- Environment Variables (.env): Environmental variables are utilized for configuration management, enabling secure access to sensitive information such as database URLs and API keys.

- Express Middleware: Various Express middleware such as body-parser and cors are used to handle request parsing, error handling, and cross-origin resource sharing, enhancing the functionality and security of the API.

- Database Integration: The API interacts with a PostgreSQL database to store and retrieve animal data, utilizing the pg library for database connectivity and executing SQL queries.

### Endpoints

- GET /animals: Retrieves a list of all animals from the database, with options for sorting and searching based on query parameters.

- POST /animals/add: Adds a new animal entry to the database, with request body containing details such as name, description, family, habitat, diet, weight, height, and image.

- GET /animals/:id: Retrieves a specific animal entry from the database by its unique identifier (ID).

- PUT /animals/update/:id: Updates an existing animal entry in the database based on its ID, with request body containing updated information.

- DELETE /animals/delete/:id: Deletes a specific animal entry from the database by its ID.

### Technologies Used

- Node.js: The runtime environment for executing JavaScript code on the server-side.

- Express.js: A minimalist web framework for Node.js used for building robust and scalable web applications and APIs.

- PostgreSQL: An open-source relational database management system used for storing and managing animal data.

- Axios: A promise-based HTTP client for making HTTP requests to external APIs or services.

- Body-parser: Middleware for parsing incoming request bodies in various formats such as JSON and URL-encoded.

### How To Run The App
- Clone the repo into the local device or open it with and extension called GitPod you can find chrome extension.
- After cloning and before running you'll see a file called .env.sample, this file contains the environment variables that you'll need it as follow:
PORT=4000 example
DATABASE_URL='postgres://ocsdsqii:z8zSqdXqFa9KrGxOAcVGRqV_A97I9XNv@tai.db.elephantsql.com/ocsdsqii'
API = 'https://freetestapi.com/api/v1/animals'
- create .env file, put inside it the previous variables.
- Run npm i in order to install all the needed dependencies.
- Run npm start to start your app.


Second way:
- install gitpod extension.
- go to the repo, you'll find button called open beside the clone button.
- You'll be directed to the Gitpod.
- Do the same previous steps from creating the .env to the npm start, then you'll see in the terminal server starting.
- check the endpoints from sending the requests through the thunder client which is extension you can install it in the vs code or the Gitpod.
- Last thing if you want to take a look on linked react app for this backend check this repository: https://github.com/rawankh98/my_animal