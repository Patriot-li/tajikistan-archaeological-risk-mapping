/***************************************************************
 * Agricultural Expansion Risk Analysis
 ***************************************************************/

// ===== 1. Define the study area =====
var aoi = ee.FeatureCollection('projects/ee-841742792/assets/tjadmin1');
var aoiGeometry = aoi.geometry();

// ===== 2. Cloud and shadow masking function =====
function maskCloudsAndShadows(image) {
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var cloudMask = qa.bitwiseAnd(cloudBitMask).eq(0)
                    .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  var hasSCL = image.bandNames().contains('SCL');
  var sclMask = ee.Algorithms.If(
    hasSCL,
    image.select('SCL').neq(3).and(image.select('SCL').neq(8))
         .and(image.select('SCL').neq(9)).and(image.select('SCL').neq(10))
         .and(image.select('SCL').neq(11)),
    ee.Image(1)
  );

  return image.updateMask(cloudMask.and(ee.Image(sclMask)))
              .divide(10000)
              .select(['B4', 'B8'])
              .copyProperties(image, ['system:time_start']);
}

// ===== 3. NDVI calculation function =====
function addNDVI(image) {
  return image.addBands(
    image.normalizedDifference(['B8', 'B4']).rename('NDVI')
  );
}

// ===== 4. Load the Sentinel-2 dataset =====
var s2Collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoi)
  .filterDate('2020-01-01', '2025-01-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
  .map(maskCloudsAndShadows)
  .map(addNDVI);

// ===== 5. Annual crop identification =====
var years = ee.List.sequence(2020, 2024);

var yearlyAnalysis = ee.ImageCollection(years.map(function(year) {
  year = ee.Number(year);

  var growingSeasonImages = s2Collection
    .filter(ee.Filter.calendarRange(year, year, 'year'))
    .filter(ee.Filter.calendarRange(4, 10, 'month'));

  var yearlyImages = s2Collection
    .filter(ee.Filter.calendarRange(year, year, 'year'));

  var observationCount = growingSeasonImages.select('NDVI').count();
  var hasObservation   = observationCount.gt(0);

  var maxNDVI       = growingSeasonImages.select('NDVI').max();
  var meanNDVI      = growingSeasonImages.select('NDVI').mean();
  var ndviAmplitude = yearlyImages.select('NDVI').max()
                        .subtract(yearlyImages.select('NDVI').min());
  var highNDVIratio = growingSeasonImages.select('NDVI')
                        .map(function(img){ return img.gt(0.35); }).sum()
                        .divide(observationCount.max(1));

  var cropPresence = maxNDVI.gt(0.45)
    .and(meanNDVI.gt(0.35))
    .and(ndviAmplitude.gt(0.25))
    .and(highNDVIratio.gt(0.4))
    .updateMask(hasObservation)
    .rename('crop_presence');

  return ee.Image.cat([
    cropPresence.byte(),
    hasObservation.byte().rename('has_observation')
  ]).set('system:time_start', ee.Date.fromYMD(year, 6, 1).millis());
}));

// ===== 6. Calculate crop frequency =====
var validYearsPerPixel = yearlyAnalysis.select('has_observation').sum();
var validDataMask      = validYearsPerPixel.gte(3);

var cropFrequencyPercent = yearlyAnalysis.select('crop_presence').sum()
  .divide(validYearsPerPixel.max(1))
  .multiply(100)
  .updateMask(validDataMask)
  .float()
  .clip(aoi);  // Clip early so that the mask boundary matches the AOI.

// ===== 7. Classify risk levels =====
// Use cropFrequencyPercent.multiply(0).add(1) instead of ee.Image(1).
// The former inherits the mask from cropFrequencyPercent and therefore
// exists only over valid pixels. A global unmasked ee.Image(1) background
// can otherwise cause exported NoData areas outside the AOI to become 0.
var riskLevel = cropFrequencyPercent.multiply(0).add(1)
  .where(cropFrequencyPercent.gt(25).and(cropFrequencyPercent.lte(40)), 2)
  .where(cropFrequencyPercent.gt(40).and(cropFrequencyPercent.lte(60)), 3)
  .where(cropFrequencyPercent.gt(60).and(cropFrequencyPercent.lte(80)), 4)
  .where(cropFrequencyPercent.gt(80), 5)
  .rename('risk_level')
  .byte()
  .clip(aoi);

// ===== 8. Diagnostic output =====
// Confirm the Console results before submitting the export.
print('=== Diagnostic Information ===');

print('Total number of Sentinel-2 images:', s2Collection.size());

print('Distribution of valid years per pixel:', validYearsPerPixel.reduceRegion({
  reducer: ee.Reducer.frequencyHistogram(),
  geometry: aoiGeometry,
  scale: 1000,
  maxPixels: 1e8
}));

print('Crop-frequency range (min/max):', cropFrequencyPercent.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: aoiGeometry,
  scale: 1000,
  maxPixels: 1e8
}));

// The histogram should contain risk levels such as
// {1: ..., 2: ..., 3: ...}, rather than only {0: ...}.
print('Risk-level pixel distribution:', riskLevel.reduceRegion({
  reducer: ee.Reducer.frequencyHistogram(),
  geometry: aoiGeometry,
  scale: 1000,
  maxPixels: 1e8
}));

// ===== 9. Export the risk level =====
Export.image.toDrive({
  image: riskLevel,
  description: 'Agricultural_Risk_Level',
  folder: 'GEE_Agriculture_Risk',
  fileNamePrefix: 'risk_level',
  scale: 500,
  region: aoiGeometry,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});

// ===== 10. Export crop frequency for validation =====
Export.image.toDrive({
  image: cropFrequencyPercent,
  description: 'Crop_Frequency_Percent',
  folder: 'GEE_Agriculture_Risk',
  fileNamePrefix: 'crop_frequency',
  scale: 500,
  region: aoiGeometry,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});
