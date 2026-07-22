# STORAGE.md - Local Data Persistence & Schema Specification (v2.0)

---

## 1. Storage Architecture & Backup Engine

Daybreak Study works client-side via LocalStorage and features Cloud Sync Ready abstraction (`IStudyRepository`), PWA support, and JSON Backup & Restore.

- **Primary Storage**: `window.localStorage` (JSON serialized).
- **Key Prefix**: `daybreak_study_` to prevent key collisions.
- **Backup Engine**: `exportAllDataToJSON()` exports entire LocalStorage data to JSON file; `importDataFromJSON()` validates and restores backup.

---

## 2. v2.0 Storage Keys

- `daybreak_study_profile`: User profile, target university, dDay, dynamic theme & notification toggles, onboarding state.
- `daybreak_study_onboarding_done`: Onboarding completion boolean flag.
- `daybreak_study_goals`: Scope study goals.
- `daybreak_study_exams`: Target exams and D-Day.
- `daybreak_study_diaries`: Daily study diary logs.
- `daybreak_study_achievements`: Milestone badges.
- `daybreak_study_routines`: Routine checklist items.
- `daybreak_study_sessions`: Completed focus session logs.
- `daybreak_study_textbooks`: Textbook reading progress.
- `daybreak_study_retrieval_notes`, `daybreak_study_wrong_notes`: Weakness notes.
