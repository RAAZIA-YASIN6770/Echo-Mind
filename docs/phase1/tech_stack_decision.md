Tech Stack Decision — Phase 1 (Locked)

Primary choices (MVP):
- Mobile: React Native (shared components with web)
- Web: React.js (single-page app)
- Backend: Python (FastAPI) — core APIs & Socratic logic
- Admin/ops microservice (optional): Node.js (if needed)
- Database: PostgreSQL (managed RDS)
- Cache/session: Redis (ElastiCache)
- Storage: S3-compatible (AWS S3)
- LLM Provider: Primary - OpenAI (GPT family), Fallback - Anthropic
- Hosting: AWS (preferred) — dev/staging/prod accounts
- CI/CD: GitHub Actions
- Monitoring: Datadog / Sentry

Rationale:
- FastAPI is async-friendly, good for low-latency LLM proxying.
- React Native accelerates cross-platform UI reuse.
- PostgreSQL provides relational consistency for progress data.

Decision log: Tech stack locked for Phase 1; changes require change request.