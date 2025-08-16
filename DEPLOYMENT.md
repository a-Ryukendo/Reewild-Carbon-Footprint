# Deployment Guide

This guide provides instructions for deploying the Carbon Footprint API to various cloud providers.

## Prerequisites

- Docker and Docker Compose installed locally
- An account with your chosen cloud provider
- Cloud provider CLI tools installed and configured

## General Deployment Steps

1. Build the Docker image:
   ```bash
   docker-compose build
   ```

2. Test locally:
   ```bash
   docker-compose up
   ```

3. Push the image to a container registry
4. Deploy to your chosen cloud provider

## Cloud Provider Specific Instructions

### AWS (Elastic Beanstalk)

1. Install and configure AWS CLI:
   ```bash
   aws configure
   ```

2. Install the Elastic Beanstalk CLI:
   ```bash
   pip install awsebcli
   ```

3. Initialize EB:
   ```bash
   eb init -p docker carbon-footprint
   ```

4. Create and deploy:
   ```bash
   eb create carbon-footprint-env
   ```

### Azure (App Service)

1. Install Azure CLI:
   ```bash
   # On macOS/Linux
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   
   # On Windows
   # Download from https://aka.ms/installazurecliwindows
   ```

2. Login to Azure:
   ```bash
   az login
   ```

3. Create a resource group:
   ```bash
   az group create --name carbon-footprint-rg --location eastus
   ```

4. Create an App Service plan:
   ```bash
   az appservice plan create --name carbon-footprint-plan --resource-group carbon-footprint-rg --sku B1 --is-linux
   ```

5. Create the web app:
   ```bash
   az webapp create --resource-group carbon-footprint-rg --plan carbon-footprint-plan --name your-app-name --deployment-container-image-name your-container-registry.azurecr.io/carbon-footprint:latest
   ```

### Google Cloud (Cloud Run)

1. Install Google Cloud SDK:
   ```bash
   # On macOS
   brew install --cask google-cloud-sdk
   
   # On Linux
   # https://cloud.google.com/sdk/docs/install#linux
   
   # On Windows
   # Download from https://cloud.google.com/sdk/docs/install#windows
   ```

2. Initialize gcloud:
   ```bash
   gcloud init
   ```

3. Enable required services:
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

4. Deploy to Cloud Run:
   ```bash
   gcloud run deploy carbon-footprint \
     --image gcr.io/your-project-id/carbon-footprint \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## Environment Variables

Make sure to set the following environment variables in your cloud provider's configuration:

- `PORT`: The port the application should listen on (default: 3000)
- `NODE_ENV`: Set to 'production' in production
- `BASIC_AUTH_USER`: Username for basic authentication
- `BASIC_AUTH_PASSWORD`: Password for basic authentication

## Monitoring and Logging

- Set up logging to track application errors and performance
- Configure monitoring and alerts for your application
- Set up a health check endpoint at `/health`

## Scaling

- Configure auto-scaling based on CPU/memory usage
- Set up a CDN if serving static files
- Consider using a managed database if adding persistent storage
