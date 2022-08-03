const { default: axios } = require("axios");
const { prisma } = require("../config");
const { error } = require("../utils");

const { TELEGRAM_BOT_TOKEN: botToken, TELEGRAM_USER_ID: tgUserId } =
    process.env;
class ContactController {
    /**
     *
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import("express").NextFunction} next
     * @returns
     */
    sendTelegramMessage = async (req, res, next) => {
        if (!req.body.email) {
            return error("email", "email can't be empty", next);
        }
        if (!req.body.first_name) {
            return error("first_name", "First Name can't be empty", next);
        }
        if (!req.body.last_name) {
            return error("last_name", "Last Name can't be empty", next);
        }
        if (!req.body.message) {
            return error("message", "message can't be empty", next);
        }
        const { email, message, first_name, last_name } = req.body;
        try {
            await axios.post(
                `https://api.telegram.org/bot${botToken}/sendMessage`,
                {
                    text: `Hello Tommy, I am ${first_name} ${last_name}\n\n ${message} \n\n please contact me through my email ${email}`,
                    chat_id: tgUserId,
                }
            );
            return res.json({ success: true });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false });
        }
    };
}
module.exports = new ContactController();
