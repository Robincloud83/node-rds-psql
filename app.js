# Use Node.js LTS (18) as the base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install dependencies (only production dependencies)
RUN npm install --production
RUN npm install aws-sdk

# Copy application code
COPY . .

# Expose the application port (change if needed, e.g., 8080)
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]

root@ip-172-31-33-250:~/node-rds-psql# cat package
cat: package: No such file or directory
root@ip-172-31-33-250:~/node-rds-psql# cat package.json
{
  "name": "rds-psql",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@aws-sdk/client-ssm": "^3.879.0",
    "aws-sdk": "^2.1692.0",
    "express": "^5.1.0",
    "pg": "^8.16.3"
  }
}
root@ip-172-31-33-250:~/node-rds-psql# cat app.js
// app.js
const express = require("express");
const { Pool } = require("pg");
const AWS = require("aws-sdk");

// Set AWS Region
AWS.config.update({ region: "eu-north-1" });

const ssm = new AWS.SSM();

async function getParameter(name) {
  const param = await ssm
    .getParameter({ Name: name, WithDecryption: true })
    .promise();
  return param.Parameter.Value;
}

async function init() {
  try {
    // Fetch DB credentials from Parameter Store
    const dbUser = await getParameter("/node-rds-psql/db-username");
    const dbPass = await getParameter("/node-rds-psql/db-password");

    // Database config
    const pool = new Pool({
      host: process.env.DB_HOST || "database-1.cluguy06mnc1.eu-north-1.rds.amazonaws.com",
      port: process.env.DB_PORT || 5432,
      user: dbUser,
      password: dbPass,
      database: process.env.DB_NAME || "postgres",
      ssl: { rejectUnauthorized: false }, // useful for RDS
    });

    const app = express();

    // Test route
    app.get("/", async (req, res) => {
      try {
        const result = await pool.query("SELECT NOW()");
        res.json({ status: "Connected!", time: result.rows[0] });
      } catch (err) {
        console.error("DB query error:", err);
        res.status(500).json({ error: "Database query failed" });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing app:", error);
    process.exit(1);
  }
}

init();
