export const site = {
  name: "XpertOne",
  company: "XpertLab Technologies",
  tagline: "Employees, Attendance and Payroll in one system",
  /** The long form — hero sub-headline and footer blurb. */
  description:
    "XpertOne is one place for your people: the full employee record, face-recognition attendance from a phone, and a salary run that already knows PF, ESIC, PT and LWF.",
  /**
   * The <meta name="description"> variant. Kept under 160 characters so search
   * engines show it whole instead of truncating mid-sentence, and led with the
   * terms people actually search for.
   */
  seoDescription:
    "HR software for Indian teams: employee records, face-recognition attendance from a phone, and payroll that already knows PF, ESIC, PT and LWF.",
  url: "https://xpertone.xpertlab.com",
  /** The agency that builds it — credited in the footer. */
  companyUrl: "https://www.xpertlab.com",
  email: "hello@xpertlab.com",
  phone: "+91 90000 00000",
  address: "Junagadh, Gujarat, India",
  /** The same address, split for schema.org's PostalAddress. */
  location: {
    city: "Junagadh",
    region: "Gujarat",
    country: "India",
    countryCode: "IN",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/xpertlab",
    twitter: "https://twitter.com/xpertlab",
    github: "https://github.com/xpertlab",
  },
} as const
