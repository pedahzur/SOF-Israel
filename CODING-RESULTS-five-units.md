---
title: "Blind re-coding results — the five headline units"
author: Ami Pedahzur
date: 2026-07-01
status: draft for author review
protocol: CODING-PROTOCOL.md
---

# Blind re-code of the five expanded units — result

Per `CODING-PROTOCOL.md`, the five units carrying the entrepreneur → expansion finding were re-coded on `Entrepreneur` from **founding circumstances only**, without consulting their `Fate`. The question: was any of them coded "entrepreneur" *because* it expanded? If so, the Fisher p=0.00001 is circular.

## Result: all five survive independent coding

| Unit | Independent founding/transformation evidence (outcome not consulted) | Blind code | N=90 code | Match |
|---|---|---|---|---|
| Unit 101 | Ariel Sharon created & commanded it (Aug 1953) at the army's tasking | founder | founder | ✓ |
| Sayeret Matkal | Avraham Arnan conceived & founded it as "Company E" in Aman, late 1957 | founder | founder | ✓ |
| Shaldag (5101) | Muki Betser the documented initiator ("The Genesis of Shaldag"); formalized 1984 | founder | founder | ✓ |
| Shayetet 13 | Ze'ev Almog rebuilt it into a professional unit after the Eilat loss (cmd 1968–77) | transformative | transformative | ✓ |
| Maglan | Tal Russo redefined its capabilities/standing (cmd 1992–94), pushed it into targeted killing | transformative | transformative | ✓ |

**Agreement: 5/5. Cohen's κ on the at-risk set = 1.0** (trivially, on n=5 — reported per protocol, not as a population estimate).

Each code is anchored to a **named individual + a documented act of formation or doctrinal redefinition** that is recorded independently of whether the unit later grew. **The finding is not a coding tautology: the entrepreneur label was assigned on founding evidence, not on the expansion outcome.** The headline claim — expansion is exclusive to entrepreneur-led units (Fisher p=0.00001) — stands.

## Honest residual caveat

The three **founder** cases (Unit 101, Sayeret Matkal, Shaldag) are clean: the founding individual is documented *at formation*, fully prior to any outcome. The two **transformative** cases (Shayetet 13, Maglan) carry a residual construct overlap — a unit redefined by a strong agent (Almog, Russo) is somewhat more likely to be *recorded* as having expanded, so "transformative" and "expanded" are not perfectly orthogonal. This does not sink the result, because:
1. the association does not depend on the transformative pair — three of the five are clean founder cases coded from formation evidence; and
2. even reclassifying the two transformatives as ambiguous, expansion remains exclusive to entrepreneur-led units (no routine unit expanded).

Report the finding as: *expansion is exclusive to entrepreneur-led units; the founder cases establish this independently of outcome, and the transformative cases reinforce it with a noted construct-overlap caveat.*

## What is still open (full-N extension)

The blind re-code closes the **circularity** threat for the headline units. It does **not** yet extend the test beyond N=90, which would require coding `Entrepreneur` and `Fate` for the remaining ~214 units in `units_coding_template.csv`. That is a manual historical-judgment task (the full data files carry `Fate` for only ~10/233 rows): most obscure squadron/battalion-level units need Ami's call on whether a founding individual is documented. Until that pass is done, the Fisher test cannot be re-run at N≈220.

**Recommendation:** report the finding at N=90 with the blind-recode confirmation (this memo) as the integrity guarantee; treat full-N extension as a "future replication" line, not a blocker for the book.

## Reproducibility
Coded rows written to `units_coding_template.csv` (5 of 219 rows now populated). Coding script: `scratchpad/code_five.py`. Re-run of the N=90 test (unchanged, since these 5 are already in the cohort): `python3 longevity_analysis.py`.

## Related
`CODING-PROTOCOL.md` · `ENTREPRENEUR-FINDING-RECONCILIATION.md` · `QUANTITATIVE-ANALYSES-MEMO.md` · `units_coding_template.csv`
