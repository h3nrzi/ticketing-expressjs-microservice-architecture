# Multipass Production Testing Guide - Ticketing Platform

This guide covers testing the production deployment locally using Multipass VMs to simulate a real VPS environment without costs.

## 🎯 Why Multipass?

- **Cost-effective**: Test production setup without VPS costs
- **Realistic**: Ubuntu VMs simulate real server environment
- **Isolated**: Clean environment separate from your development setup
- **Repeatable**: Easily destroy and recreate VMs for testing

## 📋 Prerequisites

### Host Machine Requirements

- **macOS**: 8GB RAM, 4 CPU cores, 20GB free space
- **Multipass**: Latest version installed
- **Domain**: Use local domain mapping

### Install Multipass

```bash
# macOS (Homebrew)
brew install multipass

# Or download from: https://multipass.run/
```

## 🚀 VM Setup Options

Choose one deployment approach:

### Option A: Single VM Deployment (Recommended for Testing)

### Option B: Multi-VM Cluster (Advanced Testing)

---

## 🎯 Option A: Single VM Deployment

### Step 1: Create Production-like VM

```bash
# Create VM with production specs
multipass launch --name ticketing-prod \
  --cpus 4 \
  --memory 8G \
  --disk 40G \
  22.04

# Get VM info
multipass info ticketing-prod
```

### Step 2: Configure Local Domain

```bash
# Get VM IP address
VM_IP=$(multipass info ticketing-prod | grep IPv4 | awk '{print $2}')
echo "VM IP: $VM_IP"

# Add to hosts file
echo "$VM_IP ticketing.local" | sudo tee -a /etc/hosts
```

### Step 3: Connect to VM

```bash
# SSH into VM
multipass shell ticketing-prod
```

### Step 4: Install Docker and K3s

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
newgrp docker

# Install K3s
curl -sfL https://get.k3s.io | sh -
sudo cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/.kube/config
sudo chown ubuntu:ubuntu /home/ubuntu/.kube/config
export KUBECONFIG=/home/ubuntu/.kube/config

# Add to bashrc
echo 'export KUBECONFIG=/home/ubuntu/.kube/config' >> ~/.bashrc
```

### Step 5: Install NGINX Ingress

```bash
# Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/baremetal/deploy.yaml

# Wait for deployment
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

# Check ingress controller
kubectl get pods -n ingress-nginx
```

### Step 6: Transfer Project Files

```bash
# Exit VM first
exit

# Copy project to VM
multipass transfer . ticketing-prod:/home/ubuntu/ticketing

# Go back to VM
multipass shell ticketing-prod
cd ticketing
```

### Step 7: Build Images Locally in VM

```bash
# Build all service images
docker build -t ticketing-auth:latest ./auth
docker build -t ticketing-tickets:latest ./tickets
docker build -t ticketing-orders:latest ./orders
docker build -t ticketing-payments:latest ./payments
docker build -t ticketing-expiration:latest ./expiration
docker build -t ticketing-client:latest ./client

# Verify images
docker images | grep ticketing
```

### Step 8: Create Production Manifests for Local Testing

```bash
# Create local production manifests
mkdir -p infra/k8s-local
```

Create the following files:

```yaml
# infra/k8s-local/ingress-srv.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-service
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  rules:
    - host: ticketing.local
      http:
        paths:
          - path: /api/users/?(.*)
            pathType: Prefix
            backend:
              service:
                name: auth-srv
                port:
                  number: 3000
          - path: /api/tickets/?(.*)
            pathType: Prefix
            backend:
              service:
                name: tickets-srv
                port:
                  number: 3000
          - path: /api/orders/?(.*)
            pathType: Prefix
            backend:
              service:
                name: orders-srv
                port:
                  number: 3000
          - path: /api/payments/?(.*)
            pathType: Prefix
            backend:
              service:
                name: payments-srv
                port:
                  number: 3000
          - path: /?(.*)
            pathType: Prefix
            backend:
              service:
                name: client-srv
                port:
                  number: 3000
```

```yaml
# infra/k8s-local/auth-depl.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: auth
  template:
    metadata:
      labels:
        app: auth
    spec:
      containers:
        - name: auth
          image: ticketing-auth:latest
          imagePullPolicy: Never
          env:
            - name: JWT_KEY
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: JWT_KEY
            - name: MONGO_URI
              value: mongodb://auth-mongo-srv:27017/auth
            - name: NATS_CLIENT_ID
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: NATS_URL
              value: http://nats-srv:4222
            - name: NATS_CLUSTER_ID
              value: ticketing
---
apiVersion: v1
kind: Service
metadata:
  name: auth-srv
spec:
  selector:
    app: auth
  ports:
    - name: auth
      protocol: TCP
      port: 3000
      targetPort: 3000
