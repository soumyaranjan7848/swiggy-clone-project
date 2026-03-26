#!/bin/bash
set -e

echo "========== UPDATE SYSTEM =========="
sudo apt update -y

echo "========== INSTALL DOCKER =========="
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Add users to docker group
sudo usermod -aG docker ubuntu
sudo chmod 666 /var/run/docker.sock

echo "========== CREATE DOCKER VOLUMES =========="
docker volume create jenkins_home
docker volume create sonarqube_data
docker volume create sonarqube_logs
docker volume create sonarqube_extensions

echo "========== RUN JENKINS CONTAINER =========="
docker run -d \
  --name jenkins \
  --restart always \
  -p 8080:8080 \
  -p 50000:50000 \
  --memory="2g" \
  --cpus="1.5" \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts

echo "========== RUN SONARQUBE CONTAINER =========="
docker run -d \
  --name sonarqube \
  --restart always \
  -p 9000:9000 \
  --memory="3g" \
  --cpus="2" \
  -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
  -v sonarqube_data:/opt/sonarqube/data \
  -v sonarqube_logs:/opt/sonarqube/logs \
  -v sonarqube_extensions:/opt/sonarqube/extensions \
  sonarqube:lts-community

echo "========== INSTALL TRIVY =========="
sudo apt install -y wget apt-transport-https gnupg lsb-release
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | \
gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null

echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] \
https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | \
sudo tee /etc/apt/sources.list.d/trivy.list

sudo apt update -y
sudo apt install -y trivy

echo "========== INSTALL KUBECTL =========="
curl -LO "https://dl.k8s.io/release/$(curl -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

echo "========== DONE =========="
echo "Jenkins  : http://<IP>:8080"
echo "SonarQube: http://<IP>:9000"