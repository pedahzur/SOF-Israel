---
title: "Coding protocol — Entrepreneur and Fate (for the longevity / charisma hypothesis)"
author: Ami Pedahzur
date: 2026-06-29
status: draft for author review
---

# Coding protocol: Entrepreneur and Fate

This protocol exists to make the entrepreneur → expansion finding (see `QUANTITATIVE-ANALYSES-MEMO.md`, §6 item B) **defensible** rather than circular, and to let the test be re-run at full N. Template to fill: `units_coding_template.csv` (219 units).

## Why this is needed

In the curated `UNITSLongevityN_90.csv`, all five units that *expanded* are entrepreneur-led and none of the 79 non-entrepreneur units expanded (Fisher p=0.00001). That result is only meaningful **if `Entrepreneur` and `Fate` were coded independently.** If a unit was labelled "transformative entrepreneur" *because* it expanded, the two variables are the same variable and the test is a tautology. The full units databases cannot currently extend the test: `Units_March_2026_1_all.csv` has `Fate` populated for only ~10 of 233 rows (and in an inconsistent vocabulary), and `UNITSN_194.csv` has a founder field populated for 38%. Both must be coded on the standardized scheme below.

## The independence rule (the core of the protocol)

Code the two variables in **separate passes, from separate evidence, ideally by two coders or blind**:

- **Pass 1 — Fate (the outcome).** Code from organizational/administrative records only: did the unit disband, merge, persist, or grow? **Do not consult who founded or led it.**
- **Pass 2 — Entrepreneur (the input).** Code from founding circumstances only: was there a founding or transforming individual? **Do not consult what later became of the unit.**

Record a one-line evidence note for each cell. After both passes, report inter-coder agreement (Cohen's κ) on `Entrepreneur`; if a single coder, do the two passes weeks apart and flag it as a limitation.

## Operational definitions

### Fate (outcome; mutually exclusive)
- **demised** — disbanded, capability not carried forward.
- **merged** — folded into another unit; capability absorbed.
- **endured** — still active at the 2015 cutoff, same essential form.
- **expanded** — grew into a larger formation **or** seeded a distinct successor unit (use `Successor` field as evidence; a one-year seed unit that produces a lasting successor is *expanded*, not *demised*).

### Entrepreneur (input; ordinal)
- **none** — no single founding/transforming individual is documented; the unit emerged from routine organizational process.
- **founder** — a specific individual created the unit and is documented as its originating force.
- **transformative** — an individual not only founded but redefined the unit's role/doctrine, with effects beyond it.

> Boundary discipline: "founder" is about *agency at formation*, not later fame. A famous later commander does not make a unit "founder"-coded unless the source ties the unit's existence to a founding individual.

## At-risk cases to re-check blind first

The five units carrying the headline result — recode their `Entrepreneur` value **without** looking at their `Fate`:
`Shayetet 13`, `Unit 101`, `Sayeret Matkal`, `Shaldag`, `Maglan`.
If all five survive an independent founder-coding, the finding stands. If any was coded "entrepreneur" only because it expanded, downgrade the claim.

## Re-running the test

Once `units_coding_template.csv` is filled, re-run `longevity_analysis.py` (point it at the new file): the Fisher test on expanded × entrepreneur-present extends from N=90 to full N. Report match to the N=90 result; a consistent pattern at N≈220 would be the strongest quantitative support for H5 in the book.

## Related
`QUANTITATIVE-ANALYSES-MEMO.md` · `longevity_analysis.py` · `UNITSLongevityN_90.csv` · `units_coding_template.csv`
