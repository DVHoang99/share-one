require("dotenv").config();
const path = require("path");

module.exports = {
  database: {
    connection: {
      host:
        process.env.SHAREONE_DATABASE_HOST ||
        "ec2-54-243-92-68.compute-1.amazonaws.com",
      port: Number(process.env.SHAREONE_DATABASE_PORT) || 5432,
      user: process.env.SHAREONE_DATABASE_USER || "fktyeufzyczmfs",
      password:
        process.env.SHAREONE_DATABASE_PASSWORD ||
        "b61f403027442aa41b56ab3e123688f6e15ad88b32131fc86fb9ac7e5679ac2e",
      database: process.env.SHAREONE_DATABASE_DATABASE || "d7lmb0co06qp5j",
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  file: {
    uploads: process.env.SHAREONE_FILE_UPLOAD_FOLDER || "./uploads",
    limits: {
      fileSize: Number(process.env.SHAREONE_FILE_LIMIT_FILESIZE) || 262144000,
    },
    deniedFile:
      process.env.SHAREONE_FILE_DENIED_MIMETYPE || "application/x-msdownload",
  },
  url: {
    domain: process.env.SHAREONE_FILE_DOMAIN || "http://localhost:3000",
  },
};
