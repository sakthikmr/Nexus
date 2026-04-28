import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json([
    { id: "REQ-SOW-001", title: "SAP Phase 2 Migration", budget: 450000, status: "Bidding Open", category: "ERP Services", deadline: "2024-05-15", owner: "Fin Management" },
    { id: "REQ-SOW-002", title: "Legacy Hardware Refresh", budget: 200000, status: "Evaluation", category: "Infrastructure", deadline: "2024-05-01", owner: "IT Ops" },
    { id: "REQ-STAFF-003", title: "Managed Services - Helpdesk", budget: 600000, status: "Draft", category: "Support", deadline: "2024-06-01", owner: "Customer Success" },
    { id: "REQ-SOW-004", title: "Cybersecurity Audit 2024", budget: 150000, status: "Awaiting Approval", category: "Compliance", deadline: "2024-05-20", owner: "Security Team" },
    { id: "REQ-STAFF-005", title: "Cloud Native Re-arch", budget: 1200000, status: "Bidding Open", category: "Eng Services", deadline: "2024-05-30", owner: "Platform Team" },
    { id: "REQ-SOW-006", title: "Employee Wellness App", budget: 85000, status: "Evaluation", category: "HR Tech", deadline: "2024-04-28", owner: "Human Resources" },
    { id: "REQ-HW-007", title: "Laptops for Retail Expansion", budget: 300000, status: "Draft", category: "Hardware", deadline: "2024-07-01", owner: "Supply Chain" },
    { id: "REQ-SOW-008", title: "Global Logistics AI Ops", budget: 2500000, status: "Bidding Open", category: "AI/ML", deadline: "2024-06-15", owner: "Logistics Org" },
    { id: "REQ-STAFF-009", title: "Contract Staffing - Q3", budget: 500000, status: "Evaluation", category: "Staffing", deadline: "2024-04-30", owner: "Talent Acquisition" },
    { id: "REQ-SOW-010", title: "Green Energy Grid UI", budget: 400000, status: "Draft", category: "Product Dev", deadline: "2024-08-01", owner: "Sustainability Unit" }
  ]);
});

router.post('/:id/bids', (req, res) => {
  res.status(201).json({ message: "Bid submitted for " + req.params.id, bidId: "BID-" + Math.random().toString(36).substr(2, 5).toUpperCase() });
});

router.get('/:id/bids', (req, res) => {
  res.json([
    { vendor: "V001", score: 85, bid: 440000 },
    { vendor: "V002", score: 92, bid: 460000 }
  ]);
});

export default router;
