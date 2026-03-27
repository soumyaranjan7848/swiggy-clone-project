pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'node16'
    }

    environment {
        SCANNER_HOME = tool 'sonarqube-scanner'
        IMAGE_NAME = "soumyahub54/swiggy-clone"
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_REGISTRY_CRED = 'Dockerhub-Credential'
        KUBE_CRED = 'kubernetes'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/soumyaranjan7848/swiggy-clone-project.git',
                    credentialsId: 'Github-Credential'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh """
                    ${SCANNER_HOME}/bin/sonar-scanner \
                    -Dsonar.projectName=Swiggy-CI \
                    -Dsonar.projectKey=Swiggy-CI
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                npm install
                npm audit fix || true
                '''
            }
        }

        stage('Trivy FS Scan') {
            steps {
                sh '''
                docker pull ghcr.io/aquasecurity/trivy:latest
                docker run --rm \
                -v "${WORKSPACE}:/project" \
                -w /project \
                ghcr.io/aquasecurity/trivy:latest fs --severity HIGH,CRITICAL . > trivyfs.txt || true
                '''
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: DOCKER_REGISTRY_CRED) {
                        sh '''
                        docker build -t $IMAGE_NAME:$IMAGE_TAG .
                        docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest
                        docker push $IMAGE_NAME:$IMAGE_TAG
                        docker push $IMAGE_NAME:latest
                        '''
                    }
                }
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh '''
                docker pull ghcr.io/aquasecurity/trivy:latest
                docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                ghcr.io/aquasecurity/trivy:latest image --severity HIGH,CRITICAL $IMAGE_NAME:$IMAGE_TAG > trivyimage.txt || true
                '''
            }
        }

        stage('Update Deployment Image') {
            steps {
                dir('Kubernetes') {
                    sh '''
                    sed -i "s|image:.*|image: $IMAGE_NAME:$IMAGE_TAG|" deployment.yml
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                dir('Kubernetes') {
                    withKubeConfig([credentialsId: KUBE_CRED]) {
                        sh '''
                        kubectl apply -f deployment.yml
                        kubectl apply -f service.yml
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline executed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs."
        }
    }
}