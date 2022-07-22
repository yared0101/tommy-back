const { prisma } = require("../config");
const { error } = require("../utils");
const { UploadType } = require("@prisma/client");
const { uploadFiles, removeFiles } = require("../utils/files");
const { urls } = prisma;
class ImagesController {
    /**
     *
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import("express").NextFunction} next
     * @returns
     */
    addImages = async (req, res, next) => {
        const { type } = req.body;
        let { index } = req.body;
        index = Number(index);
        if (!type || !UploadType[type]) {
            return error(
                "type",
                `please send type as one of the following ${Object.keys(
                    UploadType
                )}`,
                next
            );
        }
        if (isNaN(index)) {
            return error("index", "please send index as integer", next);
        }
        const queryUrls = await urls.findFirst({
            where: {
                userId: res.locals.id,
                type,
            },
        });
        let urlLists = queryUrls?.urls || [];
        const postedUrls = await uploadFiles(req.files, type);
        const startIndex =
            index < 0 ? 0 : index > urlLists.length ? urlLists.length : index;
        urlLists.splice(startIndex, 0, ...postedUrls);
        await urls.upsert({
            where: {
                userId_type: {
                    userId: res.locals.id,
                    type,
                },
            },
            create: {
                userId: res.locals.id,
                type,
                urls: urlLists,
            },
            update: {
                urls: urlLists,
            },
        });
        return res.json({
            success: true,
            message: "images uploaded successfully",
        });
    };
    /**
     *
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import("express").NextFunction} next
     * @returns
     */
    removeImages = async (req, res, next) => {
        const { removedIndexes, type } = req.body;
        if (
            !removedIndexes ||
            !Array.isArray(removedIndexes) ||
            !removedIndexes.length
        ) {
            return error(
                "removedIndexes",
                "please send array full of numbers",
                next
            );
        }
        if (!type || !UploadType[type]) {
            return error(
                "type",
                `please send type as one of the following ${Object.keys(
                    UploadType
                )}`,
                next
            );
        }
        const queryUrls = await urls.findFirst({
            where: {
                userId: res.locals.id,
                type,
            },
        });
        let urlLists = queryUrls.urls;
        let removedFiles = [];
        for (let i in removedIndexes) {
            const url = urlLists[removedIndexes[i]];
            if (url) {
                removedFiles.push(url);
                delete urlLists[removedIndexes[i]];
            }
        }
        urlLists = urlLists.filter((url) => url);
        await removeFiles(removedFiles);
        await urls.update({
            where: {
                id: queryUrls.id,
            },
            data: {
                urls: urlLists,
            },
        });
        return res.json({
            success: true,
            message: "file(s) removed successfully",
        });
    };
    /**
     *
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import("express").NextFunction} next
     * @returns
     */
    changeIndexes = async (req, res, next) => {
        const { changedIndexes, type } = req.body;
        let { changeStartIndex } = req.body;
        changeStartIndex = Number(changeStartIndex);
        if (
            !changedIndexes ||
            !Array.isArray(changedIndexes) ||
            !changedIndexes.length
        ) {
            return error(
                "changedIndexes",
                "please send array full of numbers",
                next
            );
        }
        if (!type || !UploadType[type]) {
            return error(
                "type",
                `please send type as one of the following ${Object.keys(
                    UploadType
                )}`,
                next
            );
        }
        if (isNaN(changeStartIndex)) {
            return error(
                "changeStartIndex",
                `please send changeStartIndex as integer `,
                next
            );
        }
        const queryUrls = await urls.findUnique({
            where: {
                userId_type: {
                    userId: res.locals.id,
                    type,
                },
            },
        });
        if (!queryUrls) {
            return error("type", "no data found with this type", next);
        }
        let urlLists = queryUrls.urls;
        const startIndex =
            changeStartIndex < 0
                ? 0
                : changeStartIndex > urlLists.length
                ? urlLists.length
                : changeStartIndex;
        let changedUrls = [];
        for (let i in changedIndexes) {
            const url = urlLists[changedIndexes[i]];
            if (url) {
                changedUrls.push(url);
                delete urlLists[changedIndexes[i]];
            }
        }
        urlLists.splice(startIndex, 0, ...changedUrls);
        urlLists = urlLists.filter((url) => url);
        await urls.update({
            where: {
                id: queryUrls.id,
            },
            data: {
                urls: urlLists,
            },
        });
        return res.json({
            success: true,
            message: "file(s) changed successfully",
        });
    };
    /**
     *
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import("express").NextFunction} next
     * @returns
     */
    getImages = async (req, res, next) => {
        const { type, username } = req.query;
        if (!type || !UploadType[type]) {
            return error(
                "type",
                `please send type as one of the following ${Object.keys(
                    UploadType
                )}`,
                next
            );
        }
        const queryUrls = await urls.findFirst({
            where: {
                user: username ? { username } : { isTommy: true },
                type,
            },
        });
        res.json(queryUrls);
    };
}
module.exports = new ImagesController();
