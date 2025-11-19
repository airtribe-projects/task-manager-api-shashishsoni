# Task Manager API

Simple RESTful API built with Express.js that manages an in-memory list of tasks. The dataset is loaded from `task.json`, and the API supports full CRUD operations plus validation and error handling. Automated tests (Tap + Supertest) verify the required behavior.

## Requirements
- Node.js 18+
- npm 9+

## Setup
```
git clone <repo-url>
cd task-manager-api-shashishsoni
npm install
```

## Running the server
```
npm start
```
The server listens on `http://localhost:3000`. Hot-reload isn’t configured; stop and restart after code changes.

## Running the tests
```
npm test
```
This runs the Tap suite inside `test/server.test.js`. All 10 tests should pass.

## API Reference
All responses are JSON. The schema for each task:
```
{
  "id": number,
  "title": string,
  "description": string,
  "completed": boolean
}
```

| Method | Endpoint        | Description                 | Success codes |
| ------ | --------------- | --------------------------- | ------------- |
| GET    | `/tasks`        | List all tasks              | `200`         |
| GET    | `/tasks/:id`    | Get a task by id            | `200`         |
| POST   | `/tasks`        | Create a new task           | `201`         |
| PUT    | `/tasks/:id`    | Replace an existing task    | `200`         |
| DELETE | `/tasks/:id`    | Remove a task               | `200`         |

### Validation
- `title` and `description` must be strings.
- `completed` must be a boolean.
- Invalid payloads return `400`.
- Unknown ids return `404`.

### Example request
```
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write docs","description":"Add README section","completed":false}'
```

## Project structure
- `app.js` – Express app with routes and validation.
- `task.json` – Seed task data loaded into memory on startup.
- `test/server.test.js` – Tap tests covering all required endpoints.

## Submission workflow
1. Ensure `npm test` passes locally.
2. Commit changes and push to `main`.
3. Open PR #1 targeting the auto-created `feedback` branch.
4. Share the PR link as your submission.