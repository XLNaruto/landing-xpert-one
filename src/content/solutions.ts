import { CalendarCheck, UserRoundCog, Wallet } from "lucide-react"
import type { Solution } from "@/types"

/**
 * The three modules the product is sold as. Each maps to a real area of the
 * app — keep the capability lists to what actually ships.
 */
export const solutions: Solution[] = [
  {
    id: "employee-management",
    icon: UserRoundCog,
    name: "Employee Management",
    tagline: "One record per person, complete",
    description:
      "Onboarding walks through ten steps and ends with a person whose file is actually finished — not a name and a phone number you chase details for later.",
    capabilities: [
      "Basic, KYC and family details in one guided flow",
      "Wage structure with allowances and deductions",
      "Education, experience, documents and issued assets",
      "Service history: transfers, promotions, branch moves",
      "Shift, roster and leave allowance per employee",
      "Company, branch, department and designation masters",
    ],
    cta: "Walk the onboarding flow",
  },
  {
    id: "attendance-management",
    icon: CalendarCheck,
    name: "Attendance Management",
    tagline: "Punches you can trust, from a phone",
    description:
      "Staff mark attendance with their face in the mobile app. Every punch carries the captured image, the location and the device, so the register settles arguments instead of starting them.",
    capabilities: [
      "Face-recognition check-in and check-out, no hardware to buy",
      "Location and device recorded against every punch",
      "Department and designation cards with present, absent and rate",
      "Month calendar per employee, with each day's punches behind it",
      "Days resolved against leave, holidays and weekly offs",
      "Leave management, leave quota and approval chains",
    ],
    cta: "See a punch in full detail",
  },
  {
    id: "payroll-management",
    icon: Wallet,
    name: "Payroll Management",
    tagline: "Attendance in, payslips out",
    description:
      "The salary register reads the month's attendance, applies the statutory rates in force for that period, and hands you a run you can pay and file from.",
    capabilities: [
      "Salary register split into To Process and Processed",
      "PF, ESIC, PT and LWF applied at the rate in force that month",
      "Bulk wage updates before a run, arrears and adjustments during it",
      "Pay by cash, cheque, NEFT, RTGS, UPI or online — tracked per batch",
      "Bank bulk-transfer sheets for NEFT, RTGS and IMPS",
      "Salary, PF, ESIC and PT reports, plus bonus estimation",
    ],
    cta: "Watch a salary run",
  },
]
