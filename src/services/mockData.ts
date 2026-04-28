
import { 
  Resource, 
  ProcurementRequirement, 
  VendorBid, 
  Contract, 
  Invoice, 
  Ticket, 
  Vendor, 
  Position, 
  Candidate,
  Customer,
  User
} from '../types';

export const MOCK_USERS: User[] = [
  { id: "U001", name: "Sarah Miller", email: "s.miller@coherent.in", role: "Super Admin", persona: "SUPER_ADMIN", status: "Active" },
  { id: "U002", name: "John Smith", email: "j.smith@gts-global.com", role: "Vendor Admin", persona: "VENDOR", status: "Active" },
  { id: "U003", name: "Marcus Chen", email: "m.chen@coherent.in", role: "Finance Manager", persona: "FINANCE", status: "Active" },
  { id: "U004", name: "Elena Vance", email: "e.vance@coherent.in", role: "Recruitment Lead", persona: "RECRUITER", status: "Active" },
  { id: "U005", name: "David Brent", email: "d.brent@coherent.in", role: "General Manager", persona: "MANAGER", status: "Active" },
  { id: "U006", name: "Anna Scott", email: "a.scott@talenthive.io", role: "Recruiter", persona: "VENDOR", status: "Active" },
  { id: "U007", name: "Robert Lowe", email: "r.lowe@coherent.in", role: "Compliance Officer", persona: "GOVERNANCE", status: "Active" },
  { id: "U008", name: "Lisa Wong", email: "l.wong@coherent.in", role: "Procurement Head", persona: "PROCUREMENT", status: "Active" },
  { id: "U009", name: "James Bond", email: "j.bond@mi6.gov", role: "Security Analyst", persona: "GOVERNANCE", status: "Inactive" },
  { id: "U010", name: "Peter Parker", email: "p.parker@bugle.com", role: "Staffing Specialist", persona: "RECRUITER", status: "Active" },
  { id: "U011", name: "Bruce Wayne", email: "b.wayne@wayne.ent", role: "Investor", persona: "MANAGER", status: "Active" },
  { id: "U012", name: "Clark Kent", email: "c.kent@planet.com", role: "Journalist", persona: "MANAGER", status: "Active" },
  { id: "U013", name: "Diana Prince", email: "d.prince@them.com", role: "Ambassador", persona: "GOVERNANCE", status: "Active" },
  { id: "U014", name: "Tony Stark", email: "t.stark@stark.com", role: "Genius", persona: "FINANCE", status: "Active" },
  { id: "U015", name: "Steve Rogers", email: "s.rogers@avengers.org", role: "Leader", persona: "MANAGER", status: "Active" },
  { id: "U016", name: "Natasha Romanoff", email: "n.romanoff@shield.gov", role: "Spy", persona: "GOVERNANCE", status: "Active" },
  { id: "U017", name: "Wanda Maximoff", email: "w.maximoff@shield.gov", role: "Specialist", persona: "RECRUITER", status: "Active" },
  { id: "U018", name: "Vision", email: "vision@shield.gov", role: "AI Expert", persona: "FINANCE", status: "Active" },
  { id: "U019", name: "Sam Wilson", email: "s.wilson@shield.gov", role: "Coordinator", persona: "PROCUREMENT", status: "Active" },
  { id: "U020", name: "Bucky Barnes", email: "b.barnes@shield.gov", role: "Assessor", persona: "GOVERNANCE", status: "Active" }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: "CUST-001", name: "Coherent Retail", industry: "Retail", location: "Global", status: "Active", accountManager: "David Brent", activeDeployments: 12 },
  { id: "CUST-002", name: "FinBank Global", industry: "Banking", location: "London", status: "Active", accountManager: "Elena Vance", activeDeployments: 8 },
  { id: "CUST-003", name: "HealthTech Solutions", industry: "Healthcare", location: "San Francisco", status: "Active", accountManager: "Marcus Chen", activeDeployments: 5 },
  { id: "CUST-004", name: "CloudCore Inc", industry: "Technology", location: "Dublin", status: "Active", accountManager: "David Brent", activeDeployments: 15 },
  { id: "CUST-005", name: "EduVision Ltd", industry: "Education", location: "Singapore", status: "Prospect", accountManager: "Elena Vance", activeDeployments: 0 },
  { id: "CUST-006", name: "GreenEnergy Co", industry: "Energy", location: "Berlin", status: "Active", accountManager: "Marcus Chen", activeDeployments: 3 },
  { id: "CUST-007", name: "NextGen Logistics", industry: "Logistics", location: "Chicago", status: "Active", accountManager: "David Brent", activeDeployments: 7 },
  { id: "CUST-008", name: "SafeCyber", industry: "Cybersecurity", location: "Tel Aviv", status: "Inactive", accountManager: "Elena Vance", activeDeployments: 0 },
  { id: "CUST-009", name: "AutoDrive", industry: "Automotive", location: "Tokyo", status: "Active", accountManager: "Marcus Chen", activeDeployments: 4 },
  { id: "CUST-010", name: "SpaceXplore", industry: "Aerospace", location: "Mars", status: "Prospect", accountManager: "David Brent", activeDeployments: 0 }
];

