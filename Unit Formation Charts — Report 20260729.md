---
title: Unit Formation Charts — SOF-Israel Data Appendix
date: 2026-07-29
type: analysis-report
project: SOF Book
source-dataset: Units_March_20262.csv (SOF-Israel repo, branch master)
tags: [analysis, units-database, formation-years, critical-junctures, charts]
figures:
  - figures/chart1_unit_formations_per_year.png
  - figures/chart2_units_formed_1973_1982.png
  - figures/sof_unit_formation_charts.html
---

# Unit Formation Charts — SOF-Israel Data Appendix

Session record, 29 July 2026. Task: review the private GitHub repository `pedahzur/SOF-Israel` (the SOF-APPENDIX data archive) and generate two charts from the units data — (1) unit formations per year from 1948 onward with 1974 emphasized, and (2) the population of units formed between 1973 and 1982.

## Data and access

The repository is private and unreachable from the analysis environment, so the source file was read through Ami's authenticated Chrome session via the raw-file path (`raw/master/Units_March_20262.csv`). The default branch is `master`. `Units_March_20262.csv` was selected because it is the current (March 2026) units database and the only current units file that carries `Year Established`; `Units_March_2026_1_all.csv` has no year field, `UNITSN_194.csv` is an older version, and `UNITSLongevityN_90.csv` covers only the 90-unit longevity subset.

A verbatim snapshot of the file as read on 29 July 2026 is preserved at `data/Units_March_20262_snapshot_2026-07-29.csv`.

## Cleaning and counting rules

The raw file contains 219 rows with a numeric `Year Established`. Rows with no year — including trailing junk (blank names, two Hebrew press-article titles, a bare "669") and five undated unit stubs (Sayeret Alon, Coral, Marul, Spectrum, SIGINT Battalion) — were excluded. One exact duplicate on (Unit, Year) was removed: Meitar 427, 2020, entered twice. This leaves 218 dated establishment records, of which 190 fall in 1948–2022.

Counting rule: one count per establishment record. The database records re-establishments as separate rows (Shaldag in 1974, 1977, and 1984; Egoz in 1956, 1963, 1995, and 2015; Unit 755 in 1956 and 1973; Sayeret 401 in 1968 and 1973; 7 Armor Reconnaissance in 1948, 1956, and 1986), and each dated row is counted in its year. The charts therefore measure formation events, not distinct organizations.

## Chart 1 — Unit formations per year, 1948–2022

File: `figures/chart1_unit_formations_per_year.png` (interactive version in `figures/sof_unit_formation_charts.html`).

![[chart1_unit_formations_per_year.png]]

n = 190. The 1948 founding wave dominates with 21 records. **1974 is the largest single-year cohort thereafter: nine units** (98 Division, Shaldag 5101, the Counterterrorism School, Golani Anti-Tank Company, Oketz 7142, Paratroopers Anti-Tank Company, Unit 5707, Unit 669, Unit Alpinistim). Together with the eight formations of 1973, the two years around the October War account for 17 formation events — against a long-run median of 2–3 per active year. Secondary clusters appear in 1970 (7) and 2000 (8, the field-intelligence reorganization). No formations are recorded for 1952, 1959–1961, 1964, 1971, 1975, 1979–1980, 1997, 1999, 2006–2007, 2009, 2011, 2013–2014, 2016, and 2019.

Full counts (years with at least one formation):

| Year | n | Year | n | Year | n | Year | n |
|---|---|---|---|---|---|---|---|
| 1948 | 21 | 1966 | 4 | 1984 | 4 | 2001 | 2 |
| 1949 | 5 | 1967 | 1 | 1985 | 1 | 2002 | 3 |
| 1950 | 4 | 1968 | 5 | 1986 | 3 | 2003 | 2 |
| 1951 | 1 | 1969 | 2 | 1987 | 2 | 2004 | 1 |
| 1953 | 2 | 1970 | 7 | 1988 | 6 | 2005 | 3 |
| 1954 | 4 | 1972 | 1 | 1989 | 1 | 2008 | 1 |
| 1955 | 2 | 1973 | 8 | 1990 | 6 | 2010 | 2 |
| 1956 | 5 | **1974** | **9** | 1991 | 3 | 2012 | 2 |
| 1957 | 2 | 1976 | 1 | 1992 | 3 | 2015 | 2 |
| 1958 | 2 | 1977 | 5 | 1993 | 4 | 2017 | 4 |
| 1962 | 1 | 1978 | 2 | 1994 | 2 | 2018 | 2 |
| 1963 | 3 | 1981 | 1 | 1995 | 2 | 2020 | 4 |
| 1965 | 2 | 1982 | 3 | 1996 | 3 | 2021 | 3 |
|  |  |  |  | 1998 | 2 | 2022 | 1 |

## Chart 2 — The population of units formed, 1973–1982

File: `figures/chart2_units_formed_1973_1982.png`.

![[chart2_units_formed_1973_1982.png]]

