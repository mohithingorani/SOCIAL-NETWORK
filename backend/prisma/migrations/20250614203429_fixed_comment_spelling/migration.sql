/*
  Warnings:

  - You are about to drop the `Caption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Caption" DROP CONSTRAINT "Caption_captionId_fkey";

-- DropTable
DROP TABLE "Caption";

-- CreateTable
CREATE TABLE "Comment" (
    "commentId" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("commentId")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Post"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;
