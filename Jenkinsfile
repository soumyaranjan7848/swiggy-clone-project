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
                    waitForQualityGate abortPipeline: false
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
                docker run --rm \
                -v "$PWD:/project" \
                -w /project \
                aquasec/trivy fs --severity HIGH,CRITICAL . > trivyfs.txt
                '''
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'Dockerhub-Credential') {
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
                docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                aquasec/trivy image --severity HIGH,CRITICAL $IMAGE_NAME:$IMAGE_TAG > trivyimage.txt
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
                    script {
                        kubeconfig(credentialsId: 'kubernetes') {
                            sh '''
                            kubectl apply -f deployment.yml
                            kubectl apply -f service.yml
                            '''
                        }
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