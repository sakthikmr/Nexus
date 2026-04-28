
import { Resource, ProcurementRequirement, VendorBid, Contract, Invoice, Ticket } from '../types';

export const MOCK_RESOURCES: Resource[] = [
  { id: "RES-001", name: "Alex Rivera", role: "Senior Java Developer", status: "Deployed", customer: "Coherent Retail", billingStatus: "Active", billingRate: "95", skills: ["Java", "Spring Boot", "AWS"], source: "Internal", deploymentDate: "2024-01-15", joiningDate: "2023-06-10", recruiterId: "REC-01", location: "New York" },
  { id: "RES-002", name: "Sarah Chen", role: "UX/UI Lead", status: "Deployed", customer: "FinBank Global", billingStatus: "Active", billingRate: "110", skills: ["Figma", "React", "Design Systems"], source: "Vendor", deploymentDate: "2024-03-05", joiningDate: "2024-02-20", recruiterId: "REC-02", location: "San Francisco" },
  { id: "RES-003", name: "Marcus Thorne", role: "DevOps Architect", status: "Bench", billingStatus: "Inactive", billingRate: "125", skills: ["Terraform", "Kubernetes", "Azure"], source: "Internal", joiningDate: "2024-04-01", recruiterId: "REC-01", location: "London" },
  { id: "RES-004", name: "Elena Gomez", role: "Product Manager", status: "Deployed", customer: "HealthTech Solutions", billingStatus: "Active", billingRate: "135", skills: ["Agile", "Roadmapping", "Jira"], source: "Internal", deploymentDate: "2023-11-20", joiningDate: "2023-09-15", recruiterId: "REC-03", location: "Madrid" },
  { id: "RES-005", name: "David Kim", role: "Security Engineer", status: "Exited", billingStatus: "Inactive", billingRate: "115", skills: ["PenTesting", "ISO27001", "Python"], source: "Vendor", joiningDate: "2023-05-10", recruiterId: "REC-02", location: "Seoul" }
];

export const MOCK_PROCUREMENT: ProcurementRequirement[] = [
  { id: "REQ-SOW-001", title: "Global SAP Migration Phase 2", type: "PROJECT_SOW", status: "Bidding Open", department: "IT Enterprise", budget: "$450,000", deadline: "2024-05-20", description: "Complete migration of legacy SAP instances to S/4HANA Cloud.", publishedDate: "2024-04-15", bidCount: 5, priority: "Critical" },
  { id: "REQ-AST-002", title: "Batch Purchase: 200 MacBook Pro M3", type: "ASSET_PROCUREMENT", status: "Evaluation", department: "Procurement", budget: "$400,000", deadline: "2024-04-25", description: "Standard developer hardware refresh for Q2 2024.", publishedDate: "2024-04-10", bidCount: 12, priority: "High" },
  { id: "REQ-SRV-003", title: "Facility AC Maintenance - Austin Hub", type: "SERVICE_CONTRACT", status: "Published", department: "Facilities", budget: "$25,000", deadline: "2024-05-01", description: "Annual maintenance and emergency support for HVAC systems.", publishedDate: "2024-04-20", bidCount: 3, priority: "Normal" },
  { id: "REQ-RFQ-004", title: "Digital Marketing Agency RFP", type: "RFQ_RFP", status: "Awarded", department: "Marketing", budget: "$120,000", deadline: "2024-03-15", description: "SEO, SEM and social media campaign management for EMEA.", publishedDate: "2024-02-10", bidCount: 8, priority: "High" }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: "INV-001", invoiceNumber: "GTS-2024-APR-01", vendorId: "V001", vendorName: "Global Talent Solutions", contractId: "CON-2024-001", amount: 125000, currency: "USD", status: "Paid", dueDate: "2024-05-15", billingPeriod: "April 2024", submissionDate: "2024-05-01", paymentDate: "2024-05-10" },
  { id: "INV-002", invoiceNumber: "THV-2024-MAR-88", vendorId: "V002", vendorName: "TalentHive Inc", contractId: "CON-2024-002", amount: 45000, currency: "USD", status: "Under Review", dueDate: "2024-05-20", billingPeriod: "March 2024", submissionDate: "2024-04-20" },
  { id: "INV-003", invoiceNumber: "QC-DISP-004", vendorId: "V004", vendorName: "Quantum Cloud", contractId: "CON-2024-003", amount: 12000, currency: "USD", status: "Disputed", dueDate: "2024-05-10", billingPeriod: "April 2024", submissionDate: "2024-04-25", disputeNote: "Hours mismatch for Candidate C105" },
  { id: "INV-004", invoiceNumber: "GTS-2024-APR-02", vendorId: "V001", vendorName: "Global Talent Solutions", contractId: "CON-2024-001", amount: 98000, currency: "USD", status: "Overdue", dueDate: "2024-04-20", billingPeriod: "March 2024", submissionDate: "2024-04-05" }
];

