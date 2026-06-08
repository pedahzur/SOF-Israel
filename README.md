> **[Browse the Data Archive →](https://pedahzur.github.io/SOF-APPENDIX/)**
> Interactive landing page with methodology, variables, and suggested analyses for each dataset.

# SOF-APPENDIX

Data appendix for the study of Israeli Special Operations Forces (SOF). This repository contains structured datasets supporting research on the organizational history, operations, personnel, and evolution of Israeli special operations and elite military units from the pre-state era through the modern IDF.

All data files were originally maintained in Airtable and exported for archival and replication purposes. The repository is published via GitHub Pages.

---

## Repository Structure

The repository contains 18 data files organized across several thematic areas: units, individuals, operations, and glossaries. Files are available in CSV and XLSX formats.

---

## Databases

### 1. Units Databases

**Units_March_2026_1_all.csv**
The most comprehensive and up-to-date units database (March 2026), with 234 records covering all identified Israeli SOF and elite units across all eras. Fields include Unit, Affiliation, and Audio-video.

**Units_March_20262.csv**
Updated units database (March 2026) with 230 records and organizational lineage tracking. Includes predecessor/successor relationships and affiliation details. Fields include Unit, Year Established, Affiliation, Predecessor, and Successor.

**UNITSN_194.csv**
Earlier version of the units database with 196 records (N=194 documented units), including Hebrew-language cells and some missing values. Tracks unit lineage, organizational affiliation, and role. Fields include Name, Notes (Hebrew), Attachments, Predecessor, Successor, Affiliation, Year Established, Year Disbanded, Branch, Command, Rrole (Role), References, and Bibliography Attachment.

**UNITSLongevityN_90.csv**
Fully documented English-language database with 90 records, focused on unit longevity analysis. Contains standardized longevity metrics for SOF units. Fields include ID, Formed, Dissolved, Overall Longevity, Standardized Longevity, Fate (merged/demised/expanded), Size, Status (Cons/Semi-Pro/Ad-Hoc/Res), and Entrepreneur (none/founder/transformative).

**UNITS-Grid view.csv**
Airtable grid-view export with 168 records containing bilingual data (English names and Hebrew notes). Includes status classification and key individuals associated with each unit. Fields include ID, Name copy, Notes (Hebrew), Status (Conventional/Elite), Year Established, Year Disbanded, and Individuals.

**Units Glossary-Grid.csv**
Glossary-style reference with 196 records mapping English unit names to Hebrew equivalents, with associated individuals and predecessor information. Fields include Unit1, UNIT - HEBREW, Individuals, and Predecessor.

**prestate_units.csv**
Database of 36 pre-state (pre-1948) special operations units from the Haganah, Palmach, and British Army era, with organizational role classification. Fields include Name, Notes (year formed), Attachments (year disbanded), LONGEVITY, ORGANIZATION, LOCATION, and ROLE (Preventive/Clandestine/Commando/Intelligence/Reconnaissance).

**regional_defensive.csv**
Database of 38 regional defensive and reconnaissance units with geographic coordinates, useful for spatial analysis of unit deployment. Fields include Name, Notes (year), Attachments, Location, Latitude, Longitude, REGIONAL COMMAND, Affiliation, and Predecessor.

---

### 2. Individuals Databases

**IDF_Individuals_April_2026.xlsx**
The most recent database of IDF individuals associated with special operations forces (April 2026 update). Excel format (25.8 KB); download required to inspect contents.

**individuals_global.csv**
Global reference list with 121 records of notable individuals relevant to the study of special operations worldwide. Includes birth/death dates and Wikipedia links for reference. Fields include Name, Born, Died, and Link (Wikipedia URLs).

**individuals_glossary.csv**
Glossary of 87 individuals associated with Israeli SOF units. Includes unit affiliations, roles, associates, and rival relationships. Partially complete — some records require additional data. Fields include Name, Born, Died, Units, Roles, Associates, and Rivals.

---

### 3. Operations Databases

**attrition_operations.csv**
Database of 73 operations during the War of Attrition period (1967-1970). Documents military operations with participating units, branch, scale, and location. Fields include DATE, NAME, Number of Units, Units, Branch (Land/Navy), SCALE (Small/Medium/Large), and Location.

**palyam_operations1939-1948.csv**
Database of 26 Palyam (naval commando) operations from 1939 to 1948, covering the pre-state and early independence period. Fields include Title, Operation, Details, Date, Location, and Coordinates.

**sayeret_matkal_birds.csv**
Database of 7 early Sayeret Matkal intelligence-gathering operations (code-named "birds"), conducted in the 1960s primarily against Egyptian Air Force targets. Fields include Name, Notes, Date, Unit, and Location.

**reprisals.csv**
The largest dataset in the repository with 967 records documenting reprisal and military operations from 1953 onward. Includes operation names, dates, locations, and detailed place descriptions. Fields include Date, Date - Translated, Operation Name, Location, and Place.

**reprisals.xlsx**
Excel version of the reprisals database (529 KB). May contain additional formatting or sheets not present in the CSV export.

**Border Wars 1952-1956.xlsx**
Database covering border war operations from 1952 to 1956. Excel format (529 KB); download required to inspect contents.

---

### 4. Air Force Database

**IAF_1973_Losses.csv**
Database of 108 Israeli Air Force (IAF) aircraft losses during the 1973 Yom Kippur War. Each record represents one aircraft loss event with details on the aircraft type, weapon that downed it, crew names, squadron, and fate of the crew. Fields include ID, Notes (date), Attachments (aircraft type), Front (Syria/Egypt), Weapon (SA6/SA2/SAM/AAA/54-7/accident), Type 2 (aircraft designation), Name1, Name2, Squadron, Location, Description, and Fate (kia/ok/pow/mia).

---

## How to Use This Repository

### Browsing Online
All CSV files can be previewed directly on GitHub by clicking on any file name. GitHub renders CSV files as searchable tables. XLSX files must be downloaded to view.

### Downloading Individual Files
Click on any file, then click the "Raw" button or the download icon to save a single file.

### Cloning the Repository
To download all files at once:
```bash
git clone https://github.com/pedahzur/SOF-APPENDIX.git
cd SOF-APPENDIX
git checkout gh-pages
```

### Working with the Data
CSV files can be opened with any spreadsheet application (Excel, Google Sheets, LibreOffice Calc) or loaded into data analysis tools such as R, Python (pandas), or Stata. For example, in Python:

```python
import pandas as pd
units = pd.read_csv("Units_March_20262.csv")
losses = pd.read_csv("IAF_1973_Losses.csv")
```

Note that some CSV files contain Hebrew text. Ensure your application supports UTF-8 encoding when opening these files.

### GitHub Pages
The repository is deployed via GitHub Pages at:
https://pedahzur.github.io/SOF-APPENDIX/

---

## Data Versions and Updates

The repository has evolved over time. Earlier files (2019-2020) were initial AirTable exports. The March and April 2026 files represent the most current versions of the units and individuals databases. When multiple versions of a dataset exist (e.g., several units files), prefer the most recently dated version for analysis.

---

## Citation

If you use these data in academic work, please cite the repository and the associated publication.

---

## Author

**Ami Pedahzur**
University of Haifa

---

## License

Please contact the author regarding permissions for use and redistribution of these data.
