-- Sample seed data for Phase 1

INSERT INTO users (id, role, email, password_hash, display_name, date_of_birth) VALUES
  ('11111111-1111-1111-1111-111111111111','parent','parent@example.com','<hash>','Parent One','1980-01-01'),
  ('22222222-2222-2222-2222-222222222222','student','child@example.com','<hash>','Child One','2014-06-15');

INSERT INTO concepts (id, key, title, subject) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','photosynthesis-basic','Photosynthesis: Basic','Science'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','multiplication-1','Multiplication basics','Math');

INSERT INTO progress (id, user_id, concept_id, status, confidence_score, attempts) VALUES
  ('33333333-3333-3333-3333-333333333333','22222222-2222-2222-2222-222222222222','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','in_progress',0.4,1);
