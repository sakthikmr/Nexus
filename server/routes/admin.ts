import { Router } from 'express';

const router = Router();

router.get('/users', (req, res) => {
  res.json([
    { id: "U001", name: "Admin User", role: "Super Admin" },
    { id: "U002", name: "Recruiter One", role: "Recruiter" }
  ]);
});

router.get('/audit-logs', (req, res) => {
  res.json([
    { id: "LOG-001", timestamp: "2026-04-28T10:00:00Z", user: "Sarah Miller", action: "VENDOR_APPROVE", entity: "Vendor", entityId: "V001", details: "Onboarding approved for Global Talent Solutions" },
    { id: "LOG-002", timestamp: "2026-04-28T10:30:00Z", user: "Marcus Chen", action: "INVOICE_PAID", entity: "Invoice", entityId: "INV-001", details: "Payment of $125,000 processed" },
    { id: "LOG-003", timestamp: "2026-04-28T11:00:00Z", user: "Elena Vance", action: "CANDIDATE_HIRED", entity: "Candidate", entityId: "CAN-006", details: "Lucy van Pelt hired for Business Analyst role" },
    { id: "LOG-004", timestamp: "2026-04-28T11:15:00Z", user: "Robert Lowe", action: "COMPLIANCE_ALARM", entity: "Vendor", entityId: "V005", details: "Risk score spiked to 85 for TechBridge Partners" },
    { id: "LOG-005", timestamp: "2026-04-28T12:00:00Z", user: "Lisa Wong", action: "REQUIREMENT_PUBLISHED", entity: "Procurement", entityId: "REQ-010", details: "Employee Wellness App RFP published" },
    { id: "LOG-006", timestamp: "2026-04-28T13:00:00Z", user: "John Smith", action: "BID_SUBMITTED", entity: "Bid", entityId: "BID-990", details: "Vendor V001 submitted bid for REQ-SOW-001" },
    { id: "LOG-007", timestamp: "2026-04-28T13:45:00Z", user: "David Brent", action: "RESOURCE_DEPLOYED", entity: "Resource", entityId: "RES-001", details: "Alex Rivera deployed to Coherent Retail" },
    { id: "LOG-008", timestamp: "2026-04-28T14:30:00Z", user: "Anna Scott", action: "CANDIDATE_SUBMITTED", entity: "Candidate", entityId: "CAN-025", details: "New referral Ronna Beckman added" },
    { id: "LOG-009", timestamp: "2026-04-28T15:10:00Z", user: "Sarah Miller", action: "USER_ROLE_CHANGE", entity: "User", entityId: "U009", details: "User James Bond marked as Inactive" },
    { id: "LOG-010", timestamp: "2026-04-28T16:00:00Z", user: "System", action: "SLA_BREACH", entity: "Ticket", entityId: "TICK-001", details: "Ticket T001 breached 24h response SLA" }
  ]);
});

router.get('/masters/recruitment-stages', (req, res) => {
  res.json([
    { order: 1, name: "Sourcing", type: "Internal", skipable: false, duration: "7 days" },
    { order: 2, name: "Technical Test", type: "Internal", skipable: true, duration: "3 days" },
    { order: 3, name: "Client Interview", type: "External", skipable: false, duration: "5 days" },
    { order: 4, name: "Offer Preparation", type: "Internal", skipable: false, duration: "2 days" },
    { order: 5, name: "Background Check", type: "Compliance", skipable: false, duration: "10 days" },
    { order: 6, name: "Onboarding Ready", type: "Docs", skipable: false, duration: "1 day" },
    { order: 7, name: "Orientation", type: "Admin", skipable: true, duration: "2 days" },
    { order: 8, name: "First Day Support", type: "Support", skipable: false, duration: "1 day" },
    { order: 9, name: "Probation", type: "Manager", skipable: false, duration: "90 days" },
    { order: 10, name: "Exit Interview", type: "HR", skipable: true, duration: "1 day" }
  ]);
});

