# PROJECT.md - Daybreak Study (새벽하늘 몰입 & 학습 관리 웹앱)

> **Single Source of Truth (SSOT)** for Daybreak Study project architecture, goals, tech stack, v2.0 SaaS Production Release status, and quality verification.

---

## 1. Project Overview

- **Project Name**: Daybreak Study (새벽하늘 Production SaaS Edition)
- **Target Audience**: High School Students preparing for CSAT (수능), school exams (내신), and daily focus routines.
- **Product Vision**: Multi-user SaaS Production App featuring Supabase Authentication, PostgreSQL RLS Security, Offline Migration Engine, and Repository Pattern.
- **Release Version**: **v2.0.0 Production SaaS Release**

---

## 2. Architecture & Cloud Infrastructure

1. **Authentication**: Supabase Auth (Email + Password Signup/Login, Password Reset, Provider OAuth placeholder for Google/Apple/Kakao).
2. **Database Engine**: Supabase PostgreSQL with Row Level Security (RLS) policies (`auth.uid() = user_id`).
3. **Repository Pattern**: `IStudyRepository` interface -> `SupabaseStudyRepository` with automatic offline fallback to `LocalStorageStudyRepository`.
4. **LocalStorage Migration Engine (`migration.ts`)**: Automatically transfers pre-existing offline guest data into Supabase upon initial user signup/login so no study logs are lost!
5. **Auth UI Suite**: Integrated Login Modal (`login-modal.tsx`), Signup Modal (`signup-modal.tsx`), Password Reset Modal (`reset-password-modal.tsx`), Profile Edit Modal (`profile-edit-modal.tsx`).
