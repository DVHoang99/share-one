const { file } = require("../configurations");
module.exports.confirmSession = async function confirmSession(req, res, next) {
  const database = req.app.get("database");
  const sessionID = req.params.session_id;
  //Case 1: session id is empty
  if (!sessionID) return res.status(400).json({ error: `Session is empty` });
  const [session] = await database("sessions")
    .where("id", "=", sessionID)
    .catch(() => []);
  //Case 2: invalid session id
  if (!session) {
    return res
      .status(404)
      .json({ error: `Session ${sessionID} is not found!` });
  }
  //Case 3: session is already confirmed
  if (session.confirmed_at) {
    return res
      .status(400)
      .json({ error: `Session ${sessionID} has already confirmed` });
  }

  const result = await database("sessions")
    .returning(["id","confirmed_at"])
    .where("id", "=", sessionID)
    .update(`confirmed_at`, new Date());
  if (result) {
    return res.status(200).json({ session: result });
  } else {
    return next(err);
  }
};

module.exports.getBySessionId = async function getBySessionId(req, res, next) {
  const database = req.app.get("database");
  const sessionID = req.params.session_id;
  // Case 1 : check id is empty
  if (!sessionID) return res.status(400).json({ error: `Session is empty` });
  const [session] = await database("sessions")
    .where("id", "=", sessionID)
    .catch(() => []);
  // Case 2 : invalid id
  if (!session) {
    return res
      .status(404)
      .json({ error: `Session ${sessionID} is not found!` });
  }
  const files = await database("files")
    .where("session_id", "=", sessionID)
    .catch(() => []);
  // Case 3 : files is null
  if (!files) {
    return res
      .status(404)
      .json({ error: `This session : ${sessionID} doesn't have any files!` });
  }
  session.files = files;
  return res.status(200).json({ result: session });
};

module.exports.post = async function post(req, res, next) {
  const database = req.app.get("database");
  const [result] = await database("sessions").returning("id").insert({
    created_at: new Date(),
  });

  if (!result) {
    return res.status(500).json({ Error: `Create session fail` });
  }

  return res.status(200).json({
    Message: "Created session successful",
    Session_id: result,
  });
};
module.exports.putSessionIdFile = async function putSessionIdFile(
  req,
  res,
  next
) {
  // Retrieve database connection, database database <-> knex
  const database = req.app.get("database");

  // Check file is empty
  if (!req.files) return res.status(404).json({ error: `Can't read the file` });
  const sessionID = req.params.session_id;

  // check sessions
  const [session] = await database("sessions")
    .select("id")
    .where("id", "=", sessionID)
    .whereNull("confirmed_at")
    .catch(() => []);
  if (!session) {
    return res
      .status(404)
      .json({ error: `Session ${sessionID} is not found! ` });
  }

  const files = req.files;
  const Rows = [];
  for (let i = 0; i < files.length; i++) {
    const Row = {
      name: files[i].filename,
      size: files[i].size,
      mimetype: files[i].mimetype,
      session_id: sessionID,
      created_at: new Date(),
    };
    Rows.push(Row);
  }

  const InsertRows = await database("files")
    .returning("id")
    .insert(Rows)
    .catch(() => []);
  if (!InsertRows) return res.status(500).json({ error: `upload files fail` });

  return res.status(200).json({
    Message: "Uploaded the file successful",
    Response: InsertRows,
  });
};
