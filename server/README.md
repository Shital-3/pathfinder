# Pathfinder API

## Production

The API supports an HttpOnly `pathfinder_session` cookie for browser authentication. Bearer JWTs remain accepted for API clients and automation. For a frontend hosted on a different site, configure `COOKIE_SAME_SITE=None` and `COOKIE_SECURE=true` over HTTPS.

### Endpoints

- `GET /api/health` — health/readiness check
- `GET /api/docs` — endpoint catalog
- `GET /api/openapi.json` — OpenAPI 3.0 document
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — create session
- `POST /api/auth/logout` — clear session
- `GET /api/auth/me` — current user

Do not commit `.env` or production credentials.
