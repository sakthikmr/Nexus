import { Router } from 'express';

const router = Router();

router.get('/positions', (req, res) => {
  res.json([
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
  ]);
});

router.get('/candidates', (req, res) => {
  res.json([
    { id: "CAN-001", name: "John Doe", positionId: "POS-001", stage: "Interview R1", status: "Interviewed", lastUpdated: "2024-04-20", experience: "8", vendorId: "V001" },
    { id: "CAN-002", name: "Jane Smith", positionId: "POS-002", stage: "Discussion", status: "Shortlisted", lastUpdated: "2024-04-21", experience: "5", vendorId: "V002" },
    { id: "CAN-003", name: "Bob Wilson", positionId: "POS-003", stage: "Sourcing", status: "Sourced", lastUpdated: "2024-04-22", experience: "12", vendorId: "V004" },
    { id: "CAN-004", name: "Alice Cooper", positionId: "POS-001", stage: "Test/Round 2", status: "Technical Clear", lastUpdated: "2024-04-25", experience: "7", vendorId: "V006" },
    { id: "CAN-005", name: "Charlie Brown", positionId: "POS-004", stage: "Discussion", status: "Evaluating", lastUpdated: "2024-04-26", experience: "4", vendorId: "V001" },
    { id: "CAN-006", name: "Lucy van Pelt", positionId: "POS-004", stage: "Onboarding", status: "Hired", lastUpdated: "2024-04-27", experience: "6" },
    { id: "CAN-007", name: "Linus van Pelt", positionId: "POS-001", stage: "Final Selection", status: "Offer Extended", lastUpdated: "2024-04-28", experience: "9", vendorId: "V009" },
    { id: "CAN-008", name: "Sally Brown", positionId: "POS-002", stage: "Sourcing", status: "Sourced", lastUpdated: "2024-04-28", experience: "3" },
    { id: "CAN-009", name: "Peppermint Patty", positionId: "POS-005", stage: "Discussion", status: "Screened", lastUpdated: "2024-04-28", experience: "10", vendorId: "V007" },
    { id: "CAN-010", name: "Franklin Armstrong", positionId: "POS-003", stage: "Interview R1", status: "Scheduled", lastUpdated: "2024-04-28", experience: "8" }
  ]);
});

router.post('/candidates/bulk-upload', (req, res) => {
  res.json({ message: 'CSV Import Successful', processed: 25, errors: 0 });
});

router.patch('/candidates/:id/stage', (req, res) => {
  res.json({ message: `Candidate ${req.params.id} moved to ${req.body.stage}` });
});

export default router;
