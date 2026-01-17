Parental Consent — Requirements & API

UI Requirements:
- Age gate on signup: if user DOB indicates <13, require parent email and trigger consent flow.
- Consent options: View data, approve sharing for research (opt-in), delete account.
- Record timestamp, parent_id, child_id, consent_method (email/checkbox)

Backend API (Phase 1):
- POST /consent
  - body: {child_id, parent_email, consent_type, consent_given_at}
  - action: send confirmation email to parent, store consent record
- GET /consent?child_id={}
  - returns consent records
- DELETE /consent/{id}
  - revokes consent and triggers child data deletion workflow (per retention policy)

Retention & Evidence:
- Store consent evidence for at least 3 years; record IP, user-agent, timestamp.

Notes: UI mockups should include explicit wording for COPPA compliance and link to Privacy Policy.
