Phase 2 Parental Consent

Overview:
- Capture explicit parental consent before collecting/processing minor PII.
- Provide guardians with a consent review and revocation interface.

Data model:
- See `database_schema.md` for `parental_consent` table.

UX:
- Consent flow should be mobile-friendly and auditable.

Next actions:
- Implement backend API endpoint `/parental-consent`
- Add email/SMS confirmation for guardian verification
