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
  db: {
    url: {
      doc: 'Database host name/IP',
      format: '*',
      default: 'mongodb://localhost:27017/mint',
      env: 'DB_URL',
    },
  },
  api: {
    url: {
      doc: 'API URL',
      format: String,
      default: 'http://127.0.0.1:3030',
      env: 'API_URL',
    },
  },
  gcenter: {
    url: {
      doc: 'API URL',
      format: String,
      default: 'http://127.0.0.1:3030',
      env: 'GCENTER_API_URL',
    },
    lambda: {
      default: 'http://127.0.0.1:3030',
      env: 'GCENTER_LAMBDA',
    },
  },
  cookies: {
    default: '',
    env: 'COOKIES',
  },
  netlify: {
    default: '',
    env: 'NETLIFY_HOOK',
  },
});

// Perform validation
config.validate({ allowed: 'strict' });

module.exports = config;
