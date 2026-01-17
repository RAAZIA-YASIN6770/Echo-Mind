Phase 3 infra scaffolding

This folder provides a minimal Kubernetes scaffold for autoscaling the Socratic Engine and related services.

Files:
- `deployment.yaml` — Deployment + Service for `socratic-engine`.
- `hpa.yaml` — HorizontalPodAutoscaler (CPU/memory). Use KEDA for custom metrics.

Next steps:
- Convert to Helm chart and templatize images/replicas.
- Add Prometheus metrics scraping and KEDA ScaledObjects for custom metrics (LLM queue length).
- Add multi-region IaC (Terraform / Crossplane) as required.