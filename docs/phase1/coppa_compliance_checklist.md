COPPA Compliance Checklist — Phase 1

1. Age Gate
   - Implement age verification on signup (parent email required for <13)
2. Parental Consent
   - Record explicit parental consent (signed or checkbox + email confirmation)
   - Store consent evidence (timestamp, parent_id, child_id)
3. Data Minimization
   - Only collect necessary PII for account creation
4. Parental Access & Deletion
   - Implement API for parents to view/delete child's data
5. Data Retention
   - Define retention windows and deletion workflows
6. Marketing & Ads
   - No targeted ads for children; explicit opt-in for communications
7. Security
   - Encryption at rest/in transit; KMS for keys; access controls
8. Audit & Reporting
   - Maintain consent logs, safety logs, and export for audits
9. Legal Review
   - Schedule external COPPA audit before beta

Notes: Implement parental consent UI and backend logging before onboarding beta participants.