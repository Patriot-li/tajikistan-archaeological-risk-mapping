# Archaeological Occurrence Modelling

## Overview

The archaeological occurrence analysis in this study was conducted using **Maxent**, an open-source program for maximum-entropy modelling.

Maxent is a third-party research software package. The authors of this repository do **not** claim authorship of the Maxent software.

Official Maxent website:

https://biodiversityinformatics.amnh.org/open_source/maxent/

Official source-code repository:

https://github.com/mrmaxent/Maxent

## Data folders

The input data used for the Maxent analysis should be placed in the following directories.

### Archaeological occurrence samples

```text
data/samples_csv/
```

Place the archaeological occurrence sample file(s) in CSV format in this directory.

Example:

```text
data/
└── samples_csv/
    └── archaeological_occurrences.csv
```

### Environmental variables

```text
data/environmental_asc/
```

Place the environmental predictor rasters used by Maxent in ESRI ASCII (`.asc`) format in this directory.

Example:

```text
data/
└── environmental_asc/
    ├── elevation.asc
    ├── slope.asc
    ├── aspect.asc
    └── ...
```

The files themselves are intentionally left for the repository author to populate with the exact data used in the published analysis.

## Running Maxent

Use the Maxent application according to the official documentation and supply:

- the CSV occurrence file(s) from `data/samples_csv/`; and
- the environmental raster layers from `data/environmental_asc/`.

For reproducibility, the public repository should state the exact Maxent version used in the paper:

```text
Maxent version: [FILL EXACT VERSION]
```

Any non-default Maxent settings used for the published analysis should also be reported in the paper or repository documentation.

## Academic citation and attribution

Use of Maxent in an academic publication must be properly acknowledged.

The official Maxent website states that analyses resulting in a publication, report, or online posting should cite the software itself. The exact software version actually used in the study should be reported.

A version-aware software citation can be written in the following form:

> Phillips, S. J., Dudík, M., & Schapire, R. E. Maxent software for modeling species niches and distributions (Version [VERSION]). American Museum of Natural History. https://biodiversityinformatics.amnh.org/open_source/maxent/

Researchers should additionally cite the relevant Maxent methodological literature where appropriate, including:

- Phillips, S. J., Anderson, R. P., & Schapire, R. E. (2006). Maximum entropy modeling of species geographic distributions. *Ecological Modelling*, 190, 231–259.
- Phillips, S. J., Anderson, R. P., Dudík, M., Schapire, R. E., & Blair, M. E. (2017). Opening the black box: an open-source release of Maxent. *Ecography*.

The citation used in the final paper should match the exact Maxent version and the journal's reference style.

## License note

Maxent 3.4.x is released under the MIT License by its developers. This repository does not redistribute or relicense Maxent.

The occurrence CSV files and environmental raster data added to this folder may have their own data-use or redistribution conditions. Those conditions should be checked before public release.
