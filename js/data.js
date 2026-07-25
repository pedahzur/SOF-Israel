/* ═══════════════════════════════════════════════════════════
   SOF-APPENDIX · data registry (window.RPT)
   Single source of truth for the archive catalog. All dataset
   text preserved from the previous site; download hrefs are
   built with encodeURIComponent() against exact repo filenames.
   span: [fromYear, toYear] drives the coverage constellation.
   ═══════════════════════════════════════════════════════════ */
window.RPT = (() => {

  const enc = encodeURIComponent;
  const dl = (file, fmt, size, label) => ({
    file, fmt, size: size || null,
    label: label || ("Download " + fmt),
    href: "./" + enc(file),
    external: false
  });
  const ext = (href, fmt, label) => ({ file: null, fmt, size: null, label, href, external: true });
  const recordCounts = window.SOF_RECORD_COUNTS || {};
  const records = file => Number.isInteger(recordCounts[file]) ? recordCounts[file] : null;

  /* ── Theme system: 5 muted categorical accents (chips/dots only) ── */
  const themes = {
    units:       { label: "Units & Organizations", chip: "#6b7a3a", chipName: "olive" },
    individuals: { label: "Individuals",           chip: "#a05c3b", chipName: "terracotta" },
    operations:  { label: "Operations",            chip: "#4a6b8a", chipName: "slate blue" },
    terrorism:   { label: "Terrorism & Conflict",  chip: "#7a4a63", chipName: "plum" },
    codebooks:   { label: "Codebooks & Methods",   chip: "#3f6b52", chipName: "forest" },
    sources:     { label: "Source Documents",      chip: "#42566a", chipName: "ink" }
  };
  const themeOrder = ["units", "individuals", "operations", "terrorism", "codebooks", "sources"];

  const datasets = [

    /* ─────────── UNITS & ORGANIZATIONS ─────────── */
    {
      id: "units-all", title: "Units_March_2026_1_all.csv", theme: "units",
      fmts: ["CSV"], n: records("Units_March_2026_1_all.csv"), period: "1920–2026", size: "111 KB", span: [1920, 2026],
      summary: "Most comprehensive units database with all identified Israeli SOF and elite units across all eras.",
      methodology: "Curated in Airtable from archival military sources, organizational histories, and secondary literature. Each record represents one identified unit with affiliation data.",
      variables: "Unit, Affiliation, Audio-video",
      analyses: "Descriptive frequency counts by affiliation; network analysis of organizational affiliations (igraph/networkx); temporal distribution of unit creation.",
      questions: ["How many SOF units existed per era?", "Which organizational affiliations cluster together?"],
      snippet: "pd.read_csv('Units_March_2026_1_all.csv')", lang: "python",
      preview: "Units_March_2026_1_all.csv",
      downloads: [dl("Units_March_2026_1_all.csv", "CSV", "111 KB")]
    },
    {
      id: "units-lineage", title: "Units_March_20262.csv", theme: "units",
      fmts: ["CSV"], n: records("Units_March_20262.csv"), period: "1920–2026", size: "20 KB", span: [1920, 2026],
      summary: "Units database with organizational lineage tracking: predecessor/successor relationships and year established.",
      methodology: "Same Airtable source. Predecessor/successor coded by manual archival research into unit histories, reorganizations, and name changes.",
      variables: "Unit, Year Established, Affiliation, Predecessor, Successor",
      analyses: "Directed lineage network analysis (genealogy graph); survival analysis of unit lifespans; temporal clustering of establishment dates.",
      questions: ["Which units spawned the most successors?", "What is the typical lifespan of a SOF unit?"],
      snippet: "pd.read_csv('Units_March_20262.csv')", lang: "python",
      preview: "Units_March_20262.csv",
      downloads: [dl("Units_March_20262.csv", "CSV", "20 KB")]
    },
    {
      id: "units-194", title: "UNITSN_194.csv", theme: "units",
      fmts: ["CSV"], n: records("UNITSN_194.csv"), period: "1920–2026", size: "98 KB", span: [1920, 2026],
      summary: "Bilingual (English/Hebrew) units database with branch, command, and role classifications.",
      methodology: "Airtable export with Hebrew-language notes. Role classification based on published military doctrine and organizational charts.",
      variables: "Name, Notes (Hebrew), Predecessor, Successor, Affiliation, Year Established, Year Disbanded, Branch, Command, Role, References",
      analyses: "Cross-tabulations of Role × Branch; chi-square tests for association; Multiple Correspondence Analysis (MCA) for categorical structure.",
      questions: ["Is there an association between branch and unit role?", "How does the role distribution change over time?"],
      snippet: "pd.read_csv('UNITSN_194.csv', encoding='utf-8')", lang: "python",
      preview: "UNITSN_194.csv",
      downloads: [dl("UNITSN_194.csv", "CSV", "98 KB")]
    },
    {
      id: "units-longevity", title: "UNITSLongevityN_90.csv", theme: "units",
      fmts: ["CSV"], n: records("UNITSLongevityN_90.csv"), period: "1920–2026", size: "5 KB", span: [1920, 2026],
      summary: "Standardized longevity metrics for 90 SOF units. Core analytical dataset for survival studies.",
      methodology: "Subset of fully documented units with confirmed formation and dissolution dates. Standardized longevity computed relative to era norms. Fate coded as merged/demised/expanded. Status: Conventional/Semi-Professional/Ad-Hoc/Reserve. Entrepreneur: none/founder/transformative.",
      variables: "ID, Formed, Dissolved, Overall Longevity, Standardized Longevity, Fate, Size, Status, Entrepreneur",
      analyses: "Cox proportional hazards models; Kaplan-Meier survival curves by Status; OLS regression on Standardized Longevity; logistic regression predicting Fate; factorial ANOVA (Status × Entrepreneur).",
      questions: ["Does entrepreneurial leadership predict unit longevity?", "Which organizational status category has highest survival?"],
      snippet: "pd.read_csv('UNITSLongevityN_90.csv')", lang: "python",
      preview: "UNITSLongevityN_90.csv",
      downloads: [dl("UNITSLongevityN_90.csv", "CSV", "5 KB")]
    },
    {
      id: "units-grid", title: "UNITS-Grid view.csv", theme: "units",
      fmts: ["CSV"], n: records("UNITS-Grid view.csv"), period: "1920–2026", size: "72 KB", span: [1920, 2026],
      summary: "Airtable grid-view export with bilingual data and status classification (Conventional/Elite).",
      methodology: "Direct Airtable grid export. Status classification based on mission profiles and organizational designation.",
      variables: "ID, Name, Notes (Hebrew), Status, Year Established, Year Disbanded, Individuals",
      analyses: "Bipartite unit–individual network analysis; two-mode to one-mode projection; status comparison statistics.",
      questions: ["Which individuals bridge multiple elite units?", "What is the conventional-to-elite ratio over time?"],
      snippet: "pd.read_csv('UNITS-Grid view.csv', encoding='utf-8')", lang: "python",
      preview: "UNITS-Grid view.csv",
      downloads: [dl("UNITS-Grid view.csv", "CSV", "72 KB")]
    },
    {
      id: "units-glossary", title: "Units Glossary-Grid.csv", theme: "units",
      fmts: ["CSV"], n: records("Units Glossary-Grid.csv"), period: "All", size: "98 KB", span: null,
      summary: "Reference glossary mapping English unit names to Hebrew equivalents with associated individuals.",
      methodology: "Lookup/reference table for joining Hebrew-language sources to English-language datasets.",
      variables: "Unit1, UNIT - HEBREW, Individuals, Predecessor",
      analyses: "Use as join key for cross-referencing Hebrew archival data with English-language tables.",
      questions: ["How do Hebrew unit names map to English equivalents?"],
      snippet: "pd.read_csv('Units Glossary-Grid.csv', encoding='utf-8')", lang: "python",
      preview: "Units Glossary-Grid.csv",
      downloads: [dl("Units Glossary-Grid.csv", "CSV", "98 KB")]
    },
    {
      id: "prestate", title: "prestate_units.csv", theme: "units",
      fmts: ["CSV"], n: records("prestate_units.csv"), period: "1920–1948", size: "2 KB", span: [1920, 1948],
      summary: "Pre-state (pre-1948) special operations units from the Haganah, Palmach, and British Army era.",
      methodology: "Compiled from published histories of pre-state paramilitary organizations. Role coded into 5 categories: Preventive/Clandestine/Commando/Intelligence/Reconnaissance.",
      variables: "Name, Notes (year formed), Attachments (year disbanded), Longevity, Organization, Location, Role",
      analyses: "Descriptive statistics; Fisher’s exact tests (small N); role distribution across organizations.",
      questions: ["What was the predominant role type in pre-state units?", "Did Palmach vs. Haganah differ in role composition?"],
      snippet: "pd.read_csv('prestate_units.csv')", lang: "python",
      preview: "prestate_units.csv",
      downloads: [dl("prestate_units.csv", "CSV", "2 KB")]
    },
    {
      id: "regional", title: "regional_defensive.csv", theme: "units",
      fmts: ["CSV"], n: records("regional_defensive.csv"), period: "1948–1960s", size: "3 KB", span: [1948, 1969],
      summary: "Regional defensive and reconnaissance units with geographic coordinates for spatial analysis.",
      methodology: "Units coded with lat/lon coordinates from known base locations. Regional Command assignment from IDF organizational records.",
      variables: "Name, Notes, Location, Latitude, Longitude, Regional Command, Affiliation, Predecessor",
      analyses: "GIS/spatial analyses: point pattern analysis, kernel density estimation, spatial autocorrelation (Moran’s I) by regional command; choropleth mapping.",
      questions: ["Were reconnaissance units spatially clustered near borders?", "How does unit density vary by regional command?"],
      snippet: "pd.read_csv('regional_defensive.csv')", lang: "python",
      preview: "regional_defensive.csv",
      downloads: [dl("regional_defensive.csv", "CSV", "3 KB")]
    },

    /* ─────────── INDIVIDUALS ─────────── */
    {
      id: "idf-individuals", title: "IDF_Individuals_April_2026.xlsx", theme: "individuals",
      fmts: ["XLSX"], n: null, period: "1948–2026", size: "26 KB", span: [1948, 2026],
      summary: "Most recent database of IDF individuals associated with special operations forces (April 2026 update).",
      methodology: "Compiled from published biographies, unit histories, and official IDF records. Updated April 2026.",
      variables: "(Excel format — download to inspect full field list)",
      analyses: "Personnel demographics; career path analysis; cohort studies by entry decade.",
      questions: ["What career trajectories characterize SOF personnel?", "How has the demographic profile changed over time?"],
      snippet: "pd.read_excel('IDF_Individuals_April_2026.xlsx')", lang: "python",
      preview: null,
      downloads: [dl("IDF_Individuals_April_2026.xlsx", "XLSX", "26 KB")]
    },
    {
      id: "individuals-global", title: "individuals_global.csv", theme: "individuals",
      fmts: ["CSV"], n: records("individuals_global.csv"), period: "1900–2020", size: "22 KB", span: [1900, 2020],
      summary: "Global reference list of notable individuals relevant to special operations research, with birth/death dates and Wikipedia links.",
      methodology: "Curated reference list from secondary sources and biographical dictionaries. Wikipedia URLs provided for verification.",
      variables: "Name, Born, Died, Link (Wikipedia URL)",
      analyses: "Cohort/generation analyses; life-span distribution; comparative demographics of SOF leaders globally.",
      questions: ["What generation patterns emerge among global SOF figures?", "Is there a characteristic lifespan pattern?"],
      snippet: "pd.read_csv('individuals_global.csv')", lang: "python",
      preview: "individuals_global.csv",
      downloads: [dl("individuals_global.csv", "CSV", "22 KB")]
    },
    {
      id: "individuals-glossary", title: "individuals_glossary.csv", theme: "individuals",
      fmts: ["CSV"], n: records("individuals_glossary.csv"), period: "1920–2026", size: "6 KB", span: [1920, 2026],
      summary: "Glossary of individuals associated with Israeli SOF units, including roles, associates, and rival relationships.",
      methodology: "Compiled from unit histories and biographical sources. Associate/rival ties coded from documented interpersonal dynamics in published accounts.",
      variables: "Name, Born, Died, Units, Roles, Associates, Rivals",
      analyses: "Social network analysis (ego networks, centrality measures); unit-affiliation bipartite graphs; two-mode to one-mode projections; clique detection.",
      questions: ["Who are the most central figures bridging units?", "Do rivalry networks predict organizational splits?"],
      snippet: "pd.read_csv('individuals_glossary.csv')", lang: "python",
      preview: "individuals_glossary.csv",
      downloads: [dl("individuals_glossary.csv", "CSV", "6 KB")]
    },

    /* ─────────── OPERATIONS ─────────── */
    {
      id: "attrition", title: "attrition_operations.csv", theme: "operations",
      fmts: ["CSV"], n: records("attrition_operations.csv"), period: "1967–1970", size: "9 KB", span: [1967, 1970],
      summary: "Military operations during the War of Attrition period, with participating units, branch, scale, and location.",
      methodology: "Coded from IDF operational histories and published accounts of the War of Attrition. Scale classified as Small/Medium/Large based on personnel commitment.",
      variables: "DATE, NAME, Number of Units, Units, Branch (Land/Navy), SCALE (Small/Medium/Large), Location",
      analyses: "Event counts over time; ordinal regression on scale; Branch × Scale contingency tests; temporal clustering of operations.",
      questions: ["Did operations escalate in scale over the period?", "What was the land-to-naval operation ratio?"],
      snippet: "pd.read_csv('attrition_operations.csv')", lang: "python",
      preview: "attrition_operations.csv",
      downloads: [dl("attrition_operations.csv", "CSV", "9 KB")]
    },
    {
      id: "palyam", title: "palyam_operations1939-1948.csv", theme: "operations",
      fmts: ["CSV"], n: records("palyam_operations1939-1948.csv"), period: "1939–1948", size: "2 KB", span: [1939, 1948],
      summary: "Palyam (naval commando) operations from 1939 to 1948, with coordinates for mapping.",
      methodology: "Compiled from Palyam veterans’ association records and published operational histories.",
      variables: "Title, Operation, Details, Date, Location, Coordinates",
      analyses: "Geospatial mapping (folium/leaflet); temporal event plots; descriptive case comparisons.",
      questions: ["What was the geographic range of Palyam operations?", "How did operation frequency change as independence approached?"],
      snippet: "pd.read_csv('palyam_operations1939-1948.csv')", lang: "python",
      preview: "palyam_operations1939-1948.csv",
      downloads: [dl("palyam_operations1939-1948.csv", "CSV", "2 KB")]
    },
    {
      id: "sayeret", title: "sayeret_matkal_birds.csv", theme: "operations",
      fmts: ["CSV"], n: records("sayeret_matkal_birds.csv"), period: "1960s", size: "2 KB", span: [1960, 1969],
      summary: "Early Sayeret Matkal intelligence-gathering operations (code-named ‘birds’), primarily against Egyptian Air Force targets.",
      methodology: "Documented from declassified operational records and published unit histories.",
      variables: "Name, Notes, Date, Unit, Location",
      analyses: "Descriptive case-study table; qualitative comparative analysis (QCA) given very small N.",
      questions: ["What patterns characterized early deep-reconnaissance missions?"],
      snippet: "pd.read_csv('sayeret_matkal_birds.csv')", lang: "python",
      preview: "sayeret_matkal_birds.csv",
      downloads: [dl("sayeret_matkal_birds.csv", "CSV", "2 KB")]
    },
    {
      id: "reprisals", title: "reprisals.csv", theme: "operations",
      fmts: ["CSV", "XLSX"], n: records("reprisals.csv"), period: "1952–1964", size: "47 KB", span: [1952, 1964],
      summary: "Documented reprisal and military operations, 1952–1964, with operation names, dates, locations, and detailed place descriptions.",
      methodology: "Coded from newspaper reports, IDF announcements, and published operational histories. Each record is one operation event.",
      variables: "Date, Date - Translated, Operation Name, Location, Place",
      analyses: "Time-series analysis (event counts); seasonality tests; geospatial clustering; interrupted time-series (before/after policy changes); escalation models.",
      questions: ["Did reprisal frequency follow cyclical patterns?", "How did the geographic focus shift over time?"],
      snippet: "pd.read_csv('reprisals.csv')", lang: "python",
      preview: "reprisals.csv",
      downloads: [
        dl("reprisals.csv", "CSV", "47 KB"),
        dl("reprisals.xlsx", "XLSX", "48 KB")
      ]
    },
    {
      id: "border-wars", title: "Border Wars 1952-1956.xlsx", theme: "operations",
      fmts: ["XLSX"], n: null, period: "1952–1956", size: "529 KB", span: [1952, 1956],
      summary: "Border war operations and incidents from 1952 to 1956.",
      methodology: "Compiled from IDF Southern and Central Command records and published border-incident studies.",
      variables: "(Excel format — download to inspect)",
      analyses: "Interrupted time-series; escalation/retaliation sequence analysis; event-count models.",
      questions: ["Did border incidents follow a tit-for-tat escalation pattern?"],
      snippet: "pd.read_excel('Border Wars 1952-1956.xlsx')", lang: "python",
      preview: null,
      downloads: [dl("Border Wars 1952-1956.xlsx", "XLSX", "529 KB")]
    },

    /* ─────────── TERRORISM & CONFLICT ─────────── */
    {
      id: "nssc-terrorism", title: "NSSC_Terrorism_Israel_1948-2005.csv", theme: "terrorism",
      fmts: ["CSV"], n: records("NSSC_Terrorism_Israel_1948-2005.csv"), period: "1948–2005", size: "1.6 MB", span: [1948, 2005],
      summary: "National Security Studies Center terrorism event database coded from Israeli newspaper sources (1948–2005).",
      methodology: "Systematic newspaper coding (Haaretz and others). Each event coded for location (16 statistical regions), weapon/tactic (20+ categories), perpetrator demographics, victim details, and state response. See NSSC_Codebook for full variable dictionary.",
      variables: "Year, Date, Region, Weapon, Terrorist demographics (gender/age/religion/education/political orientation), Victim demographics, Target type, State Response",
      analyses: "Poisson/negative-binomial regression on attack counts; logistic regression on perpetrator capture; multinomial logit on tactic choice; spatial analysis by statistical region; victim-level demographic analyses; time-series of attack frequency.",
      questions: ["What predicts tactic selection?", "How did attack frequency vary across regions and decades?", "Is perpetrator education associated with mission outcome?"],
      snippet: "pd.read_csv('NSSC - Terrorist attacks in Isr-Grid view.csv', encoding='utf-8')", lang: "python",
      preview: "NSSC_Terrorism_Israel_1948-2005.csv",
      downloads: [
        dl("NSSC_Terrorism_Israel_1948-2005.csv", "CSV", "1.6 MB"),
        dl("NSSC - Terrorist attacks in Isr-Grid view.csv", "CSV", "1.5 MB", "Download Grid-view CSV")
      ]
    },
    {
      id: "nssc-complete", title: "NSSC_Terrorism_Israel_1948-2005_Complete.xlsx", theme: "terrorism",
      fmts: ["XLSX"], n: records("NSSC_Terrorism_Israel_1948-2005.csv"), period: "1948–2005", size: "6.7 MB", span: [1948, 2005],
      /* Same data as nssc-terrorism in Excel format — excluded from the
         masthead record total so the event rows are counted once. */
      dupOf: "nssc-terrorism",
      summary: "Complete NSSC terrorism dataset in Excel format with full Airtable metadata and formatting.",
      methodology: "Same as NSSC CSV version but preserves Airtable field types, lookups, and formatting.",
      variables: "Same as NSSC CSV (see codebook)",
      analyses: "Same analytical techniques as CSV version; Excel format enables pivot tables for exploratory analysis.",
      questions: ["Same as NSSC CSV"],
      snippet: "pd.read_excel('NSSC_Terrorism_Israel_1948-2005_Complete.xlsx')", lang: "python",
      preview: null,
      downloads: [dl("NSSC_Terrorism_Israel_1948-2005_Complete.xlsx", "XLSX", "6.7 MB")]
    },
    {
      id: "gtd-israel", title: "Global Terrorism Database (GTD) — Israel subset", theme: "terrorism",
      fmts: ["EXTERNAL"], n: null, recordLabel: "external licensed dataset", period: "1970–2021", size: "not distributed", span: [1970, 2021],
      status: "Restricted — obtain from START", statusTone: "restricted",
      summary: "GTD-based Israel subset used for cross-validation. The source data are not distributed in this public appendix.",
      methodology: "GTD materials must be obtained directly from START under the applicable license. This appendix retains only a description of the intended cross-validation workflow.",
      variables: "See GTD codebook (135+ variables including attack type, weapon, target, casualties, perpetrator group)",
      analyses: "Cross-validation with NSSC data; inter-coder reliability analysis; multinomial models on attack type; casualty severity models.",
      questions: ["How does GTD coding compare with NSSC for the same events?", "What attack types predominate in different decades?"],
      snippet: "# Obtain GTD data directly from START before reproducing this analysis", lang: "text",
      preview: null,
      downloads: [
        ext("https://www.start.umd.edu/gtd/", "WEB", "Access GTD through START"),
        ext("https://www.start.umd.edu/gtd-terms", "WEB", "Read GTD terms")
      ]
    },
    {
      id: "mandate", title: "Mandate_Events_1920_1948.xlsx", theme: "terrorism",
      fmts: ["XLSX"], n: null, period: "1920–1948", size: "89 KB", span: [1920, 1948],
      summary: "Events during the British Mandate period. Covered by dedicated methodological appendix.",
      methodology: "See Methodological_Appendix_Mandate_Dataset.docx for full description of sources, coding criteria, and limitations.",
      variables: "(Excel format — see methodological appendix)",
      analyses: "Event history analysis; temporal patterns of political violence during Mandate; escalation modeling toward 1948.",
      questions: ["How did violence patterns evolve from 1920 riots through 1936–1939 revolt to 1948?"],
      snippet: "pd.read_excel('Mandate_Events_1920_1948.xlsx')", lang: "python",
      preview: null,
      downloads: [dl("Mandate_Events_1920_1948.xlsx", "XLSX", "89 KB")]
    },
    {
      id: "iaf", title: "IAF_1973_Losses.csv", theme: "terrorism",
      fmts: ["CSV"], n: records("IAF_1973_Losses.csv"), period: "1973", size: "18 KB", span: [1973, 1973],
      summary: "108 Israeli Air Force aircraft losses during the 1973 Yom Kippur War. Each record is one loss event.",
      methodology: "Compiled from IAF squadron records, published loss lists, and crew fate documentation. Front coded as Syria/Egypt; Weapon coded as SA-6/SA-2/SAM/AAA/MiG/accident.",
      variables: "ID, Date, Aircraft type, Front (Syria/Egypt), Weapon, Type 2, Name1, Name2, Squadron, Location, Description, Fate (KIA/OK/POW/MIA)",
      analyses: "Categorical/logistic regression (Fate ~ Weapon + Front); contingency tables (aircraft type vs. weapon); survival-of-crew analysis; front-specific loss rates.",
      questions: ["Were SA-6 losses more lethal than AAA?", "Did loss patterns differ between the Egyptian and Syrian fronts?"],
      snippet: "pd.read_csv('IAF_1973_Losses.csv')", lang: "python",
      preview: "IAF_1973_Losses.csv",
      downloads: [dl("IAF_1973_Losses.csv", "CSV", "18 KB")]
    },

    /* ─────────── CODEBOOKS & METHODS ─────────── */
    {
      id: "nssc-codebook", title: "NSSC_Codebook.csv / .xlsx", theme: "codebooks",
      fmts: ["CSV", "XLSX"], n: null, period: "N/A", size: "3 / 22 KB", span: null,
      summary: "Full variable dictionary for the NSSC terrorism database. Lists all field names, value categories, and coding instructions.",
      methodology: "Reference document — describes the coding scheme used by NSSC researchers.",
      variables: "Variable name, Description/Categories for each NSSC field",
      analyses: "Use as reference when analyzing NSSC data files.",
      questions: [],
      snippet: "pd.read_csv('NSSC_Codebook.csv')", lang: "python",
      preview: "NSSC_Codebook.csv",
      downloads: [
        dl("NSSC_Codebook.csv", "CSV", "3 KB"),
        dl("NSSC_Codebook.xlsx", "XLSX", "22 KB")
      ]
    },
    {
      id: "gtd-codebook", title: "Global Terrorism Database codebook", theme: "codebooks",
      fmts: ["EXTERNAL"], n: null, recordLabel: "external licensed document", period: "N/A", size: "not distributed", span: null,
      status: "Restricted — obtain from START", statusTone: "restricted",
      summary: "Official GTD variable documentation. The codebook is not redistributed in this public appendix.",
      methodology: "Published by START (National Consortium for the Study of Terrorism and Responses to Terrorism) and subject to the GTD terms.",
      variables: "135+ GTD variables fully documented",
      analyses: "Reference for GTD-based analyses.",
      questions: [],
      snippet: "# Obtain the current codebook directly from START", lang: "text",
      preview: null,
      downloads: [
        ext("https://www.start.umd.edu/gtd/", "WEB", "Access GTD through START"),
        ext("https://www.start.umd.edu/gtd-terms", "WEB", "Read GTD terms")
      ]
    },
    {
      id: "mandate-method", title: "Methodological_Appendix_Mandate_Dataset.docx", theme: "codebooks",
      fmts: ["DOCX"], n: null, period: "N/A", size: "17 KB", span: null,
      summary: "Methodological appendix describing sources, coding criteria, and limitations of the Mandate Events dataset.",
      methodology: "Details the archival sources (British records, Hebrew press, secondary histories) and event inclusion/exclusion criteria.",
      variables: "Describes all coded fields in Mandate_Events_1920_1948.xlsx",
      analyses: "Reference for Mandate dataset analyses.",
      questions: [],
      snippet: "# Open DOCX externally", lang: "text",
      preview: null,
      downloads: [dl("Methodological_Appendix_Mandate_Dataset.docx", "DOCX", "17 KB")]
    },
    {
      id: "fallen-oct7", title: "Methodological_Appendix_Fallen_Oct7.md", theme: "codebooks",
      fmts: ["MD"], n: null, recordLabel: "draft method note", period: "2023", size: "4 KB", span: [2023, 2023],
      status: "Draft — verification pending", statusTone: "draft",
      /* The underlying record-level dataset is not part of this public release. */
      countInTotal: false,
      summary: "Draft methodological narrative for the October 7–8 fallen-personnel analysis. The underlying record-level dataset is not included in the public release.",
      methodology: "The source list, cutoff rule, field inventory, and SOF boundary cases still require verification before publication.",
      variables: "Planned fields: Unit affiliation, Rank, Age, Service track, Duty status, Time of death, Place of death",
      analyses: "Planned analyses: SOF vs. non-SOF cross-tabulations, duty-status comparisons, and demographic composition.",
      questions: ["What share of the October 7–8 fallen served in units coded as special operations forces?", "How do self-deployed volunteers differ from stationed personnel in rank and age?"],
      snippet: "# Draft Markdown document — do not cite as final", lang: "text",
      preview: null,
      downloads: [
        ext("https://github.com/pedahzur/SOF-APPENDIX/blob/gh-pages/Methodological_Appendix_Fallen_Oct7.md", "MD", "View on GitHub"),
        dl("Methodological_Appendix_Fallen_Oct7.md", "MD", "4 KB", "Download MD")
      ]
    },

    /* ─────────── SOURCE DOCUMENTS ─────────── */
    {
      id: "isa-summaries", title: "ISA (Shin Bet / שב״כ) annual terrorism summaries", theme: "sources",
      fmts: ["PDF"], n: null, period: "2004 · 2005 · 2008", size: "276 + 172 + 292 KB", span: [2004, 2008],
      summary: "Three Hebrew-language annual terrorism summary reports published by the Israel Security Agency (Shin Bet / שב״כ) for the years 2004, 2005, and 2008.",
      methodology: "Official ISA publications in Hebrew. These are source documents underlying the NSSC terrorism database era coverage; they provide the agency's own annual counts and characterizations of attacks against which newspaper-based coding can be triangulated.",
      variables: "(Hebrew-language PDF reports — download to inspect)",
      analyses: "Triangulation against NSSC annual attack counts; inter-source reliability for the Second Intifada era; Hebrew-language document analysis.",
      questions: ["How do ISA official annual totals compare with the NSSC newspaper-coded counts for the same years?"],
      snippet: "# Hebrew PDF documents — open externally", lang: "text",
      preview: null,
      downloads: [
        dl("שבכ_summary-2004.pdf", "PDF", "276 KB", "2004 summary · PDF"),
        dl("summary-2005שבכ_.pdf", "PDF", "172 KB", "2005 summary · PDF"),
        dl("summary-2008שבכ_.pdf", "PDF", "292 KB", "2008 summary · PDF")
      ]
    }
  ];

  /* ── Cross-dataset linkages (hero constellation + linkages section) ── */
  const linkages = [
    {
      id: "lnk-units-individuals", a: "units", b: "individuals", anchor: 1948,
      title: "Units ↔ Individuals",
      text: "Join via unit-affiliation fields (unit name appears in both individuals_glossary and Units tables)."
    },
    {
      id: "lnk-units-operations", a: "units", b: "operations", anchor: 1955,
      title: "Units ↔ Operations",
      text: "Operations databases list participating units by name."
    },
    {
      id: "lnk-nssc-reprisals-gtd", a: "terrorism", b: "operations", anchor: 1970,
      title: "NSSC ↔ Reprisals ↔ GTD",
      text: "Linkable via date + location for triangulation and inter-coder reliability studies."
    }
  ];

  /* ── Companion report (standalone HTML, not a catalogued dataset) ── */
  const companion = {
    file: "Ch1_Jewish_Population",
    href: "./" + enc("Ch1_Jewish_Population"),
    size: "25 KB",
    title: "Jewish Colonies in 1888 — interactive report",
    text: "A standalone interactive HTML report on the Jewish population of the 1888 colonies, supporting Chapter 1. The link opens (or downloads) a self-contained HTML document — open it in a browser to read the report."
  };

  const citation = {
    text: "If you use these data in academic work, please cite the repository and the associated publication. Contact the author regarding permissions for use and redistribution."
  };

  return { themes, themeOrder, datasets, linkages, companion, citation };
})();
