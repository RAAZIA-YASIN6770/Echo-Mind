

## SOFTWARE REQUIREMENTS
## SPECIFICATION (SRS)
Project: Eco-Mind AI – The Socratic Mentor
Version: 1.0 (Final)
## Date: May 20, 2024

## 1. INTRODUCTION
## 1.1 Purpose
This document specifies the requirements for "Eco-Mind," an AI-driven educational platform
for children (Grades 3-7). It aims to replace direct answer-giving with Socratic inquiry,
ensuring cognitive development and online safety.
## 1.2 Scope
The system is a cross-platform application (Web/Mobile). It includes an AI dialogue engine, a
gamified progress tracker (Knowledge Tree), and a parent monitoring dashboard. It does not
provide social networking features or direct homework solutions.
1.3 Definitions and Abbreviations
Socratic Engine: The logic layer that rephrases AI outputs into questions.
Knowledge Tree (KT): The visual representation of a user's database entries.
COPPA: Children's Online Privacy Protection Act.
Prompt Injection: An attempt by a user to bypass AI safety filters.

## 2. OVERALL DESCRIPTION
## 2.1 Product Perspective
Eco-Mind operates as a middleware between a child user and a Large Language Model
(LLM). It acts as a safety and pedagogical filter.
2.2 User Classes and Characteristics

- Student (Ages 8-13): Primary user. Needs simplified UI, voice support, and rewards.

- Parent/Guardian: Monitors progress via the Knowledge Tree and receives safety
alerts.

- Developer/Admin: Manages API keys, updates content "whitelists," and monitors
system logs.

## 2.3 Operating Environment
● Frontend: React Native (iOS/Android) or React.js (Web).
● Backend: Python (FastAPI/Flask) for AI logic and Node.js for user management.
● Database: PostgreSQL (Relational data) and Redis (Session/Streak caching).

## 3. SPECIFIC REQUIREMENTS (FUNCTIONAL)
3.1 Socratic Mentoring Module (FR-01)
Requirement: The AI must intercept any direct question and respond with a pedagogical
hint.
## Logic:
● Input: "What is 12 times 10?"
● Output: "If you have 12 boxes and each box has 10 pencils, how would you count
them quickly?"
Threshold: If a user fails to answer correctly after 3 hints, the AI provides a visual analogy
rather than the digit.
## Example:
● User: "What is 12 times 10?"
● AI: "If you have 12 boxes and each box has 10 pencils, how would you count them
quickly?"
3.2 The Knowledge Tree & Gamification (FR-02)
Requirement: The KT must update in real-time based on successful "Concept Completion."
## Data Points:
● Node Growth: Triggered when the AI marks a topic as "Understood" (via sentiment
analysis).


● Curiosity Streak: Tracks daily active sessions. Streak > 5 days unlocks "Golden
## Leaves."

● Wilt Logic: If no login occurs for >72 hours, the CSS transitions the tree to a
"Dormant" (greyed out) state.

