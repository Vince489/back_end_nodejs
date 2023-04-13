const app = require("./app");
const { PORT } = process.env;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Auth Backend running on http://localhost:${PORT}`);
  });
};

startServer();
