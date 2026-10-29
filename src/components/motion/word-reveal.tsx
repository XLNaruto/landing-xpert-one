"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { Fragment, useRef } from "react"

type WordRevealProps = {
  text: string
  className?: string
}

/**
 * A heading tied to the scroll a word at a time: as it scrolls in, each word
 * rises out of a blur in turn; as it scrolls out the top, the words blur and
 * drift up again in the same order. Scroll back and it plays in reverse. For
 * below-the-fold headings; the hero <h1> uses the CSS-only <RevealWords> so
 * its paint never waits on JavaScript.
 *
 * Words are separate inline-blocks with real spaces between them, so the
 * heading still wraps, balances and reads as one sentence to a screen reader.
 */
export function WordReveal({ text, className }: WordRevealProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const words = text.split(" ")

  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => (
        <Fragment key={index}>
          {reduceMotion ? (
            <span className="inline-block">{word}</span>
          ) : (
            <Word
              word={word}
              share={index / words.length}
              progress={scrollYProgress}
            />
          )}
          {index < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  )
}

function Word({
  word,
  share,
  progress,
}: {
  word: string
  /** 0 for the first word, approaching 1 for the last. */
  share: number
  progress: MotionValue<number>
}) {
  /* In: the words arrive across the first third of the pass. Out: they
     leave across the last quarter, first word first. */
  const inStart = 0.05 + share * 0.25
  const outStart = 0.72 + share * 0.15
  const keys = [inStart, inStart + 0.12, outStart, outStart + 0.1]

  const opacity = useTransform(progress, keys, [0, 1, 1, 0.15])
  const y = useTransform(progress, keys, ["0.45em", "0em", "0em", "-0.3em"])
  const filter = useTransform(progress, keys, [
    "blur(8px)",
    "blur(0px)",
    "blur(0px)",
    "blur(6px)",
  ])

  return (
    <motion.span className="inline-block" style={{ opacity, y, filter }}>
      {word}
    </motion.span>
  )
}
