export interface IConfig {
  port: number;
  node_env: string;
  session: {
    secret: string;
  };
  cookie: {
    secret: string;
    expires: number;
  };
  jwt: {
    secret: string;
    expires: number | string;
  };
  password: {
    pepper: string;
  };
}

const config: IConfig = {
  port: parseInt(process.env.PORT) || 3000,
  node_env: process.env.NODE_ENV,
  session: {
    secret: process.env.SESSION_SECRET,
  },
  cookie: {
    secret: process.env.COOKIE_SECRET,
    expires: 7, // 7day
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires: '7d', // 7day
  },
  password: {
    pepper: process.env.PASSWORD_PEPPER,
  },
};

export default config;
