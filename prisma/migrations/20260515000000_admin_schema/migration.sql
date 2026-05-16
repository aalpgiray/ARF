-- Migration: admin_schema
-- Splits displayName → firstName/lastName, adds isActive to Member and Boat,
-- makes googleUserId nullable, removes syncedAt, adds updatedAt.
-- Column names match the camelCase convention used by the init migration.

-- ── Members ─────────────────────────────────────────────────────────────────

-- 1. Make googleUserId nullable (keep unique index, drop NOT NULL)
ALTER TABLE "members" ALTER COLUMN "googleUserId" DROP NOT NULL;

-- 2. Drop syncedAt (Google sync removed)
ALTER TABLE "members" DROP COLUMN "syncedAt";

-- 3. Add firstName and lastName as nullable for backfill
ALTER TABLE "members" ADD COLUMN "firstName" TEXT;
ALTER TABLE "members" ADD COLUMN "lastName"  TEXT;

-- 4. Backfill from displayName
UPDATE "members"
SET
  "firstName" = SPLIT_PART("displayName", ' ', 1),
  "lastName"  = CASE
    WHEN POSITION(' ' IN "displayName") > 0
    THEN TRIM(SUBSTRING("displayName" FROM POSITION(' ' IN "displayName") + 1))
    ELSE ''
  END;

-- 5. Drop displayName
ALTER TABLE "members" DROP COLUMN "displayName";

-- 6. Make firstName / lastName NOT NULL
ALTER TABLE "members" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "members" ALTER COLUMN "lastName"  SET NOT NULL;

-- 7. Add isActive and updatedAt
ALTER TABLE "members" ADD COLUMN "isActive"  BOOLEAN      NOT NULL DEFAULT true;
ALTER TABLE "members" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- ── Boats ────────────────────────────────────────────────────────────────────

ALTER TABLE "boats" ADD COLUMN "isActive"       BOOLEAN      NOT NULL DEFAULT true;
ALTER TABLE "boats" ADD COLUMN "retiredReason"  TEXT;
ALTER TABLE "boats" ADD COLUMN "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
