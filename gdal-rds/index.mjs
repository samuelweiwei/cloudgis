import gdal from 'gdal-async';
import path from 'path';
import {metainfoGeojson, transformGeojson, transformShp, transformDXF} from './transform/ogr2ogrtrans.mjs';

export const handler = async (event) => {
  try {
    // use process.env.LAMBDA_TASK_ROOT acqure Lambda root
    // const tifPath = path.join(process.env.LAMBDA_TASK_ROOT, 'example.tif');
    // console.log('lambda root:', process.env.LAMBDA_TASK_ROOT);
    // console.log('Reading TIF file from:', tifPath);
    // const tifPath = './data/example.tif';

    // gdal deal
    // const dataset = gdal.open(tifPath);
    // const bandCount = dataset.bands.count();
    // console.log('Successfully read TIF file. Band count:', bandCount);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'File processed successfully',
        bandCount: bandCount
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing file',
        error: error.message
      })
    };
  }
};

// transformShp();
transformDXF();