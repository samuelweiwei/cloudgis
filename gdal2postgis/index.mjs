import gdal from 'gdal-async';
import path from 'path';

export const handler = async (event) => {
  try {
    // use process.env.LAMBDA_TASK_ROOT acqure Lambda root
    const tifPath = path.join(process.env.LAMBDA_TASK_ROOT, 'example.tif');
    console.log('Reading TIF file from:', tifPath);
    
    // gdal deal
    const dataset = gdal.open(tifPath);
    const bandCount = dataset.bands.count();
    console.log('Successfully read TIF file. Band count:', bandCount);
    
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
