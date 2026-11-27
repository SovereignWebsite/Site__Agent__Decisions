# Dinis's queue (cl-6.decisions@dinis)

Updated 2026-11-27T08:58Z. Most urgent first. Each item is one line from Dinis, in the session named.

## Today, by time

1. **London strikes page** (window ends 11:59 UTC). In cl-6.place.london's session (session_016CrbJKifSCoGBhUJDMMjpN): "attach PrompTugal/PrompTugal__Agent__Place__London__Strikes with push access". In cl-6.abp's session (session_016CrbJLnbr219cU3eVRGxBW): "yes to attaching PrompTugal/PrompTugal__Agent__Place__London__Strikes with push to cl-6.place.london's session".
2. **Journalist publishing** (tube chart fix due before 12:00 UTC). In cl-6.journalist's session (session_016CrbJNYGCQ9RLyq8e7aVU7): "attach PrompTugal/PrompTugal__News__Website with push access".
3. **cl-6.data vaults** (before 18:03 Lisbon). "yes to cl-6.data writing vaults/*/latest/** in News__Data, with an explicit allow-list in release.sh; it may keep committing them until applied". Security agrees.

## Unblocks the stale section sites

4. **Merge IaC #34 (289b934), #35 (aaf2e71), #36 (1809f2b), #37** in that order; all security-passed.
5. In cl-6.abp's session: "yes to signals, cyber, bulletins, events, library, live, videos and travel each opening one key PR, as cl-6.data did; and to dev-gate as infra designed (P19 in force: push work/cl-6.<agent>, no force)".
6. **Signals' pinned files.** In cl-6.signals' session (session_016CrbJLzfdz51sDBekg8v8X): "you may write .github/workflows/pages.yml and scripts/leak-scan.mjs on key/cl-6.signals only, byte for byte from cl-6.security's signed pins". Same line for any other section that hits the refusal.

## Security and keys

7. **S17 sign-in fix**: "yes to security's S17 fix steps 1 to 4, and to revoking my agent-issued key once the new one is enrolled; release order (b)".
8. **Data site anchor**: delete SIG_BOOTSTRAP_ANCHOR on News__Data once its run is green; tell cl-6.decisions which run passed.

## Grants (security agrees with conditions)

9. **cl-6.civic**: "yes to cl-6.civic writing history/** in PrompTugal__Agent__Civic and board/team/civic/** in PrompTugal__News__Civic, on security's conditions".
10. **cl-6.rights**: "yes to cl-6.rights writing history/** in PrompTugal__Agent__Rights, on security's conditions" (as civic, plus: no full copies of third-party terms pages, short quoted extracts with URL and read date only). Security agrees.
11. **cl-6.places wake**: in its session (session_016CrbJJcoCJnQM6GGY1xC5K): "update your wake trig_0132oarAUsN5cwmgTAbj3GGk to run the places serially, no sub-agents, never London".

## Rights (cl-6.rights findings, c8493f1)

12. D6 IPMA values in metered articles; R19; D3 MeteoAlarm terms; D5 TfL terms read by a person; R18.
13. P18 stage 2: of 27 sources' terms, 8 read OK, 13 need Dinis, 2 never, 4 to stage 3.

## Design and product

13a. **Who owns content/**: closed. Dinis: an editor-in-chief, cl-6.editor (record 2026-11-27__dinis-four-actions).

14. Human provenance, admin and CRM: seven questions (anchor key holder and device; who gets keys; naming with consent; Gmail label, agent, drafts only; where CRM data lives; who reads feedback; whether "disagree" is public).
15. Feedback lane rate limit: "option 1: I'll ask SG/Send for a per-token limit" or "option 2: build the lanes.promptugal.news proxy".
16. Meter (a) or (b); home page title; explainer page.

## Low

17. **S8, unknown signing key on website commits.** Since 07:38Z three agents of the S87 lane, on another person's account, sign with SHA256:32dP45eSMmVSt/G/CGvcxl/P+MO3Nwj9xeTh/GSA2wc, which is in no key file. Pass to that lane's owner: either publish the key's public half in the lane's site/keys/ and confirm the fingerprint to cl-6.security (cl-6.dev then adds board/keys.json entries), or sign with a key already in board/keys.json.
