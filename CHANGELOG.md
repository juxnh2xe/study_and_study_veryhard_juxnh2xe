# CHANGELOG.md

All notable changes to the **Daybreak Study** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-07-23 (Premium Release)

### Added & Polished
- **Dynamic Sky Theme (`useDynamicSkyTheme.ts`)**: Background ambient glow shifts according to local time (Dawn, Morning, Day, Sunset, Night).
- **Focus Garden (`FocusGarden.tsx`)**: Added study hours growth levels (Cloud -> Sprout -> Tree -> Forest -> Starry Sky).
- **Brand Splash Screen (`SplashScreen.tsx`)**: 1-second load animation with brand logo and slogan.
- **Onboarding Carousel (`OnboardingModal.tsx`)**: First-time user guide carousel saved in LocalStorage.
- **Weekly & Monthly Reports (`AnalyticsReportModal.tsx`)**: Advanced analytics summary for total hours, target achievement %, top subject, and AI growth insights.
- **Cloud Sync Ready Repository Layer (`repository.ts`)**: `IStudyRepository` interface ready for seamless Supabase / Firebase adapter swapping in v2.1.
- **Notification System (`notifications.ts`)**: Browser Push Notification triggers for focus start, Pomodoro rest finish, routine reminders, and exam D-Day.
- **Expanded Settings**: Dynamic theme toggle, Notification permissions switch, backup & restore, onboarding restart.

---

## [1.1.0] - 2026-07-23 (Expansion Pack Release)

### Added
- Goals System, Exam D-Day Manager, 365-Day Heatmap, Monthly Study Calendar, Achievement Gallery, Study Diary, White Noise Selector, JSON Backup/Restore, PWA Manifest, Global Search.
