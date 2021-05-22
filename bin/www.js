const server = require("../src");

server.listen(process.env.PORT || 3000, () =>
  console.log("LISTEN http://localhost:3000")
);