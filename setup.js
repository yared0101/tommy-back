require("dotenv").config();
const { writeFileSync, existsSync, mkdirSync } = require("fs");
writeFileSync(
    "firebase_service_keys.json",
    JSON.stringify({
        type: process.env.FIREBASE_type,
        project_id: process.env.FIREBASE_project_id,
        private_key_id: process.env.FIREBASE_private_key_id,
        private_key: process.env.FIREBASE_private_key,
        client_email: process.env.FIREBASE_client_email,
        client_id: process.env.FIREBASE_client_id,
        auth_uri: process.env.FIREBASE_auth_uri,
        token_uri: process.env.FIREBASE_token_uri,
        auth_provider_x509_cert_url:
            process.env.FIREBASE_auth_provider_x509_cert_url,
        client_x509_cert_url: process.env.FIREBASE_client_x509_cert_url,
    })
);
if (!existsSync("tempFiles")) {
    mkdirSync("tempFiles");
}
