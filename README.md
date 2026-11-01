# Campus Records Hub (Student Management) - `student-management_j9`

A small Node.js + Express Student Management app built for a DevOps lab:
Git/GitHub -> Jenkins -> Docker -> Kubernetes -> automated tests.

Each student has: **name, email, course, year** (year = 1 to 6). Data is kept in memory.

## Names used (chosen so they do not clash with another project)

| Thing | Value |
|---|---|
| App / page title | Campus Records Hub |
| Docker image | `student-mgmt-j9` |
| Container name | `student-mgmt-j9` |
| Docker host port | **3001** (container listens on 3000) |
| K8s Deployment | `student-mgmt-j9-deployment` |
| K8s Service | `student-mgmt-j9-service` |
| K8s NodePort | **30008** |

If any of these are already in use, change them in `Jenkinsfile`, `k8s/*.yaml` and the commands below.

## 1. Run locally

```bat
npm install
npm test
npm start
```
Open http://localhost:3000

## 2. Git and GitHub

```bat
git init
git add .
git commit -m "Initial commit: Campus Records Hub"
git branch -M main
git remote add origin https://github.com/<your-username>/student-management_j9.git
git push -u origin main
```
Other commands to demonstrate: `git status`, `git log --oneline`, `git branch feature-x`, `git checkout feature-x`, `git merge feature-x`, `git pull`.

## 3. Jenkins (Windows)

The `Jenkinsfile` is for **Windows**: it uses `bat` steps (the original used `sh`).

- Near the top there is a clearly marked **editable line** `DOCKER_BIN = '...'`. It is set to
  `C:\Users\Hasini\AppData\Local\Programs\DockerDesktop\resources\bin`.
  Change it if Docker is installed elsewhere (e.g. `C:\Program Files\Docker\Docker\resources\bin`).
- Create a **Pipeline** job -> *Pipeline script from SCM* -> Git -> your repo URL -> branch `main` -> script path `Jenkinsfile`.
- Jenkins must run as a user who can use Docker and kubectl, and Node.js must be on the Windows PATH.
- Stages: Checkout -> Install -> Test -> Docker Build -> Docker Run -> Deploy to Kubernetes.

## 4. Docker (manual)

```bat
docker build -t student-mgmt-j9:latest .
docker run -d --name student-mgmt-j9 -p 3001:3000 student-mgmt-j9:latest
```
Open http://localhost:3001 (3001 is used because 3000 may already be taken by your other project).

Stop it: `docker rm -f student-mgmt-j9`

## 5. Kubernetes (manual)

Enable Kubernetes in Docker Desktop, then:

```bat
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl get pods
kubectl get svc student-mgmt-j9-service
```
Open http://localhost:30008

The deployment uses `imagePullPolicy: IfNotPresent`, so it uses the image you built locally with Docker Desktop.

Clean up: `kubectl delete -f k8s/`

## 6. Automated tests

Six Jest + Supertest tests in `tests/app.test.js`:
health check, create student, missing-field validation, invalid-year validation, update year, delete + 404.

```bat
npm test
```

## API

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | status check |
| GET | `/api/students` | list |
| GET | `/api/students/:id` | one student |
| POST | `/api/students` | body: name, email, course, year |
| PUT | `/api/students/:id` | same body |
| DELETE | `/api/students/:id` | 204 on success |
