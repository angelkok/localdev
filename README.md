### What this is
This is a local development environment setup demonstrating running services and dependencies locally.

The setup shows how to use `tilt` to deploy services to a local kubernetes cluster.

#### Sample services
- Node.js
- Python
- Rails

#### Data 
- Redis
- Postgress

### Setup
This setup assumes WSL2 environment, and the following pre-reqs:

Tilt and Kubernetes:
- Install `docker desktop`, `tilt`, `kind`, `kubectl`
- Install `helm` (https://github.com/helm/helm/blob/main/scripts/get-helm-3)
- Setup local registery cluster with `kind-with-registry.sh` (https://kind.sigs.k8s.io/docs/user/local-registry/)

Languages:
- Install `python`
- Install `nodejs`
```
apt install nodejs npm
```

### Kubernetes 
Exec into the pod
```
# list pods with ids
kubectl get pod

# exec into pod give pod id
kubectl exec -t POD_ID
```

Rails/Postgress setup from (https://github.com/tilt-dev/tilted-rails) 