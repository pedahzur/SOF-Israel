---
title: "Reconciliation — the two entrepreneurship findings (survival vs expansion)"
author: Ami Pedahzur
date: 2026-07-01
status: draft for author review
supersedes: "the framing tension between SOF Data Analysis Report §A2 and QUANTITATIVE-ANALYSES-MEMO §6.B"
---

# Reconciling the two entrepreneurship results into one claim

Two rounds of analysis appeared to disagree about whether entrepreneurs matter for units.
This memo shows they do **not** disagree, fixes the framing, and states the one claim the book should make. All numbers below were re-run on 2026-07-01 from `UNITSLongevityN_90.csv`; the survival reconstruction is in `verify_survival.py`.

## The apparent conflict

| | Round 4 — *SOF Data Analysis Report* §A2 | Round 6 — *QUANTITATIVE-ANALYSES-MEMO* §6.B |
|---|---|---|
| Same data? | **Yes** — `UNITSLongevityN_90.csv`, all 90 units | **Yes** — identical file |
| Outcome variable | survival **time** in years, censoring-aware (Kaplan–Meier / Cox / log-rank); event = demised or merged, alive (endured/expanded) = censored | **Standardized Longevity** = longevity ÷ (founding→2015 window), a ratio; plus a categorical Fate × Entrepreneur table |
| Entrepreneur vs none | log-rank **p = 0.086**; entrepreneur median survival *not reached* vs **19 y** for none — read as "trend *supporting* the thesis" | Kruskal–Wallis **p = 0.243**; founder median **0.23 < 0.63** for none — read as "entrepreneurship does *not* predict longevity" |

Read quickly, Round 4 says entrepreneur units live longer and Round 6 says they do not. That is the tension the worklog flagged.

## Why there is no real contradiction

**1. Both tests are non-significant.** log-rank p = 0.086 and Kruskal–Wallis p = 0.243 both fail to reject the null at α = 0.05. On the question *"do entrepreneur-led units last longer?"* the two rounds give the **same answer: no measurable difference.** Round 4's prose over-read a p = 0.086 as a thesis-supporting trend; it is not significant and should not be reported as support.

**2. The opposite *direction* is an artifact, and the data show exactly why:**

- **Censoring.** Of the 11 entrepreneur-led units, **7 are still alive** (4 events). The Kaplan–Meier estimate in Round 4 correctly credits those survivors, so the entrepreneur curve never crosses 50% ("not reached"). Round 6's *Standardized Longevity* ratio is **not** censoring-aware: a young unit that is still alive scores low on "fraction of the founding→2015 window survived," so the same survivors that lift the KM curve drag down the ratio. Two metrics, opposite ranking of the identical units.
- **Pooling vs splitting the entrepreneur category.** The protective look in Round 4 comes almost entirely from the **2 transformative** units (Shayetet 13, Maglan — both *expanded*, zero deaths). Round 6's Kruskal–Wallis separates the categories and exposes that the **9 "founder" units are mostly short-lived seeds** (median standardized longevity 0.23). Pool founder + transformative → entrepreneurs look durable; split them → founders look fragile. Same 11 units, different partition.
- **No power.** 11 entrepreneur units, 4 events. Neither test can detect a duration effect of any plausible size; p-values swing with operationalization. Duration is simply the wrong question to push on this N.

## The finding that *is* robust (and survives both rounds)

Across both analyses the strong, stable signals are not about how long units last but about **what they become**:

| Claim | Test | Result | Round |
|---|---|---|---|
| **Expansion is exclusive to entrepreneur-led units** | Fisher exact, expanded × entrepreneur-present | **5/5 expanded units entrepreneur-led; 0/79 routine units expanded; p = 0.00001** | 6 |
| **Transformative entrepreneurs never produce a failed unit** | complete separation in Cox; 2/2 expanded | zero events — so protective the hazard can't be estimated | 4 |
| **Durability is bought by professionalization, not founders** | Mann–Whitney, std. longevity Pro/Semi-Pro vs rest | 0.98 vs 0.54, **p = 0.001** | 6 |
| Entrepreneur-led units last *longer* | log-rank / Kruskal–Wallis | **n.s.** (p = 0.086 / 0.243) | 4 + 6 agree |

The five expanded units — **Shayetet 13, Unit 101, Sayeret Matkal, Shaldag, Maglan** — are the spine of the book.

## The single claim for the manuscript

> Entrepreneurship does not buy a unit a longer life. On the 90-unit cohort, entrepreneur-led and routine units are statistically indistinguishable in survival time (log-rank p = 0.086; Kruskal–Wallis on standardized longevity p = 0.243 — both non-significant; the apparent directional split is an artifact of censoring and of pooling short-lived "founder" seeds with the two "transformative" cases). What entrepreneurship is **necessary** for is **institutional expansion**: every unit that grew into a larger formation or seeded a successor was entrepreneur-led, and none of the 79 routine units did (Fisher p = 0.00001); transformative entrepreneurs in particular never produced a failed unit. **Endurance, by contrast, is the work of professionalization** (Mann–Whitney p = 0.001).

This is sharper than either round alone. It refines **H5** from "entrepreneurs drive emergence *and survival*" to: **entrepreneurs are the necessary condition for a unit to become an institution or seed a lineage; professionalization is what makes a unit endure.** Founding charisma starts units; it does not, by itself, keep them alive.

## The one threat that still has to be closed

The headline expansion result (Fisher p = 0.00001) is only evidence if `Entrepreneur` and `Fate` were coded **independently**. If a unit was labelled "transformative entrepreneur" *because* it expanded, the two variables are one variable and the test is a tautology. The fix is specified in `CODING-PROTOCOL.md`: blind-recode `Entrepreneur` for the five headline units (and ideally the full N), then re-run the Fisher test and report Cohen's κ. **This reconciliation stands on the condition that the blind recode confirms the five units' entrepreneur coding.**

## Reproducibility
- Round 6 numbers: `python3 longevity_analysis.py`
- Round 4 survival numbers (log-rank, KM medians, separation): `python3 verify_survival.py`
- Both read `UNITSLongevityN_90.csv` only; nothing is written to data files.

## Related
`QUANTITATIVE-ANALYSES-MEMO.md` · `CODING-PROTOCOL.md` · `longevity_analysis.py` · `verify_survival.py` · vault: `10 Projects/SOF Book/Analysis/SOF Data Analysis — Report.md`
