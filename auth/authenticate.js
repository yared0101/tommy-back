const { verify } = require("jsonwebtoken");
const { env } = require("../config");
const { error } = require("../utils");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns
 */
const authenticate = async (req, res, next) => {
    if (!req.headers.authorization) {
        // error("accessToken", "access token was not sent", next, 401);
        return res.status(402).send({
            message: "access token was not sent",
            argument: "accessToken",
        });
    }
    const accessToken = req.headers.authorization.split(" ")[1];
    let payload;
    try {
        payload = verify(accessToken, env.ACCESS_KEY);
    } catch (e) {
        console.log("invalid token sent");
        // error("accessToken", "Invalid or Expired Access Token", next, 401);
        return res.status(402).send({
            message: "Invalid or Expired Access Token",
            argument: "accessToken",
        });
    }
    console.log("reached here");
    res.locals.id = payload.id;
    next();
};
module.exports = authenticate;
