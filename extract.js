const fs = require("fs");
const jose = require("node-jose");

(async () => {
  try {
    const pubKey = fs.readFileSync("public.pem"); 
    const key = await jose.JWK.asKey(pubKey, "pem");
    const json = key.toJSON();
    console.log("n:", json.n);
    console.log("e:", json.e);
  } catch (err) {
    console.error("Error extracting JWK:", err);
  }
})();