export const MOCK_VENDORS: Vendor[] = [
  { id: "V001", name: "Global Talent Solutions", status: "Active", category: "Contract Staffing", risk: "Low", score: 94, onboardingDate: "2024-03-15", location: "Global" },
  { id: "V002", name: "TalentHive Inc", status: "Active", category: "IT Services", risk: "Low", score: 88, onboardingDate: "2024-02-10", location: "US" },
  { id: "V003", name: "NexGen Resources", status: "Onboarding", category: "Specialized Tech", risk: "Med", score: 0, onboardingDate: "2024-04-20", location: "Asia" },
  { id: "V004", name: "Quantum Cloud", status: "Active", category: "Cloud Services", risk: "Low", score: 97, onboardingDate: "2024-04-01", location: "EMEA" },
  { id: "V005", name: "TechBridge Partners", status: "Suspended", category: "General Staffing", risk: "High", score: 65, onboardingDate: "2024-01-20", location: "LatAM" },
  { id: "V006", name: "Logic Flow Systems", status: "Active", category: "Software Development", risk: "Low", score: 91, onboardingDate: "2023-11-12", location: "India" },
  { id: "V007", name: "Cyber Armor", status: "Active", category: "Information Security", risk: "Low", score: 95, onboardingDate: "2024-01-05", location: "Israel" },
  { id: "V008", name: "Data Insight", status: "Pending Review", category: "Data Analytics", risk: "Med", score: 72, onboardingDate: "2024-04-10", location: "Canada" },
  { id: "V009", name: "Future Staffing", status: "Active", category: "Executive Search", risk: "Low", score: 89, onboardingDate: "2023-09-22", location: "UK" },
  { id: "V010", name: "Outsource Pro", status: "Suspended", category: "BPO Services", risk: "High", score: 55, onboardingDate: "2023-06-30", location: "Philippines" }
];

export const MOCK_RESOURCES: Resource[] = [
  { id: "RES-001", name: "Alex Rivera", role: "Senior Java Developer", status: "Deployed", customer: "Coherent Retail", billingStatus: "Active", billingRate: "95", skills: ["Java", "Spring Boot", "AWS"], source: "Internal", deploymentDate: "2024-01-15", joiningDate: "2023-06-10", recruiterId: "U004", location: "New York" },
  { id: "RES-002", name: "Sarah Chen", role: "UX/UI Lead", status: "Deployed", customer: "FinBank Global", billingStatus: "Active", billingRate: "110", skills: ["Figma", "React", "Design Systems"], source: "Vendor", vendorId: "V002", deploymentDate: "2024-03-05", joiningDate: "2024-02-20", recruiterId: "U004", location: "San Francisco" },
  { id: "RES-003", name: "Marcus Thorne", role: "DevOps Architect", status: "Bench", billingStatus: "Inactive", billingRate: "125", skills: ["Terraform", "Kubernetes", "Azure"], source: "Internal", joiningDate: "2024-04-01", recruiterId: "U004", location: "London" },
  { id: "RES-004", name: "Elena Gomez", role: "Product Manager", status: "Deployed", customer: "HealthTech Solutions", billingStatus: "Active", billingRate: "135", skills: ["Agile", "Roadmapping", "Jira"], source: "Internal", deploymentDate: "2023-11-20", joiningDate: "2023-09-15", recruiterId: "U004", location: "Madrid" },
  { id: "RES-005", name: "David Kim", role: "Security Engineer", status: "Exited", billingStatus: "Inactive", billingRate: "115", skills: ["PenTesting", "ISO27001", "Python"], source: "Vendor", vendorId: "V007", joiningDate: "2023-05-10", recruiterId: "U004", location: "Seoul" },
  { id: "RES-006", name: "Rachel Green", role: "Frontend Dev", status: "Deployed", customer: "CloudCore Inc", billingStatus: "Active", billingRate: "85", skills: ["Vue", "Tailwind"], source: "Vendor", vendorId: "V006", joiningDate: "2024-01-01", deploymentDate: "2024-01-10", recruiterId: "U004", location: "Chicago" },
  { id: "RES-007", name: "Joey Tribbiani", role: "Manual QA", status: "Deployed", customer: "Coherent Retail", billingStatus: "Active", billingRate: "70", skills: ["Testing", "SQL"], source: "Vendor", vendorId: "V001", joiningDate: "2024-02-01", deploymentDate: "2024-02-15", recruiterId: "U004", location: "Austin" },
  { id: "RES-008", name: "Chandler Bing", role: "Data Analyst", status: "Bench", billingStatus: "Inactive", billingRate: "100", skills: ["Excel", "Tableau"], source: "Internal", joiningDate: "2024-03-20", recruiterId: "U004", location: "Seattle" },
  { id: "RES-009", name: "Monica Geller", role: "Scrum Master", status: "Deployed", customer: "NextGen Logistics", billingStatus: "Active", billingRate: "120", skills: ["Safe", "CSM"], source: "Vendor", vendorId: "V009", joiningDate: "2023-12-10", deploymentDate: "2023-12-20", recruiterId: "U004", location: "New York" },
  { id: "RES-010", name: "Phoebe Buffay", role: "Technical Writer", status: "Deployed", customer: "AutoDrive", billingStatus: "Active", billingRate: "75", skills: ["Confluence", "API Doc"], source: "Internal", joiningDate: "2023-08-05", deploymentDate: "2023-08-20", recruiterId: "U004", location: "Phoenix" }
];

