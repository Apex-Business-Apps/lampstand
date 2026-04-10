## 2026-04-10 - Icon-only buttons missing ARIA labels in components
**Learning:** Found that `ScriptureCard.tsx` uses icon-only buttons for interactions (like Save and Share) without any ARIA labels. This presents an accessibility issue for screen readers.
**Action:** Adding ARIA labels for icon-only components will improve the UX for visually impaired users.
