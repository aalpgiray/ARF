## 1. Convert SessionTable to client component

- [x] 1.1 Add `'use client'` directive to `components/dashboard/SessionTable.tsx`
- [x] 1.2 Add `useRouter` and `useState` imports
- [x] 1.3 Add `returning` state (`string | null`) to track which session is submitting
- [x] 1.4 Implement `handleReturn(sessionId)` — POST to `/api/sessions/${sessionId}/return`, on success `router.push('/sign-in/training?session_id=${sessionId}')`
- [x] 1.5 Add "I'm back" button to each `sess-row`, disabled when `returning === s.id`, showing "Recording…" while in flight
- [x] 1.6 Keep status chip (overdue / on water) alongside new button

## 2. Update dashboard page

- [x] 2.1 Remove the `<Link href="/sign-in">` "I'm back — sign in" footer CTA from `app/page.tsx`

## 3. Remove redundant sign-in page

- [x] 3.1 Delete `app/sign-in/page.tsx`
- [x] 3.2 Verify `app/sign-in/training/page.tsx` is untouched and still routes correctly

## 4. Verify

- [x] 4.1 Dashboard renders with "I'm back" button on each row
- [x] 4.2 Tapping "I'm back" shows "Recording…" state then redirects to training page
- [x] 4.3 Footer no longer shows standalone "I'm back — sign in" CTA
- [x] 4.4 Navigating to `/sign-in` returns 404
- [x] 4.5 `/sign-in/training?session_id=<id>` still works after return is recorded
