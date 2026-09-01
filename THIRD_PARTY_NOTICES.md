# Third-Party Software and Data

## Maxent

The Archaeological Occurrence Modelling component uses the open-source **Maxent** software developed by Steven J. Phillips, Miroslav Dudík, Robert E. Schapire, and collaborators.

Official project page:

https://biodiversityinformatics.amnh.org/open_source/maxent/

Source code:

https://github.com/mrmaxent/Maxent

Maxent 3.4.x is distributed under the MIT License. The exact version used for the paper should be recorded before release:

```text
Maxent version used in this study: [FILL EXACT VERSION]
```

This repository does not claim authorship of Maxent.

## Google Earth Engine

The agricultural and urban expansion risk scripts are designed for the Google Earth Engine JavaScript API.

Google Earth Engine:

https://earthengine.google.com/

Google Earth Engine Code Editor:

https://code.earthengine.google.com/

## Earth Engine datasets referenced by the scripts

### Urban expansion

```text
JRC/GHSL/P2023A/GHS_BUILT_S
```

The script uses the `built_surface` band for 1990 and 2020.

### Agricultural expansion

```text
COPERNICUS/S2_SR_HARMONIZED
```

The script uses Sentinel-2 surface-reflectance observations for 2020–2024.

Users are responsible for following the citation and usage requirements of Google Earth Engine and the original dataset providers.
