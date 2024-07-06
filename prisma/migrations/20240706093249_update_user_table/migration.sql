-- AlterTable
ALTER TABLE `Users` ADD COLUMN `dailyBoostersExp` DATETIME(3) NULL,
    ADD COLUMN `dailyFreeBoosters` INTEGER NOT NULL DEFAULT 6;
