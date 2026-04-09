# Unified Runtime

Use the standardized runtime files:

- `docker-compose.unified.prod.yml`
- `.env.unified` (copy from `.env.unified.example`)

Run:

```bash
docker compose -f docker-compose.unified.prod.yml --env-file .env.unified up -d --build
```
