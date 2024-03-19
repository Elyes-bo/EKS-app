
---

# Nuageup EKS Application Deployment

Note: this project was built using private credentials, private docker images and aws services , building this project requires specific ressources and secrets.

## Prerequisites

- An AWS account with configured access to EKS.
- Docker for building and pushing container images.
- `kubectl`, `eksctl` and `helm` CLI tools for Kubernetes interaction.
- Node.js (v16) and npm for running the Express.js application and tests.
- Express.js framework for building the server.
- Jest and Supertest libraries for implementing unit tests.
- VPC CNI add-on to enable NetworkPolicies

## Application Overview

The main application (app1) is an Express.js web service with multiple endpoints including root (`/`), `/fibonacci`, `/health`, and `/readiness`. Another Express.js web service is available (app2) with a single endpoints root (`/gaming`) is available to test the ingress capabilities. 

Below are instruction on how to get our cluster running, further down is a CI/CD option that automates the entire process.

## Local Development

1. Clone the repository and navigate to the application directory:

   ```bash
   git clone https://github.com/Elyes-bo/Ngup-test.git
   cd Ngup-test/src/app1
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm start
   ```

## Running Tests

Before building the Docker images, run the unit tests to ensure the application is functioning as expected:

```bash
npm test
```

## Dockerization

Build and push the Docker images for both `app1` and `app2` to your Docker Hub repository, (Note our dpeloyments are configured to pull images from "elyes28" private docker hub):

```bash
docker build -t <your-dockerhub-username>/app1:latest ./src/app1
docker push <your-dockerhub-username>/app1:latest
# Repeat for app2
```

## Deployment to EKS

In case you dont have a running eks cluster, you can create one with the eks-config.yaml file
```bash
eksctl create cluster eks-config.yaml
```

Use the Helm chart for deploying your application to EKS. The `helm-0.1.0.tgz` package in the `helm` directory contains all the necessary Kubernetes resources.

```bash
helm package .
helm install helm .helm/helm-0.1.0.tgz 
```

The `k8s-app` folder contains the original Kubernetes manifests for manual deployment if needed.
```bash
kubectl apply -f ressource_name.yaml
```
However, using the Helm chart for deployment is advised for convenience and reliability.

Additionally, install the Ingress controller to manage external access:

```bash
helm upgrade --install ingress-nginx ingress-nginx \
 --repo https://kubernetes.github.io/ingress-nginx \
 --namespace ingress-nginx \
 --create-namespace
```

Make sure to create VPC CNI add-on to enable NetworkPolicies, you can do this from the AWS EKS interface :
Select the cluster
Select add-ons
selec AWS VPC-CNI
Expand the Optional configuration settings.

Enter the JSON key "enableNetworkPolicy": and value "true" in Configuration values. The resulting text must be a valid JSON object. If this key and value are the only data in the text box, surround the key and value with curly braces {}.

{
    "enableNetworkPolicy": "true",
    "nodeAgent": {
        "enableCloudWatchLogs": "true",
        "healthProbeBindAddr": "8163",
        "metricsBindAddr": "8162"
    }
}

Create a DockerHub secret to allow Kubernetes to pull images from the private Docker repository:

```bash
kubectl create secret docker-registry dockerhub-secret \
  --docker-username=<your-dockerhub-username> \
  --docker-password=<your-dockerhub-password> \
  --docker-email=bachq2@gmail.com
```

## CI/CD Pipeline

The repository includes a GitHub Actions workflow for automated testing, building, and deployment:

- The `unit-tests` job runs tests for `app1` to ensure code integrity.
- The `build-and-push-docker-images` job builds Docker images and pushes them to Docker Hub.
- The `lint-and-package-helm-charts` job lints and packages the Helm charts.
- The `deploy-to-eks` job configures AWS credentials, updates kubeconfig, creates the DockerHub secret, and deploys the resources to EKS using Helm, including the separate installation of the Ingress controller.

This workflow is triggered on push to the `main` branch and can also be manually dispatched.


## Repository Structure

- `helm/`: Contains Helm chart templates and packaged charts.
- `k8s-app/`: Original Kubernetes manifests (now superseded by Helm charts).
- `src/`: Source code for the two applications, including Dockerfiles and test files.
- `.github/workflows/`: CI/CD pipeline definitions for GitHub Actions.
- `README.md`: Documentation for the repository.

---
