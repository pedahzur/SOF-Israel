# Rights and Access

This repository combines original research data, derived datasets, and third-party
source material. A file's presence in earlier repository history does not imply
permission to redistribute it.

## Global Terrorism Database materials

The following files were removed from the deployable `gh-pages` branch on
2026-07-25:

- `GTD_2026_Codebook.pdf`
- `GTD_2026_globalterrorismdb_2021Jan-June_1222dist.xlsx`
- `Israel_GTD_2026_Revised.xlsx`

They are not part of the public appendix release. The current Global Terrorism
Database (GTD) terms prohibit public posting or distribution of the data,
codebook, and auxiliary materials without express written permission from the
University of Maryland.

Researchers should obtain GTD materials directly from START and accept the
applicable terms:

- GTD access: <https://www.start.umd.edu/gtd/>
- GTD terms: <https://www.start.umd.edu/gtd-terms>

Non-commercial analysis and visualizations derived from GTD may be presented
subject to those terms. This repository's catalog therefore describes the GTD
cross-validation use case and links to START, but does not distribute GTD files.

## Other materials

Unless a file says otherwise, contact Ami Pedahzur regarding permission to reuse
the repository's original datasets. Official reports and other third-party
documents remain subject to their publishers' rights and should not be treated
as covered by a blanket repository license.

## Publication note

The removed GTD files remain recoverable from private Git history. Before making
the full repository history public, publish a clean release repository or remove
restricted objects from the public history.

After the `gh-pages` deployment completes, verify that the restricted paths
return HTTP 404 or 410:

```bash
python3 scripts/check_live_rights.py
```
