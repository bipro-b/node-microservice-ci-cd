
# 🚀 Microservices CI/CD with Docker Compose, Docker Hub, and EC2

This project demonstrates a **full CI/CD pipeline** for deploying Node.js microservices using **Docker**, **GitHub Actions**, and **AWS EC2**.  
Each service is built as a Docker image, pushed to Docker Hub, and deployed automatically to an EC2 instance via SSH.

---

## 🧩 Architecture Overview

```

GitHub → Build & Push (Docker Images) → Docker Hub → EC2 → Docker Compose Up

```

### Services
| Service | Port | Description |
|----------|------|--------------|
| product-service | 3001 | Manages products |
| payment-service | 3002 | Handles payments |
| user-service | 3003 | User authentication & profiles |
| gateway-service | 3000 | API gateway / entry point |

---

## ⚙️ Folder Structure

```

micro-service/
├── product-service/
│   └── Dockerfile
├── payment-service/
│   └── Dockerfile
├── user-service/
│   └── Dockerfile
├── gateway-service/
│   └── Dockerfile
└── docker-compose.yml

````

---

## 🧾 1. Docker Compose File

Your `docker-compose.yml` defines all microservices, ports, and health checks.  
Each service references an image built by GitHub Actions:

```yaml
image: ${DOCKERHUB_USERNAME}/product-service:${IMAGE_TAG}
````

When `.env` is created on EC2, those variables are replaced with the actual values.

---

## 🔐 2. GitHub Secrets Setup

Add these secrets to your **GitHub repository → Settings → Secrets → Actions**:

| Secret Name          | Description                                |
| -------------------- | ------------------------------------------ |
| `DOCKERHUB_USERNAME` | Your Docker Hub username                   |
| `DOCKERHUB_TOKEN`    | Docker Hub Access Token                    |
| `EC2_HOST`           | EC2 Public IP or DNS                       |
| `EC2_USER`           | SSH username (e.g. `ec2-user` or `ubuntu`) |
| `EC2_SSH_KEY`        | Private key content for SSH access         |

---

## 🤖 3. GitHub Actions Workflow

File: `.github/workflows/deploy.yml`

### Pipeline Flow:

1. **On Push to `main`** → starts build & deploy.
2. **Build Phase (Matrix Build)**

   * Builds each service (`product`, `payment`, `user`, `gateway`).
   * Tags images with both `latest` and commit SHA.
   * Pushes to Docker Hub.
3. **Deploy Phase (on EC2)**

   * Connects via SSH.
   * Writes `.env` with correct tag.
   * Pulls and restarts containers using Docker Compose.

---

## 🧠 4. Local Development Workflow

You can build and run everything locally using Docker Compose.

### 4.1 Create `.env` file

```bash
DOCKERHUB_USERNAME=biprob
IMAGE_TAG=latest
```

### 4.2 Build all services locally

```bash
docker compose build
```

### 4.3 Run all containers

```bash
docker compose up -d
```

### 4.4 Check running containers

```bash
docker ps
```

### 4.5 View logs

```bash
docker compose logs -f gateway-service
```

### 4.6 Stop all containers

```bash
docker compose down
```

---

## 🌐 5. CI/CD Flow Breakdown (Step by Step)

### 🏗️ Step 1 – Build and Push to Docker Hub

GitHub Actions runs:

```bash
docker build -t biprob/product-service:<sha> ./micro-service/product-service
docker push biprob/product-service:<sha>
```

This repeats for all four services.

Each image ends up on Docker Hub like:

```
biprob/product-service:abc1234
biprob/payment-service:abc1234
...
```

---

### 🚀 Step 2 – Deploy on EC2

GitHub Actions connects to your EC2 instance and runs:

```bash
# Login to DockerHub
echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

# Ensure .env file exists
cat > .env <<EOF
DOCKERHUB_USERNAME=biprob
IMAGE_TAG=abc1234
EOF

# Pull updated images from Docker Hub
docker compose pull

# Recreate and start containers
docker compose up -d

# (Optional) Remove unused old images
docker image prune -af
```

---

### 🔁 Step 3 – Service Health Check

After deployment, you can verify that all services are running:

```bash
curl http://<EC2_PUBLIC_IP>:3000/api/gateway/health
```

Expected response:

```json
{ "status": "ok" }
```

---

## 💡 6. Common Docker Commands Reference

| Command                   | Purpose                               |
| ------------------------- | ------------------------------------- |
| `docker compose build`    | Build images locally from Dockerfiles |
| `docker compose push`     | Push built images to Docker Hub       |
| `docker compose pull`     | Pull latest images from Docker Hub    |
| `docker compose up -d`    | Start all containers in detached mode |
| `docker compose down`     | Stop and remove containers            |
| `docker ps`               | Show running containers               |
| `docker logs <container>` | View container logs                   |
| `docker image prune -af`  | Remove unused images to free space    |

---

## 🧹 7. Optional Cleanup on EC2

If you need to clean everything and redeploy fresh:

```bash
docker compose down
docker system prune -af
docker compose pull
docker compose up -d
```

---

## ✅ 8. Deployment Summary

| Stage      | Action                                       | Trigger             |
| ---------- | -------------------------------------------- | ------------------- |
| **Build**  | GitHub builds & pushes images to Docker Hub  | On `push` to `main` |
| **Deploy** | EC2 pulls new images and restarts containers | Same GitHub Action  |
| **Result** | Latest code automatically runs on EC2        | Fully automated 🎉  |

---

## 📦 Example Compose Variables on EC2

`.env` file auto-created by GitHub Actions:

```bash
DOCKERHUB_USERNAME=biprob
IMAGE_TAG=abc1234
```

`docker-compose.yml` uses these for image names:

```yaml
image: ${DOCKERHUB_USERNAME}/gateway-service:${IMAGE_TAG}
```

Resulting image pulled:

```
biprob/gateway-service:abc1234
```

---

## 🧭 9. Troubleshooting

| Issue                        | Cause                                | Fix                                       |
| ---------------------------- | ------------------------------------ | ----------------------------------------- |
| `manifest not found`         | Image not built/pushed to Docker Hub | Wait for CI build or verify repo name     |
| `Permission denied` when SSH | Wrong `EC2_SSH_KEY` format           | Copy full private key text without quotes |
| `docker compose not found`   | Compose plugin not installed         | Installed automatically by workflow       |

---

## 💬 Summary

✅ Build → Push → Deploy flow fully automated
✅ Docker Compose ensures consistent multi-service setup
✅ Works locally or in CI/CD
✅ Minimal human steps after first setup

---

### 🧑‍💻 Author

**Biprob**
*Cloud-native microservices deployment using Docker, GitHub Actions, and AWS EC2.*

```

---

