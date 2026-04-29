-- Add `age` and `cardColor` columns to `influencers` table.
--
-- `age` (Int?) renders as part of the popup subtitle, replacing what was
-- accidentally being shown using `countryCode` (e.g. `Coach | 24`).
--
-- `cardColor` (String?) lets admins pick a card background color so each
-- influencer keeps a stable color across page loads. The frontend falls
-- back to a deterministic id-hash from a hardcoded palette when null.
--
-- Both columns are nullable; existing rows pick up NULL safely.

-- AlterTable
ALTER TABLE "influencers" ADD COLUMN     "age" INTEGER;
ALTER TABLE "influencers" ADD COLUMN     "cardColor" TEXT;
