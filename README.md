# SOFS APPENDIX - Military Historical Data

This repository contains historical data about Israeli Special Forces operations, units, personnel, and military engagements.

## Databases

- **IAF Yom Kippur War** - Losses during the Yom Kippur War (1973)
- **Units N=194** - Including Hebrew cells and missing values
- **Units N=90** - English, fully documented
- **Military Operations** - Attrition operations, reprisals, Palyam operations, and special operations
- **Personnel** - Individual records of key military figures

## Interactive Dashboard

This repository includes an interactive web dashboard to visualize and explore the data.

### Setup Instructions

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the dashboard:**
   ```bash
   python dashboard.py
   ```

3. **Access the dashboard:**
   Open your web browser and navigate to: `http://127.0.0.1:8050`

### Dashboard Features

The dashboard provides:

- **Overview** - Key metrics and summary statistics
- **IAF 1973 Losses** - Detailed breakdown of aircraft losses during the Yom Kippur War
- **Military Operations** - Timeline and analysis of attrition operations (1967-1973)
- **Reprisal Operations** - Interactive map and data table of reprisal operations
- **Elite Units** - Longevity and characteristics of special forces units
- **Special Operations** - Sayeret Matkal, Palyam, and regional defensive unit operations

All data tables support:
- Filtering by any column
- Sorting
- Interactive visualizations
- Export capabilities

## Data Files

- `IAF_1973_Losses.csv` - IAF aircraft losses during the 1973 war
- `attrition_operations.csv` - Attrition operations (1967-1973)
- `reprisals.csv` - Reprisal operations data
- `UNITSN_194.csv` - Comprehensive units database
- `UNITSLongevityN_90.csv` - Elite units longevity data
- `individuals_global.csv` - Personnel records
- `sayeret_matkal_birds.csv` - Sayeret Matkal operations
- `palyam_operations1939-1948.csv` - Palyam operations
- `Border Wars 1952-1956.xlsx` - Border wars data

## Requirements

- Python 3.8+
- dash
- plotly
- pandas
- openpyxl
