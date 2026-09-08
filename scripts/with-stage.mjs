/**
 * Runs a Next command with one stage's env file loaded — the equivalent of
 * Vite's `--mode` in app-xpert-one.
 *
 *   node scripts/with-stage.mjs development build
 *
 * Next picks its own env file from NODE_ENV, which is always `production`
 * during a build. That makes it impossible to build the development artefact
 * through `.env.development` alone, and Node's `--env-file` flag can't help
 * either: Next forwards node flags to its workers through NODE_OPTIONS, which
 * rejects it. So the file is parsed here and handed to the child directly —
 * @next/env leaves variables that are already in process.env alone, so these
 * win over whatever `.env.production` says.
 */
import { spawn } from "node:child_process"
import { readFileSync } from "node:fs"
import { parseEnv } from "node:util"

const STAGES = ["development", "production"]

const [stage, ...command] = process.argv.slice(2)

if (!STAGES.includes(stage)) {
  console.error(
    `with-stage: expected one of ${STAGES.join(" | ")}, got "${stage ?? ""}".`,
  )
  process.exit(1)
}

if (command.length === 0) {
  console.error("with-stage: no Next command given (build, dev, …).")
  process.exit(1)
}

const file = `.env.${stage}`

/* Optional: `.env.<stage>` is untracked, so CI builds run without one. The
   hosts live in SITE_URLS in src/lib/env.ts, and the stage is on the command
   line, so a build has everything it needs. The file only carries the values
   that can't be committed — the GA ID, the lead endpoint. */
let vars = {}
try {
  vars = parseEnv(readFileSync(file, "utf8"))
} catch {
  console.log(`with-stage: no ${file}, using ${stage} defaults.`)
}

/* The command decides the stage — never a stray value in the environment. */
vars.NEXT_PUBLIC_APP_STAGE = stage

/* Pinned to empty when this stage doesn't name a host, so that the .env
   file Next loads for itself (always .env.production, whatever the stage)
   can't substitute the wrong domain. Empty falls back to SITE_URLS[stage]. */
vars.NEXT_PUBLIC_SITE_URL ??= ""

const child = spawn("./node_modules/.bin/next", command, {
  stdio: "inherit",
  env: { ...process.env, ...vars },
})

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exit(code ?? 1)
})
