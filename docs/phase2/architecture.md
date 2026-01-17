System Architecture — Phase 2

Overview:
- Productionize microservices: Socratic Engine, LLM Adapter, Edge Layer, API Layer
- Stronger boundaries: separate FastAPI Socratic Engine, Django for admin/web if kept
- Introduce orchestration and infra: containers, Helm/ECS task defs, staging/production

Components (Phase 2 additions):
- LLM Adapter: provider failover, quota/cost accounting, rate limiting
- Edge Layer: PII redaction, homework-guard, content classification
- Telemetry & Observability: tracing, metrics, logging, cost dashboards
- Parent Dashboard: consent UX, read-only progress

Deployment & Operations:
- CI/CD promoting containers to staging then production
- Secrets via KMS/Secrets Manager, DB migrations managed in pipeline
- Load testing and provider failover simulations

Security & Compliance:
- COPPA controls, data retention policies, audit trails
- RBAC and least privilege for admin portals

Next steps:
- Finalize infra diagrams and dependency map
- Add runbooks for failover and incident response