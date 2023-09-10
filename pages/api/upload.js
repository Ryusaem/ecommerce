// multiparty is a library that helps your server understand and handle requests that include files, like when a user wants to upload a photo on a website. We will use be used in cooperation with S3 to upload the files to S3.
// when a user submits a form that includes file uploads, the data is sent as multipart/form-data. Parsing such data is non-trivial due to its format, which allows for both textual fields and files. multiparty provides a way to effortlessly extract these details from the request. In your code, after parsing, you get two objects: fields (which contains the text inputs from the form) and files (which contains details and paths to the uploaded files).
import multiparty from "multiparty";

// s3 is used to upload the files to S3. S3 is a service provided by AWS to store files in the cloud.
// PutObjectCommand is a class that represents the command to upload a file to S3.
// S3Client is a class that represents the client that will send the command to S3.
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// fs is a Node.js library to read and write files. We will use it to read the files from the file system.
import fs from "fs";

// mime-types is a library to get the MIME type of a file based on its extension. We will use it to get the MIME type of the file that we want to upload to S3. For example, if the file is a JPEG image, the MIME type will be image/jpeg.
import mime from "mime-types";

// mongooseConnect is a function that connects to the database.
import { mongooseConnect } from "@/lib/mongoose";

// isAdminRequest check if the user is an admin.
import { isAdminRequest } from "./auth/[...nextauth]";

// -------------------------------------------
// GOAL: Create an API route that uploads files to S3.
// An API route is a special type of Next.js page, that is used for handling requests from the client. It is not a page that is rendered by Next.js. It is a page that is used for handling requests from the client.
// -------------------------------------------

// -------------------------------------------
// Algorithm:
// 0. The user sends a request to the API route (pages/api/upload.js). For example, the user wants to upload a photo.
// 1. Connect to the database (using mongooseConnect).
// 2. Check if the user is an admin. (using isAdminRequest)
// 3. Parse the multipart/form-data request (using multiparty). It mean that we will unpack the request and get the files and the form fields.
// 4. Upload the files to S3 (using s3).
// 5. Return the links of the uploaded files ((using res.json())
// -------------------------------------------

// -------------------------------------------

// bucketName is the name of the S3 bucket. A bucket is a container for objects stored in S3.
// S3 is a service provided by AWS to store files in the cloud.
const bucketName = "ryusaem-next-ecommerce";

// The function "handle" is an asynchronous function that's designed to handle an HTTP request and produce a response.
export default async function handle(req, res) {
  // ---- Connecting to Database ----
  await mongooseConnect();

  // ---- Authorization Check ----
  await isAdminRequest(req, res);

  // ---- Form Parsing ----
  // What is multiparty? multiparty is a node module used for reading form data, especially the kind that includes files (like multipart/form-data often seen in file uploads).
  // The line const form = new multiparty.Form(); creates a new instance of a form parser.
  const form = new multiparty.Form();

  // ---- Extract Fields and Files from Form ----
  // The parser reads the incoming request and extracts fields (which are textual form fields) and files (which are uploaded files).
  const { fields, files } = await new Promise((resolve, reject) => {
    // Parse the multipart/form-data request
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  // ---- S3 Client Initialization ----
  // Amazon S3 is a service that allows you to store files. The code initializes a client to communicate with an S3 bucket. The credentials for S3 (access key ID and secret access key) are read from environment variables.
  const client = new S3Client({
    region: "eu-north-1",
    // credentials are read from the environment variables
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  // ---- Processing Each File ----
  // steps:
  // 1. Determines the file extension (e.g., .jpg or .png) (using split() and pop()
  // 2. Renames the file with a timestamp for uniqueness (using Date.now()
  // 3. Reads the file from the file system (using fs.readFileSync)
  // 4. Uploads the file to the S3 bucket (using PutObjectCommand)
  // 5. Stores the link to the uploaded file in an array. (using push())
  // 6. links is an array containing the links of the uploaded files (using res.json())

  // links is an array containing the links of the uploaded files
  const links = [];

  // loop through the uploaded files
  // files is an array of files. We get it from the "form parser".
  for (const file of files.files) {
    // ext is the file extension (jpg, png, etc.)
    // split() will give us an array of strings. For example, "photo.jpg" will be split into ["photo", "jpg"] and pop() will give us the last element of the array, which is the extension.
    const ext = file.originalFilename.split(".").pop();

    // newFileName is the name of the file with the extension and a timestamp is appended to it
    // Example: "photo.jpg" will become "photo.1621234567890.jpg"
    const newFileName = `${Date.now()}.${ext}`;

    // Create an instance of PutObjectCommand to upload the file to S3
    // PutObjectCommand is a class that represents the command to upload a file to S3.
    await client.send(
      new PutObjectCommand({
        // Bucket is the name of the S3 bucket
        Bucket: bucketName,

        // Key is the name of the file. For example, "photo.1621234567890.jpg"
        Key: newFileName,

        // Read the file from the file system
        // Body is the file itself (the file contents) and we use fs which is a Node.js library to read the file from the file system
        Body: fs.readFileSync(file.path),

        // ACL is the "access control policy" of the file (public-read means anyone can read the file)
        ACL: "public-read",

        // ContentType is the MIME (==extention) type of the file. For example, if the file is a JPEG image, the MIME type will be image/jpeg. We use mime-types library to get the MIME type of the file based on its extension.
        ContentType: mime.lookup(file.path),
      })
    );

    // link is the link of the uploaded file. For example, "https://ryusaem-next-ecommerce.s3.amazonaws.com/photo.1621234567890.jpg" is the link of the file "photo.1621234567890.jpg" in the bucket "ryusaem-next-ecommerce"
    const link = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;

    // Add the link to the array of links
    links.push(link);
  }

  // Return the links of the uploaded files
  return res.json({ links });
}

// const config is an object that contains the configuration of the API route. We use it to disable body parsing, because we want to consume the raw body payload.
export const config = {
  // Disable body parsing, we want to consume the raw body payload
  api: { bodyParser: false },
};
