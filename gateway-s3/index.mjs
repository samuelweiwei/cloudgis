import {S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import { readFile} from "fs/promises";
import { basename } from "path";
import fs from "fs";
import path from "path";
import os from "os";
import { Readable } from "stream";

const s3 = new S3Client({region: "ap-southeast-2"});

async function downloadFromS3(bucket, key) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const response = await s3.send(command);
    if (!response.Body) {
      throw new Error("No response body from S3");
    }
    const filePath = path.join("./", path.basename(key));
    const readableStream = response.Body instanceof Readable ? response.Body : Readable.fromWeb(response.Body);

    //Write the stream to a file
    const writeStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      readableStream
        .pipe(writeStream)
        .on("finish", () => {
          console.log(`Successfully downloaded ${key} to ${filePath}`);
          resolve(filePath);
        })
        .on("error", (err) => {
          reject(`Error downloading from S3: ${err}`);
        });
    });
  } catch (err) {
    console.error("Error downloading from S3:", err);
    throw err;
  }
}

export const handler = async () => {
  try {
    // TODO implement
    const filePath = "./file-to-upload.zip";
    const bucketName = "mapview-data"

    if (!bucketName) {
      throw new Error('S3 bucket name is required. Provide it in the event or as an environment variable S3_BUCKET_NAME');
    }
    // Read the file
    // Get S3 bucket and key from event or environment variables
    const s3Bucket = "mapview-data" || event.s3Bucket || process.env.S3_BUCKET;
    const s3Key = "file-to-upload.zip" || event.s3Key || process.env.S3_KEY;

    if (!s3Bucket || !s3Key) {
      throw new Error("S3 bucket and key must be provided either in the event or as environment variables");
    }

    const tempFilePath = await downloadFromS3(s3Bucket, s3Key);
    const fileName = basename(filePath);

    // const fileContent = await readFile(filePath);
    // // Get the filename from the path
    // const fileName = basename(filePath);

    // const params = {
    //   Bucket: bucketName,
    //   Key: fileName,
    //   Body: fileContent,
    //   ContentType: "application/zip",
    // };

    // // 3. Upload to S3
    // const command = new PutObjectCommand(params);
    // const response =  await s3.send(command);
    // console.log("Upload response:", response);
    return{
      statusCode: 200,
      body: JSON.stringify({
        message: "File uploaded successfully",
        fileName: fileName,
        s3location: `s3://${s3Bucket}/${s3Key}`,
        // response: response,
      }),
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to upload file to S3',
        error: error.message
      })
    };
  }
};

await handler();