```

### Step 9: Create All Service Deployments

```bash
# Copy and modify existing k8s files for local use
cp infra/k8s/*.yaml infra/k8s-local/

# Update image references in all deployment files
sed -i 's/image: .*/image: ticketing-auth:latest/g' infra/k8s-local/auth-depl.yaml
sed -i 's/image: .*/image: ticketing-tickets:latest/g' infra/k8s-local/tickets-depl.yaml
sed -i 's/image: .*/image: ticketing-orders:latest/g' infra/k8s-local/orders-depl.yaml
sed -i 's/image: .*/image: ticketing-payments:latest/g' infra/k8s-local/payments-depl.yaml
sed -i 's/image: .*/image: ticketing-expiration:latest/g' infra/k8s-local/expiration-depl.yaml
sed -i 's/image: .*/image: ticketing-client:latest/g' infra/k8s-local/client-depl.yaml

# Add imagePullPolicy: Never to all deployments
find infra/k8s-local/ -name "*-depl.yaml" -exec sed -i '/image:/a\        imagePullPolicy: Never' {} \;
```

### Step 10: Create Secrets and Deploy

```bash
# Create secrets
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=test-jwt-secret-key
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_your_stripe_key

# Deploy all services
kubectl apply -f infra/k8s-local/

# Check deployment status
kubectl get pods
kubectl get services
kubectl get ingress
```

### Step 11: Test the Deployment

```bash
# Check if all pods are running
kubectl get pods

# Check ingress
kubectl get ingress

# Test from host machine
curl -H "Host: ticketing.local" http://$(multipass info ticketing-prod | grep IPv4 | awk '{print $2}')/api/users/currentuser
```

---

## 🔄 Option B: Multi-VM Cluster Setup

### Step 1: Create Multiple VMs

```bash
# Create master node
multipass launch --name k8s-master \
  --cpus 2 \
  --memory 4G \
  --disk 20G \
  22.04

# Create worker nodes
multipass launch --name k8s-worker1 \
  --cpus 2 \
  --memory 4G \
  --disk 20G \
  22.04

multipass launch --name k8s-worker2 \
  --cpus 2 \
  --memory 4G \
  --disk 20G \
  22.04

# Get all VM IPs
multipass list
```

### Step 2: Set up Kubernetes Cluster

```bash
# On master node
multipass shell k8s-master

# Install K3s as server
curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644

# Get node token
sudo cat /var/lib/rancher/k3s/server/node-token

# Get master IP
ip addr show eth0 | grep inet | awk '{print $2}' | cut -d/ -f1
```

```bash
# On worker nodes
multipass shell k8s-worker1

# Join cluster (replace with actual master IP and token)
curl -sfL https://get.k3s.io | K3S_URL=https://MASTER_IP:6443 K3S_TOKEN=NODE_TOKEN sh -
```

### Step 3: Configure kubectl on Host

```bash
# Copy kubeconfig from master
multipass exec k8s-master -- sudo cat /etc/rancher/k3s/k3s.yaml > k3s-config.yaml

# Update server IP in config
MASTER_IP=$(multipass info k8s-master | grep IPv4 | awk '{print $2}')
sed -i "s/127.0.0.1/$MASTER_IP/g" k3s-config.yaml

# Use config
export KUBECONFIG=$(pwd)/k3s-config.yaml
kubectl get nodes
```

---

## 🛠️ Development Workflow with Multipass

### Quick Commands

```bash
# Start VM
multipass start ticketing-prod

# Stop VM
multipass stop ticketing-prod

# Delete VM (clean slate)
multipass delete ticketing-prod
multipass purge

# Mount local directory for live development
multipass mount . ticketing-prod:/home/ubuntu/ticketing

# Execute commands without SSH
multipass exec ticketing-prod -- kubectl get pods
```

### Rebuild and Redeploy

```bash
# Quick rebuild script
cat > rebuild.sh << 'EOF'
#!/bin/bash
echo "Rebuilding images..."
docker build -t ticketing-auth:latest ./auth
docker build -t ticketing-tickets:latest ./tickets
docker build -t ticketing-orders:latest ./orders
docker build -t ticketing-payments:latest ./payments
docker build -t ticketing-expiration:latest ./expiration
docker build -t ticketing-client:latest ./client

echo "Restarting deployments..."
kubectl rollout restart deployment/auth-depl
kubectl rollout restart deployment/tickets-depl
kubectl rollout restart deployment/orders-depl
kubectl rollout restart deployment/payments-depl
kubectl rollout restart deployment/expiration-depl
kubectl rollout restart deployment/client-depl

