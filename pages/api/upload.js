// muliparty is a library to parse multipart/form-data requests
import multiparty from "multiparty";

export default async function handle(req, res) {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    console.log(fields.length);
    res.json("ok");
  });
}

export const config = {
  // Disable body parsing, we want to consume the raw body payload
  api: { bodyParser: false },
};
