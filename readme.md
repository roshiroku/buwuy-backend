# Buwuy Origami Shop E-Commerce Backend

This repository contains the backend for the **Buwuy Origami Shop** — a demonstration of an e-commerce system implemented with Node.js, Express, Mongoose, and other related libraries. It showcases a straightforward approach to managing products, categories, orders, and user authentication, while also demonstrating how to handle environment-specific configurations and seeding procedures.

---

## Table of Contents

- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables and Configuration](#environment-variables-and-configuration)
  - [Running the Project](#running-the-project)
- [Seeding Data](#seeding-data)
- [Contributing](#contributing)
- [License](#license)

---

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web application framework for Node.js.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **MongoDB**: NoSQL database.
- **dotenv**: For loading environment variables from `.env` files.
- **config**: For managing environment-specific configurations (`development.json`, `production.json`, etc.).
- **bcryptjs**: For password hashing.
- **jsonwebtoken**: For user authentication via JWT.
- **multer**: For file upload handling.
- **morgan**: HTTP request logger middleware.
- **chalk**: For coloring the console output.
- **nodemon**: Developer tool to automatically restart the server on file changes.

---

## Project Structure

A simplified overview of key files and folders in this repository:

```
buwuy-backend
├── config
│   ├── default.json
│   ├── development.json
│   └── production.json
├── seed
│   ├── assets/
│   ├── users.json
│   ├── tags.json
│   ├── categories.json
│   ├── products.json
│   └── orders.json
├── src
│   ├── server.js
│   ├── models/
│   ├── routes/
│   └── ...
├── .env                 (ignored by Git)
├── .development.env     (ignored by Git)
├── package.json
└── ...
```

- **config/** contains environment-specific JSON configuration files.
- **seed/** contains the data files and assets used to seed the database.
- **src/** holds the main server code, including Express routes and Mongoose models.
- **.env** and **.development.env** are environment variable files (excluded from version control).
- **package.json** contains project metadata and scripts.

---

## Getting Started

### Prerequisites

1. **Node.js** (version 14+ recommended).
2. **MongoDB** installed and running locally (or a remote MongoDB URI).
3. **npm** (usually comes with Node.js).

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/buwuy-backend.git
   cd buwuy-backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

### Environment Variables and Configuration

This project relies on two environment files (`.env` and `.development.env`) which are **not** included in the repository because they are part of the `.gitignore`. You will need to **create** these files in the root of your project:

1. **Create `.env`** (for production):

   ```bash
   # .env
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/buwuy
   JWT_SECRET=your_jwt_secret_key
   ```

2. **Create `.development.env`** (for development):

   ```bash
   # .development.env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/buwuy
   JWT_SECRET=your_jwt_secret_key
   ```

> **Note**: Update the variables (like `MONGO_URI` or `JWT_SECRET`) according to your setup. 

#### Config JSON (`config/development.json`)

Below is an example of a `development.json` file that specifies seed file paths:

```json
{
  "seed": {
    "assets": "seed/assets",
    "users": "seed/users.json",
    "tags": "seed/tags.json",
    "categories": "seed/categories.json",
    "products": "seed/products.json",
    "orders": "seed/orders.json"
  }
}
```

The `seed` section in `development.json` defines the file paths used during the seeding procedure in development mode. 

> **Note**: Additional environment-specific configurations can be placed in `config/production.json` or other files according to the [config documentation](https://www.npmjs.com/package/config).

### Running the Project

- **Production** mode:

  ```bash
  npm start
  ```

  This will use your `.env` variables and `NODE_ENV=production`.

- **Development** mode:

  ```bash
  npm run dev
  ```

  This will load environment variables from both `.env` and `.development.env` (with `.development.env` taking precedence), set `NODE_ENV=development`, and automatically restart the server on file changes via **nodemon**.

---

## Seeding Data

When the server starts in **development** mode (via `npm run dev`), the application checks whether certain collections (e.g., `users`, `tags`, `categories`, `products`, `orders`) in the database are empty. If they are:

1. It populates them with the data from the corresponding JSON files (defined in `config/development.json` under the `seed` key).  
2. It copies **only** the image files from the `seed/assets` folder **that are actually referenced** in the seeded data. Files not referenced by any seeded data are not copied.

This ensures your local development environment starts with sample data to work with.

> **Important**: Seeding typically only occurs on empty collections. If you want to reset your data, you may need to drop the relevant collections in MongoDB before starting the server again.

---

**Happy coding and enjoy building your e-commerce app!** If you have any questions or suggestions, feel free to reach out.