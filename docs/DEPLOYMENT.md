# VPS Deployment Guide - Ticketing Platform

This guide covers deploying the ticketing microservices platform on a Virtual Private Server (VPS).

## 📋 Prerequisites

### VPS Requirements

- **Minimum**: 4GB RAM, 2 CPU cores, 40GB storage
- **Recommended**: 8GB RAM, 4 CPU cores, 80GB storage
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **Network**: Public IP address
- **Domain**: Registered domain pointing to VPS IP

### Required Accounts

- Docker Hub account (or private registry)
- Stripe account (for payments)
- Domain registrar access

## 🚀 Deployment Options

Choose one of these deployment approaches:

### Option A: Kubernetes (K3s) - Recommended for Production

### Option B: Docker Compose - Simpler Setup

---

## 🎯 Option A: Kubernetes Deployment

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git
```

### Step 2: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
```

### Step 3: Install K3s (Lightweight Kubernetes)

```bash
# Install K3s
curl -sfL https://get.k3s.io | sh -

# Set kubeconfig
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER:$USER ~/.kube/config
export KUBECONFIG=~/.kube/config

# Verify installation
kubectl get nodes
```

### Step 4: Install NGINX Ingress Controller

```bash
# Install NGINX Ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/baremetal/deploy.yaml

# Wait for deployment
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

### Step 5: Install Cert-Manager (SSL)

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Wait for deployment
kubectl wait --namespace cert-manager \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/instance=cert-manager \
  --timeout=120s
```

### Step 6: Build and Push Images

```bash
# Clone your repository
git clone <your-repo-url>
cd ticketing

# Build all service images
docker build -t your-dockerhub-username/ticketing-auth:latest ./auth
docker build -t your-dockerhub-username/ticketing-tickets:latest ./tickets
docker build -t your-dockerhub-username/ticketing-orders:latest ./orders
docker build -t your-dockerhub-username/ticketing-payments:latest ./payments
docker build -t your-dockerhub-username/ticketing-expiration:latest ./expiration
docker build -t your-dockerhub-username/ticketing-client:latest ./client

# Push to Docker Hub
docker push your-dockerhub-username/ticketing-auth:latest
docker push your-dockerhub-username/ticketing-tickets:latest
docker push your-dockerhub-username/ticketing-orders:latest
docker push your-dockerhub-username/ticketing-payments:latest
docker push your-dockerhub-username/ticketing-expiration:latest
docker push your-dockerhub-username/ticketing-client:latest
```

### Step 7: Create Production Kubernetes Manifests

Create `infra/k8s-prod/` directory with production configurations:

```bash
mkdir -p infra/k8s-prod
```

### Step 8: Update Ingress for Production

```yaml
# infra/k8s-prod/ingress-srv.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-service
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/use-regex: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
    - hosts:
        - yourdomain.com
      secretName: ticketing-tls
  rules:
    - host: yourdomain.com
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

### Step 9: Create SSL Certificate Issuer

```yaml
# infra/k8s-prod/cert-issuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@domain.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
```

### Step 10: Create Production Secrets

```bash
# Generate strong JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Create Kubernetes secrets
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=$JWT_SECRET
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=your-stripe-secret-key

# Create MongoDB secrets (if using external MongoDB)
kubectl create secret generic mongo-secret --from-literal=MONGO_URI=mongodb://your-mongo-connection-string
```

### Step 11: Deploy Application

```bash
# Apply cert-manager issuer
kubectl apply -f infra/k8s-prod/cert-issuer.yaml

# Deploy all services
kubectl apply -f infra/k8s-prod/

