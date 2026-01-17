Phase 2 Tech Stack Decisions

- Keep Django for admin and web; introduce FastAPI for Socratic Engine and LLM Adapter.
- Postgres for primary DB, Redis for cache/sessions, S3 for assets.
- Observability: Prometheus + Grafana, OpenTelemetry for tracing.

Open decisions:
- Kubernetes (EKS) vs ECS Fargate
- Provider selection and multi-provider strategy
