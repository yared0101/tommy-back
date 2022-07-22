-- CreateEnum
CREATE TYPE "UploadType" AS ENUM ('STATIC', 'WIREFRAME', 'MOTION_DESIGN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isTommy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "urls" (
    "id" SERIAL NOT NULL,
    "type" "UploadType" NOT NULL,
    "urls" TEXT[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "generatedPassword" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "urls_userId_type_key" ON "urls"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Password_generatedPassword_key" ON "Password"("generatedPassword");

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
