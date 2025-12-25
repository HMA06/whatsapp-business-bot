process.env.NODE_ENV = 'test';

process.env.DB_TYPE = 'sqlite';
process.env.DB_DATABASE = ':memory:';

process.env.JWT_ACCESS_TOKEN_SECRET = 'test-access';
process.env.JWT_REFRESH_TOKEN_SECRET = 'test-refresh';
