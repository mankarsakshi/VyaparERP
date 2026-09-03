
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { generateToken } = require('./config/jwt');

const app = express();

// ====================== MIDDLEWARE ======================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vyapar ERP API",
      version: "1.0.0",
      description: "API documentation for Vyapar ERP"
    },
    servers: [
      {
        url: "http://localhost:8080"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },

  apis: ["server.js", "./routes/*.js"]
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


// ====================== DATABASE ======================

const {
    initializeDatabase,
    getDB
} = require('./database/db');
initializeDatabase();


// ====================== ROUTES ======================

const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);
app.use('/api', authRoutes);

const purchaseRoutes = require('./routes/purchaseRoutes');
app.use('/api/purchases', purchaseRoutes);

const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
app.use('/api/purchase-orders', purchaseOrderRoutes);

const supplierRoutes = require('./routes/supplierRoutes');
app.use('/api/suppliers', supplierRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

// ====================== SERVER ======================

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Vyapar ERP Server running on http://${HOST}:${PORT}`);
    console.log(`Local Access: http://localhost:${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});