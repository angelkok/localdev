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

#### Database Credentials

This project uses a `.env` file to manage database credentials.

1.  Copy the example file: `cp .env.example .env`
2.  Modify the values in the `.env` file as needed.

Tilt will use the variables in this file to configure the services' database. If this file is not present, default values will be used.

#### Tilt and Kubernetes:

- Install `docker desktop`, `tilt`, `kind`, `kubectl`
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
```

Rails/Postgress setup from (<https://github.com/tilt-dev/tilted-rails>)

