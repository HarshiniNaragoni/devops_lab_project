// WINDOWS Jenkinsfile: every step uses `bat` (the original used `sh`).
// Run this on a Jenkins agent that is a Windows machine with Node.js,
// Docker Desktop and (optionally) Kubernetes enabled.

pipeline {
    agent any

    environment {
        // >>> EDIT THIS LINE if your Docker Desktop is installed somewhere else <<<
        DOCKER_BIN     = 'C:\\Users\\Hasini\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin'
        // <<< END OF EDITABLE LINE >>>

        PATH           = "${DOCKER_BIN};${env.PATH}"

        // Different names so this does not clash with your other project
        IMAGE_NAME     = 'student-mgmt-j9'
        CONTAINER_NAME = 'student-mgmt-j9'
        HOST_PORT      = '3001'   // free port on your laptop for docker run
        K8S_DEPLOYMENT = 'student-mgmt-j9-deployment'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                bat 'node --version'
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker --version'
                bat "docker build -t %IMAGE_NAME%:latest ."
            }
        }

        stage('Docker Run') {
            steps {
                // Remove the old container if it exists (ignore errors)
                bat "docker rm -f %CONTAINER_NAME% || exit /b 0"
                bat "docker run -d --name %CONTAINER_NAME% -p %HOST_PORT%:3000 %IMAGE_NAME%:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s/deployment.yaml'
                bat 'kubectl apply -f k8s/service.yaml'
                bat "kubectl rollout restart deployment/%K8S_DEPLOYMENT%"
                bat "kubectl rollout status deployment/%K8S_DEPLOYMENT% --timeout=120s"
            }
        }
    }

    post {
        success {
            echo 'Docker: http://localhost:3001  |  Kubernetes: http://localhost:30008'
        }
        failure {
            echo 'Build failed - check the stage logs above.'
        }
    }
}
