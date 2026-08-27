# Architecture Node: Storage and Sync

## File Locations
- Storage Layer: `src/lib/storage.ts`
- Cloud Sync Engine: `src/lib/supabaseSync.ts`
- Supabase Client: `src/integrations/supabase/client.ts`

## Key Architecture Principles

1. **Local-First Default**: All application features operate directly on `localStorage` using typed, schema-validated accessor methods (`getProfile`, `savePassage`, `saveJournalEntry`).
2. **Deterministic Deduplication**: List mutations use `writeListAtomically()` and normalize reference keys to prevent duplicate passages or entries.
3. **Storage Caps**:
   - Saved Passages: 200 items max.
   - Journal Entries: 500 items max.
   - Safety Events: 100 items max.
4. **Consent-Gated Cloud Sync**:
   - `optionalCloudSync` in `UserProfile` must be explicitly `true` before `supabaseSync.ts` uploads records to PostgreSQL.
   - If false or unauthenticated, cloud synchronization is completely blocked.