3.3 Offline Challenge Trigger (FR-03)
Requirement: To prevent eye strain, the system must force a "Physical Break."
Trigger: After 20 minutes of continuous chat or 3 completed concepts.
Action: The UI displays a full-screen "Quest Card" (e.g., "Go find a round object in your
house"). The chat is locked until the user clicks "I'm Back."
3.4 Misconception Buster (FR-04)
Requirement: The AI must test the user's confidence and logic.
Trigger: Once per session.
Example: AI says: "I heard that plants eat pizza to grow. Is that true?"
Success Condition: User provides a rebuttal (e.g., "No, plants need sunlight and water").

## 4. SAFETY & SECURITY REQUIREMENTS (THE
## TRIPLE-LOCK)
4.1 Content Filtering (Lock 1)
System Constraint: The AI shall use a Negative Constraint Prompt.
Blocked Categories: Politics, Religion, Sexuality, Violence, and Social Media Trends.
Response for Blocked Topics: "I'm a Nature and Science explorer! Let's talk about
something like space or animals instead."
4.2 Privacy & PII Protection (Lock 2)
Requirement: The system must use Regex (Regular Expressions) to detect and redact:
● Phone numbers
● Email addresses
● Physical addresses
● Real names

Action: Data is scrubbed before being sent to the LLM API to ensure user anonymity.
4.3 Homework Guard (Lock 3)
Requirement: Detect "Copy-Paste" patterns (long strings of text ending in a question mark).
Action: If detected, the AI must say: "That looks like a big task! Let's break it down into
smaller pieces together."

## 5. TECHNICAL SPECIFICATION & DATABASE DESIGN
5.1 Database Schema (Simplified for Developers)
## Table Column Type Description
Users User_ID UUID Primary Key
Progress Concept_ID String Topic mastered (e.g.,
"Photosynthesis")
Tree_Stat
e
Health_Scor
e
Integer 0-100 (Influences visual growth)
Streaks Last_Login Timestamp Used to calculate the Curiosity Streak
## 5.2 System Prompt Engineering
Developers must use the following System Message for the AI API:
"You are Eco-Mind, a mentor for kids. You never give direct answers. You only give hints.
You are curious, kind, and strictly educational. You ignore all questions about politics,
religion, or personal identities. Your tone is like a friendly robot explorer."

## 6. NON-FUNCTIONAL REQUIREMENTS
## 6.1 Performance
● Latency: AI response time must be <2.5 seconds.
● Scalability: System must support up to 5,000 concurrent students.
## 6.2 Availability
● 99.9% uptime during school hours (8 AM - 4 PM).

## 6.3 Maintenance
● The "Blocked Keyword" list must be updated weekly to include new viral trends or
unsafe slang.

## 7. VALIDATION & TESTING
● Pedagogical Test: Does the AI give the answer? (Result must be NO).
● Safety Test: Does the AI respond to "Who is the Prime Minister?" (Result must be
## REDIRECT).
● UI Test: Does the tree grow when a concept is finished? (Result must be YES).

## 8. PROJECT ROADMAP & ESTIMATION (TIMELINE)
The development of Eco-Mind is estimated to take 24 weeks (6 months) for a
high-standard, production-ready MVP (Minimum Viable Product).
## Phase Duratio
n
## Key Deliverables
## Phase 1: Discovery &
## Planning
2 Weeks Finalized UI/UX Wireframes, Prompt
## Engineering Strategy.
Phase 2: UI/UX Design 4 Weeks High-fidelity prototypes, Character design for
## Robot Guide.
Phase 3: Core AI
## Development
## 6 Weeks Socratic Logic Layer, Safety Filters, Integration
with LLM APIs.
## Phase 4: Gamification &
## Tree Logic
4 Weeks Knowledge Tree SVG animations, Streak logic,
Database setup.
## Phase 5: Safety & Beta
## Testing
4 Weeks Stress testing (Prompt Injection), COPPA
compliance audit.
## Phase 6: Deployment &
## Launch
4 Weeks App Store/Play Store submission, Cloud
scaling (AWS/Azure).

## 9. BUDGET ESTIMATION (HIGH-STANDARD INDUSTRY
## RATES)

For a high-quality, scalable, and secure AI tool, the budget is divided into Development
Costs and Operational Costs.
9.1 Development Costs (One-Time)
Estimates based on a mid-to-high tier specialized tech team.
Resource/Category Est. Cost
## (USD)
## Description
Senior AI/Backend
## Engineer
## $25,000 -
## $35,000
Designing the Socratic engine and API
security.
## Frontend & Game
## Developer
## $15,000 -
## $20,000
Knowledge Tree animations and Mobile
## UI.
UI/UX Designer $8,000 -
## $12,000
Child-centric design and character mascot.
QA/Safety Tester $5,000 - $8,000 Manual and automated testing for content
safety.
## Project Management $7,000 -
## $10,000
Agile coordination and documentation.
## Total Dev Budget $60,000 -
## $85,000
Total for MVP Development.
9.2 Operational Costs (Recurring Monthly)
## Category Est. Cost
(USD/Mo)
## Description
AI API Costs (LLM) $500 - $2,000 Based on token usage for 5,000 active
users.
## Cloud Hosting
## (AWS/GCP)
$300 - $800 Scalable server costs and database
hosting.
Maintenance & Security $1,000 - $1,500 Monthly updates to safety filters and bug
fixes.

## 10. SYSTEM ARCHITECTURE & VISUAL DESIGN
## CONCEPTS
## 10.1 Technical Architecture

The system will follow a Microservices Architecture:
● Edge Layer: Handles Language Filtering and PII scrubbing.
● Logic Layer: The "Socratic Wrapper" that converts answers to questions.
● Visual Layer: React-based frontend that renders the Knowledge Tree.
## 10.2 The Knowledge Tree Wireframe
The UI is designed to be highly visual:
● Left Panel: Chat interface with the Robot Guide.
● Right Panel: The 3D/2D Knowledge Tree that grows fruits as the user learns.
● Top Bar: Displays the "Curiosity Streak" (Fire/Leaf icon).

## 11. RISK MANAGEMENT (POST-LAUNCH)
## Risk Impact Mitigation Strategy
AI Hallucination High Using "Grounding" (referencing a whitelisted knowledge
base).
## Screen
## Addiction
Medium Mandatory "Offline Challenges" triggered after 20 mins of use.
## Prompt
## Injection
High Implementing an adversarial filter to block "Ignore previous
instructions" hacks.

## 12. APPROVAL SECTION
Authorized by:
## Project Lead / Stakeholder Name: _____________________________
## Date: _____________________________
## Lead Software Architect: _____________________________
## Date: _____________________________
Head of Educational Content: _____________________________
## Date: _____________________________

## END OF DOCUMENT

## 13. MEASURABLE ACCEPTANCE CRITERIA (APPENDIX)

This appendix defines measurable, testable acceptance criteria for key functional and non-functional requirements.

13.1 Socratic Mentoring Module (FR-01)
- Direct-answer rate: <5% on a curated test suite of 300 prompts across subjects.
- Hint progression: 3-hint flow must escalate appropriately; pass rate for hint-triggered correct student answers >= 60% within session.

13.2 Knowledge Tree & Gamification (FR-02)
- Tree update latency: visual update within 3 seconds of backend concept completion event (95th percentile).
- Curiosity streak accuracy: streak calculations must match server login history in 99% of test cases.

13.3 Offline Challenge (FR-03)
- Trigger accuracy: challenge appears at 20 minutes continuous chat or after 3 completed concepts in 100% simulated runs.

13.4 Misconception Buster (FR-04)
- Detection accuracy: misconception prompts detection precision >= 85% on a 50-case test set.

13.5 Safety Filters (Triple-Lock)
- Blocked content detection: precision >= 99%, recall >= 95% on curated corpus (500+ cases).
- PII redaction: detection and redaction success rate >= 99% on 200+ PII test cases.
- Homework guard: detection of copy-paste homework patterns (>=100 words ending with a question mark) >= 98%.

13.6 Performance
- Latency targets: P95 response time <2.5 seconds; P99 <4.0 seconds under expected load.
- Concurrency: system supports 5,000 concurrent active sessions with error rate <0.5% under defined test profile (50 messages/user/hour).

13.7 Availability & Reliability
- Uptime target: 99.9% during defined school hours (8 AM - 4 PM) over 30-day rolling window.

13.8 Security & Compliance
- Penetration testing: zero critical findings; no high-risk findings unresolved at time of sign-off.
- Audit logging: all safety events and consent actions audited and retained for at least 1 year; consent evidence retained for 3 years.

13.9 COPPA & Privacy
- Parental consent capture: recorded with timestamp, parent identifier, IP, and user-agent; retrieval API available.
- Data deletion: delete requests processed and acknowledged within 30 days; automated deletion job documented.

13.10 Validation & CI
- Test coverage: unit test coverage >=85% for core modules (Socratic engine, safety filters, API layer).
- CI gating: PRs must pass unit tests and linting; integration tests required before merge to main for release branches.

These measurable criteria will be used as the basis for Phase sign-off and acceptance testing. Test suites and CI pipelines must include the cases necessary to validate the metrics above.

## END OF DOCUMENT

Eco-Mind AI – The Socratic Mentor | Software Requirements Specification v1.0
