const config = {
  development: {
    apiBaseUrl: '',
    logLevel: 'debug',
    enableMockApi: false,
  },
  production: {
    apiBaseUrl: '',
    logLevel: 'error',
    enableMockApi: false,
  },
};

const env = (import.meta.env.NODE_ENV as keyof typeof config) || 'development';

export default config[env];
