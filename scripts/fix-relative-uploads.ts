/**
 * fix-relative-uploads.ts
 *
 * One-shot migration: rewrites every "/uploads/<filename>" stored as a
 * relative path in the CMS database to the absolute backend URL, so that
 * the public site (https://ddip.ai) can render uploaded media.
 *
 * Why this script exists
 * ──────────────────────
 * Until 2026-04-28, `POST /api/admin/upload` returned `url: "/uploads/X.jpg"`
 * (relative). Those values were saved into multiple model columns. Public
 * pages render `<img src={record.imageUrl}>` which resolves the relative
 * path against the page's domain (https://ddip.ai), and Vercel does NOT
 * serve `/uploads/...` — so every legacy upload 404s on the live site.
 *
 * The upload controller was patched to return absolute URLs going forward,
 * but pre-existing rows still hold the relative form. This script
 * back-fills them.
 *
 * Caveats
 * ───────
 * • Railway containers have an EPHEMERAL filesystem. Files written to
 *   `<repo>/uploads` disappear on every redeploy. Some legacy filenames
 *   may already be gone — prefixing the URL won't bring them back, but it
 *   at least normalizes the database so any surviving file renders.
 * • A persistent storage provider (Cloudflare R2 / S3 / Railway Volume)
 *   is still required before the site is "production-ready" for media.
 *   This script is a one-time band-aid, NOT a solution to ephemerality.
 *
 * Usage
 * ─────
 *   # Preview which rows would change (no writes):
 *   DATABASE_URL=... npx ts-node scripts/fix-relative-uploads.ts --dry-run
 *
 *   # Preview AND HEAD-check each URL on the backend to flag missing files:
 *   DATABASE_URL=... npx ts-node scripts/fix-relative-uploads.ts --dry-run --check
 *
 *   # Apply (writes to DB):
 *   DATABASE_URL=... npx ts-node scripts/fix-relative-uploads.ts --apply
 *
 *   # Apply + clear values whose file no longer exists on the backend
 *   # (clean slate so the admin shows an empty upload field):
 *   DATABASE_URL=... npx ts-node scripts/fix-relative-uploads.ts --apply --check --null-missing
 *
 *   # Override backend URL (default: https://backend-api-production-a9fc.up.railway.app):
 *   BACKEND_PUBLIC_URL=https://my-backend.example.com \
 *     DATABASE_URL=... npx ts-node scripts/fix-relative-uploads.ts --apply
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_BACKEND_URL = "https://backend-api-production-a9fc.up.railway.app";
const BACKEND_URL = (
  process.env.BACKEND_PUBLIC_URL ||
  process.env.PUBLIC_URL ||
  DEFAULT_BACKEND_URL
).replace(/\/$/, "");

const args = new Set(process.argv.slice(2));
const APPLY = args.has("--apply");
const DRY_RUN = args.has("--dry-run") || !APPLY;
const HEAD_CHECK = args.has("--check") || args.has("--null-missing");
/** When true, rows whose file 404s are NULLed instead of being prefixed.
 * Forces --check on, since we need to know which files are missing. */
const NULL_MISSING = args.has("--null-missing");

interface FieldSpec {
  /** Friendly model name for logging */
  model: string;
  /** Column to rewrite */
  column: string;
  /** Async list/update wrapper around the corresponding Prisma model */
  list: () => Promise<Array<{ id: string; value: string | null }>>;
  /** Updater for a single row. Pass `null` to clear the field (only valid for
   * nullable columns — see `nullable` flag). */
  update: (id: string, value: string | null) => Promise<unknown>;
  /** Whether the schema allows null on this column. If false, --null-missing
   * cannot clear it; the script will skip with a warning. */
  nullable: boolean;
}

