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

let vars
try {
  vars = parseEnv(readFileSync(file, "utf8"))
} catch {
  console.error(`with-stage: cannot read ${file}. Copy .env.sample to it.`)
  process.exit(1)
}

const child = spawn("./node_modules/.bin/next", command, {
  stdio: "inherit",
  env: { ...process.env, ...vars },
})

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exit(code ?? 1)
})
