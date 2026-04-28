import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json([
    { id: "TICK-001", vendorName: "Global Talent Solutions", subject: "Payment delay for INV-004", status: "In Progress", priority: "High", assignedTo: "Marcus Chen", createdAt: "2024-04-25" },
    { id: "TICK-002", vendorName: "TalentHive Inc", subject: "Portal access for new recruiter", status: "Closed", priority: "Medium", assignedTo: "Sarah Miller", createdAt: "2024-04-26" },
    { id: "TICK-003", vendorName: "Quantum Cloud", subject: "Questionnaire logic error", status: "Open", priority: "Low", assignedTo: "Sarah Miller", createdAt: "2024-04-27" },
    { id: "TICK-004", vendorName: "Logic Flow Systems", subject: "SOW Extension Request", status: "Open", priority: "High", assignedTo: "Marcus Chen", createdAt: "2024-04-28" },
    { id: "TICK-005", vendorName: "Cyber Armor", subject: "ISO Cert Upload Failure", status: "Resolved", priority: "Medium", assignedTo: "Robert Lowe", createdAt: "2024-04-20" },
    { id: "TICK-006", vendorName: "Data Insight", subject: "API Integration Timeout", status: "In Progress", priority: "Critical", assignedTo: "Vision", createdAt: "2024-04-28" },
    { id: "TICK-007", vendorName: "Future Staffing", subject: "Bank Details Update", status: "Open", priority: "High", assignedTo: "Marcus Chen", createdAt: "2024-04-28" },
    { id: "TICK-008", vendorName: "Outsource Pro", subject: "Resource Building Access", status: "Awaiting Vendor", priority: "Normal", assignedTo: "David Brent", createdAt: "2024-04-27" },
    { id: "TICK-009", vendorName: "NexGen Resources", subject: "JD Clarification RQ-901", status: "Closed", priority: "Low", assignedTo: "Elena Vance", createdAt: "2024-04-22" },
    { id: "TICK-010", vendorName: "TechBridge Partners", subject: "Billing Currency mismatch", status: "Open", priority: "Medium", assignedTo: "Marcus Chen", createdAt: "2024-04-28" }
  ]);
});

router.post('/', (req, res) => {
  res.status(201).json({ id: "T" + Date.now(), ...req.body, status: "Open" });
});

router.post('/:id/comments', (req, res) => {
  res.json({ message: "Comment added to ticket " + req.params.id });
});

export default router;
