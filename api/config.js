const environments = {};

// Staging (default) environment
environments.staging = {
  envName: 'staging',
  db: 'shop',
};

environments.test = {
  envName: 'test',
  db: 'test',
};

// Determine which environment was passed as a command-line argument
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string'
      ? process.env.NODE_ENV.toLowerCase()
      : '',
  // Check that the current environment is one of the environments above, if not default to staging
  environmentToExport =
    typeof environments[currentEnvironment] === 'object'
      ? environments[currentEnvironment]
      : environments.staging;

module.exports = environmentToExport;
