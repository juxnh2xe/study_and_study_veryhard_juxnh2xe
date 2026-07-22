# STATE.md - React State & Custom Hooks Architecture (v2.0)

---

## 1. State Management Architecture

Daybreak Study uses custom React domain hooks with LocalStorage synchronization and Repository Layer Abstraction (`repository.ts`).

```text
src/hooks/
 ├─ useLocalStorage.ts      # Base SSR-safe LocalStorage sync hook
 ├─ useDynamicSkyTheme.ts   # Local hour-based background sky phase hook
 ├─ useTimer.ts             # Date.now() timestamp delta timer calculation & session recorder
 ├─ useRoutines.ts          # Routine checklist CRUD, daily midnight rollover, and streak tracker
 ├─ useStudyStats.ts        # Aggregated study time calculations & Recharts dataset formatter
 ├─ useTextbooks.ts         # Textbook reading progress tracker
 └─ useWeaknessNotes.ts     # Retrieval weakness notes & wrong answer review logger
```

---

## 2. v2.0 Architecture Specifications

- **`IStudyRepository`**: Abstract repository interface decoupled from UI components.
- **`useDynamicSkyTheme`**: Evaluates `Dawn`, `Morning`, `Day`, `Sunset`, `Night` sky ambient glow based on `new Date().getHours()`.
- **`FocusGarden`**: Visual growth component mapping cumulative hours to levels (Cloud to Starry Sky).
- **`NotificationTriggers`**: Helper layer triggering browser notifications.