echo "Waiting for rollout..."
kubectl rollout status deployment/auth-depl
kubectl rollout status deployment/tickets-depl
kubectl rollout status deployment/orders-depl
kubectl rollout status deployment/payments-depl
kubectl rollout status deployment/expiration-depl
kubectl rollout status deployment/client-depl

echo "Done!"
EOF

chmod +x rebuild.sh
```

### Monitoring and Debugging

```bash
# Watch pods
kubectl get pods -w

# Check logs
kubectl logs -f deployment/auth-depl

# Describe problematic pods
kubectl describe pod <pod-name>

# Check ingress
kubectl describe ingress ingress-service

# Port forward for direct access
kubectl port-forward service/auth-srv 3001:3000
```

## 🧪 Testing Scenarios

### 1. Load Testing

```bash
# Install Apache Bench in VM
sudo apt install apache2-utils

# Test auth endpoint
ab -n 1000 -c 10 http://ticketing.local/api/users/currentuser

# Test ticket creation
ab -n 100 -c 5 -p ticket.json -T application/json http://ticketing.local/api/tickets
```

### 2. Failure Testing

```bash
# Kill random pods to test resilience
kubectl delete pod $(kubectl get pods | grep auth | head -1 | awk '{print $1}')

# Scale down services
kubectl scale deployment auth-depl --replicas=0

# Scale up services
kubectl scale deployment auth-depl --replicas=3
```

### 3. Database Testing

```bash
# Connect to MongoDB
kubectl exec -it $(kubectl get pods | grep auth-mongo | awk '{print $1}') -- mongo

# Check data persistence
kubectl delete pod $(kubectl get pods | grep auth-mongo | awk '{print $1}')
# Wait for pod to restart, then check if data is still there
```

## 🔧 Docker Compose Alternative

For simpler testing without Kubernetes:

```yaml
# docker-compose.multipass.yml
version: "3.8"

services:
  auth:
    build: ./auth
    environment:
      - JWT_KEY=test-jwt-key
      - MONGO_URI=mongodb://mongo:27017/auth
      - NATS_CLIENT_ID=auth
      - NATS_URL=http://nats-streaming:4222
      - NATS_CLUSTER_ID=ticketing
    depends_on:
      - mongo
      - nats-streaming

  tickets:
    build: ./tickets
    environment:
      - JWT_KEY=test-jwt-key
      - MONGO_URI=mongodb://mongo:27017/tickets
      - NATS_CLIENT_ID=tickets
      - NATS_URL=http://nats-streaming:4222
      - NATS_CLUSTER_ID=ticketing
    depends_on:
      - mongo
      - nats-streaming

  orders:
    build: ./orders
    environment:
      - JWT_KEY=test-jwt-key
      - MONGO_URI=mongodb://mongo:27017/orders
      - NATS_CLIENT_ID=orders
      - NATS_URL=http://nats-streaming:4222
      - NATS_CLUSTER_ID=ticketing
      - EXPIRATION_WINDOW_SECONDS=60
    depends_on:
      - mongo
      - nats-streaming

  payments:
    build: ./payments
    environment:
      - JWT_KEY=test-jwt-key
      - MONGO_URI=mongodb://mongo:27017/payments
      - NATS_CLIENT_ID=payments
      - NATS_URL=http://nats-streaming:4222
      - NATS_CLUSTER_ID=ticketing
      - STRIPE_KEY=sk_test_fake_key
    depends_on:
      - mongo
      - nats-streaming

  expiration:
    build: ./expiration
    environment:
      - NATS_CLIENT_ID=expiration
      - NATS_URL=http://nats-streaming:4222
      - NATS_CLUSTER_ID=ticketing
      - REDIS_HOST=redis
    depends_on:
      - redis
      - nats-streaming

  client:
    build: ./client
    environment:
      - NODE_ENV=production

  mongo:
    image: mongo:5.0
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

  nats-streaming:
    image: nats-streaming:0.25.0
    command:
      [
        "-p",
        "4222",
        "-m",
        "8222",
        "-hbi",
        "5s",
        "-hbt",
        "5s",
        "-hbf",
        "2",
        "-SD",
        "-cid",
        "ticketing",
      ]

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.multipass.conf:/etc/nginx/nginx.conf
    depends_on:
      - auth
      - tickets
      - orders
      - payments
      - client

volumes:
  mongo-data:
  redis-data:
```

```nginx
# nginx.multipass.conf
events {
    worker_connections 1024;
}