export const MOCK_PROCUREMENT: ProcurementRequirement[] = [
  { id: "REQ-SOW-001", title: "Global SAP Migration Phase 2", type: "PROJECT_SOW", status: "Bidding Open", department: "IT Enterprise", budget: "$450,000", deadline: "2024-05-20", description: "Complete migration of legacy SAP instances to S/4HANA Cloud.", publishedDate: "2024-04-15", bidCount: 5, priority: "Critical" },
  { id: "REQ-AST-002", title: "Batch Purchase: 200 MacBook Pro M3", type: "ASSET_PROCUREMENT", status: "Evaluation", department: "Procurement", budget: "$400,000", deadline: "2024-04-25", description: "Standard developer hardware refresh for Q2 2024.", publishedDate: "2024-04-10", bidCount: 12, priority: "High" },
  { id: "REQ-SRV-003", title: "Facility AC Maintenance - Austin Hub", type: "SERVICE_CONTRACT", status: "Published", department: "Facilities", budget: "$25,000", deadline: "2024-05-01", description: "Annual maintenance and emergency support for HVAC systems.", publishedDate: "2024-04-20", bidCount: 3, priority: "Normal" },
  { id: "REQ-RFQ-004", title: "Digital Marketing Agency RFP", type: "RFQ_RFP", status: "Awarded", department: "Marketing", budget: "$120,000", deadline: "2024-03-15", description: "SEO, SEM and social media campaign management for EMEA.", publishedDate: "2024-02-10", bidCount: 8, priority: "High" },
  { id: "REQ-005", title: "Cloud Backup Solution", type: "SERVICE_CONTRACT", status: "Draft", department: "IT Infrastructure", budget: "$150,000", deadline: "2024-06-15", description: "Enterprise-wide immutable backup strategy.", publishedDate: "2024-05-01", bidCount: 0, priority: "High" },
  { id: "REQ-006", title: "L1 Support Outsource", type: "PROJECT_SOW", status: "Evaluation", department: "Customer Ops", budget: "$200,000/yr", deadline: "2024-04-30", description: "24/7 level 1 support desk operations.", publishedDate: "2024-04-05", bidCount: 6, priority: "Normal" },
  { id: "REQ-007", title: "Office Furniture Refresh", type: "ASSET_PROCUREMENT", status: "Published", department: "Facilities", budget: "$80,000", deadline: "2024-05-15", description: "Ergonomic chairs and sit-stand desks for Chicago office.", publishedDate: "2024-04-28", bidCount: 2, priority: "Normal" },
  { id: "REQ-008", title: "Oracle Licensing Audit", type: "SERVICE_CONTRACT", status: "Clarification", department: "Compliance", budget: "$50,000", deadline: "2024-05-05", description: "Third-party audit of our Oracle license utilization.", publishedDate: "2024-04-12", bidCount: 4, priority: "High" },
  { id: "REQ-009", title: "Data Center Cooling Retrofit", type: "PROJECT_SOW", status: "Bidding Open", department: "Infrastructure", budget: "$350,000", deadline: "2024-06-01", description: "Installation of liquid cooling systems for high-density racks.", publishedDate: "2024-04-20", bidCount: 3, priority: "Critical" },
  { id: "REQ-010", title: "Employee Wellness App", type: "RFQ_RFP", status: "Published", department: "HR", budget: "$40,000", deadline: "2024-05-20", description: "Subscription for mental health and fitness tracking for 5000 employees.", publishedDate: "2024-04-28", bidCount: 1, priority: "Normal" }
];

