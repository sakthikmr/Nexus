# Coherent Nexus VMP - Functional Specification Document (FSD)

## 1. Project Vision
**Coherent Nexus** is a next-generation Vendor Management Platform (VMP) designed for mid-to-large enterprises to orchestrate vendor onboarding, compliance, talent recruitment (Staff Augmentation), procurement bidding, and financial operations through a unified, multi-tenant portal.

---

## 2. Role & Permission Matrix

| Module | Super Admin | Recruiter | Finance | Vendor Admin |
|--------|-------------|-----------|---------|--------------|
| Vendor Master | Full View/Edit | Read Only | Read Only | View Self |
| Onboarding | Approve/Reject | View Only | View Only | Submit/Update |
| Recruitment | View All | Manage Board | View Stats | Submit Talent |
| Procurement | Manage All | View Only | View Only | Bid Submission |
| Finance | View Logs | View Only | Approve/Pay | Submit Invoices |
| Governance | Master Config | No Access | No Access | No Access |

---

## 3. Module Specifications & Workflows

### 3.1. Vendor Lifecycle (Onboarding -> Performance)
- **Workflow**: Registration -> Assessment -> Compliance Review -> Approved -> Master List.
- **Key Features**: 
  - Automated Risk Scoring (Low/Med/High).
  - Document Expiry Alerts (ISO, Tax, Insurance).
  - Multi-tiered performance rating (90% + Compliance = Gold).

### 3.2. Talent & Recruitment (Staff Augmentation)
- **Workflow**: Position Request -> Vendor Submission -> Technical Interview -> Client Feedback -> Offer -> Hired.
- **Key Features**: 
  - Kanban board for candidate movement.
  - Integration with "Resource Bench" for quick deployment.
  - Vendor candidate ownership tracking.

### 3.3. Procurement & Sourcing (SOW/RFP)
- **Workflow**: Requirement Publish -> Bid Collection -> Technical Evaluation -> Financial Comparison -> Award.
- **Key Features**: 
  - SOW vs Asset Procurement distinction.
  - Blind technical scoring.

### 3.4. Financial Management
- **Workflow**: Work Approval -> Invoice Submission -> Three-way Match -> Approval -> Payment.
- **Key Features**: 
  - Disputed invoice management with "Threaded Comments".
  - Contract Value vs Utilized Value tracking.

---

## 4. Screen Inventory & UI Components

### Dashboard Views
- **Admin Dashboard**: Trend lines for Spend, Hires, and SLA Breach.
- **Vendor Portal Home**: Compliance Health Meter, Pending Tasks, and "Top Opportunities".

### Core Screens
| Screen Name | Path | Primary UI Widget |
|-------------|------|-------------------|
| Vendor Master | `/vendors` | Data Table with Risk Indicators |
| Recruitment Board | `/talent/recruitment` | Drag-and-drop Kanban Board |
| Invoice Center | `/finance/invoices` | List with Multi-state Badges |
| Compliance Engine | `/governance/compliance` | Questionnaire & Audit Log |
| Support Desk | `/ops/support` | Threaded Messaging UI |

---

## 5. Schema Summary (Core Entities)

- **Vendor**: `id`, `name`, `status`, `riskScore`, `category`, `onboardingDate`.
- **Position**: `id`, `title`, `businessUnit`, `hiresNeeded`, `priority`, `status`.
- **Candidate**: `id`, `name`, `positionId`, `stage`, `experience`, `vendorId`.
- **Invoice**: `id`, `amount`, `currency`, `status`, `dueDate`, `vendorId`.
- **Requirement**: `id`, `title`, `budget`, `deadline`, `status`.
- **Audit Log**: `timestamp`, `user`, `action`, `details`.

---

## 6. API Architecture Summary (v1)

- **Auth**: `/api/v1/auth/me`
- **Vendors**: `GET /api/v1/vendors`, `PATCH /api/v1/vendors/:id/status`
- **Recruitment**: `GET /api/v1/recruitment/positions`, `GET /api/v1/recruitment/candidates`
- **Finance**: `GET /api/v1/finance/invoices`, `GET /api/v1/finance/contracts`
- **Admin**: `GET /api/v1/admin/audit-logs`, `GET /api/v1/admin/masters/*`

---

## 7. Master Data Samples (Mock)

### Recruitment Positions
- `POS-001 | Senior Java Developer | Finance | 3 Needed | High | Active`
- `POS-002 | UX Designer | Design | 1 Needed | Medium | Active`

### Vendors
- `V001 | Global Talent Solutions | Active | Low Risk | Score: 94%`
- `V005 | TechBridge Partners | Suspended | High Risk | Score: 45%`

### Invoice Status Values
- `Draft`, `Submitted`, `Under Review`, `Approved`, `Disputed`, `Paid`, `Overdue`.

---

## 8. Global Interaction Patterns
1. **Drawer Pattern**: Every table row click should open a details drawer on the right.
2. **Timeline Widget**: Used in Onboarding and Candidate stages to show historical progression.
3. **Ghost Loading**: Use skeleton loaders for chart placeholders.
4. **Tenant Check**: Vendor users are automatically filtered via `X-Vendor-ID` header.
