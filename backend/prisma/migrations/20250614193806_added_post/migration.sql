-- CreateTable
CREATE TABLE "Post" (
    "postId" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "Like" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("postId")
);

-- CreateTable
CREATE TABLE "Caption" (
    "captionId" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Caption_pkey" PRIMARY KEY ("captionId")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_postId_fkey" FOREIGN KEY ("postId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caption" ADD CONSTRAINT "Caption_captionId_fkey" FOREIGN KEY ("captionId") REFERENCES "Post"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;
