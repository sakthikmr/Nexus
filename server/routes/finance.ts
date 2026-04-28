import { Router } from 'express';

const router = Router();

router.get('/invoices', (req, res) => {
  res.json([
    { id: "INV-001", invoiceNumber: "GTS-2024-APR-01", vendorId: "V001", vendorName: "Global Talent Solutions", amount: 125000, currency: "USD", status: "Paid", dueDate: "2024-05-15", billingPeriod: "April 2024", submissionDate: "2024-05-01" },
    { id: "INV-002", invoiceNumber: "THV-2024-MAR-88", vendorId: "V002", vendorName: "TalentHive Inc", amount: 45000, currency: "USD", status: "Under Review", dueDate: "2024-05-20", billingPeriod: "March 2024", submissionDate: "2024-04-20" },
    { id: "INV-003", invoiceNumber: "QC-DISP-004", vendorId: "V004", vendorName: "Quantum Cloud", amount: 12000, currency: "USD", status: "Disputed", dueDate: "2024-05-10", billingPeriod: "April 2024", submissionDate: "2024-04-25" },
    { id: "INV-004", invoiceNumber: "GTS-2024-APR-02", vendorId: "V001", vendorName: "Global Talent Solutions", amount: 98000, currency: "USD", status: "Overdue", dueDate: "2024-04-20", billingPeriod: "March 2024", submissionDate: "2024-04-05" },
    { id: "INV-005", invoiceNumber: "LF-MAY-01", vendorId: "V006", vendorName: "Logic Flow Systems", amount: 110000, currency: "USD", status: "Draft", dueDate: "2024-06-15", billingPeriod: "May 2024", submissionDate: "2024-06-01" },
    { id: "INV-006", invoiceNumber: "CA-2024-05", vendorId: "V007", vendorName: "Cyber Armor", amount: 75000, currency: "USD", status: "Approved", dueDate: "2024-05-25", billingPeriod: "April 2024", submissionDate: "2024-05-05" },
    { id: "INV-007", invoiceNumber: "DI-990-22", vendorId: "V008", vendorName: "Data Insight", amount: 25000, currency: "USD", status: "Submitted", dueDate: "2024-05-30", billingPeriod: "April 2024", submissionDate: "2024-05-10" },
    { id: "INV-008", invoiceNumber: "FS-EXEC-11", vendorId: "V009", vendorName: "Future Staffing", amount: 50000, currency: "USD", status: "Draft", dueDate: "2024-06-01", billingPeriod: "May 2024", submissionDate: "2024-05-20" },
    { id: "INV-009", invoiceNumber: "OP-442-00", vendorId: "V010", vendorName: "Outsource Pro", amount: 35000, currency: "USD", status: "Paid", dueDate: "2024-04-15", billingPeriod: "March 2024", submissionDate: "2024-04-01" },
    { id: "INV-010", invoiceNumber: "GTS-2024-MAY-01", vendorId: "V001", vendorName: "Global Talent Solutions", amount: 130000, currency: "USD", status: "Submitted", dueDate: "2024-06-15", billingPeriod: "May 2024", submissionDate: "2024-06-01" }
  ]);
});

router.get('/contracts', (req, res) => {
  res.json([
    { id: "CON-2024-001", vendorId: "V001", vendorName: "Global Talent Solutions", customer: "Coherent Retail", type: "MSA", startDate: "2024-01-01", endDate: "2025-12-31", status: "Active", value: "$5,000,000" },
    { id: "CON-2024-002", vendorId: "V002", vendorName: "TalentHive Inc", customer: "FinBank Global", type: "SOW", startDate: "2024-02-01", endDate: "2024-12-31", status: "Active", value: "$850,000" },
    { id: "CON-2024-003", vendorId: "V004", vendorName: "Quantum Cloud", customer: "HealthTech Solutions", type: "Work Order", startDate: "2024-04-01", endDate: "2025-03-31", status: "Active", value: "$240,000" },
    { id: "CON-2024-004", vendorId: "V006", vendorName: "Logic Flow Systems", customer: "CloudCore Inc", type: "SOW", startDate: "2023-11-01", endDate: "2024-10-31", status: "Active", value: "$1,200,000" },
    { id: "CON-2024-005", vendorId: "V003", vendorName: "NexGen Resources", customer: "Internal", type: "NDA", startDate: "2024-04-20", endDate: "2029-04-20", status: "Pending Signature", value: "$0" },
    { id: "CON-2024-006", vendorId: "V007", vendorName: "Cyber Armor", customer: "SafeCyber", type: "SOW", startDate: "2024-01-01", endDate: "2024-06-30", status: "Active", value: "$45,000" },
    { id: "CON-2024-007", vendorId: "V008", vendorName: "Data Insight", customer: "FinBank Global", type: "Work Order", startDate: "2024-03-15", endDate: "2024-09-15", status: "Active", value: "$125,000" },
    { id: "CON-2024-008", vendorId: "V009", vendorName: "Future Staffing", customer: "Coherent Retail", type: "MSA", startDate: "2023-01-01", endDate: "2025-12-31", status: "Active", value: "$1,500,000" },
    { id: "CON-2024-009", vendorId: "V010", vendorName: "Outsource Pro", customer: "NextGen Logistics", type: "SOW", startDate: "2024-03-01", endDate: "2025-02-28", status: "Terminated", value: "$300,000" },
    { id: "CON-2024-010", vendorId: "V001", vendorName: "Global Talent Solutions", customer: "CloudCore Inc", type: "SOW", startDate: "2024-05-01", endDate: "2024-12-31", status: "Draft", value: "$200,000" }
  ]);
});

router.post('/invoices', (req, res) => {
  res.status(201).json({ id: "INV-" + Math.random().toString(36).substr(2, 5).toUpperCase(), ...req.body });
});

router.patch('/invoices/:id/approve', (req, res) => {
  res.json({ message: `Invoice ${req.params.id} approved` });
});

router.get('/contracts/export', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.send('PDF_DATA_STREAM_MOCK');
});

export default router;
