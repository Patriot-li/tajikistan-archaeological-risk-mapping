# Agricultural and Urban Expansion Risk Mapping

## Overview

The source code in this directory implements the agricultural expansion risk and urban expansion risk analyses used in the study.

Both analyses were developed for the **Google Earth Engine (GEE) JavaScript API** and are intended to be executed in the Google Earth Engine Code Editor:

https://code.earthengine.google.com/

## Files

```text
agricultural_expansion_risk.js
urban_expansion_risk.js
```

The two scripts are independent and should be run separately.

## Study-area asset

Both original scripts use:

```javascript
var aoi = ee.FeatureCollection('projects/ee-841742792/assets/tjadmin1');
```

This is the study-area FeatureCollection used by the analysis.

If this asset is not publicly accessible, users reproducing the workflow must replace the asset ID with their own accessible study-area FeatureCollection.

## Agricultural expansion risk

File:

```text
agricultural_expansion_risk.js
```

Main data source:

```text
COPERNICUS/S2_SR_HARMONIZED
```

Analysis period:

```text
2020-01-01 to 2025-01-01
```

Annual crop-presence analysis is performed for 2020–2024.

The script:

1. masks clouds and cloud shadows;
2. computes NDVI;
3. evaluates annual crop presence from growing-season and annual NDVI behaviour;
4. calculates crop-frequency percentage across valid years;
5. converts crop frequency into five risk levels; and
6. exports both the risk level and crop-frequency raster to Google Drive.

The risk classes are:

| Level | Crop frequency |
|---|---:|
| 1 | ≤ 25% |
| 2 | > 25% and ≤ 40% |
| 3 | > 40% and ≤ 60% |
| 4 | > 60% and ≤ 80% |
| 5 | > 80% |

The exported risk raster uses a 500 m scale and `EPSG:4326`, matching the supplied source code.

## Urban expansion risk

File:

```text
urban_expansion_risk.js
```

Main data source:

```text
JRC/GHSL/P2023A/GHS_BUILT_S
```

The script compares the `built_surface` band in 1990 and 2020 and calculates compound annual growth rate (CAGR):

```text
CAGR = ((builtEnd / (builtStart + epsilon))^(1 / yearDiff) - 1) × 100
```

with:

```text
epsilon = 0.1
yearDiff = 30
```

The CAGR is converted into five urban-expansion risk levels:

| Level | CAGR |
|---|---:|
| 1 | ≤ 0% |
| 2 | > 0% and ≤ 1% |
| 3 | > 1% and ≤ 3% |
| 4 | > 3% and ≤ 5% |
| 5 | > 5% |

The exported risk raster uses a 100 m scale and `EPSG:4326`, matching the supplied source code.

## Running the scripts

1. Open the Google Earth Engine Code Editor.
2. Create a new script.
3. Copy the contents of one `.js` file into the editor.
4. Confirm that the study-area asset is accessible, or replace its asset ID.
5. Run the script.
6. Inspect the diagnostic information in the **Console**.
7. Start the corresponding export task from the **Tasks** panel.

## Reproducibility note

The source files in this repository preserve the analysis logic, thresholds, dates, input dataset IDs, and export settings supplied for the study. Only comments and user-facing diagnostic/legend text were translated from Chinese into English for public release.

When using these workflows in academic work, cite the associated paper, Google Earth Engine, and the original remote-sensing datasets according to the relevant provider guidance.