router.get('/masters/vendor-categories', (req, res) => {
  res.json([
    { id: 1, name: "IT Professional Services", code: "IT-PRO", status: "Active", riskWeight: 0.1 },
    { id: 2, name: "Managed Service Provider", code: "MSP", status: "Active", riskWeight: 0.3 },
    { id: 3, name: "Direct Hire Agency", code: "DHA", status: "Active", riskWeight: 0.2 },
    { id: 4, name: "Hardware Reseller", code: "HW", status: "Inactive", riskWeight: 0.5 },
    { id: 5, name: "Cybersecurity specialized", code: "SEC", status: "Active", riskWeight: 0.05 },
    { id: 6, name: "Facilities & Real Estate", code: "FAC", status: "Active", riskWeight: 0.4 },
    { id: 7, name: "Marketing/Branding", code: "MKT", status: "Active", riskWeight: 0.2 },
    { id: 8, name: "Legal Services", code: "LGL", status: "Active", riskWeight: 0.1 },
    { id: 9, name: "Consulting", code: "CON", status: "Active", riskWeight: 0.15 },
    { id: 10, name: "Logistics Partner", code: "LOG", status: "Active", riskWeight: 0.35 }
  ]);
});

router.get('/masters/sla', (req, res) => {
  res.json([
    { priority: "P1", category: "System Down", target: "2 hours", escalation: "CTO", penalty: "$5,000/hr" },
    { priority: "P2", category: "Critical Bug", target: "8 hours", escalation: "VP Eng", penalty: "$1,000/hr" },
    { priority: "P3", category: "Minor Issue", target: "3 days", escalation: "Tech Lead", penalty: "$100/day" },
    { priority: "P4", category: "New Request", target: "10 days", escalation: "PM", penalty: "None" },
    { priority: "S1", category: "Onboarding Response", target: "24 hours", escalation: "VMO Head", penalty: "SLA Notch" },
    { priority: "S2", category: "Invoice Payment", target: "30 days", escalation: "Finance Dir", penalty: "2% Interest" },
    { priority: "S3", category: "Compliance Doc Review", target: "5 days", escalation: "Risk Officer", penalty: "Escalation" },
    { priority: "S4", category: "Support Ticket Res", target: "48 hours", escalation: "Helpdesk Mgr", penalty: "Score point" },
    { priority: "S5", category: "Contract Renewal", target: "60 days before", escalation: "Gov Head", penalty: "Lapse risk" },
    { priority: "S6", category: "RFP Final Selection", target: "14 days", escalation: "Proc Dir", penalty: "Bid expiry" }
  ]);
});

router.get('/dashboard/stats', (req, res) => {
  res.json({
    activeVendors: 12,
    openPositions: 45,
    pendingInvoices: 8,
    complianceScore: 94
  });
});

router.get('/deployments', (req, res) => {
  res.json([
    { id: "DEP-001", resource: "Alex Rivera", customer: "Coherent Retail", project: "Cloud Migration", startDate: "2024-05-01", status: "Allocated" },
    { id: "DEP-002", resource: "Sarah Jenkins", customer: "FinBank Global", project: "Security Refresh", startDate: "2024-04-15", status: "Active" },
    { id: "DEP-003", resource: "Michael Scott", customer: "NextGen Logistics", project: "WMS Rollout", startDate: "2024-06-01", status: "Scheduled" },
    { id: "DEP-004", resource: "Pam Beesly", customer: "HealthTech Solutions", project: "EMR Upgrade", startDate: "2024-03-20", status: "Active" },
    { id: "DEP-005", resource: "Dwight Schrute", customer: "CloudCore Inc", project: "Data Lake", startDate: "2024-05-15", status: "Allocated" },
    { id: "DEP-006", resource: "Jim Halpert", customer: "FinBank Global", project: "Mobile App P2", startDate: "2024-04-01", status: "Active" },
    { id: "DEP-007", resource: "Angela Martin", customer: "Internal", project: "Nexus V2 Audit", startDate: "2024-04-28", status: "Active" },
    { id: "DEP-008", resource: "Stanley Hudson", customer: "Coherent Retail", project: "Legacy Support", startDate: "2024-01-01", status: "Terminating" },
    { id: "DEP-009", resource: "Kelly Kapoor", customer: "Customer Care Unit", project: "CRM Integration", startDate: "2024-07-01", status: "Draft" },
    { id: "DEP-010", resource: "Ryan Howard", customer: "StartUp Lab", project: "MVP Development", startDate: "2024-02-10", status: "Active" }
  ]);
});

export default router;
