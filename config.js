const convict = require('convict');

// Define a schema
const config = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The applicaton port environment.',
    default: '3030',
    env: 'PORT',
  },
});

// Perform validation
config.validate({ allowed: 'strict' });

module.exports = config;
