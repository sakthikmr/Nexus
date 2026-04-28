import { Router } from 'express';

const router = Router();

// Mock Vendors
const vendors = [
  { id: "V001", name: "Global Talent Solutions", status: "Active", risk: "Low", category: "Contract Staffing", score: 94, onboardingDate: "2024-03-15", location: "Global" },
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

router.get('/', (req, res) => {
  res.json(vendors);
});

router.get('/:id', (req, res) => {
  const vendor = vendors.find(v => v.id === req.params.id);
  if (vendor) res.json(vendor);
  else res.status(404).json({ error: 'Vendor not found' });
});

router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  res.json({ message: `Vendor ${req.params.id} status updated to ${status}` });
});

router.post('/bulk-onboard', (req, res) => {
  res.json({ message: 'Bulk onboarding initiated', count: req.body.vendors?.length || 0 });
});

export default router;
