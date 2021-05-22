# shareone

> Share file one time

## APIs

### Public

[x] `POST /files`

[x] `GET /files/:id`

// Hoang

[] `POST /sessions` 

[] `PUT /sessions/:session_id/file` 

// Tuan

[] `PATCH /sessions/:session_id/confirmation`

[] `GET /sessions/:session_id` 

// Tuan + Hoang

[] Download files of session

  - `GET /sessions:/session_id/tarball` (get session, then push to queue)
  - Zip files to a tarball
  - Send message back to user (websocket)
