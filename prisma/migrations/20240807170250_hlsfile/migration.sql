-- CreateTable
CREATE TABLE "hls_files" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "hls_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hls_files" ADD CONSTRAINT "hls_files_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
