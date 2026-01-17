Phase 3 — Growth Features & Internationalization

Targets:
- Multi-language support for hints and UX (i18n/l10n).
- Analytics and experimentation (A/B tests, feature gates).
- Content packs: curated learning modules and localization-ready assets.

Plan:
1. Internationalization:
   - Add translation pipeline (gettext / message catalogs or service like Lokalise).
   - LLM-generated localized hints with quality checks and fallback to English.
2. Analytics & growth:
   - Integrate event tracking (telemetry) with analytics platform (Amplitude / Mixpanel) and data warehouse.
   - Set up experimentation framework for content and hint strategies.
3. Content packs:
   - Define content pack schema and ingestion pipeline (S3-backed assets).
   - Support regional curricula and age-appropriate variants.

Next steps:
- Create localization backlog and sample content pack.
- Instrument A/B testing hooks in `socratic-engine` and `personalization-service`.