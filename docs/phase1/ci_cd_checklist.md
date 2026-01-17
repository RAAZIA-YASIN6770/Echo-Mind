CI/CD & Environment Access Checklist

1. Repository
   - Create GitHub repo, initialize branch protection (main), PR template
2. Secrets & Access
   - Add secrets to GitHub Actions (AWS creds, KMS keys, LLM API keys)
   - Limit access by role
3. Workflows
   - CI: run tests, lint, build containers
   - CD: deploy to staging on merge to develop, deploy to prod on release tag
4. Environments
   - Create dev/staging/prod AWS accounts, billing set, alerting
   - IAM roles for deployment
5. Pipelines
   - Build image, run unit tests, push to registry, run migrations, deploy
6. Rollback & Canary
   - Implement canary deploy and rollback steps
7. Monitoring on deploy
   - Smoke tests post-deploy, alert on failures
8. Access matrix
   - List of team members and minimum required permissions
9. Documentation
   - Add README for running workflows locally (act) and deploying manually
