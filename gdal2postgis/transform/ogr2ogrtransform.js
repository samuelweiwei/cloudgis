import gdal from "gdal-async";

export const transformShp = ()=>{
    var dataset = gdal.open('./data/Site_Roads.shp');
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