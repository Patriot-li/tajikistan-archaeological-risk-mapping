# Tajikistan Archaeological Occurrence and Expansion Risk Mapping

This repository provides the research materials and source code used for two components of the associated study:

1. **Archaeological Occurrence Modelling** based on the open-source **Maxent** software.
2. **Agricultural Expansion Risk** and **Urban Expansion Risk** mapping implemented in the **Google Earth Engine (GEE) JavaScript API**.

The repository is intended to make the analytical workflow transparent and reproducible. Source code and lightweight documentation are maintained in the Git repository, while large research data files are distributed separately through **GitHub Releases**.

## Repository structure

```text
.
├── README.md
├── LICENSE
├── CITATION.cff
├── THIRD_PARTY_NOTICES.md
├── archaeological_occurrence_modelling/
│   ├── README.md
│   └── data/
│       ├── samples_csv/
│       └── environmental_asc/
└── expansion_risk_mapping/
    ├── README.md
    ├── agricultural_expansion_risk.js
    └── urban_expansion_risk.js
```

The `archaeological_occurrence_modelling/data/` directory indicates the expected local directory structure for the Maxent inputs. Large input files do not need to be stored in the Git history and should instead be downloaded from the repository's GitHub Releases.

## Data and large-file distribution

Large files associated with the archaeological occurrence modelling component are distributed as **GitHub Release assets** rather than being committed directly to the Git repository.

The dataset used with the initial public version of this repository is provided in **release `v1.0.0`**:

[GitHub Release v1.0.0](https://github.com/Patriot-li/tajikistan-archaeological-risk-mapping/releases/tag/v1.0.0)

### Release assets

| File | Contents | Approx. size |
|---|---|---:|
| `samples_csv.7z` | Archaeological occurrence sample CSV file(s) used as Maxent occurrence input | 0.23 MB |
| `environmental_asc.7z` | Environmental predictor layers in ESRI ASCII raster (`.asc`) format used as Maxent environmental input | 402.51 MB |

Download both archives and extract their contents into the corresponding local directories:

```text
archaeological_occurrence_modelling/
└── data/
    ├── samples_csv/
    └── environmental_asc/
```

The expected mapping is:

- `samples_csv.7z` → `archaeological_occurrence_modelling/data/samples_csv/`
- `environmental_asc.7z` → `archaeological_occurrence_modelling/data/environmental_asc/`

The archives are kept outside the Git history because the environmental raster package is substantially larger than the source-code files.

For reproducibility, use the source code and data associated with the same release tag. The manuscript-associated snapshot represented here is `v1.0.0`.

## 1. Archaeological Occurrence Modelling

The archaeological occurrence analysis was conducted using **Maxent**, an open-source maximum-entropy modelling program.

This repository does not redistribute or claim authorship of Maxent. Instead, it provides the workflow, directory structure, and study-specific input data needed to reproduce the archaeological occurrence modelling analysis.

The required Maxent inputs are:

- `archaeological_occurrence_modelling/data/samples_csv/`  
  Archaeological occurrence sample CSV file(s).

- `archaeological_occurrence_modelling/data/environmental_asc/`  
  Environmental predictor layers in ESRI ASCII raster (`.asc`) format.

The study-specific Maxent inputs are distributed through **GitHub Release `v1.0.0`** as `samples_csv.7z` and `environmental_asc.7z`. After download, extract each archive into its corresponding directory shown above.

See `archaeological_occurrence_modelling/README.md` for the Maxent workflow, required attribution, and citation guidance.

## 2. Expansion Risk Mapping

The agricultural and urban expansion risk analyses were implemented in the **Google Earth Engine JavaScript API**.

Two independent scripts are provided:

- `expansion_risk_mapping/agricultural_expansion_risk.js`
- `expansion_risk_mapping/urban_expansion_risk.js`

The scripts can be copied directly into the Google Earth Engine Code Editor.

The original scripts reference the study-area asset:

```javascript
projects/ee-841742792/assets/tjadmin1
```

Users who do not have access to this asset must replace it with an accessible `ee.FeatureCollection` representing the intended study area.

See `expansion_risk_mapping/README.md` for methodological and execution details.

## Reproducibility and versioning

The Git repository contains the version-controlled source code and documentation, while large research data are distributed through tagged GitHub Releases.

For a reproducible analysis:

1. use the source code associated with the relevant release tag;
2. download the large data assets from the same release;
3. place the downloaded Maxent inputs into the directory structure described above; and
4. record the release tag used when reporting or reproducing the analysis.

Published release assets should be treated as fixed research snapshots. Corrections or updated datasets should be distributed under a new release tag rather than silently replacing previously published files.

## Citation

If this repository is used in academic work, please cite the associated paper and appropriately acknowledge the third-party software and datasets used by the workflow.

When referring to a specific reproducible version of the repository, cite or report the corresponding GitHub release tag.

For the Maxent component, follow the citation guidance provided by the official Maxent project and cite the exact software version used in the analysis.

## License

The original source code in this repository is released under the MIT License.

Third-party software and datasets are not relicensed by this repository and remain subject to their respective licenses, terms of use, and citation requirements.