/** Each entry maps directly to a Prisma model.column found in schema.prisma */
const FIELDS: FieldSpec[] = [
  {
    model: "HeroSlider",
    column: "videoUrl",
    nullable: true,
    list: async () =>
      (await prisma.heroSlider.findMany({ select: { id: true, videoUrl: true } })).map(
        (r) => ({ id: r.id, value: r.videoUrl ?? null })
      ),
    update: (id, value) => prisma.heroSlider.update({ where: { id }, data: { videoUrl: value } }),
  },
  {
    model: "Work",
    column: "mediaUrl",
    nullable: true,
    list: async () =>
      (await prisma.work.findMany({ select: { id: true, mediaUrl: true } })).map(
        (r) => ({ id: r.id, value: r.mediaUrl ?? null })
      ),
    update: (id, value) => prisma.work.update({ where: { id }, data: { mediaUrl: value } }),
  },
  {
    model: "AiSolution",
    column: "mediaUrl",
    nullable: true,
    list: async () =>
      (await prisma.aiSolution.findMany({ select: { id: true, mediaUrl: true } })).map(
        (r) => ({ id: r.id, value: r.mediaUrl ?? null })
      ),
    update: (id, value) => prisma.aiSolution.update({ where: { id }, data: { mediaUrl: value } }),
  },
  {
    model: "Influencer",
    column: "imageUrl",
    nullable: true,
    list: async () =>
      (await prisma.influencer.findMany({ select: { id: true, imageUrl: true } })).map(
        (r) => ({ id: r.id, value: r.imageUrl ?? null })
      ),
    update: (id, value) => prisma.influencer.update({ where: { id }, data: { imageUrl: value } }),
  },
  {
    model: "Influencer",
    column: "videoUrl",
    nullable: true,
    list: async () =>
      (await prisma.influencer.findMany({ select: { id: true, videoUrl: true } })).map(
        (r) => ({ id: r.id, value: r.videoUrl ?? null })
      ),
    update: (id, value) => prisma.influencer.update({ where: { id }, data: { videoUrl: value } }),
  },
  {
    model: "AutomationIcon",
    column: "iconUrl",
    // iconUrl is `String` (not `String?`) — null clears not allowed.
    nullable: false,
    list: async () =>
      (await prisma.automationIcon.findMany({ select: { id: true, iconUrl: true } })).map(
        (r) => ({ id: r.id, value: r.iconUrl ?? null })
      ),
    update: (id, value) => {
      if (value === null) {
        throw new Error("AutomationIcon.iconUrl is non-nullable; cannot clear");
      }
      return prisma.automationIcon.update({ where: { id }, data: { iconUrl: value } });
    },
  },
  {
    model: "UseCase",
    column: "mediaUrl",
    nullable: true,
    list: async () =>
      (await prisma.useCase.findMany({ select: { id: true, mediaUrl: true } })).map(
        (r) => ({ id: r.id, value: r.mediaUrl ?? null })
      ),
    update: (id, value) => prisma.useCase.update({ where: { id }, data: { mediaUrl: value } }),
  },
  {
    model: "Insight",
    column: "imageUrl",
    nullable: true,
    list: async () =>
      (await prisma.insight.findMany({ select: { id: true, imageUrl: true } })).map(
        (r) => ({ id: r.id, value: r.imageUrl ?? null })
      ),
    update: (id, value) => prisma.insight.update({ where: { id }, data: { imageUrl: value } }),
  },
  {
    model: "Insight",
    column: "seoOgImage",
    nullable: true,
    list: async () =>
      (await prisma.insight.findMany({ select: { id: true, seoOgImage: true } })).map(
        (r) => ({ id: r.id, value: r.seoOgImage ?? null })
      ),
    update: (id, value) => prisma.insight.update({ where: { id }, data: { seoOgImage: value } }),
  },
  {
    model: "ProjectSubmission",
    column: "briefFile",
    nullable: true,
    list: async () =>
      (await prisma.projectSubmission.findMany({ select: { id: true, briefFile: true } })).map(
        (r) => ({ id: r.id, value: r.briefFile ?? null })
      ),
    update: (id, value) => prisma.projectSubmission.update({ where: { id }, data: { briefFile: value } }),
  },
];

