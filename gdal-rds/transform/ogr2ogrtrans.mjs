import gdal from "gdal-async";
export const transformGeojson = () => {
  const ds = gdal.open("./Transit_Lanes.geojson");
  const out = gdal.vectorTranslate("/vsimem/temp.gpkg", ds, ["-of", "GPKG"]);
  console.log("Output:", out);
};

export const metainfoGeojson = () => {
  const ds = gdal.open("./data/Transit_Lanes.geojson");
  const driver = ds.driver;
  const driver_metadata = driver.getMetadata();
  if (driver_metadata.DCAP_VECTOR !== "YES") {
    console.error("Source file is not a vector");
    process.exit(1);
  }

  console.log(`Driver = ${driver.description}`);
  console.log("");

  // layers
  let i = 0;
  console.log("Layers: ");
  ds.layers.forEach((layer) => {
    console.log(`${i++}: ${layer.name}`);

    console.log(`  Geometry Type = ${gdal.Geometry.getName(layer.geomType)}`);
    console.log(
      `  Spatial Reference = ${layer.srs ? layer.srs.toWKT() : "null"}`
    );

    const extent = layer.getExtent();
    console.log("  Extent: ");
    console.log(`    minX = ${extent.minX}`);
    console.log(`    minY = ${extent.minY}`);
    console.log(`    maxX = ${extent.maxX}`);
    console.log(`    maxY = ${extent.maxY}`);

    console.log("  Fields: ");
    layer.fields.forEach((field) => {
      console.log(`    -${field.name} (${field.type})`);
    });

    console.log(`  Feature Count = ${layer.features.count()}`);
  });
};

export const transformShp = ()=>{
    var dataset = gdal.open('./data/Surface Water Creeks.shp');
    console.log('dataset shape file:', dataset);
    const strdataset = JSON.stringify(dataset);
    console.log('dataset shape file in json string is:', strdataset);
    const layer = dataset.layers.get(0);
    console.log('layer:', layer);
    layer.fields.getNames().forEach((name) => {
      console.log(`Field: ${name}, Type: ${layer.fields.get(name).type}`);
    });
    const layername = gdal.Geometry.getName(layer.geomType);
    console.log('layername:', layername);
    layer.features.forEach(async (feature) => {
      const geom = feature.getGeometry();
      const wkt = geom.toWKT();
      const names = feature.fields;
      const array = names.forEach(element => {
        console.log('element:', element);
      });
  
      console.log(`Feature ${feature.fid}: (${wkt})`);
    });
    return layer;
}

export const transformDXF = ()=>{
  const dxfdrv = gdal.drivers.get('dxf');
  if (!dxfdrv) {
    console.error('DXF driver not available');
    process.exit(1);
  }
  var dataset = dxfdrv.open('./data/bridge.dxf');
  console.log('dataset DXF file:', dataset);
}