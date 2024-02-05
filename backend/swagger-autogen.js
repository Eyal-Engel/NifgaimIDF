const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/*.js'];

const config = {
    info: {
        title: 'NifgaimIDF Documentation',
        description: '',
    },
    tags: [ ],
    host: 'localhost:5000/api',
    schemes: ['http', 'https'],
    // basePath: '/api', // Specify the base path for your API routes
};

swaggerAutogen(outputFile, endpointsFiles, config);
