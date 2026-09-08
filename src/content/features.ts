import {
  Building2,
  FileBarChart,
  Landmark,
  MessagesSquare,
  ShieldCheck,
  Smartphone,
} from "lucide-react"
import type { Feature, Stat, Step } from "@/types"

/** What holds the three modules together — the reason they work as one system. */
export const features: Feature[] = [
  {
    icon: Landmark,
    title: "Statutory rates, versioned",
    description:
      "PF, ESIC, PT and LWF each keep their own rate history and office addresses. A re-run of an old month prices at that month's rates, not today's.",
  },
  {
    icon: Building2,
    title: "Many companies, many branches",
    description:
      "Group entities sit side by side. Switch company and the whole workspace — employees, registers, reports — follows.",
  },
  {
    icon: ShieldCheck,
    title: "Roles, scope and IP control",
    description:
      "Permissions decide which screens exist for a user, scope decides which branches they see, and IP rules decide where they can sign in from.",
  },
  {
    icon: Smartphone,
    title: "A real mobile app for staff",
    description:
      "Employees register their face, punch in and out, and raise leave requests from their own phone. The portal stays the admin's tool.",
  },
  {
    icon: FileBarChart,
    title: "Returns-ready reports",
    description:
      "Salary, PF, ESIC and PT reports come out of the same figures you paid on, so filing is an export rather than a rebuild.",
  },
  {
    icon: MessagesSquare,
    title: "Chat and support built in",
    description:
      "Internal chat with monitoring for the compliance-minded, and a ticket queue so an employee's question reaches HR instead of a WhatsApp group.",
  },
]

export const steps: Step[] = [
  {
    title: "Set up the company",
    description:
      "Branches, departments, designations and your PF, ESIC, PT and LWF rates go in first — the numbers everything else is computed against.",
  },
  {
    title: "Bring your people across",
    description:
      "Send us the employee sheet you keep today. We import it, then your team fills the gaps in the guided ten-step record and enrols faces from the app.",
  },
  {
    title: "Run one month with us watching",
    description:
      "Your first attendance cycle and first salary run happen with our engineer alongside, reconciled against however you did it before.",
  },
]

export const stats: Stat[] = [
  { value: "3", label: "modules, one employee record" },
  { value: "10", label: "steps to a complete personnel file" },
  { value: "4", label: "statutory acts handled — PF, ESIC, PT, LWF" },
  { value: "1", label: "salary run per month, not one per spreadsheet" },
]
