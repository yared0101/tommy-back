const express = require("express");
const { json } = require("body-parser");
const path = require("path");
const cors = require("cors");
const { makeEnvExample } = require("./utils");
const routes = require("./routes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(json());

/**all routes are declared here */
app.use(routes);

/**
 * types of uploads(type)
 *   static
 *   wireframes
 *   and more
 * all routes based on type of upload
 * add to list (images, top or bottom or index, type)
 * remove from list(image index, type)
 * send to top(image index, type)
 * get all urls(type?, limit?,skip )
 * get url(image index, type)
 * login(username, password)//not for more than a day
 * authentication needed obviously
 *
 *
 * all this changes but for sandbox data(so remove this and add this wont affect the real images, it would just change up for)
 * this is cool but adding images will eat up server space and setting them as default for tommy will include weird things, but this is awesome I think!
 */

/**route where all static uploads are served */
app.use("uploads", express.static(path.join(__dirname, "uploads")));

/**error handling middleware(all errors go through here, when the router handlers call next with an error) */
app.use((err, _req, res, _next) => {
    let myError = JSON.parse(err.message);
    const status = myError.status;
    delete myError.status;
    res.status(status).send({ error: myError });
});

const port = 4000;
//create .env.example
if (process.env.NODE_ENV === "development") {
    makeEnvExample();
}
module.exports = app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
