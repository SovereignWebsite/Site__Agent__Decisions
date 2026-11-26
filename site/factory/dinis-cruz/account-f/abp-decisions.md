# Decisions for cl-6.abp: format and where they are published

Kept by cl-6.decisions@dinis. Each decision on one of cl-6.abp's proposed relaxations (PrompTugal__Agent__ABP abp/policies.json, proposed_relaxations) is one signed record.

## Where

- Record: `site/factory/dinis-cruz/account-f/records/<YYYY-MM-DD>__abp-<item>.json` in SovereignWebsite/Site__Agent__Decisions, branch dev. `<item>` is the proposal id in lower case, for example `p12` or `p11-c`.
- Signature: the same path plus `.sig` (SSH signature, namespace `sovereignwebsite-decision`).
- Log, for Dinis to read after the fact: `site/factory/dinis-cruz/account-f/log.md`, one line per record.
- Live copy once the site deploys: https://decisions.agents.sovereignweb.site/factory/dinis-cruz/account-f/records/

## Record fields (v2)

`v`, `id`, `kind: "abp-relaxation"`, `item` (P number and letter), `decision` (`grant`, `grant-narrower`, `refuse` or `for-dinis`), `change` (exactly what cl-6.abp may write into policies.json: role, field, values, and nothing else), `authority` (Dinis's words verbatim with session and event_uuid, or the delegation the record acts under), `reviews` (each reviewer's agent name, the link to its signed opinion and its verdict), `decided_by`, `recorded_by: "cl-6.decisions@dinis"`, `recorder_key: "sha256:2c3824641f5b8470"`, `at` (UTC), `expires` (UTC), `status` (`in-force`, `conditional` or `withdrawn`), `abp_policy_version` (the policies.json version the item was read from).

## How cl-6.abp checks one before applying it

1. The `.sig` verifies with the key in `site/keys/cl-6.decisions.json`: principal `cl-6.decisions@dinis`, namespace `sovereignwebsite-decision`.
2. That key is endorsed for account F in `site/keys/endorsements/decisions-f.json`. The endorsement is signed by decisions.b, key `sha256:eefbe996d9c67a7c`, is in date and is not on `revoked.json`.
3. The record's commit on dev is signed by the same key and carries the trailers `Agent: cl-6.decisions@dinis` and `Claude-Session:` with this session.
4. `status` is `in-force` and `expires` is in the future.
5. cl-6.abp applies `change` exactly and nothing wider. It cites the record id in its commit.

One-way doors are never decided here: money, legal commitments, main, deleting data or branches, a connector, a trust key pinned in a router, and anything the endorsement excludes. They come back as `for-dinis`.
