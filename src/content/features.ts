import {
  ArrowRightLeft,
  Building2,
  MessagesSquare,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react"
import type { Feature, Stat, Step } from "@/types"

/** What holds the three modules together — the reason they work as one system. */
export const features: Feature[] = [
  {
    icon: Wallet,
    title: "Payroll without the rework",
    description:
      "Automate salary calculations using attendance, leave, overtime and other payroll inputs, reducing manual work every month.",
  },
  {
    icon: Smartphone,
    title: "Attendance from anywhere",
    description:
      "Employees can mark attendance from their mobile, check their working hours and view their attendance history in one place.",
  },
  {
    icon: MessagesSquare,
    title: "Communication that stays connected",
    description:
      "Use XpertTalk for one-to-one and group conversations, file sharing and employee communication without relying on separate apps.",
  },
  {
    icon: ArrowRightLeft,
    title: "Accurate attendance to payroll",
    description:
      "Attendance data flows directly into payroll, helping reduce duplicate entry and differences between attendance records and salary calculations.",
  },
  {
    icon: Building2,
    title: "Manage multiple teams and branches",
    description:
      "Manage employees, attendance and payroll across different companies, branches and teams from a single system.",
  },
  {
    icon: ShieldCheck,
    title: "Better control for HR and admin",
    description:
      "Set roles and permissions, manage payroll rules and access reports and employee information based on each user's responsibility.",
  },
]

export const steps: Step[] = [
  {
    title: "Create employee profiles",
    description:
      "Add employee details, salary information, department, designation and other required records in one place.",
  },
  {
    title: "Track attendance",
    description:
      "Employees mark attendance through the mobile app, while supervisors can manage attendance, working hours and overtime.",
  },
  {
    title: "Process payroll",
    description:
      "Attendance, leave, overtime and salary details come together to simplify monthly payroll processing.",
  },
]

export const stats: Stat[] = [
  { value: "3", label: "modules, one employee record" },
  { value: "10", label: "steps to a complete personnel file" },
  { value: "4", label: "statutory acts handled — PF, ESIC, PT, LWF" },
  { value: "1", label: "salary run per month, not one per spreadsheet" },
]
