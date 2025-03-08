import { DataTypes } from 'sequelize';
export class DatabaseWriter {
    constructor(sequelize) {
      this.sequelize = sequelize;
    }
  
    getSequelizeType(gdalType) {
      const typeMapping = {
        'Integer': DataTypes.INTEGER,
        'Integer64': DataTypes.BIGINT,
        'Real': DataTypes.DOUBLE,
        'String': DataTypes.TEXT,
        'Date': DataTypes.DATEONLY,
        'DateTime': DataTypes.DATE,
        'Time': DataTypes.TIME,
        'Binary': DataTypes.BLOB,
        'Boolean': DataTypes.BOOLEAN
      };
  
      return typeMapping[gdalType] || DataTypes.TEXT;
    }
  
    async createTable(tableName, analysis, schema = 'public') {
      // Create schema if doesn't exist
      await this.sequelize.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`);
  
      const fields = {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        geometry: {
          type: DataTypes.GEOMETRY,
          allowNull: true
        }
      };
  
      // Add fields from analysis
      analysis.fields.forEach(field => {
        fields[field.name] = {
          type: this.getSequelizeType(field.type),
          allowNull: true
        };
      });
  
      // Define model
      const Model = this.sequelize.define(tableName, fields, {
        schema: schema,
        timestamps: false,
        freezeTableName: true
      });
  
      await Model.sync();
  
      // Create spatial index
      await this.sequelize.query(`
        CREATE INDEX IF NOT EXISTS ${tableName}_geometry_idx 
        ON ${schema}.${tableName} USING GIST (geometry);
      `);
  
      return Model;
    }
  
    async writeFeatures(Model, features, batchSize = 100) {
      const batches = [];
      for (let i = 0; i < features.length; i += batchSize) {
        const batch = features.slice(i, i + batchSize).map(feature => ({
          ...feature,
          geometry: this.sequelize.fn(
            'ST_GeomFromText',
            feature.geometry,
            4326
          )
        }));
  
        batches.push(Model.bulkCreate(batch, { 
          logging: false,
          returning: false 
        }));

        // Optional: Add logging after pushing the batch
        console.log(`Batch ${Math.floor(i/batchSize) + 1} queued for processing`);
      }
  
      await Promise.all(batches);
      await this.sequelize.query(`ANALYZE ${Model.schema}.${Model.tableName};`);
      
      return features.length;
    }
  }
  