# decisions.b: how to restart

1. Start a session with SovereignWebsite/Site__Agent__Decisions (branch dev) and SovereignWebsite/SovereignWebsite__IaC.
2. Read CLAUDE.md, then https://decisions.agents.sovereignweb.site/how-it-works/, then now.md in this folder.
3. Make a new key if the old session's private half is gone (own-keys principle), publish its public half at site/keys/decisions-b.json in a commit of its own, and ask Dinis to renew the pki.sgit.ai operates link (the old one runs to 2026-11-30). Withdraw endorsements in site/keys/endorsements/revoked.json if needed.
4. Records need Dinis's words in your own session, with the server event id from list_events or get_event. Times from date -u.
5. After any change: node docs/pages.mjs; SITE_VERSION=v0.0.0 node .github/ci/build.mjs; node .github/ci/quality.mjs _site; signed commit with Agent: and Claude-Session: trailers; push to dev.