# Check deployment status
kubectl get pods
kubectl get services
kubectl get ingress
```

---

## 🐳 Option B: Docker Compose Deployment

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 2: Create Production Docker Compose

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  # MongoDB
  mongo:
    image: mongo:5.0
    restart: always
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: your-mongo-password

  # Redis
  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis-data:/data

  # NATS Streaming
  nats-streaming:
    image: nats-streaming:0.25.0
    restart: always
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

  # Auth Service
  auth:
    image: your-dockerhub-username/ticketing-auth:latest
    restart: always
    environment:
      - JWT_KEY=your-jwt-secret
      - MONGO_URI=mongodb://admin:your-mongo-password@mongo:27017/auth?authSource=admin
      - NATS_CLIENT_ID=auth
      - NATS_URL=http://nats-streaming:4222
      - NATS_CLUSTER_ID=ticketing
    depends_on:
      - mongo
      - nats-streaming

  # Tickets Service
  tickets:
    image: your-dockerhub-username/ticketing-tickets:latest
    restart: always
    environment:
      - JWT_KEY=your-jwt-secret
      - MONGO_URI=mongodb://admin:your-mongo-password@mongo:27017/tickets?authSource=admin
      - NATS_CLIENT_ID=tickets
      - NATS_URL=http://nats-streaming:4222
      - NATS_CLUSTER_ID=ticketing
    depends_on:
      - mongo
      - nats-streaming

  # Orders Service
  orders:
    image: your-dockerhub-username/ticketing-orders:latest
    restart: always
    environment:
      - JWT_KEY=your-jwt-secret
      - MONGO_URI=mongodb://admin:your-mongo-password@mongo:27017/orders?authSource=admin
      - NATS_CLIENT_ID=orders
      - NATS_URL=http://nats-streaming:4222
      - NATS_CLUSTER_ID=ticketing
      - EXPIRATION_WINDOW_SECONDS=900
    depends_on:
      - mongo
      - nats-streaming

  # Payments Service
  payments:
    image: your-dockerhub-username/ticketing-payments:latest
    restart: always
    environment:
      - JWT_KEY=your-jwt-secret
      - MONGO_URI=mongodb://admin:your-mongo-password@mongo:27017/payments?authSource=admin
      - NATS_CLIENT_ID=payments
      - NATS_URL=http://nats-streaming:4222
      - NATS_CLUSTER_ID=ticketing
      - STRIPE_KEY=your-stripe-secret-key
    depends_on:
      - mongo
      - nats-streaming

  # Expiration Service
  expiration:
    image: your-dockerhub-username/ticketing-expiration:latest
    restart: always
    environment:
      - NATS_CLIENT_ID=expiration
      - NATS_URL=http://nats-streaming:4222
      - NATS_CLUSTER_ID=ticketing
      - REDIS_HOST=redis
    depends_on:
      - redis
      - nats-streaming

  # Client
  client:
    image: your-dockerhub-username/ticketing-client:latest
    restart: always
    environment:
      - NODE_ENV=production

  # NGINX Reverse Proxy
  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
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

### Step 3: Create NGINX Configuration

```nginx
# nginx.conf
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
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location /api/users {
            proxy_pass http://auth;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/tickets {
            proxy_pass http://tickets;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/orders {
            proxy_pass http://orders;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /api/payments {
            proxy_pass http://payments;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location / {
            proxy_pass http://client;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### Step 4: Get SSL Certificate

```bash
# Install Certbot
sudo apt install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
```

### Step 5: Deploy with Docker Compose

```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🔧 Post-Deployment Configuration

### 1. Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Set up Monitoring

```bash
# Install htop for system monitoring
sudo apt install htop

# Monitor Docker containers
docker stats

# For Kubernetes
kubectl top nodes
kubectl top pods
```

### 3. Set up Backup

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MongoDB (Docker Compose)
docker exec mongo mongodump --out /tmp/backup
docker cp mongo:/tmp/backup $BACKUP_DIR/mongo_$DATE

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /path/to/your/app

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "mongo_*" -mtime +7 -exec rm -rf {} \;
EOF

chmod +x backup.sh

# Add to crontab (daily backup at 2 AM)
echo "0 2 * * * /path/to/backup.sh" | crontab -
```

### 4. Set up Log Rotation

```bash
# Create logrotate config
sudo tee /etc/logrotate.d/docker << 'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF
```

## 🚨 Troubleshooting

### Common Issues

1. **Services not starting**

   ```bash
   # Check logs
   kubectl logs <pod-name>  # Kubernetes
   docker-compose logs <service-name>  # Docker Compose
   ```

2. **SSL certificate issues**

   ```bash
   # Renew certificate
   sudo certbot renew
   ```

3. **Database connection issues**

   ```bash
   # Check MongoDB connection
   docker exec -it mongo mongo
   ```

4. **Memory issues**
   ```bash
   # Check memory usage
   free -h
   docker stats
   ```

### Health Checks

```bash
# Check service health
curl -f http://yourdomain.com/api/users/currentuser || echo "Auth service down"
curl -f http://yourdomain.com/api/tickets || echo "Tickets service down"
```

## 📊 Performance Optimization

### 1. Enable Gzip Compression

Add to NGINX config:

```nginx
gzip on;
gzip_types text/plain application/json application/javascript text/css;
```

### 2. Set up Caching

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Optimization

```javascript
// Add indexes to MongoDB collections
db.tickets.createIndex({ title: "text" });
db.orders.createIndex({ userId: 1, status: 1 });
```

## 🔐 Security Checklist

- [ ] SSL certificate installed and auto-renewal configured
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] Strong passwords for all services
- [ ] JWT secret is cryptographically secure
- [ ] Database access restricted
- [ ] Regular security updates applied
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting configured

## 📈 Scaling Considerations

### Horizontal Scaling (Kubernetes)

```bash
# Scale services
kubectl scale deployment auth-depl --replicas=3
kubectl scale deployment tickets-depl --replicas=3
```

### Vertical Scaling

```yaml
# Increase resource limits
resources:
  limits:
    memory: "512Mi"
    cpu: "500m"
  requests:
    memory: "256Mi"
    cpu: "250m"
```

## 🎯 Production Checklist

- [ ] Domain configured and pointing to VPS
- [ ] SSL certificate installed
- [ ] All services deployed and running
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] Firewall configured
- [ ] Log rotation configured
- [ ] Health checks passing
- [ ] Performance optimizations applied
- [ ] Security measures implemented

---

**Support**: For issues, check the troubleshooting section or create an issue in the repository.
