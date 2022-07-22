const { hash } = require("bcrypt");
const { prisma } = require("../config");

const addUser = async () => {
    await prisma.user.upsert({
        where: {
            username: "tommydicktommy",
        },
        update: {
            username: "tommydicktommy",
        },
        create: {
            password: await hash("randomPassword", 10),
            username: "tommydicktommy",
            isTommy: true,
        },
    });
};
addUser();
