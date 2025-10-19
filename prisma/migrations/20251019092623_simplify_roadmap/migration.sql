/*
  Warnings:

  - You are about to drop the `milestone_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roadmap_milestones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_roadmaps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `category` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `creator_id` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty_level` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_duration` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `follower_count` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `is_template` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `roadmaps` table. All the data in the column will be lost.
  - Added the required column `phases` to the `roadmaps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `roadmaps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `roadmaps` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `roadmaps` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "milestone_progress_user_roadmap_id_milestone_id_key";

-- DropIndex
DROP INDEX "roadmap_milestones_roadmap_id_idx";

-- DropIndex
DROP INDEX "user_roadmaps_user_id_roadmap_id_key";

-- DropIndex
DROP INDEX "user_roadmaps_roadmap_id_idx";

-- DropIndex
DROP INDEX "user_roadmaps_user_id_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "milestone_progress";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "roadmap_milestones";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_roadmaps";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_roadmaps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "phases" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "roadmaps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_roadmaps" ("description", "id", "title") SELECT "description", "id", "title" FROM "roadmaps";
DROP TABLE "roadmaps";
ALTER TABLE "new_roadmaps" RENAME TO "roadmaps";
CREATE INDEX "roadmaps_userId_idx" ON "roadmaps"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