export const MOCK_TICKETS: Ticket[] = [
  { id: "TICK-001", vendorId: "V001", vendorName: "Global Talent Solutions", category: "Invoice Issue", subject: "Payment delay for INV-004", description: "Our invoice INV-004 is showing as overdue for more than 10 days.", priority: "High", status: "In Progress", createdAt: "2024-04-25T10:00:00Z", updatedAt: "2024-04-26T14:30:00Z", assignedTo: "Marcus Chen", slaBreached: true, isEscalated: true },
  { id: "TICK-002", vendorId: "V002", vendorName: "TalentHive Inc", category: "Requirement Clarification", subject: "Skills clarification for RQ-2024-901", description: "Is AWS certification mandatory for the Lead Cloud Architect role?", priority: "Medium", status: "Awaiting Vendor", createdAt: "2024-04-27T09:15:00Z", updatedAt: "2024-04-28T11:00:00Z", assignedTo: "Sarah Miller", slaBreached: false, isEscalated: false },
  { id: "TICK-003", vendorId: "V004", vendorName: "Quantum Cloud", category: "Access/Login Issue", subject: "Portal login failing for new admin", description: "Newly added user cannot log into the vendor portal.", priority: "Critical", status: "Open", createdAt: "2024-04-28T08:30:00Z", updatedAt: "2024-04-28T08:30:00Z", slaBreached: false, isEscalated: false }
];

export const MOCK_ANALYTICS = {
  recruitment: [
    { month: 'May', candidates: 45, hires: 12, budget: 45000 },
    { month: 'Jun', candidates: 52, hires: 15, budget: 48000 },
    { month: 'Jul', candidates: 48, hires: 10, budget: 42000 },
    { month: 'Aug', candidates: 61, hires: 18, budget: 55000 },
    { month: 'Sep', candidates: 55, hires: 14, budget: 50000 },
    { month: 'Oct', candidates: 67, hires: 22, budget: 62000 },
    { month: 'Nov', candidates: 72, hires: 25, budget: 68000 },
    { month: 'Dec', candidates: 58, hires: 20, budget: 58000 },
    { month: 'Jan', candidates: 65, hires: 19, budget: 60000 },
    { month: 'Feb', candidates: 78, hires: 28, budget: 75000 },
    { month: 'Mar', candidates: 85, hires: 32, budget: 82000 },
    { month: 'Apr', candidates: 92, hires: 35, budget: 90000 },
  ],
  vendorsByCategory: [
    { name: 'IT Services', value: 45 },
    { name: 'Contract Staffing', value: 30 },
    { name: 'Hardware', value: 15 },
    { name: 'Facilities', value: 10 }
  ],
  funnelDropOff: [
    { stage: 'Sourcing', count: 1200 },
    { stage: 'Screening', count: 800 },
    { stage: 'Interview', count: 450 },
    { stage: 'Technical', count: 180 },
    { stage: 'Offer', count: 95 },
    { stage: 'Hired', count: 88 }
  ]
};
