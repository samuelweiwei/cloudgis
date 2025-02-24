import AWS from "aws-sdk";

const s3 = new AWS.S3();
export const handler = async (event) => {
  try {
    // TODO implement
    const body = Buffer.from(event.body, "base64");

    // 2. Define S3 parameters
    const bucketName = "gisuploadshape";
    const fileName = `uploads/Site_Roads.zip`;
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: body,
      ContentType: "application/zip",
    };

    // 3. Upload to S3
    await s3.putObject(params).promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "ZIP file uploaded successfully",
        fileName,
      }),
    };
    return response;
  } catch (error) {
    console.error("Upload error:", error);
    return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error uploading ZIP file", error: error.message })
    };
  }
};