29 units were established in the decade from the Yom Kippur War to the Lebanon War; 17 of them in 1973–1974 alone. Grouped by the database's `Affiliation` field: Ground Forces 20, Air Force 2, Navy 1, Police & Border Police 2, Field Intelligence 2, affiliation not recorded 2 (Shaldag 1974 and SLA Reconnaissance 1978, whose affiliation cells are blank).

| Year | Unit | Affiliation (raw) | Group |
|---|---|---|---|
| 1973 | Green Squirrel | ATM, Paratroopers | Ground Forces |
| 1973 | Natran | Artillery | Ground Forces |
| 1973 | Reconnaissance Battalion 87 | Armor | Ground Forces |
| 1973 | Reconnaissance Company 421 | Armor | Ground Forces |
| 1973 | Sayeret 401 Armored Reconnaissance Company | Armor | Ground Forces |
| 1973 | Unit 755 | Artillery | Ground Forces |
| 1973 | Visual Intelligence Unit - 869 - Shahaf | Field Intelligence | Field Intelligence |
| 1973 | Yamam Counter-terrorism | Border Police, Police | Police & Border Police |
| 1974 | 98 Division - The Fire Formation | Central Command | Ground Forces |
| 1974 | Battalion for Air Assignments (Shaldag) 5101 | — | Not recorded |
| 1974 | Counterterrorism school | 99 Division, Infantry, Marom | Ground Forces |
| 1974 | Golani Anti-Tank Company | Golani Brigade, Infantry | Ground Forces |
| 1974 | Oketz Unit Canine Special Forces 7142 | 99 Division, Infantry, Marom | Ground Forces |
| 1974 | Paratroopers Anti-Tank Company | ATM, Paratroopers Brigade 35 | Ground Forces |
| 1974 | Unit 5707 | Air force | Air Force |
| 1974 | Unit 669 Airborne Rescue And Evacuation | Air force, Wing 7 | Air Force |
| 1974 | Unit Alpinistim (Res) | 810 Brigade, Recon Bn 7810, Regional | Ground Forces |
| 1975 | *no formations recorded* | | |
| 1976 | General Staff Visual Intelligence Unit - Mobile Company | Field Intelligence | Field Intelligence |
| 1977 | Battalion for Air Assignments (Shaldag) | Infantry, Sayeret Matkal | Ground Forces |
| 1977 | Combat Engineering Reconnaissance Platoon 605 | CERP, Engineering | Ground Forces |
| 1977 | Golani Anti-Tank Company | Golani Brigade, Infantry | Ground Forces |
| 1977 | Golani Engineer Company | Golani Brigade, Infantry | Ground Forces |
| 1977 | Nahal Anti-Tank Company (Res) | ATM | Ground Forces |
| 1978 | SLA Reconnaissance | — | Not recorded |
| 1978 | Yaltam Underwater Missions | Navy | Navy |
| 1979 | *no formations recorded* | | |
| 1980 | *no formations recorded* | | |
| 1981 | Moran | ATM | Ground Forces |
| 1982 | Border Police Reconnaissance Unit - North | Police, SAMAG | Police & Border Police |
| 1982 | Nahal Brigade 933 | 162 Division, Infantry, Southern Command | Ground Forces |
| 1982 | Sayeret Yael Combat Engineering Reconnaissance | Engineering, Yahalom | Ground Forces |

## Caveats and flags

1. **Definitional scope.** The database includes formations that are not SOF under the manuscript's §1 definitional markers — divisional HQs (98 Division), brigades (Nahal 933, Givati 84), service commands, and line anti-tank/engineer companies. Both charts count all dated records. A filtered version restricted to units meeting the definitional markers would shrink the counts noticeably; the 1974 cohort would thin to roughly Shaldag, 669, Oketz, the CT School, and 5707. Decide before either figure enters the book.
2. **Re-establishments.** Shaldag appears in both 1974 (blank affiliation, predecessor Sayeret Matkal) and 1977 (Infantry) — both counted, per the lineage design of the database.
3. **Framework fit.** The 1973–1974 spike and the 1978–1981 near-drought are consistent with the 1973 critical juncture ratified in the Phase 1 decision log; the chart of formation events is a productive-conditions illustration, not a test.
4. **Data hygiene items for the repo**: duplicate Meitar 427/2020 row; five undated unit stubs; Hebrew press-article titles sitting in Unit cells at the end of the file.

## Reproducibility

Counting: pandas — drop rows without numeric `Year Established`, strip unit names, `drop_duplicates(["Unit","Year"])`, group by year (Chart 1: years ≥ 1948, zero-filled through 2022; Chart 2: 1973 ≤ year ≤ 1982). Affiliation grouping by keyword on the raw `Affiliation` string (police/samag/yamas/prison → Police & Border Police; air force/wing → Air Force; navy/palyam → Navy; field intelligence → Field Intelligence; blank → Not recorded; else Ground Forces). Charts rendered from `figures/sof_unit_formation_charts.html` (Chart.js 4.4.1, IBM Plex, house palette), screenshotted at 2× scale.
