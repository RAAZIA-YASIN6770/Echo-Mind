System Architecture — Overview (Phase 1)

Components:
- Edge Layer (Input Scrubbing)
  - PII redaction, keyword blocking, homework guard detection
- API Layer (FastAPI)
  - Auth, user management, progress, tree state endpoints
- Socratic Engine Service
  - Prompt injection, hint-generation, 3-hint progression
- LLM Adapter
  - Rate limiting, retry/fallback, cost tracking
- Data Layer
  - PostgreSQL (progress, users), Redis (sessions, cache), S3 (assets)
- Parent Dashboard & Admin Portal
  - Read-only views of progress, safety alerts
- Real-time Layer
  - WebSockets (notifications, tree updates)

Responsibilities & Boundaries:
- Edge Layer must scrub PII before passing to LLM Adapter.
- Socratic Engine transforms user prompts into hint prompts and enforces safety.
- LLM Adapter handles provider failover and token accounting.

Deployment:
- Microservices on containers (ECS/EKS)
- CI/CD pipelines for build/test/deploy
- Staging environment mirrors production for load tests

Security & Compliance Highlights:
- KMS for API keys & encryption keys
- RBAC for admin portals
- Audit logs retained per policy (see COPPA checklist)
