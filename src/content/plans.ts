import type { Plan } from "@/types"

export const plans: Plan[] = [
  {
    id: "attendance",
    name: "Attendance",
    monthly: { price: "₹40", period: "employee / month" },
    /* Yearly billing charges ten months for twelve: ₹40 × 10. */
    annual: { price: "₹400", period: "employee / year" },
    description:
      "For a team that just needs punches it can trust and a clean monthly register.",
    features: [
      "Employee Management",
      "Attendance Management",
      "Face-recognition punches from the mobile app",
      "Leave, holidays and weekly-off policies",
      "Monthly attendance register and exports",
      "Email support",
    ],
    cta: "Start with Attendance",
  },
  {
    id: "complete",
    name: "Complete",
    monthly: { price: "₹70", period: "employee / month" },
    annual: { price: "₹700", period: "employee / year" },
    description:
      "All three modules — the whole cycle from onboarding to a paid salary run.",
    features: [
      "Everything in Attendance",
      "Payroll Management with the salary register",
      "PF, ESIC, PT and LWF with rate history",
      "Bank bulk-transfer sheets and payment batches",
      "Salary, PF, ESIC and PT reports; bonus estimation",
      "Roles, branch scope and approval chains",
      "Priority support with a named engineer",
    ],
    cta: "Start with Complete",
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: { price: "Let's talk", period: "annual contract" },
    annual: { price: "Let's talk", period: "annual contract" },
    description:
      "For groups running several companies with their own way of doing things.",
    features: [
      "Everything in Complete",
      "Unlimited companies and branches",
      "IP access control and custom approval hierarchies",
      "Custom reports and integrations",
      "On-premise or private cloud deployment",
      "Data migration handled by our team, SLA-backed support",
    ],
    cta: "Talk to sales",
  },
]
