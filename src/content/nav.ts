import type { NavLink } from "@/types"

export const navLinks: NavLink[] = [
  { label: "Solutions", href: "/#solutions" },
  { label: "Why one system", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
]

export const footerLinks: { title: string; links: NavLink[] }[] = [
  {
    title: "Solutions",
    links: [
      { label: "XpertOne Payroll", href: "/#payroll" },
      { label: "XpertOne Attendance", href: "/#attendance" },
      { label: "XpertTalk", href: "/#xperttalk" },
      { label: "Plans and pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About XpertLab", href: "https://www.xpertlab.com" },
      { label: "Contact", href: "/#cta" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy/" },
      { label: "Terms of service", href: "/terms/" },
    ],
  },
]
