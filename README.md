# Tilt for local development

## What this is

This is a local development environment setup demonstrating running services and
dependencies locally.

The setup shows how to use `tilt` to deploy services to a local kubernetes cluster.

### Sample services

- Node.js
- Python
- Rails

### Data

- Redis
- Postgress

### Setup

This setup assumes WSL2 environment, and the following pre-reqs:

Tilt and Kubernetes:

- Install `docker desktop`, `tilt`, `kind`, `kubectl`, `helm`
- (Upgrade tilt by re-running installer)
- Install `helm` (<https://github.com/helm/helm/blob/main/scripts/get-helm-3>)
- Setup local registery cluster with `kind-with-registry.sh` (<https://kind.sigs.k8s.io/docs/user/local-registry/>)

Languages:

- Install `python`
- Install `nodejs`

```shell
apt install nodejs npm
```

### Running

```shell
tilt up
tilt down
```

### Kubernetes

Exec into the pod

```shell
# list pods with ids
kubectl get pod

# exec into pod give pod id
kubectl exec -t POD_ID

# list services
kubectl get service

```
Consider:
- setting up `k` alias for `kubectl`
- use `gum` to parse `kubectl` output from `kubectl get pods` for other cmds like `exec`

Rails/Postgress setup from (<https://github.com/tilt-dev/tilted-rails>)
