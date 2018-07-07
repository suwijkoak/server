const app = {
  db: {
    host: "ds129821.mlab.com",
    port: 29821,
    name: "server",
    username: "con",
    password: "o123456"
  },
  jwt: {
    APP_SECRET: "ILOVEYOU",
    EXPIRE_IN: "7d"
  }
};

export const database = app.db;
export default app;
