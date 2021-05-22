const express = require("express");
const cors = require("cors");

const configurations = require("./configurations");
const useDatabase = require("./libs/database");
const useUploadMW = require("./middlewares/upload");
const api = require("./api");

const server = express();

server.set("database", useDatabase(configurations.database));

//Error function
server.use((err, req, res, next) => {
  const error = server.get("env") === "development" ? err : {};
  const status = err.status || 500;

  //response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

// Middlewares
server.use(cors());

server.get("/", api.root.get);
// File endpoints
server.post(
  "/files",
  useUploadMW(
    configurations.file.limits,
    configurations.file.deniedFile
  ).single("file", 1),
  api.files.post
);
server.get("/files/:id", api.files.getById);

// Session endpoint
server.patch("/sessions/:session_id/confirmation", api.sessions.confirmSession);

server.get("/sessions/:session_id", api.sessions.getBySessionId);

server.post("/sessions", api.sessions.post);

server.put(
  "/sessions/:session_id/file",
  useUploadMW(configurations.file.limits, configurations.file.deniedFile).array(
    "files",
    5
  ),
  api.sessions.putSessionIdFile
);
module.exports = server;
