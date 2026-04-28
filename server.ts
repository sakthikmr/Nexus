import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log("Initializing Coherent Nexus Server...");

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "Coherent Nexus API is operational", version: "1.0.0", timestamp: new Date().toISOString() });
  });

  // Mock Vendors
  const vendors = [
    { id: "V001", name: "Global Talent Solutions", status: "Active", risk: "Low", category: "IT Staffing", score: 92, contact: "Sarah J.", email: "contact@globaltalents.com", phone: "+1 555-0101", location: "New York, USA", employees: "250+", founded: "2010" },
    { id: "V002", name: "TechBridge Systems", status: "Onboarding", risk: "Med", category: "Project Services", score: 78, contact: "Mike R.", email: "ops@techbridge.io", phone: "+1 555-0102", location: "San Francisco, USA", employees: "120", founded: "2015" },
    { id: "V003", name: "Facility Plus", status: "Active", risk: "Low", category: "Facilities", score: 85, contact: "Elena G.", email: "care@facilityplus.com", phone: "+1 555-0103", location: "Austin, USA", employees: "500+", founded: "2005" },
    { id: "V004", name: "Nexus HR Partners", status: "Active", risk: "Low", category: "HR Consulting", score: 88, contact: "David L.", email: "hr@nexus-partners.com", phone: "+1 555-0104", location: "London, UK", employees: "85", founded: "2018" },
    { id: "V005", name: "CloudScale Infra", status: "Suspended", risk: "High", category: "Cloud Services", score: 45, contact: "Kevin S.", email: "security@cloudscale.com", phone: "+1 555-0105", location: "Seattle, USA", employees: "300", founded: "2012" },
    { id: "V006", name: "LogisLink Express", status: "Active", risk: "Low", category: "Logistics", score: 90, contact: "Pat M.", email: "ship@logislink.com", phone: "+1 555-0106", location: "Singapore", employees: "1000+", founded: "1998" },
    { id: "V007", name: "ArchiBuild Ltd", status: "Onboarding", risk: "Low", category: "Architectural", score: 0, contact: "Robert T.", email: "design@archibuild.com", phone: "+1 555-0107", location: "Berlin, Germany", employees: "45", founded: "2020" },
    { id: "V008", name: "Swift Legal Associates", status: "Active", risk: "Low", category: "Legal", score: 95, contact: "Jessica W.", email: "counsel@swiftlegal.com", phone: "+1 555-0108", location: "Toronto, Canada", employees: "150", founded: "2008" },
    { id: "V009", name: "GreenEnergy Solar", status: "Pending Review", risk: "N/A", category: "Renewables", score: 0, contact: "Sam H.", email: "energy@greensolar.com", phone: "+1 555-0109", location: "Dublin, Ireland", employees: "60", founded: "2021" },
    { id: "V010", name: "Prime Marketing", status: "Active", risk: "Med", category: "Marketing", score: 72, contact: "Amy F.", email: "buzz@primemarketing.com", phone: "+1 555-0110", location: "Sydney, Australia", employees: "200", founded: "2014" },
  ];

  app.get("/api/vendors", (req, res) => {
    res.json(vendors);
  });

  // Mock Positions
  const positions = [
    { id: "P-2024-001", title: "Lead Cloud Architect", businessUnit: "FinDev", priority: "High", openDate: "2024-04-10", status: "Active", hiresNeeded: 2, hiresFilled: 1 },
    { id: "P-2024-002", title: "Senior React Developer", businessUnit: "Platform Ops", priority: "Medium", openDate: "2024-04-15", status: "Active", hiresNeeded: 5, hiresFilled: 3 },
    { id: "P-2024-003", title: "Data Engineer (P3)", businessUnit: "E-Commerce", priority: "Low", openDate: "2024-04-20", status: "Active", hiresNeeded: 1, hiresFilled: 0 },
    { id: "P-2024-004", title: "Cybersecurity Analyst", businessUnit: "Security", priority: "High", openDate: "2024-04-22", status: "Active", hiresNeeded: 1, hiresFilled: 0 },
    { id: "P-2024-005", title: "DevOps Engineer", businessUnit: "Infrastructure", priority: "High", openDate: "2024-04-25", status: "Active", hiresNeeded: 3, hiresFilled: 0 },
  ];

  // Mock Interviewers
  const interviewers = [
    { id: "INT-01", name: "David Miller", role: "CTO", department: "Engineering" },
    { id: "INT-02", name: "Sarah Connor", role: "Lead Architect", department: "Cloud" },
    { id: "INT-03", name: "Alex Reed", role: "Senior Manager", department: "Security" },
  ];

  // Mock Candidates with extended statuses
  const candidates = [
    { 
      id: "C101", 
      name: "Alice Johnson", 
      positionId: "P-2024-001", 
      stage: "Interview R1", 
      status: "Technical Round", 
      customerStatus: "Shared",
      source: "Internal", 
      lastUpdated: "2h ago",
      experience: "12 Years",
      currentCompany: "SkyNet Systems",
      history: [
        { stage: "Sourcing", date: "2024-04-12", action: "Matched to position" },
        { stage: "Discussion", date: "2024-04-14", action: "Screening cleared" }
      ]
    },
    { 
      id: "C102", 
      name: "Bob Smith", 
      positionId: "P-2024-001", 
      stage: "Sourcing", 
      status: "Eligible", 
      customerStatus: "Yet to Share",
      source: "Vendor", 
      vendorId: "V001",
      lastUpdated: "5h ago",
      experience: "8 Years",
      currentCompany: "WebLogic Corp",
      history: []
    },
    { 
      id: "C104", 
      name: "David Smith", 
      positionId: "P-2024-001", 
      stage: "Discussion", 
      status: "HR Clear", 
      customerStatus: "Yet to Share",
      source: "Vendor", 
      vendorId: "V002",
      lastUpdated: "3h ago",
      experience: "10 Years",
      currentCompany: "Innovation Lab",
      history: [{ stage: "Sourcing", date: "2024-04-15" }]
    },
    { 
      id: "C105", 
      name: "Elena Ross", 
      positionId: "P-2024-001", 
      stage: "Test/Round 2", 
      status: "Coding Assessment", 
      customerStatus: "Shared",
      source: "Internal", 
      lastUpdated: "1d ago",
      experience: "7 Years",
      currentCompany: "Global Data",
      history: [{ stage: "Sourcing", date: "2024-04-10" }, { stage: "Interview R1", date: "2024-04-12" }]
    },
    { 
      id: "C106", 
      name: "Frank Castle", 
      positionId: "P-2024-005", 
      stage: "Sourcing", 
      status: "Applied", 
      customerStatus: "Yet to Share",
      source: "Referral", 
      lastUpdated: "1h ago",
      experience: "4 Years",
      currentCompany: "Justice Tech",
      history: []
    }
  ];

  // More mock candidates for scale
  for (let i = 7; i <= 25; i++) {
    candidates.push({
      id: `CPre-${String(i).padStart(2, '0')}`,
      name: [`John`, `Jane`, `Michael`, `Sarah`, `Robert`][i % 5] + ' ' + [`Doe`, `Smith`, `Lee`, `Wang`, `Gomez`][i % 5],
      positionId: `P-2024-00${(i % 5) + 1}`,
      stage: (['Sourcing', 'Discussion', 'Interview R1', 'Test/Round 2', 'Final Selection', 'Onboarding'] as any)[i % 6],
      status: 'In Progress',
      customerStatus: (['Yet to Share', 'Shared', 'On Hold', 'Selected'] as any)[i % 4],
      source: i % 2 === 0 ? 'Internal' : 'Vendor',
      vendorId: i % 2 === 0 ? undefined : `V00${(i % 3) + 1}`,
      lastUpdated: `${i}h ago`,
      experience: `${(i % 10) + 2} Years`,
      currentCompany: 'Enterprise Partner',
      history: []
    });
  }

  // Staff Augmentation & Resource Deployment Data
  const resources = [
    {
      id: "RES-001",
      candidateId: "C103",
      name: "Charlie Davis",
      source: "Referral",
      vendorId: null,
      recruiterId: "RECRUITER",
      customer: "Coherent Retail",
      project: "Nexus Core UI",
      role: "Lead React Dev",
      skills: ["React", "TypeScript", "Node.js"],
      joiningDate: "2024-04-15",
      deploymentDate: "2024-04-18",
      status: "Deployed",
      billingStatus: "Active",
      billingRate: "120",
      location: "New York, USA",
      workOrder: "WO-2024-001"
    },
    {
      id: "RES-002",
      name: "Sarah Lee",
      source: "Vendor",
      vendorId: "V001",
      recruiterId: "RECRUITER",
      customer: "FinBank Global",
      project: "Legacy Modernization",
      role: "Java Architect",
      skills: ["Java", "Spring Boot", "AWS"],
      joiningDate: "2024-03-01",
      deploymentDate: "2024-03-05",
      status: "Deployed",
      billingStatus: "Active",
      billingRate: "145",
      location: "Remote (India)",
      workOrder: "WO-2024-002"
    },
    {
      id: "RES-003",
      name: "Mike Tyson",
      source: "Internal",
      vendorId: null,
      recruiterId: "RECRUITER",
      customer: null,
      project: null,
      role: "Android Developer",
      skills: ["Kotlin", "Jetpack Compose"],
      joiningDate: "2024-04-20",
      deploymentDate: null,
      status: "Bench",
      billingStatus: "Inactive",
      billingRate: "0",
      location: "San Francisco, USA",
      workOrder: null
    },
    {
      id: "RES-004",
      name: "Oscar Wilde",
      source: "Vendor",
      vendorId: "V004",
      recruiterId: "RECRUITER",
      customer: "Retail Giant",
      project: "Mobile App Refresh",
      role: "UX Designer",
      skills: ["Figma", "Research"],
      joiningDate: "2024-02-10",
      deploymentDate: "2024-02-15",
      status: "Exited",
      billingStatus: "Stopped",
      billingRate: "95",
      location: "London, UK",
      workOrder: "WO-2024-003",
      exitDate: "2024-04-25",
      exitReason: "Project Completion"
    }
  ];

  app.get("/api/resources", (req, res) => res.json(resources));
  
  // Procurement Requirements Mock Data
  const procurementRequirements = [
    { 
      id: "REQ-SOW-001", 
      title: "Global SAP Migration Phase 2", 
      type: "PROJECT_SOW", 
      status: "Bidding Open", 
      department: "IT Enterprise", 
      budget: "$450,000", 
      deadline: "2024-05-20", 
      description: "Complete migration of legacy SAP instances to S/4HANA Cloud.",
      publishedDate: "2024-04-15",
      bidCount: 5,
      priority: "Critical"
    },
    { 
      id: "REQ-AST-002", 
      title: "Batch Purchase: 200 MacBook Pro M3", 
      type: "ASSET_PROCUREMENT", 
      status: "Evaluation", 
      department: "Procurement", 
      budget: "$400,000", 
      deadline: "2024-04-25", 
      description: "Standard developer hardware refresh for Q2 2024.",
      publishedDate: "2024-04-10",
      bidCount: 12,
      priority: "High"
    },
    { 
      id: "REQ-SRV-003", 
      title: "Facility AC Maintenance - Austin Hub", 
      type: "SERVICE_CONTRACT", 
      status: "Published", 
      department: "Facilities", 
      budget: "$25,000", 
      deadline: "2024-05-01", 
      description: "Annual maintenance and emergency support for HVAC systems.",
      publishedDate: "2024-04-20",
      bidCount: 3,
      priority: "Normal"
    },
    { 
      id: "REQ-RFQ-004", 
      title: "Digital Marketing Agency RFP", 
      type: "RFQ_RFP", 
      status: "Awarded", 
      department: "Marketing", 
      budget: "$120,000", 
      deadline: "2024-03-15", 
      description: "SEO, SEM and social media campaign management for EMEA.",
      publishedDate: "2024-02-10",
      bidCount: 8,
      priority: "High"
    }
  ];

  const vendorBids = [
    { 
      id: "BID-001", 
      requirementId: "REQ-SOW-001", 
      vendorId: "V001", 
      vendorName: "Global Talent Solutions", 
      technicalScore: 88, 
      commercialBid: "$442,000", 
      status: "Submitted", 
      submissionDate: "2024-04-20" 
    },
    { 
      id: "BID-002", 
      requirementId: "REQ-AST-002", 
      vendorId: "V006", 
      vendorName: "LogisLink Express", 
      technicalScore: 95, 
      commercialBid: "$398,000", 
      status: "Shortlisted", 
      submissionDate: "2024-04-22" 
    }
  ];

  app.get("/api/procurement/requirements", (req, res) => res.json(procurementRequirements));
  app.get("/api/procurement/bids", (req, res) => res.json(vendorBids));

  // Contracts Mock Data
  const contracts = [
    {
      id: "CON-2024-001",
      vendorId: "V001",
      vendorName: "Global Talent Solutions",
      customer: "Coherent Corp",
      type: "MSA",
      startDate: "2024-01-01",
      endDate: "2026-12-31",
      status: "Active",
      value: "$2.5M",
      attachments: ["msa_signed.pdf"],
      obligations: ["99.9% SL", "Monthly reporting"]
    },
    {
      id: "CON-2024-002",
      vendorId: "V002",
      vendorName: "TalentHive Inc",
      customer: "Coherent Retail",
      type: "SOW",
      startDate: "2024-03-01",
      endDate: "2024-09-30",
      status: "Active",
      value: "$450,000",
      attachments: ["sow_nexus.pdf"],
      obligations: ["Delivery by Aug 30"]
    },
    {
      id: "CON-2024-003",
      vendorId: "V004",
      vendorName: "Quantum Cloud",
      customer: "Global Systems",
      type: "Work Order",
      startDate: "2024-04-15",
      endDate: "2024-10-15",
      status: "Pending Signature",
      value: "$85,000",
      attachments: [],
      obligations: []
    }
  ];

  // Invoices Mock Data
  const invoices = [
    {
      id: "INV-001",
      invoiceNumber: "GTS-2024-APR-01",
      vendorId: "V001",
      vendorName: "Global Talent Solutions",
      contractId: "CON-2024-001",
      amount: 125000,
      currency: "USD",
      status: "Paid",
      dueDate: "2024-05-15",
      billingPeriod: "April 2024",
      submissionDate: "2024-05-01",
      paymentDate: "2024-05-10"
    },
    {
      id: "INV-002",
      invoiceNumber: "THV-2024-MAR-88",
      vendorId: "V002",
      vendorName: "TalentHive Inc",
      contractId: "CON-2024-002",
      amount: 45000,
      currency: "USD",
      status: "Under Review",
      dueDate: "2024-05-20",
      billingPeriod: "March 2024",
      submissionDate: "2024-04-20"
    },
    {
      id: "INV-003",
      invoiceNumber: "QC-DISP-004",
      vendorId: "V004",
      vendorName: "Quantum Cloud",
      contractId: "CON-2024-003",
      amount: 12000,
      currency: "USD",
      status: "Disputed",
      dueDate: "2024-05-10",
      billingPeriod: "April 2024",
      submissionDate: "2024-04-25",
      disputeNote: "Hours mismatch for Candidate C105"
    },
    {
      id: "INV-004",
      invoiceNumber: "GTS-2024-APR-02",
      vendorId: "V001",
      vendorName: "Global Talent Solutions",
      contractId: "CON-2024-001",
      amount: 98000,
      currency: "USD",
      status: "Overdue",
      dueDate: "2024-04-20",
      billingPeriod: "March 2024",
      submissionDate: "2024-04-05"
    }
  ];

  app.get("/api/contracts", (req, res) => res.json(contracts));
  app.get("/api/invoices", (req, res) => res.json(invoices));

  // Tickets Mock Data
  const tickets = [
    {
      id: "TICK-001",
      vendorId: "V001",
      vendorName: "Global Talent Solutions",
      category: "Invoice Issue",
      subject: "Payment delay for INV-004",
      description: "Our invoice INV-004 is showing as overdue for more than 10 days.",
      priority: "High",
      status: "In Progress",
      createdAt: "2024-04-25T10:00:00Z",
      updatedAt: "2024-04-26T14:30:00Z",
      assignedTo: "Marcus Chen",
      slaBreached: true,
      isEscalated: true
    },
    {
      id: "TICK-002",
      vendorId: "V002",
      vendorName: "TalentHive Inc",
      category: "Requirement Clarification",
      subject: "Skills clarification for RQ-2024-901",
      description: "Is AWS certification mandatory for the Lead Cloud Architect role?",
      priority: "Medium",
      status: "Awaiting Vendor",
      createdAt: "2024-04-27T09:15:00Z",
      updatedAt: "2024-04-28T11:00:00Z",
      assignedTo: "Sarah Miller",
      slaBreached: false,
      isEscalated: false
    },
    {
      id: "TICK-003",
      vendorId: "V004",
      vendorName: "Quantum Cloud",
      category: "Access/Login Issue",
      subject: "Portal login failing for new admin",
      description: "Newly added user cannot log into the vendor portal.",
      priority: "Critical",
      status: "Open",
      createdAt: "2024-04-28T08:30:00Z",
      updatedAt: "2024-04-28T08:30:00Z",
      slaBreached: false,
      isEscalated: false
    }
  ];

  // Adding more mock tickets for variety
  for (let i = 4; i <= 10; i++) {
    tickets.push({
      id: `TICK-00${i}`,
      vendorId: `V00${(i % 5) + 1}`,
      vendorName: "Mock Vendor Partner",
      category: (["General Support", "Compliance Issue", "Deployment Issue"] as any)[i % 3],
      subject: `Support Request #${i}`,
      description: "Routine inquiry regarding platform features.",
      priority: (["Low", "Medium", "High"] as any)[i % 3],
      status: "Open",
      createdAt: "2024-04-28T10:00:00Z",
      updatedAt: "2024-04-28T10:00:00Z",
      slaBreached: i === 5, // example breach
      isEscalated: i === 5  // example escalation
    });
  }

  app.get("/api/tickets", (req, res) => res.json(tickets));

  // Analytics Trend Data (12 Months)
  const analyticsTrends = {
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

  app.get("/api/analytics/trends", (req, res) => res.json(analyticsTrends));

  app.get("/api/deployments", (req, res) => res.json([
    { id: "DEP-01", resourceId: "RES-001", customer: "Coherent Retail", date: "2024-04-18" },
    { id: "DEP-02", resourceId: "RES-002", customer: "FinBank Global", date: "2024-03-05" }
  ]));

  app.get("/api/positions", (req, res) => res.json(positions));
  app.get("/api/candidates", (req, res) => res.json(candidates));
  app.get("/api/interviewers", (req, res) => res.json(interviewers));

  // Master Data
  app.get("/api/masters/vendor-categories", (req, res) => res.json([
    { id: 'VC01', name: 'IT Staffing', code: 'ITS', status: 'Active' },
    { id: 'VC02', name: 'Software Services', code: 'SWS', status: 'Active' },
    { id: 'VC03', name: 'Facilities & Real Estate', code: 'FRE', status: 'Active' }
  ]));

  app.get("/api/masters/recruitment-stages", (req, res) => res.json([
    { id: 'S1', name: 'Sourcing', order: 1, type: 'Internal', skipable: true },
    { id: 'S2', name: 'Discussion', order: 2, type: 'Internal', skipable: false },
    { id: 'S3', name: 'Interview R1', order: 3, type: 'Internal', skipable: false },
    { id: 'S4', name: 'Assessment', order: 4, type: 'Internal', skipable: true },
    { id: 'S5', name: 'Selected', order: 5, type: 'External', skipable: true },
    { id: 'S6', name: 'Onboarding', order: 6, type: 'System', skipable: false },
  ]));

  app.get("/api/masters/sla", (req, res) => res.json([
    { id: 'SLA-1', name: 'Critical Support', category: 'Ticketing', priority: 'P1', target: '4 Hours', escalation: 'VP Ops' },
    { id: 'SLA-2', name: 'Candidate Review', category: 'Recruitment', priority: 'P2', target: '48 Hours', escalation: 'Recruitment Lead' }
  ]));

  // Mock Onboarding Applications
  const onboardingApplications = [
    { 
      id: 'ONB-001', 
      vendorName: 'Nexus Staffing Partners', 
      category: 'IT Staffing', 
      stage: 'Under Review', 
      progress: 75,
      submittedAt: '2024-04-25',
      riskScore: 72,
      tier: 'Tier 2',
      docs: ['GST_CERT.pdf', 'ISO_27001.pdf', 'COI.pdf']
    },
    { 
      id: 'ONB-002', 
      vendorName: 'BuildSource Inc.', 
      category: 'Project Services', 
      stage: 'Submitted', 
      progress: 100,
      submittedAt: '2024-04-27',
      riskScore: 0,
      tier: 'Pending',
      docs: ['TAX_ID.pdf', 'MS_PARTNER.pdf']
    }
  ];

  app.get("/api/onboarding", (req, res) => res.json(onboardingApplications));

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Vite in middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Coherent Nexus Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start Nexus Server:", err);
});

