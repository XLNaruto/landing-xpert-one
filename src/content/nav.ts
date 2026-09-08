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
      { label: "Employee Management", href: "/#employee-management" },
      { label: "Attendance Management", href: "/#attendance-management" },
      { label: "Payroll Management", href: "/#payroll-management" },
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
