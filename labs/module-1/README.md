# Module 1 · Sample workload (OSS)

This sample gives the course a real application to containerize: a Node.js API,
PostgreSQL, OCI image, rootless runtime, and a small OpenTofu exercise.

## 1. Build and run the API

From `labs/module-1/api`:

```bash
npm install
buildah bud -t course-api:v1 .
podman run --rm -p 3000:3000 course-api:v1
```

In another terminal, `curl http://localhost:3000/health` should return
`{"status":"alive"}`. This health endpoint deliberately doesn't check the DB;
try `/ready` after the database is connected.

**Important:** The starter Containerfile uses `npm install`, to be improved in
Lesson 1.6. After generating and committing a lockfile, switch to `npm ci`
for reproducible package installation, optionally adopt multiple build stages.

## 2. Reproduce the environment using OpenTofu

From `labs/module-1/infra` after building the image:

```bash
tofu init
tofu plan
tofu apply
curl http://localhost:3000/ready
curl -H 'content-type: application/json' -d '{"name":"lab record"}' http://localhost:3000/items
curl http://localhost:3000/items
```

The `terraform_data` resource executes supplied Podman scripts for this local
lesson. **This is a bootstrap wrapper, not a native provider.** OpenTofu tracks
the bootstrap action but does not detect drift in individual containers, networks,
or volumes. This limit is part of the teaching discussion; a proper infrastructure
provider should be introduced for real resource-by-resource reconciliation.

To destroy/rebuild disposable resources:

```bash
tofu plan -destroy
tofu destroy
tofu apply
curl http://localhost:3000/items
```

The PostgreSQL volume is **intentionally kept** after destroy. It contains your
lab records. You may remove it explicitly at the end after backing up anything
important: `podman volume rm course-dev-data` (only when it is not mounted).

## 3. Staging challenge

Use a separate OpenTofu working directory or state to avoid replacing dev;
never share one state between the two environments.

```bash
mkdir -p ../infra-staging
cp -R . ../infra-staging/
cd ../infra-staging
rm -rf .terraform terraform.tfstate terraform.tfstate.backup
# create a staging.auto.tfvars containing:
# environment = "staging"
# host_port   = 3001
# image       = "course-api:v1"
tofu init && tofu apply
curl http://localhost:3001/health
```

The same image works under separate runtime configuration. Do not commit state
or credential files. Example database credentials are disposable classroom-only
values, and would be managed as secrets outside this lab.
