/*
  Warnings:

  - The values [UZDT] on the enum `CurrencyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CurrencyType_new" AS ENUM ('KZT', 'RUB', 'USD', 'UZS', 'EUR');
ALTER TABLE "Wallet" ALTER COLUMN "currency" TYPE "CurrencyType_new" USING ("currency"::text::"CurrencyType_new");
ALTER TYPE "CurrencyType" RENAME TO "CurrencyType_old";
ALTER TYPE "CurrencyType_new" RENAME TO "CurrencyType";
DROP TYPE "public"."CurrencyType_old";
COMMIT;
