Test Plan — Phase 1 (Mapping acceptance criteria to tests)

Acceptance areas & test plan:

1. Socratic Engine (FR-01)
   - Unit tests: 200 prompt->hint cases (math, science, general)
   - Integration tests: 100 end-to-end sessions verifying no direct answers
   - Acceptance: Direct-answer rate <5% on 300-case suite

2. Knowledge Tree (FR-02)
   - UI unit tests: 50 snapshot tests
   - Integration: 30 scenarios for node growth and state transitions
   - Acceptance: Tree updates within 3s of concept completion; visual states correct in 95% cases

3. Offline Challenge (FR-03)
   - Unit: 20 timer/trigger tests
   - Acceptance: Challenge triggers at 20 min or 3 concepts in 100% of simulated sessions

4. Misconception Buster (FR-04)
   - Unit: 50 example misconception prompts
   - Acceptance: Correct detection and response in 85%+ of cases

5. Safety Filters (Triple-Lock)
   - Blocked content tests: 500 test cases (politics, religion, sexual, violent)
   - PII tests: 200 test cases (phone/email/address formats)
   - Homework guard: 100 copy-paste detection tests
   - Acceptance: Safety filter precision >=99%, recall >=95% on curated test corpus

6. Performance
   - Load tests: 5k concurrent users, 50 messages/user/hour profile
   - Acceptance: P95 latency <2.5s, error rate <0.5%

CI gating:
- Unit tests must pass on PRs; integration tests pass in staging before merge to main; load tests run before major releases.

Reporting:
- Automated test reports (JUnit/HTML), coverage badge target >=85% for core modules.
