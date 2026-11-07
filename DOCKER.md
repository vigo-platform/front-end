# Frontend Docker deployment

The frontend image is published as `logtaha/vigo-front-end`.

## Network requirement

The frontend Compose project is intentionally independent from the backend Compose file. It joins the external Docker network used by the `gateway` service in `vigo-platform/development`.

The default network name below assumes the backend Compose project name is `development`:

```text
development_app-network
```

Start the backend Compose stack first, then verify the actual network name:

```bash
docker network ls --format '{{.Name}}' | grep app-network
```

If the listed name differs, set `VIGO_DOCKER_NETWORK` to that exact name when running the frontend Compose commands.

## Build and run locally

Run these commands from the frontend repository root:

```bash
docker compose -f compose.yml up -d --build
```

The frontend is exposed on port `3001` by default. Set `FRONTEND_PORT` to change the host port.

Nginx serves the Vite SPA and forwards requests under `/api/` to `http://gateway:8080` on the shared Docker network. The default empty `VITE_API_BASE_URL` makes the browser use same-origin API paths.

## Run the published image

To use an image already published to Docker Hub instead of building locally:

```bash
docker compose -f compose.yml pull front-end
docker compose -f compose.yml up -d --no-build
```

Set `FRONTEND_TAG` to select a version instead of `latest`.

## Docker Hub publishing

The GitHub Actions workflow follows the Auth service release triggers:

- Push a version tag such as `1.2.0` to publish that tag and `latest`.
- Push `build-and-push` to publish a commit-SHA tag.
- Push `build-and-push-1.2.0` to publish `1.2.0` and `latest`.
- Run **Docker Build & Push** manually. An empty tag publishes `sha-<short-sha>`; a supplied tag publishes that tag and `latest`.

The workflow uses the repository secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.
