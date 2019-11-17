const express = require("express");
const server = express();

server.use(express.json());

const projects = [
  { id: "1", title: "Sigma-Four", tasks: ["Secret #1"] },
  { id: "2", title: "Kempster-Lacroix", tasks: ["Ventrue", "Camarilla"] },
  { id: "3", title: "Project-706", tasks: ["BombIt!"] },
  { id: "4", title: "Rainbow", tasks: ["Cow Level"] },
  { id: "5", title: "Nutmeg", tasks: ["Nut", "Meg"] }
];

const reqs = [];

server.use((req, res, next) => {
  reqs.push({
    timestamp: Date(Date.now()).toString(),
    // status: res.statusCode,
    method: req.method,
    url: req.url
  });
  console.log(`${reqs.length} requisitions until now, see http://localhost:3000/history for more details.`);
  next();
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

function findProjectIndex(id) {
  index = projects.findIndex(project => project.id === id);
  return index;
}

function checkProjectExistence(req, res, next) {
  if (findProjectIndex(req.params.id) === -1) {
    return res.status(404).json({ error: "Project not found" });
  } else {
    next();
  }
}

server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;
  if (findProjectIndex(id) === -1) {
    projects.push({ id: id, title: title, tasks: tasks });
    return res.status(201).json(projects);
  } else {
    return res.status(409).json({ error: "Project ID already exists" });
  }
});

server.put("/projects/:id", checkProjectExistence, (req, res) => {
  const { title } = req.body;
  projects[findProjectIndex(req.params.id)].title = title;
  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExistence, (req, res) => {
  projects.splice(findProjectIndex(req.params.id), 1);
  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExistence, (req, res) => {
  const { title } = req.body;
  projects[findProjectIndex(req.params.id)].tasks.push(title);
  return res.status(201).json(projects);
});

server.get("/history", (req, res) => {
  return res.json(reqs);
});

server.listen(3000);