export const MOCK_POSITIONS: Position[] = [
  { id: "POS-001", title: "Senior Java Developer", businessUnit: "Financial Services", openDate: "2024-04-10", hiresNeeded: 3, hiresFilled: 1, priority: "High", status: "Active" },
  { id: "POS-002", title: "UX Designer", businessUnit: "Product Design", openDate: "2024-04-12", hiresNeeded: 1, hiresFilled: 0, priority: "Medium", status: "Active" },
  { id: "POS-003", title: "DevOps Engineer", businessUnit: "Cloud Infrastructure", openDate: "2024-04-15", hiresNeeded: 2, hiresFilled: 0, priority: "High", status: "Active" },
  { id: "POS-004", title: "Business Analyst", businessUnit: "Global Operations", openDate: "2024-04-18", hiresNeeded: 5, hiresFilled: 2, priority: "Low", status: "Active" },
  { id: "POS-005", title: "Security Specialist", businessUnit: "Cyber Security", openDate: "2024-04-20", hiresNeeded: 1, hiresFilled: 0, priority: "High", status: "Active" },
  { id: "POS-006", title: "Data Scientist", businessUnit: "AI Lab", openDate: "2024-04-21", hiresNeeded: 2, hiresFilled: 0, priority: "Medium", status: "Active" },
  { id: "POS-007", title: "React Frontend Dev", businessUnit: "Retail Web", openDate: "2024-04-22", hiresNeeded: 4, hiresFilled: 1, priority: "High", status: "Active" },
  { id: "POS-008", title: "SAP Consultant", businessUnit: "Enterprise Apps", openDate: "2024-04-23", hiresNeeded: 1, hiresFilled: 0, priority: "High", status: "Active" },
  { id: "POS-009", title: "QA Automation Lead", businessUnit: "Quality Org", openDate: "2024-04-24", hiresNeeded: 1, hiresFilled: 0, priority: "Medium", status: "Active" },
  { id: "POS-010", title: "Network Architect", businessUnit: "Infrastructure", openDate: "2024-04-25", hiresNeeded: 1, hiresFilled: 0, priority: "Low", status: "Active" }
];

