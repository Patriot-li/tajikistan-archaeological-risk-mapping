# Tajikistan Archaeological Occurrence and Expansion Risk Mapping

This repository provides the research materials and source code used for two components of the associated study:

1. **Archaeological Occurrence Modelling** based on the open-source **Maxent** software.
2. **Agricultural Expansion Risk** and **Urban Expansion Risk** mapping implemented in the **Google Earth Engine (GEE) JavaScript API**.

The repository is intended to make the analytical workflow transparent and easier to reproduce.

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

## 1. Archaeological Occurrence Modelling

The archaeological occurrence analysis was conducted using **Maxent**, an open-source maximum-entropy modelling program.

This repository does not redistribute or claim authorship of Maxent. Instead, it provides the analysis input folders used by the study:

- `archaeological_occurrence_modelling/data/samples_csv/`  
  Add the archaeological occurrence sample CSV file(s) here.

- `archaeological_occurrence_modelling/data/environmental_asc/`  
  Add the environmental predictor layers in ESRI ASCII raster (`.asc`) format here.

See `archaeological_occurrence_modelling/README.md` for the required Maxent attribution and citation guidance.

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

## Citation

If this repository is used in academic work, please cite the associated paper and appropriately acknowledge the third-party software and datasets used by the workflow.

For the Maxent component, follow the citation guidance provided by the official Maxent project and cite the exact software version used in the analysis.

## License

The original source code in this repository is released under the MIT License.

Third-party software and datasets are not relicensed by this repository and remain subject to their respective licenses, terms of use, and citation requirements.
