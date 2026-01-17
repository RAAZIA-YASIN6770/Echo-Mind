Database Schema (Phase 1 — simplified)

Tables:

1. users
- id (UUID) PK
- role (enum: student,parent,admin)
- email (varchar, indexed)
- password_hash (varchar)
- display_name (varchar)
- date_of_birth (date)
- parent_id (UUID) FK -> users.id (nullable)
- created_at (timestamp)
- updated_at (timestamp)

2. concepts
- id (UUID) PK
- key (varchar) unique (e.g., photosynthesis-basic)
- title (varchar)
- subject (varchar)
- created_at

3. progress
- id (UUID) PK
- user_id (UUID) FK -> users.id
- concept_id (UUID) FK -> concepts.id
- status (enum: in_progress,understood,needs_review)
- confidence_score (numeric) -- 0-1 inferred
- last_interaction (timestamp)
- attempts (int)
- created_at
- updated_at

Indexes:
- users(email)
- progress(user_id, concept_id)

Notes:
- Use UUIDs for portability and easier replication.
- Add audit table (safety_logs) for flagged conversations with retention policy.

safety_logs
- id (UUID) PK
- user_id (UUID)
- incident_type (enum)
- context_snippet (text, redacted)
- flagged_at (timestamp)
- resolved (bool)
- resolved_by (UUID)