export const MOCK_CANDIDATES: Candidate[] = [
  // 25 Candidates
  { id: "CAN-001", name: "John Doe", positionId: "POS-001", stage: "Interview R1", status: "Interviewed", customerStatus: "Yet to Share", source: "Vendor", vendorId: "V001", lastUpdated: "2024-04-20", experience: "8", currentCompany: "Tech Corp", history: [] },
  { id: "CAN-002", name: "Jane Smith", positionId: "POS-002", stage: "Discussion", status: "Shortlisted", customerStatus: "Shared", source: "Internal", vendorId: "V002", lastUpdated: "2024-04-21", experience: "5", currentCompany: "Design Studio", history: [] },
  { id: "CAN-003", name: "Bob Wilson", positionId: "POS-003", stage: "Sourcing", status: "Sourced", customerStatus: "Yet to Share", source: "Referral", vendorId: "V004", lastUpdated: "2024-04-22", experience: "12", currentCompany: "Cloud Systems", history: [] },
  { id: "CAN-004", name: "Alice Cooper", positionId: "POS-001", stage: "Test/Round 2", status: "Technical Clear", customerStatus: "Shared", source: "Vendor", vendorId: "V006", lastUpdated: "2024-04-25", experience: "7", currentCompany: "Legacy Systems", history: [] },
  { id: "CAN-005", name: "Charlie Brown", positionId: "POS-004", stage: "Discussion", status: "Evaluating", customerStatus: "Shared", source: "Vendor", vendorId: "V001", lastUpdated: "2024-04-26", experience: "4", currentCompany: "Bank Inc", history: [] },
  { id: "CAN-006", name: "Lucy van Pelt", positionId: "POS-004", stage: "Onboarding", status: "Hired", customerStatus: "Hired (Coherent)", source: "Internal", lastUpdated: "2024-04-27", experience: "6", currentCompany: "Coherent", history: [] },
  { id: "CAN-007", name: "Linus van Pelt", positionId: "POS-001", stage: "Final Selection", status: "Offer Extended", customerStatus: "Selected", source: "Vendor", vendorId: "V009", lastUpdated: "2024-04-28", experience: "9", currentCompany: "ScaleUp", history: [] },
  { id: "CAN-008", name: "Sally Brown", positionId: "POS-002", stage: "Sourcing", status: "Sourced", customerStatus: "Yet to Share", source: "Internal", lastUpdated: "2024-04-28", experience: "3", currentCompany: "Agency", history: [] },
  { id: "CAN-009", name: "Peppermint Patty", positionId: "POS-005", stage: "Discussion", status: "Screened", customerStatus: "Shared", source: "Vendor", vendorId: "V007", lastUpdated: "2024-04-28", experience: "10", currentCompany: "SecureNet", history: [] },
  { id: "CAN-010", name: "Franklin Armstrong", positionId: "POS-003", stage: "Interview R1", status: "Scheduled", customerStatus: "Yet to Share", source: "Referral", lastUpdated: "2024-04-28", experience: "8", currentCompany: "Deploy It", history: [] },
  { id: "CAN-011", name: "Sam Seaborn", positionId: "POS-004", stage: "Discussion", status: "Screened", customerStatus: "Yet to Share", source: "Vendor", vendorId: "V001", lastUpdated: "2024-04-28", experience: "12", currentCompany: "White House", history: [] },
  { id: "CAN-012", name: "Josh Lyman", positionId: "POS-001", stage: "Sourcing", status: "Sourced", customerStatus: "Yet to Share", source: "Vendor", vendorId: "V002", lastUpdated: "2024-04-28", experience: "15", currentCompany: "Politics Inc", history: [] },
  { id: "CAN-013", name: "C.J. Cregg", positionId: "POS-002", stage: "Test/Round 2", status: "Cleared", customerStatus: "Shared", source: "Vendor", vendorId: "V006", lastUpdated: "2024-04-28", experience: "14", currentCompany: "Media Corp", history: [] },
  { id: "CAN-014", name: "Toby Ziegler", positionId: "POS-004", stage: "Onboarding", status: "Hired", customerStatus: "Hired (Coherent)", source: "Internal", lastUpdated: "2024-04-28", experience: "20", currentCompany: "Coherent", history: [] },
  { id: "CAN-015", name: "Leo McGarry", positionId: "POS-001", stage: "Discussion", status: "Reviewing", customerStatus: "Yet to Share", source: "Internal", lastUpdated: "2024-04-28", experience: "30", currentCompany: "Retirement", history: [] },
  { id: "CAN-016", name: "Donna Moss", positionId: "POS-003", stage: "Interview R1", status: "Scheduled", customerStatus: "Yet to Share", source: "Referral", lastUpdated: "2024-04-28", experience: "6", currentCompany: "Assistant Co", history: [] },
  { id: "CAN-017", name: "Charlie Young", positionId: "POS-005", stage: "Sourcing", status: "New", customerStatus: "Yet to Share", source: "Vendor", vendorId: "V007", lastUpdated: "2024-04-28", experience: "2", currentCompany: "Uni Grad", history: [] },
  { id: "CAN-018", name: "Will Bailey", positionId: "POS-001", stage: "Test/Round 2", status: "Technical Clear", customerStatus: "Shared", source: "Vendor", vendorId: "V001", lastUpdated: "2024-04-28", experience: "11", currentCompany: "Speech Tech", history: [] },
  { id: "CAN-019", name: "Kate Harper", positionId: "POS-005", stage: "Sourcing", status: "New", customerStatus: "Yet to Share", source: "Internal", lastUpdated: "2024-04-28", experience: "18", currentCompany: "CIA", history: [] },
  { id: "CAN-020", name: "Matt Santos", positionId: "POS-004", stage: "Final Selection", status: "Offer Made", customerStatus: "Selected", source: "Vendor", vendorId: "V002", lastUpdated: "2024-04-28", experience: "25", currentCompany: "Strategy Group", history: [] },
  { id: "CAN-021", name: "Arnold Vinick", positionId: "POS-004", stage: "Discussion", status: "Shortlisted", customerStatus: "Shared", source: "Vendor", vendorId: "V004", lastUpdated: "2024-04-28", experience: "40", currentCompany: "Senator", history: [] },
  { id: "CAN-022", name: "Helen Santos", positionId: "POS-002", stage: "Sourcing", status: "New", customerStatus: "Yet to Share", source: "Internal", lastUpdated: "2024-04-28", experience: "10", currentCompany: "Consultant", history: [] },
  { id: "CAN-023", name: "Lou Thornton", positionId: "POS-003", stage: "Interview R1", status: "Scheduled", customerStatus: "Yet to Share", source: "Vendor", vendorId: "V006", lastUpdated: "2024-04-28", experience: "12", currentCompany: "Campaign HQ", history: [] },
  { id: "CAN-024", name: "Bram Howard", positionId: "POS-001", stage: "Discussion", status: "Screened", customerStatus: "Shared", source: "Vendor", vendorId: "V001", lastUpdated: "2024-04-28", experience: "5", currentCompany: "Policy Group", history: [] },
  { id: "CAN-025", name: "Ronna Beckman", positionId: "POS-004", stage: "Discussion", status: "Screened", customerStatus: "Yet to Share", source: "Referral", lastUpdated: "2024-04-28", experience: "10", currentCompany: "Operations Plus", history: [] }
];

