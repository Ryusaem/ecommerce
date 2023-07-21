// muliparty is a library to parse multipart/form-data requests
import multiparty from "multiparty";

// s3 is used to upload the files to S3. S3 is a service provided by AWS to store files in the cloud.
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// fs is a Node.js library to read and write files
import fs from "fs";

// mime-types is a library to get the MIME type of a file based on its extension
import mime from "mime-types";

const bucketName = "ryusaem-next-ecommerce";

export default async function handle(req, res) {
  // Form is an instance of multiparty.Form that will parse the multipart/form-data request
  const form = new multiparty.Form();

  // fields is an object containing the form fields and their values and files is an array containing the uploaded files
  const { fields, files } = await new Promise((resolve, reject) => {
    // Parse the multipart/form-data request
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
  console.log("length:", files.files.length);

  // Create an instance of S3Client to upload the files to S3
  const client = new S3Client({
    region: "eu-north-1",
    // credentials are read from the environment variables
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  // links is an array containing the links of the uploaded files
  const links = [];

  // loop through the uploaded files
  for (const file of files.files) {
    // ext is the file extension (jpg, png, etc.)
    const ext = file.originalFilename.split(".").pop();

    // newFileName is the name of the file without the extension and a timestamp is appended to it
    const newFileName = `${Date.now()}.${ext}`;

    // console.log({ ext, file });
    // Create an instance of PutObjectCommand to upload the file to S3
    await client.send(
      new PutObjectCommand({
        // Bucket is the name of the S3 bucket
        Bucket: bucketName,
        // Key is the name of the file
        Key: newFileName,
        // Body is the file itself (the file contents) and we use fs which is a Node.js library to read the file from the file system
        Body: fs.readFileSync(file.path),
        // ACL is the access control policy of the file (public-read means anyone can read the file)
        ACL: "public-read",
        // mime is used to the type of the file based on its extension
        ContentType: mime.lookup(file.path),
      })
    );
    const link = "https://${bucketName}.s3.amazonaws.com/${newFileName}";
    links.push(link);
  }

  // Create an instance of S3Client to upload the files to S3
  // Upload the files to S3

  return res.json({ links });
}

export const config = {
  // Disable body parsing, we want to consume the raw body payload
  api: { bodyParser: false },
};
