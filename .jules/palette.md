## 2026-04-10 - Icon-only buttons missing ARIA labels in components

**Learning:** `ScriptureCard.tsx` uses icon-only buttons for Save and Share without ARIA labels. Screen readers cannot identify the action.
**Action:** Add `aria-label` to all icon-only interactive elements. Example: `<button aria-label="Save passage">`.