export const MOCK_CONTRACTS: Contract[] = [
  { id: "CON-2024-001", vendorId: "V001", vendorName: "Global Talent Solutions", customer: "Coherent Retail", type: "MSA", startDate: "2024-01-01", endDate: "2025-12-31", status: "Active", value: "$5,000,000", attachments: [], obligations: ["99.9% SLA", "14-day replacement"] },
  { id: "CON-2024-002", vendorId: "V002", vendorName: "TalentHive Inc", customer: "FinBank Global", type: "SOW", startDate: "2024-02-01", endDate: "2024-12-31", status: "Active", value: "$850,000", attachments: [], obligations: ["Weekly reporting"] },
  { id: "CON-2024-003", vendorId: "V004", vendorName: "Quantum Cloud", customer: "HealthTech Solutions", type: "Work Order", startDate: "2024-04-01", endDate: "2025-03-31", status: "Active", value: "$240,000", attachments: [], obligations: ["ISO27001 compliance"] },
  { id: "CON-2024-004", vendorId: "V006", vendorName: "Logic Flow Systems", customer: "CloudCore Inc", type: "SOW", startDate: "2023-11-01", endDate: "2024-10-31", status: "Active", value: "$1,200,000", attachments: [], obligations: ["On-site presence"] },
  { id: "CON-2024-005", vendorId: "V003", vendorName: "NexGen Resources", customer: "Internal", type: "NDA", startDate: "2024-04-20", endDate: "2029-04-20", status: "Pending Signature", value: "$0", attachments: [], obligations: ["Confidentiality"] },
  { id: "CON-2024-006", vendorId: "V007", vendorName: "Cyber Armor", customer: "SafeCyber", type: "SOW", startDate: "2024-01-01", endDate: "2024-06-30", status: "Active", value: "$45,000", attachments: [], obligations: ["Monthly PenTest"] },
  { id: "CON-2024-007", vendorId: "V008", vendorName: "Data Insight", customer: "FinBank Global", type: "Work Order", startDate: "2024-03-15", endDate: "2024-09-15", status: "Active", value: "$125,000", attachments: [], obligations: ["Data privacy"] },
  { id: "CON-2024-008", vendorId: "V009", vendorName: "Future Staffing", customer: "Coherent Retail", type: "MSA", startDate: "2023-01-01", endDate: "2025-12-31", status: "Active", value: "$1,500,000", attachments: [], obligations: ["Diversity hiring"] },
  { id: "CON-2024-009", vendorId: "V010", vendorName: "Outsource Pro", customer: "NextGen Logistics", type: "SOW", startDate: "2024-03-01", endDate: "2025-02-28", status: "Terminated", value: "$300,000", attachments: [], obligations: ["Service transition"] },
  { id: "CON-2024-010", vendorId: "V001", vendorName: "Global Talent Solutions", customer: "CloudCore Inc", type: "SOW", startDate: "2024-05-01", endDate: "2024-12-31", status: "Draft", value: "$200,000", attachments: [], obligations: ["None specified"] }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: "INV-001", invoiceNumber: "GTS-2024-APR-01", vendorId: "V001", vendorName: "Global Talent Solutions", contractId: "CON-2024-001", amount: 125000, currency: "USD", status: "Paid", dueDate: "2024-05-15", billingPeriod: "April 2024", submissionDate: "2024-05-01", paymentDate: "2024-05-10" },
  { id: "INV-002", invoiceNumber: "THV-2024-MAR-88", vendorId: "V002", vendorName: "TalentHive Inc", contractId: "CON-2024-002", amount: 45000, currency: "USD", status: "Under Review", dueDate: "2024-05-20", billingPeriod: "March 2024", submissionDate: "2024-04-20" },
  { id: "INV-003", invoiceNumber: "QC-DISP-004", vendorId: "V004", vendorName: "Quantum Cloud", contractId: "CON-2024-003", amount: 12000, currency: "USD", status: "Disputed", dueDate: "2024-05-10", billingPeriod: "April 2024", submissionDate: "2024-04-25", disputeNote: "Hours mismatch for Candidate C105" },
  { id: "INV-004", invoiceNumber: "GTS-2024-APR-02", vendorId: "V001", vendorName: "Global Talent Solutions", contractId: "CON-2024-001", amount: 98000, currency: "USD", status: "Overdue", dueDate: "2024-04-20", billingPeriod: "March 2024", submissionDate: "2024-04-05" },
  { id: "INV-005", invoiceNumber: "LF-MAY-01", vendorId: "V006", vendorName: "Logic Flow Systems", contractId: "CON-2024-004", amount: 110000, currency: "USD", status: "Draft", dueDate: "2024-06-15", billingPeriod: "May 2024", submissionDate: "2024-06-01" },
  { id: "INV-006", invoiceNumber: "CA-2024-05", vendorId: "V007", vendorName: "Cyber Armor", contractId: "CON-VAR-01", amount: 75000, currency: "USD", status: "Approved", dueDate: "2024-05-25", billingPeriod: "April 2024", submissionDate: "2024-05-05" },
  { id: "INV-007", invoiceNumber: "DI-990-22", vendorId: "V008", vendorName: "Data Insight", contractId: "CON-VAR-02", amount: 25000, currency: "USD", status: "Submitted", dueDate: "2024-05-30", billingPeriod: "April 2024", submissionDate: "2024-05-10" },
  { id: "INV-008", invoiceNumber: "FS-EXEC-11", vendorId: "V009", vendorName: "Future Staffing", contractId: "CON-VAR-03", amount: 50000, currency: "USD", status: "Draft", dueDate: "2024-06-01", billingPeriod: "May 2024", submissionDate: "2024-05-20" },
  { id: "INV-009", invoiceNumber: "OP-442-00", vendorId: "V010", vendorName: "Outsource Pro", contractId: "CON-VAR-04", amount: 35000, currency: "USD", status: "Paid", dueDate: "2024-04-15", billingPeriod: "March 2024", submissionDate: "2024-04-01", paymentDate: "2024-04-10" },
  { id: "INV-010", invoiceNumber: "GTS-2024-MAY-01", vendorId: "V001", vendorName: "Global Talent Solutions", contractId: "CON-2024-001", amount: 130000, currency: "USD", status: "Submitted", dueDate: "2024-06-15", billingPeriod: "May 2024", submissionDate: "2024-06-01" }
];

