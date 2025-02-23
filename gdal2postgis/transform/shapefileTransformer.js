// shapefileTransformer.js
import gdal from 'gdal-async';

export class ShapefileTransformer {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async analyze() {
    try {
      const dataset = await gdal.openAsync(this.filePath);
      const layer = await dataset.layers.getAsync(0);
      
      const analysis = {
        layerName: layer.name,
        geomType: gdal.Geometry.getName(layer.geomType),
        srid: layer.srs ? layer.srs.getAuthorityCode() : 4326,
        featureCount: layer.features.count(),
        fields: []
      };

      // Get field names and types
      const fieldNames = layer.fields.getNames();
      fieldNames.forEach(name => {
        analysis.fields.push({
          name: name,
          type: layer.fields.get(name).type
        });
      });

      return analysis;
    } catch (error) {
      console.error('Error in analyze:', error);
      throw error;
    }
  }

  async transformFeatures() {
    try {
      const dataset = await gdal.openAsync(this.filePath);
      const layer = await dataset.layers.getAsync(0);
      const features = [];
      const fieldNames = layer.fields.getNames();

      // Use a traditional for loop to iterate through features
      for (let i = 0; i < layer.features.count(); i++) {
        const feature = layer.features.get(i);
        const geometry = feature.getGeometry();
        const attributes = {};
        
        // Get field values using field names
        fieldNames.forEach(fieldName => {
          attributes[fieldName] = feature.fields.get(fieldName);
        });

        // Transform geometry to WGS84 if needed
        if (geometry) {
          const srid = layer.srs ? layer.srs.getAuthorityCode() : 4326;
          if (srid !== 4326) {
            geometry.transformTo(gdal.SpatialReference.fromEPSG(4326));
          }
          attributes.geometry = geometry.toWKT();
        }

        features.push(attributes);
      }

      return features;
    } catch (error) {
      console.error('Error in transformFeatures:', error);
      throw error;
    }
  }

  async printShapefileInfo() {
    try {
      const dataset = await gdal.openAsync(this.filePath);
      const layer = await dataset.layers.getAsync(0);
      
      console.log('Dataset info:', {
        description: dataset.description,
        layers: dataset.layers.count(),
        driver: dataset.driver.description
      });
      
      console.log('Layer info:', {
        name: layer.name,
        featureCount: layer.features.count(),
        geomType: gdal.Geometry.getName(layer.geomType)
      });

      console.log('Fields:');
      const fieldNames = layer.fields.getNames();
      fieldNames.forEach(name => {
        const field = layer.fields.get(name);
        console.log(`- ${name}: ${field.type}`);
      });

      // Print first feature as sample
      if (layer.features.count() > 0) {
        const firstFeature = layer.features.get(0);
        console.log('Sample feature:');
        fieldNames.forEach(fieldName => {
          console.log(`- ${fieldName}: ${firstFeature.fields.get(fieldName)}`);
        });
        const geom = firstFeature.getGeometry();
        if (geom) {
          console.log('Geometry:', geom.toWKT());
        }
      }
    } catch (error) {
      console.error('Error in printShapefileInfo:', error);
      throw error;
    }
  }
}

export const verse = () => {
  console.log('GDAL version:', gdal.version);
console.log('PROJ version:', gdal.projVersion);
}