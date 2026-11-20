import { site } from "@/content/site"
import type { ChatConfig } from "@/types"

/**
 * Fixed copy for the site assistant. Everything the bot *says* comes from
 * its server (lib/chat.ts); this is only the chrome around it, plus what to
 * fall back to when `/api/config` can't be reached.
 */
export const chatCopy = {
  placeholder: "How may I help you?",
  inputLabel: "Your question",
  newChat: "New chat",
  contactLink: "Contact our team",
  errors: {
    network: "Could not reach the assistant. Please check your connection and try again.",
    timeout: "The assistant is taking too long to answer. Please try again.",
    broken: "Sorry, something went wrong.",
  },
} as const

/** Used when `/api/config` fails: the chat still opens, CAPTCHA off. */
export const chatDefaultConfig: ChatConfig = {
  bot_name: `${site.name} Assistant`,
  welcome_message: `Hi! Ask me anything about ${site.name} HRM.`,
  contact_url: "",
  suggested_questions: [
    "Is there a free trial?",
    "How much does it cost?",
    "Does it handle PF and ESIC?",
  ],
  max_question_chars: 1000,
  start_ui: null,
  turnstile_sitekey: "",
}
