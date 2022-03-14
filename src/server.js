const { PORT = 5000 } = process.env;

const app = require("./app");
const knex = require("./db/connection");

//app.listen(PORT);

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
    app.listen(PORT);
  })
  .catch(console.error);