/** True if this string looks like a path that needs absolute prefixing. */
function isRelativeUploadPath(value: string | null | undefined): value is string {
  if (!value) return false;
  // Skip absolute URLs and protocol-relative URLs
  if (/^https?:\/\//i.test(value)) return false;
  if (value.startsWith("//")) return false;
  // Cloudflare Stream IDs are bare hex — leave them alone
  if (/^[a-f0-9]{32}$/i.test(value)) return false;
  // Anything starting with /uploads/ qualifies
  return value.startsWith("/uploads/");
}

async function headCheck(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

interface Outcome {
  id: string;
  oldValue: string;
  newValue: string;
  fileExists?: boolean;
  status?: number;
}

async function main() {
  console.log("─".repeat(60));
  console.log("fix-relative-uploads");
  console.log("─".repeat(60));
  console.log(`Backend URL : ${BACKEND_URL}`);
  console.log(`Mode        : ${APPLY ? "APPLY (writes to DB)" : "DRY RUN (no writes)"}`);
  console.log(`HEAD check  : ${HEAD_CHECK ? "yes" : "no"}`);
  console.log("─".repeat(60));

  let totalRowsScanned = 0;
  let totalRowsToFix = 0;
  let totalRowsPrefixed = 0;
  let totalRowsCleared = 0;
  let totalMissingFiles = 0;

  for (const field of FIELDS) {
    const fieldLabel = `${field.model}.${field.column}`;
    let rows: Array<{ id: string; value: string | null }>;
    try {
      rows = await field.list();
    } catch (err) {
      console.error(`[${fieldLabel}] failed to list rows:`, err);
      continue;
    }
    totalRowsScanned += rows.length;
    const targets = rows.filter((r) => isRelativeUploadPath(r.value));
    if (targets.length === 0) {
      console.log(`[${fieldLabel}] ${rows.length} rows — none need fixing`);
      continue;
    }
    console.log(`[${fieldLabel}] ${rows.length} rows — ${targets.length} need fixing`);

    for (const row of targets) {
      const oldValue = row.value as string;
      const prefixedValue = `${BACKEND_URL}${oldValue}`;
      const outcome: Outcome = { id: row.id, oldValue, newValue: prefixedValue };

      if (HEAD_CHECK) {
        const check = await headCheck(prefixedValue);
        outcome.fileExists = check.ok;
        outcome.status = check.status;
        if (!check.ok) totalMissingFiles++;
      }

      // Decide what value to write
      let writeValue: string | null = prefixedValue;
      let writeAction: "prefix" | "clear" | "skip" = "prefix";
      if (NULL_MISSING && outcome.fileExists === false) {
        if (field.nullable) {
          writeValue = null;
          writeAction = "clear";
        } else {
          writeAction = "skip";
        }
      }
      outcome.newValue = writeAction === "clear" ? "<NULL>" : prefixedValue;

      totalRowsToFix++;

      const fileFlag =
        outcome.fileExists === true
          ? "✓ file exists"
          : outcome.fileExists === false
          ? `✗ HTTP ${outcome.status}`
          : "  ";
      const arrow =
        writeAction === "clear"
          ? "→ NULL (file missing, cleared so admin can re-upload)"
          : writeAction === "skip"
          ? "→ SKIP (non-nullable column, file missing)"
          : `→ ${prefixedValue}`;
      console.log(`  [${fileFlag}] ${row.id} : ${oldValue}`);
      console.log(`         ${arrow}`);

      if (APPLY && writeAction !== "skip") {
        try {
          await field.update(row.id, writeValue);
          if (writeAction === "clear") totalRowsCleared++;
          else totalRowsPrefixed++;
        } catch (err) {
          console.error(`    UPDATE FAILED for ${field.model}.${row.id}:`, err);
        }
      }
    }
  }

  console.log("─".repeat(60));
  console.log(`Rows scanned        : ${totalRowsScanned}`);
  console.log(`Rows needing fix    : ${totalRowsToFix}`);
  if (HEAD_CHECK) {
    console.log(`Missing files       : ${totalMissingFiles} of ${totalRowsToFix} (HEAD ≠ 200)`);
  }
  if (APPLY) {
    console.log(`Rows prefixed       : ${totalRowsPrefixed}`);
    if (NULL_MISSING) {
      console.log(`Rows cleared (null) : ${totalRowsCleared}`);
    }
    console.log("Done.");
  } else {
    console.log(
      "DRY RUN — no changes written. Re-run with --apply" +
        (NULL_MISSING ? " --null-missing" : "") +
        " to commit."
    );
  }
  console.log("─".repeat(60));
}

main()
  .catch((err) => {
    console.error("Migration crashed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
