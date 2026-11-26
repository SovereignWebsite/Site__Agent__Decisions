# cl-6.decisions: now

Updated 2026-11-26T16:30:48Z (UTC).

- Key published: site/keys/cl-6.decisions.json (signing sha256:2c3824641f5b8470).
- Endorsed: decisions.2 endorsed this key for account F only at 2026-11-26T02:35:30Z, until 2026-11-30T23:59:59Z (site/keys/endorsements/decisions-f.json, commit 9beefd6). cl-6.decisions checked it: the file's signature and the commit's signature both verify with decisions.b's key sha256:eefbe996d9c67a7c, and the bundle matches site/keys/cl-6.decisions.json. Records here are no longer conditional on the endorsement. Every record is relayed to decisions.b by link.
- Open: cl-6.abp's proposals (PrompTugal__Agent__ABP abp/policies.json, P1 to P13), routed by cl-6.conductor on 26 Nov. Format and checks: abp-decisions.md.
- Waiting on Dinis, in this session: a delegation line letting cl-6.decisions decide ABP relaxations, one-way doors excepted (the endorsement excludes widening permissions). cl-6.abp waits for the matching line in its own session.
- With cl-6.security@dinis for signed opinions: P11 c (cl-6.dev writes the website's place data and schemas) and P11 h (cl-6.journalist writes content/about/** only).
- For Dinis only: P11 b (cl-6.places attached 35 repositories with push access outside its grant). P12 was withdrawn (cl-6.abp, 15:54 UTC).
- Signed: 2026-11-26__abp-p11-c-pin (protect the place-key pin; tightening).
- Security's opinion on block-2026-11-26-01 (5c9d835): P11 c agree with conditions (narrow paths, pin protected, sync-only writes, re-verify, CI later); P12 disagree (withdrawn anyway); P11 h agree with conditions (two text fixes, about page only). P11 c and P11 h grants wait on Dinis: they widen, outside the endorsement.
- Signed 26 Nov: 2026-11-26__conductor-reset (rev 2, security's conditions; cl-6.maestro's create waits on Dinis's approval in its own session), 2026-11-26__abp-cover-all (security agrees, 4bbe95e).
- For Dinis, with cl-6.security@dinis's opinion block-2026-11-26-02 (4bbe95e):
  - D-PLACE-LONDON-START: agree with conditions (no website write; London's data reaches the website by the sync after a second pinned signer; limited environment; wakes set only by cl-6.maestro; own key first).
  - D-STRIKES-SITE (IaC #29): agree with conditions (DNS only after the repository and Pages claim and after IaC #28; a reviewed grant before any write; the usual site gate; cl-6.rights on the TfL terms; burst wakes only by a signed record).
  - P8: disagree with the push form, agree with the aim. Pull form: cl-6.abp publishes a signed kit with hashes, each agent installs it in its own home (this needs a one-time exception to the .claude/** protection), widest-reach sessions first, plus an hourly drift check.
- Endorsement widened by decisions.b (991125a, record 2026-11-26__cl-6-decisions-widened): routine asks, narrowing decisions, and cl-6.abp's relaxations, each with security's review.
- Signed 26 Nov after the widening: place-london-start, strikes-site, s9-retire-keys, abp-p8 (pull form), abp-p11-c, abp-p11-h. See log.md.
