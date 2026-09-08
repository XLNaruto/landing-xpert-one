import type { Faq } from "@/types"

export const faqs: Faq[] = [
  {
    question: "How does face-recognition attendance work?",
    answer:
      "An employee enrols their face once in the mobile app. After that, checking in and out captures a photo, the location and the device against the punch — so the register carries evidence, not just a timestamp. No biometric hardware to buy or maintain.",
  },
  {
    question: "Do we need the attendance module to run payroll?",
    answer:
      "Payroll reads attendance to work out payable days, so the two are designed to run together. If you already collect attendance elsewhere, the salary register accepts an import instead.",
  },
  {
    question: "Which statutory deductions are handled?",
    answer:
      "PF, ESIC, PT and LWF. Each keeps its own rate history, so a run — or a re-run of a month from last year — is priced at the rates that were in force for that period, with matching PF, ESIC and PT reports for filing.",
  },
  {
    question: "Can we pay staff in different ways?",
    answer:
      "Yes. A run can be settled by cash, cheque, NEFT, RTGS, UPI, online transfer or another mode, tracked per batch. For NEFT, RTGS and IMPS the system generates the bank's bulk-transfer sheet for you to upload.",
  },
  {
    question: "We have several companies and branches. Is that extra?",
    answer:
      "Multiple companies and branches are part of the product, not an add-on. Each user's scope decides which of them they can see, and switching company switches the entire workspace.",
  },
  {
    question: "How long does it take to go live?",
    answer:
      "Most teams are running within two to three weeks: company and statutory setup first, then employee import and face enrolment, then a first attendance cycle and salary run with our engineer alongside.",
  },
  {
    question: "Who can see what?",
    answer:
      "Roles decide which screens exist for a user, branch scope decides whose records they reach, approval chains decide who signs off leave, and IP rules can restrict where sign-in is allowed from at all.",
  },
  {
    question: "What happens to our data if we leave?",
    answer:
      "It stays yours. Every register and report exports to Excel, and we will provide a full database export on request when a subscription ends. No exit fee.",
  },
]
