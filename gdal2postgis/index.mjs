import { sequelize, initializeDb } from "./sequelize/index.js";
import { QueryTypes } from "sequelize";
import { ShapefileTransformer } from "./transform/shapefileTransformer.js";
import { DatabaseWriter } from "./sequelize/dataWriter.js";
const postgisexec = () => {
  const result = sequelize.query("select postgis_version();");
  return result;
};
let postgisVersion;

export const handler = async (event) => {
  try {
    initializeDb();

    // First check if PostGIS is installed
    const isPostgisInstalled = await sequelize.query(
      "SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis');",
      {
        type: QueryTypes.SELECT,
        plain: true,
      }
    );

    // If PostGIS is not installed, install it
    if (!isPostgisInstalled.exists) {
      console.log("PostGIS not found, installing...");
      await sequelize.query("CREATE EXTENSION IF NOT EXISTS postgis;", {
        type: QueryTypes.RAW,
      });
      console.log("PostGIS installation completed");
    }

    // Now we can safely query PostGIS version
    postgisVersion = await sequelize.query(
      "SELECT postgis_full_version() as version;",
      {
        type: QueryTypes.SELECT,
        plain: true,
      }
    );

    console.log("GIS version is after async:", postgisVersion);

    // New shapefile and database writer
    const transformer = new ShapefileTransformer("./data/Site_Roads.shp");
    const writer = new DatabaseWriter(sequelize);

    // Analyze shapefile
    console.log("Analyzing shapefile...");
    const analysis = await transformer.analyze();
    console.log("Analysis:", analysis);

    // Transform features
    console.log("Transforming features...");
    const features = await transformer.transformFeatures();
    console.log(`Transformed ${features.length} features`);

    // Create table and write features
    console.log("Creating table...");
    const Model = await writer.createTable("site_roads", analysis);

    console.log("Writing features to database......");
    const writtenCount = await writer.writeFeatures(Model, features);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Success",
        postgisVersion: postgisVersion,
        data: "succeed",
      }),
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred",
        error: err.message,
      }),
    };
  } finally {
    console.log("PostGIS version:", postgisVersion);
  }
}