# Campus Records Hub (Student Management)

A small Node.js + Express Student Management app built for a DevOps lab:
Git/GitHub -> Jenkins -> Docker -> Kubernetes -> automated API tests (Karate).

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
npm start
```
Open http://localhost:3000 (set `PORT` to use a different port, e.g. `set PORT=5055`).

## 2. Git and GitHub

```bat
git init
git add .
git commit -m "Initial commit: Campus Records Hub"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
Other commands to demonstrate: `git status`, `git log --oneline`, `git branch`, `git remote -v`, `git pull`.

## 3. Jenkins (Windows)

The `Jenkinsfile` is for **Windows**: it uses `bat` steps (the original used `sh`).

- Two clearly marked editable lines near the top: `DOCKER_BIN` (Docker Desktop `resources\bin` folder) and `MAVEN_BIN` (Maven `bin` folder).
- Create a **Pipeline** job -> *Pipeline script from SCM* -> Git -> repository URL -> branch `*/main` -> script path `Jenkinsfile`.
- Optional automatic builds: Build Triggers -> **Poll SCM** -> `H/5 * * * *`.
- Jenkins must run as a user who can use Docker, Java, Maven and kubectl.
- Stages: Checkout -> Docker Build -> Docker Run -> Karate API Tests -> Deploy to Kubernetes.
- The Karate tests run against the container started in the Docker Run stage (port 3001).

## 4. Docker (manual)

```bat
docker build -t student-mgmt-j9:latest .
docker run -d --name student-mgmt-j9 -p 3001:3000 student-mgmt-j9:latest
```
Open http://localhost:3001 (3001 is used because 3000 may already be taken by another project).

Stop it: `docker rm -f student-mgmt-j9`

## 5. Kubernetes (manual)

Enable Kubernetes in Docker Desktop, then:

```bat
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl get pods
kubectl get svc student-mgmt-j9-service
```
The Service is a NodePort on **30008**. If http://localhost:30008 is not reachable on your machine, use port-forward:

```bat
kubectl port-forward service/student-mgmt-j9-service 8085:80
```
Then open http://localhost:8085. The deployment uses `imagePullPolicy: IfNotPresent`, so it uses the image built locally with Docker Desktop.

Clean up: `kubectl delete -f k8s/`

## 6. Automated tests (Karate)

Six Karate scenarios in `karate/src/test/java/students/students.feature`:
health check, create student with year, missing-field validation, invalid-year validation, update year, delete + 404.

Requirements: Java 11+ and Maven (`java -version`, `mvn -v`).

Start the app first (Docker on port 3001 or `npm start`), then:

```bat
cd karate
mvn test -DbaseUrl=http://localhost:3001
```
Use whatever port the app is on for `baseUrl`. The HTML report is written to `karate/target/karate-reports/karate-summary.html`.

## API

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | status check |
| GET | `/api/students` | list |
| GET | `/api/students/:id` | one student |
| POST | `/api/students` | body: name, email, course, year |
| PUT | `/api/students/:id` | same body |
| DELETE | `/api/students/:id` | 204 on success |