export const MOCK_TICKETS: Ticket[] = [
  { id: "TICK-001", vendorId: "V001", vendorName: "Global Talent Solutions", category: "Invoice Issue", subject: "Payment delay for INV-004", description: "Our invoice INV-004 is showing as overdue for more than 10 days.", priority: "High", status: "In Progress", createdAt: "2024-04-25T10:00:00Z", updatedAt: "2024-04-26T14:30:00Z", assignedTo: "Marcus Chen", slaBreached: true, isEscalated: true },
  { id: "TICK-002", vendorId: "V002", vendorName: "TalentHive Inc", category: "Requirement Clarification", subject: "Skills clarification for RQ-2024-901", description: "Is AWS certification mandatory for the Lead Cloud Architect role?", priority: "Medium", status: "Awaiting Vendor", createdAt: "2024-04-27T09:15:00Z", updatedAt: "2024-04-28T11:00:00Z", assignedTo: "Sarah Miller", slaBreached: false, isEscalated: false },
  { id: "TICK-003", vendorId: "V004", vendorName: "Quantum Cloud", category: "Access/Login Issue", subject: "Portal login failing for new admin", description: "Newly added user cannot log into the vendor portal.", priority: "Critical", status: "Open", createdAt: "2024-04-28T08:30:00Z", updatedAt: "2024-04-28T08:30:00Z", slaBreached: false, isEscalated: false },
  { id: "TICK-004", vendorId: "V006", vendorName: "Logic Flow Systems", category: "Contract Issue", subject: "SOW Amendment Request", description: "Request to extend the current SOW by 3 months.", priority: "High", status: "Open", createdAt: "2024-04-28T11:00:00Z", updatedAt: "2024-04-28T11:00:00Z", slaBreached: false, isEscalated: false },
  { id: "TICK-005", vendorId: "V001", vendorName: "Global Talent Solutions", category: "Candidate/Profile Issue", subject: "Candidate JD Change", description: "The JD for Senior Java Dev seems to have changed mid-sourcing.", priority: "Medium", status: "Resolved", createdAt: "2024-04-20T14:00:00Z", updatedAt: "2024-04-22T10:00:00Z", assignedTo: "Elena Vance", slaBreached: false, isEscalated: false },
  { id: "TICK-006", vendorId: "V007", vendorName: "Cyber Armor", category: "Compliance Issue", subject: "ISO Cert Upload Error", description: "The portal rejects my PDF upload for the security certificate.", priority: "High", status: "Closed", createdAt: "2024-04-15T09:00:00Z", updatedAt: "2024-04-15T15:00:00Z", assignedTo: "Robert Lowe", slaBreached: false, isEscalated: false },
  { id: "TICK-007", vendorId: "V008", vendorName: "Data Insight", category: "Onboarding Issue", subject: "Questionnaire logic error", description: "Sec 4 Question 2 does not allow selecting multiple options.", priority: "Low", status: "In Progress", createdAt: "2024-04-28T12:00:00Z", updatedAt: "2024-04-28T13:00:00Z", assignedTo: "Sarah Miller", slaBreached: false, isEscalated: false },
  { id: "TICK-008", vendorId: "V009", vendorName: "Future Staffing", category: "Payment Issue", subject: "Bank details update", description: "Need to update our global SWIFT code for payments.", priority: "Critical", status: "Open", createdAt: "2024-04-28T14:00:00Z", updatedAt: "2024-04-28T14:00:00Z", slaBreached: false, isEscalated: false },
  { id: "TICK-009", vendorId: "V010", vendorName: "Outsource Pro", category: "Deployment Issue", subject: "ID Card access pending", description: "Our resource joey tribbiani does not have building access.", priority: "Low", status: "Awaiting Vendor", createdAt: "2024-04-28T15:00:00Z", updatedAt: "2024-04-28T15:30:00Z", assignedTo: "David Brent", slaBreached: false, isEscalated: false },
  { id: "TICK-010", vendorId: "V003", vendorName: "NexGen Resources", category: "General Support", subject: "API Integration docs", description: "Where can I find the Coherent API documentation for vendors?", priority: "Low", status: "Open", createdAt: "2024-04-28T16:00:00Z", updatedAt: "2024-04-28T16:00:00Z", slaBreached: false, isEscalated: false }
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

export const MOCK_ONBOARDING = [
  { id: "APP-V001", vendorName: "Global Talent Solutions", category: "Staffing", stage: "Under Review", progress: 65, submittedAt: "2024-04-20", riskScore: 24, tier: "Gold", docs: ["Cert.inc", "Tax_Compliance.pdf"] },
  { id: "APP-V006", vendorName: "Logic Flow Systems", category: "Software", stage: "Submitted", progress: 20, submittedAt: "2024-04-25", riskScore: 42, tier: "Silver", docs: ["Company_Profile.pdf"] },
  { id: "APP-V007", vendorName: "Cyber Armor", category: "Security", stage: "Approved", progress: 100, submittedAt: "2024-01-01", riskScore: 12, tier: "Platinum", docs: ["ISO.pdf"] },
  { id: "APP-V011", vendorName: "Cloud Systems Inc", category: "Cloud", stage: "Registration", progress: 10, submittedAt: "2024-04-28", riskScore: 0, tier: "Pending", docs: [] },
  { id: "APP-V012", vendorName: "Green Energy Corp", category: "Utilities", stage: "Assessment", progress: 45, submittedAt: "2024-04-15", riskScore: 30, tier: "Gold", docs: ["Policy.pdf"] },
  { id: "APP-V013", vendorName: "Auto Drive Labs", category: "Automotive", stage: "Compliance Review", progress: 85, submittedAt: "2024-03-20", riskScore: 15, tier: "Platinum", docs: ["Safety_Audit.pdf"] },
  { id: "APP-V014", vendorName: "Edu Vision Ltd", category: "Education", stage: "Clarification", progress: 55, submittedAt: "2024-04-05", riskScore: 40, tier: "Silver", docs: ["Curriculum.pdf"] },
  { id: "APP-V015", vendorName: "NextGen Logistics", category: "Logistics", stage: "Draft", progress: 5, submittedAt: "2024-04-27", riskScore: 0, tier: "Pending", docs: [] },
  { id: "APP-V016", vendorName: "Safe Cyber Ltd", category: "Cybersecurity", stage: "Rejected", progress: 90, submittedAt: "2023-12-15", riskScore: 85, tier: "None", docs: ["Failed_Audit.pdf"] },
  { id: "APP-V017", vendorName: "Space Xplore", category: "Aerospace", stage: "Approved", progress: 100, submittedAt: "2024-02-10", riskScore: 5, tier: "Titanium", docs: ["Space_Agency_License.pdf"] }
];

export const MOCK_AUDIT_LOGS = [
  { id: "LOG-001", timestamp: "2024-04-28T10:00:00Z", user: "Sarah Miller", action: "VENDOR_APPROVE", entity: "Vendor", entityId: "V001", details: "Onboarding approved for Global Talent Solutions" },
  { id: "LOG-002", timestamp: "2024-04-28T10:30:00Z", user: "Marcus Chen", action: "INVOICE_PAID", entity: "Invoice", entityId: "INV-001", details: "Payment of $125,000 processed" },
  { id: "LOG-003", timestamp: "2024-04-28T11:00:00Z", user: "Elena Vance", action: "CANDIDATE_HIRED", entity: "Candidate", entityId: "CAN-006", details: "Lucy van Pelt hired for Business Analyst role" },
  { id: "LOG-004", timestamp: "2024-04-28T11:15:00Z", user: "Robert Lowe", action: "COMPLIANCE_ALARM", entity: "Vendor", entityId: "V005", details: "Risk score spiked to 85 for TechBridge Partners" },
  { id: "LOG-005", timestamp: "2024-04-28T12:00:00Z", user: "Lisa Wong", action: "REQUIREMENT_PUBLISHED", entity: "Procurement", entityId: "REQ-010", details: "Employee Wellness App RFP published" },
  { id: "LOG-006", timestamp: "2024-04-28T13:00:00Z", user: "John Smith", action: "BID_SUBMITTED", entity: "Bid", entityId: "BID-990", details: "Vendor V001 submitted bid for REQ-SOW-001" },
  { id: "LOG-007", timestamp: "2024-04-28T13:45:00Z", user: "David Brent", action: "RESOURCE_DEPLOYED", entity: "Resource", entityId: "RES-001", details: "Alex Rivera deployed to Coherent Retail" },
  { id: "LOG-008", timestamp: "2024-04-28T14:30:00Z", user: "Anna Scott", action: "CANDIDATE_SUBMITTED", entity: "Candidate", entityId: "CAN-025", details: "New referral Ronna Beckman added" },
  { id: "LOG-009", timestamp: "2024-04-28T15:10:00Z", user: "Sarah Miller", action: "USER_ROLE_CHANGE", entity: "User", entityId: "U009", details: "User James Bond marked as Inactive" },
  { id: "LOG-010", timestamp: "2024-04-28T16:00:00Z", user: "System", action: "SLA_BREACH", entity: "Ticket", entityId: "TICK-001", details: "Ticket T001 breached 24h response SLA" }
];