http {
    upstream auth {
        server auth:3000;
    }

    upstream tickets {
        server tickets:3000;
    }

    upstream orders {
        server orders:3000;
    }

    upstream payments {
        server payments:3000;
    }

    upstream client {
        server client:3000;
    }

    server {
        listen 80;
        server_name ticketing.local;

        location /api/users {
            proxy_pass http://auth;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /api/tickets {
            proxy_pass http://tickets;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /api/orders {
            proxy_pass http://orders;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /api/payments {
            proxy_pass http://payments;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location / {
            proxy_pass http://client;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

## 🚨 Troubleshooting

### Common Issues

1. **VM won't start**

   ```bash
   multipass info ticketing-prod
   multipass start ticketing-prod
   ```

2. **Can't access services**

   ```bash
   # Check VM IP
   multipass info ticketing-prod

   # Update hosts file
   sudo vim /etc/hosts
   ```

3. **Pods stuck in Pending**

   ```bash
   kubectl describe pod <pod-name>
   kubectl get events --sort-by=.metadata.creationTimestamp
   ```

4. **Images not found**
   ```bash
   # Ensure imagePullPolicy is Never
   kubectl get deployment auth-depl -o yaml | grep imagePullPolicy
   ```

### Performance Issues

```bash
# Check VM resources
multipass exec ticketing-prod -- htop

# Check disk space
multipass exec ticketing-prod -- df -h

# Check memory usage
multipass exec ticketing-prod -- free -h
```

## 📊 Automation Scripts

### Complete Setup Script

```bash
#!/bin/bash
# setup-multipass.sh

set -e

echo "🚀 Setting up Multipass production testing environment..."

# Create VM
echo "Creating VM..."
multipass launch --name ticketing-prod --cpus 4 --memory 8G --disk 40G 22.04

# Get VM IP
VM_IP=$(multipass info ticketing-prod | grep IPv4 | awk '{print $2}')
echo "VM IP: $VM_IP"

# Update hosts file
echo "Updating hosts file..."
if ! grep -q "ticketing.local" /etc/hosts; then
    echo "$VM_IP ticketing.local" | sudo tee -a /etc/hosts
fi

# Transfer files
echo "Transferring project files..."
multipass transfer . ticketing-prod:/home/ubuntu/ticketing

# Setup script for VM
cat > vm-setup.sh << 'EOF'
#!/bin/bash
set -e

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
newgrp docker

# Install K3s
curl -sfL https://get.k3s.io | sh -
sudo cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/.kube/config
sudo chown ubuntu:ubuntu /home/ubuntu/.kube/config
echo 'export KUBECONFIG=/home/ubuntu/.kube/config' >> ~/.bashrc
export KUBECONFIG=/home/ubuntu/.kube/config

# Install NGINX Ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/baremetal/deploy.yaml

# Wait for ingress
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=120s

# Build images
cd ticketing
docker build -t ticketing-auth:latest ./auth
docker build -t ticketing-tickets:latest ./tickets
docker build -t ticketing-orders:latest ./orders
docker build -t ticketing-payments:latest ./payments
docker build -t ticketing-expiration:latest ./expiration
docker build -t ticketing-client:latest ./client

# Create secrets
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=test-jwt-secret-key
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_fake_key

echo "✅ VM setup complete!"
EOF

# Transfer and run setup script
multipass transfer vm-setup.sh ticketing-prod:/home/ubuntu/
multipass exec ticketing-prod -- chmod +x vm-setup.sh
multipass exec ticketing-prod -- ./vm-setup.sh

echo "✅ Multipass environment ready!"
echo "🌐 Access your app at: http://ticketing.local"
echo "🔧 SSH into VM: multipass shell ticketing-prod"
```

### Cleanup Script

```bash
#!/bin/bash
# cleanup-multipass.sh

echo "🧹 Cleaning up Multipass environment..."

# Remove from hosts file
sudo sed -i '/ticketing.local/d' /etc/hosts

# Stop and delete VM
multipass stop ticketing-prod
multipass delete ticketing-prod
multipass purge

echo "✅ Cleanup complete!"
```

## 🎯 Testing Checklist

- [ ] VM created with adequate resources
- [ ] Domain mapping configured in hosts file
- [ ] Docker and K3s installed successfully
- [ ] NGINX Ingress Controller deployed
- [ ] All service images built locally
- [ ] Kubernetes secrets created
- [ ] All pods running and healthy
- [ ] Ingress routing working correctly
- [ ] Services accessible via ticketing.local
- [ ] Database persistence tested
- [ ] Load testing performed
- [ ] Failure scenarios tested

## 💡 Tips for Effective Testing

1. **Snapshot VMs**: Create snapshots before major changes
2. **Resource Monitoring**: Keep an eye on VM resource usage
3. **Log Everything**: Use `kubectl logs` extensively
4. **Test Incrementally**: Deploy services one by one
5. **Automate**: Use scripts for repetitive tasks
6. **Document Issues**: Keep notes of problems and solutions

---

**Next Steps**: Once testing is complete, use the main `DEPLOYMENT.md` guide for actual VPS deployment.
