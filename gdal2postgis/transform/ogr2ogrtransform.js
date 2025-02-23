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

// Get geometry type from GDAL layer
function getGeometryType(layer) {
  const geomType = layer.geomType;
  const layerName = gdal.Geometry.getName(geomType);
  
  // Map GDAL geometry types to PostGIS types
  if (layerName.includes('3D')) {
    return 'GEOMETRY(LINESTRINGZ, 4326)';
  } else if (layerName.includes('Line')) {
    return 'GEOMETRY(LINESTRING, 4326)';
  } else if (layerName.includes('Point')) {
    return 'GEOMETRY(POINT, 4326)';
  } else if (layerName.includes('Polygon')) {
    return 'GEOMETRY(POLYGON, 4326)';
  }
  
  return 'GEOMETRY';
}

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