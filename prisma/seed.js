const { hash } = require("bcrypt");
const { prisma } = require("../config");
require("dotenv").config();

const addUser = async () => {
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
        return console.log(
            "please add admin username and password in the environment variables"
        );
    }
    await prisma.user.upsert({
        where: {
            username: process.env.ADMIN_USERNAME,
        },
        update: {
            username: process.env.ADMIN_USERNAME,
        },
        create: {
            password: await hash(process.env.ADMIN_PASSWORD, 10),
            username: process.env.ADMIN_USERNAME,
            isTommy: true,
        },
    });
};
addUser();
