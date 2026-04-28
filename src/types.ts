export interface Contract {
  id: string;
  vendorId: string;
  vendorName: string;
  customer: string;
  type: 'MSA' | 'SOW' | 'Work Order' | 'NDA';
  startDate: string;
  endDate: string;
  renewalDate?: string;
  status: 'Active' | 'Draft' | 'Expired' | 'Pending Signature' | 'Terminated';
  value: string;
  attachments: string[];
  obligations: string[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  contractId: string;
  amount: number;
  currency: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Paid' | 'Disputed' | 'Overdue';
  dueDate: string;
  billingPeriod: string;
  submissionDate: string;
  paymentDate?: string;
  disputeNote?: string;
}

export interface Ticket {
  id: string;
  vendorId: string;
  vendorName: string;
  category: 
    | 'Onboarding Issue' 
    | 'Access/Login Issue' 
    | 'Requirement Clarification' 
    | 'Candidate/Profile Issue' 
    | 'Contract Issue' 
    | 'Invoice Issue' 
    | 'Payment Issue' 
    | 'Compliance Issue' 
    | 'Deployment Issue' 
    | 'General Support';
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Awaiting Vendor' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  slaBreached: boolean;
  isEscalated: boolean;
}

export type ModuleType = 
  | 'DASHBOARD' 
  | 'VENDOR_MASTER' 
  | 'RECRUITMENT' 
  | 'COMPLIANCE' 
  | 'FINANCE' 
  | 'GOVERNANCE' 
  | 'ONBOARDING' 
  | 'STAFF_AUG'
  | 'PROCUREMENT'
  | 'TICKETING';

export type RecruitmentStage = 
  | 'Sourcing' 
  | 'Discussion' 
  | 'Interview R1' 
  | 'Test/Round 2' 
  | 'Final Selection' 
  | 'Onboarding';

export type ProcurementType = 
  | 'PROJECT_SOW' 
  | 'RFQ_RFP' 
  | 'ASSET_PROCUREMENT' 
  | 'SERVICE_CONTRACT';

export type ProcurementStatus = 
  | 'Draft' 
  | 'Published' 
  | 'Bidding Open' 
  | 'Evaluation' 
  | 'Clarification' 
  | 'Awarded' 
  | 'Closed';

export interface ProcurementRequirement {
  id: string;
  title: string;
  type: ProcurementType;
  status: ProcurementStatus;
  department: string;
  budget: string;
  deadline: string;
  description: string;
  publishedDate: string;
  bidCount: number;
  priority: 'Critical' | 'High' | 'Normal';
}

export interface VendorBid {
  id: string;
  requirementId: string;
  vendorId: string;
  vendorName: string;
  technicalScore: number;
  commercialBid: string;
  status: 'Submitted' | 'Shortlisted' | 'Rejected' | 'Awarded';
  submissionDate: string;
}

export type CustomerStatus = 
  | 'Yet to Share' 
  | 'Shared' 
  | 'On Hold' 
  | 'Selected' 
  | 'Rejected' 
  | 'Hired (Coherent)' 
  | 'Deployed (Customer)';

export interface Vendor {
  id: string;
  name: string;
  status: 'Active' | 'Onboarding' | 'Pending Review' | 'Suspended' | 'Blacklisted';
  risk: 'Low' | 'Med' | 'High' | 'N/A';
  category: string;
  contactEmail?: string;
  onboardingDate?: string;
  score?: number;
  location?: string;
}

export interface Position {
  id: string;
  title: string;
  businessUnit: string;
  priority: 'High' | 'Medium' | 'Low';
  openDate: string;
  status: 'Active' | 'On Hold' | 'Closed' | 'Cancelled';
  hiresNeeded: number;
  hiresFilled: number;
}

export interface Candidate {
  id: string;
  name: string;
  positionId: string;
  stage: RecruitmentStage;
  status: string;
  customerStatus: CustomerStatus;
  source: 'Internal' | 'Vendor' | 'Referral';
  vendorId?: string;
  lastUpdated: string;
  experience: string;
  currentCompany: string;
  history: {
    stage: string;
    date: string;
    action?: string;
  }[];
}

export interface Customer {
  id: string;
  name: string;
  industry: string;
  location: string;
  status: 'Active' | 'Prospect' | 'Inactive';
  accountManager: string;
  activeDeployments: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  persona: string;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
}

export interface Resource {
  id: string;
  candidateId?: string;
  name: string;
  source: 'Internal' | 'Vendor' | 'Referral';
  vendorId?: string | null;
  recruiterId: string;
  customer?: string | null;
  project?: string | null;
  role: string;
  skills: string[];
  joiningDate: string;
  deploymentDate?: string | null;
  status: 'Deployed' | 'Bench' | 'Exited';
  billingStatus: 'Active' | 'Inactive' | 'Stopped' | 'Pending';
  billingRate: string;
  location: string;
  workOrder?: string | null;
  exitDate?: string;
  exitReason?: string;
}
