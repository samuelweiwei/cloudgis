import gdal from "gdal-async";
import { DataTypes } from "sequelize";
// GDAL to Sequelize type mapping with PostGIS support
function getSequelizeType(field) {
    console.log(`Processing field: ${field.name}, GDAL Type: ${field.type}`);
    
    switch (field.type.toLowerCase()) {
      case 'real':
        return DataTypes.DOUBLE;
        
      case 'string':
        return DataTypes.STRING(255);
        
      case 'integer':
        return DataTypes.INTEGER;
        
      case 'date':
        return DataTypes.DATEONLY;
        
      case 'datetime':
        return DataTypes.DATE;
        
      default:
        console.warn(`Unknown field type: ${field.type} for field ${field.name}, defaulting to TEXT`);
        return DataTypes.TEXT;
    }
}

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