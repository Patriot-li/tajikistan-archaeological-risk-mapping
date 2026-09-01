/***************************************************************
 * Urban Expansion Risk Assessment
 ***************************************************************/

// ==============================================================
// 1. Parameter settings
// ==============================================================
var aoi = ee.FeatureCollection('projects/ee-841742792/assets/tjadmin1');
var aoiGeometry = aoi.geometry();

var startYear = 1990;
var endYear   = 2020;
var epsilon   = 0.1;

// ==============================================================
// 2. Load built_surface
// ==============================================================
var builtStart = ee.Image('JRC/GHSL/P2023A/GHS_BUILT_S/' + startYear)
  .select('built_surface')
  .clip(aoiGeometry);

var builtEnd = ee.Image('JRC/GHSL/P2023A/GHS_BUILT_S/' + endYear)
  .select('built_surface')
  .clip(aoiGeometry);

var yearDiff = endYear - startYear;

// ==============================================================
// 3. Calculate CAGR
// ==============================================================
var cagr = builtEnd
  .divide(builtStart.add(epsilon))
  .pow(ee.Number(1).divide(yearDiff))
  .subtract(1)
  .multiply(100)
  .rename('CAGR')
  .clip(aoiGeometry);

// ==============================================================
// 4. Build the valid-data mask
// Only pixels with values in both builtEnd and builtStart are valid.
// This prevents a global ee.Image(1) background from contaminating
// the exported result.
// ==============================================================
var validMask = builtEnd.mask().and(builtStart.mask());

// ==============================================================
// 5. Classify urban-expansion risk levels
// Use cagr.multiply(0).add(1) as the base image so that its mask
// exactly matches the CAGR image and does not create global NoData=0
// artefacts outside the valid-data region.
// ==============================================================
var riskLevels = cagr.multiply(0).add(1)   // Create a level-1 base image only within valid CAGR pixels
  .where(cagr.gt(0).and(cagr.lte(1)), 2)
  .where(cagr.gt(1).and(cagr.lte(3)), 3)
  .where(cagr.gt(3).and(cagr.lte(5)), 4)
  .where(cagr.gt(5), 5)
  .updateMask(validMask)                   // Retain only pixels valid in both input years
  .rename('urban_expansion_risk')
  .byte()
  .clip(aoiGeometry);

// ==============================================================
// 6. Diagnostic output
// Confirm the Console results before submitting the export.
// ==============================================================
print('=== Diagnostic Information ===');

print('builtStart statistics:', builtStart.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: aoiGeometry,
  scale: 1000,
  maxPixels: 1e8
}));

print('builtEnd statistics:', builtEnd.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: aoiGeometry,
  scale: 1000,
  maxPixels: 1e8
}));

print('CAGR range:', cagr.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: aoiGeometry,
  scale: 1000,
  maxPixels: 1e8
}));

// The risk-level histogram should contain values from 1 to 5,
// rather than only 0.
print('Risk-level distribution (values 1-5 expected):', riskLevels.reduceRegion({
  reducer: ee.Reducer.frequencyHistogram(),
  geometry: aoiGeometry,
  scale: 1000,
  maxPixels: 1e8
}));

// ==============================================================
// 7. Visualization
// ==============================================================
var riskPalette = ['006400', '7FFF00', 'FFFF00', 'FFA500', 'FF0000'];
Map.centerObject(aoi, 8);
Map.addLayer(riskLevels, {
  min: 1,
  max: 5,
  palette: riskPalette
}, 'Urban Expansion Risk (CAGR)');
Map.addLayer(aoi, {color: 'blue'}, 'Study Area', false);

// ==============================================================
// 8. Legend
// ==============================================================
var legend = ui.Panel({
  style: { position: 'bottom-left', padding: '8px 15px' }
});

legend.add(ui.Label({
  value: 'Urban Expansion Risk Level',
  style: { fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0' }
}));

var riskLabels = [
  'Level 1: No expansion or negative growth (≤0%)',
  'Level 2: Low expansion (0%–1%)',
  'Level 3: Moderate expansion (1%–3%)',
  'Level 4: High expansion (3%–5%)',
  'Level 5: Very high expansion (>5%)'
];

for (var i = 0; i < 5; i++) {
  legend.add(ui.Panel({
    widgets: [
      ui.Label({ style: { backgroundColor: riskPalette[i], padding: '8px', margin: '0 4px 4px 0' }}),
      ui.Label(riskLabels[i])
    ],
    layout: ui.Panel.Layout.Flow('horizontal')
  }));
}
Map.add(legend);

// ==============================================================
// 9. Export
// ==============================================================
Export.image.toDrive({
  image: riskLevels,
  description: 'Urban_Expansion_Risk_CAGR_' + startYear + '_' + endYear,
  folder: 'GEE_exports',
  fileNamePrefix: 'urban_risk_' + startYear + '_' + endYear,
  scale: 100,
  region: aoiGeometry,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF',
  crs: 'EPSG:4326'
});
