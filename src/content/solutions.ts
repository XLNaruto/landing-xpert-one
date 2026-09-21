import { CalendarCheck, MessagesSquare, Wallet } from "lucide-react"
import type { Solution } from "@/types"

/**
 * The three modules the product is sold as. Each maps to a real area of the
 * app — keep the capability lists to what actually ships.
 */
export const solutions: Solution[] = [
  {
    id: "payroll",
    icon: Wallet,
    name: "XpertOne Payroll",
    tagline: "From attendance logs to bank payout in seconds",
    description:
      "Your salary register reads monthly attendance logs and calculates exact payouts along with PF, ESIC, PT and LWF compliance deductions in a single click.",
    capabilities: [
      "1-click salary runs synced with attendance and leaves",
      "Automatic PF, ESIC, PT and tax calculations",
      "Instant payslip sharing via WhatsApp and email",
      "Loans, salary advances and arrear tracking",
      "Flexible wage structures and custom allowances",
      "Multi-company support with self-service staff apps",
    ],
    cta: "Watch a salary run",
  },
  {
    id: "attendance",
    icon: CalendarCheck,
    name: "XpertOne Attendance",
    tagline: "Punches you can trust, straight from a phone",
    description:
      "Staff mark attendance using face recognition directly on their phones. Every punch captures verified location and device details to eliminate biometric hardware costs and proxy markups.",
    capabilities: [
      "Face-recognition check-ins with zero hardware",
      "Geo-fencing limits punches to approved work locations",
      "Automatic shift rosters and overtime tracking",
      "Real-time status for present, absent and late staff",
      "Monthly calendar with full daily check-in history",
      "Instant sync with payroll calculations",
    ],
    cta: "See a punch in full detail",
  },
  {
    id: "xperttalk",
    icon: MessagesSquare,
    name: "XpertTalk",
    tagline: "Secure internal chat built for teams",
    description:
      "Keep work conversations safe and organised in one place. Staff communicate in real time on a private platform, replacing personal messaging apps and keeping company data secure.",
    capabilities: [
      "Direct messaging for private one-on-one chats",
      "Group channels for teams and departments",
      "Secure file, photo and document sharing",
      "Enterprise data encryption for complete security",
      "Pinned messages to highlight key announcements",
      "Instant search to find past chats and files",
    ],
    cta: "Take a look inside XpertTalk",
  },
]
