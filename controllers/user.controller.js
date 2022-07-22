const { compare } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { prisma } = require("../config");
const { error } = require("../utils");

const { user } = prisma;
class UserController {
    /**
     *
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import("express").NextFunction} next
     * @returns
     */
    login = async (req, res, next) => {
        if (!req.body.username) {
            error("username", "username can't be empty", next);
        }
        if (!req.body.password) {
            error("password", "password can't be empty", next);
        }
        const { username, password } = req.body;
        console.log(await user.findMany());
        const queryResult = await user.findUnique({
            where: { username },
            select: {
                password: true,
                id: true,
            },
        });
        let key = "username";
        if (!queryResult) {
            return error(key, "account doesn't exist", next);
        }
        if (queryResult.deleted_status) {
            return error(key, "account has been deleted", next);
        }
        const correctPassword = await compare(password, queryResult.password);
        if (!correctPassword) {
            return error("password", "Wrong password", next);
        }
        const accessToken = sign(
            {
                id: queryResult.id,
            },
            process.env.ACCESS_KEY,
            { expiresIn: "10h" }
        );
        return res.json({
            accessToken,
            id: queryResult.id,
        });
    };
}
module.exports = new UserController();
