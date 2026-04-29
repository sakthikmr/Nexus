# Coherent Nexus VMP - Consolidated Specification Document

## 1. Project Overview
Project Phoenix (Coherent Nexus) is a high-density Vendor Management Platform (VMP) designed for professional enterprise use. It centralizes vendor lifecycle management, talent acquisition, procurement, and financial settlement into a single, compact interface.

## 2. Role & Permission Matrix
Access is governed by persona-based permissions to ensure data isolation.

| Module | Super Admin | Recruiter | Finance | Vendor Admin |
|--------|-------------|-----------|---------|--------------|
| Vendor Master | Full View/Edit | Read Only | Read Only | View Self |
| Onboarding | Approve/Reject | View Only | View Only | Submit/Update |
| Recruitment | View All | Manage Board | View Stats | Submit Talent |
| Procurement | Manage All | View Only | View Only | Bid Submission |
| Finance | View Logs | View Only | Approve/Pay | Submit Invoices |
| Governance | Master Config | No Access | No Access | No Access |

## 3. Screen Inventory & Application Map

### 3.1 Core Navigation (Sidebar)
*   **Dashboard**: High-level execution metrics and trend lines.
*   **Vendor Master**: Central repository for all approved partners.
*   **Talent Acquisition**: Recruitment funnel and position management.
*   **Onboarding**: Multi-stage assessment and compliance tracking.
*   **Staff Augregation**: Resource bench and active deployment tracking.
*   **Procurement**: RFP/SOW bidding and source selection.
*   **Finance Hub**: Invoice processing and financial reconciliation.
*   **Compliance**: Governance framework and risk management.
*   **Ticketing**: Support desk and SLA-driven case management.

### 3.2 High-Density UI Principles
All screens follow a compact design language:
*   **Font Scaling**: 10px - 14px as standard range.
*   **Tight Spacing**: Reduced padding (p-2 to p-4) and gaps (gap-2 to gap-4).
*   **KPI Widgets**: Information-dense cards with sparklines and mini-icons.
*   **Action Clarity**: Ghost buttons for secondary actions, high-contrast black/blue for primary.

## 4. Operational Workflows

### 4.1. Recruitment Pipeline (Talent)
1.  **Publish**: Internal positional requirement is created (`Position`).
2.  **Sourcing**: Vendors submit candidates (`Candidate`).
3.  **Screening**: Candidates move from "Applied" to "Technical Review".
4.  **Closure**: Status moves to "Hired" or "Rejected".

### 4.2. Financial Settlement (Finance)
1.  **Work Submission**: Vendor logs hours/milestones.
2.  **Invoice Generation**: Vendor submits digital invoice.
3.  **Verification**: 3-Way match between PO, SOW, and Invoice.
4.  **Payment**: Status moves to "Approved" -> "Paid".

### 4.3. Support Request (Ticketing)
1.  **Ticket Creation**: Issue logged by partner or internal user.
2.  **Priority Assignment**: Critical / High / Medium classification.
3.  **Resolution**: SLA tracking for First Response and MTTR.

## 5. Schema Summary (Firebase Entities)

| Entity | Fields | Description |
|--------|--------|-------------|
| **Vendor** | `id, name, status, riskScore, category, onboardingDate` | Approved partner data. |
| **Position** | `id, title, businessUnit, hiresNeeded, priority, status` | Open staffing requirements. |
| **Candidate** | `id, name, positionId, stage, experience, vendorId` | Talent submissions. |
| **Invoice** | `id, amount, currency, status, dueDate, vendorId` | Billing documents. |
| **Ticket** | `id, subject, priority, status, vendorName, createdAt` | Support incidents. |
| **Resource** | `id, name, role, skills, status, billingRate` | Staff augmentation bench. |

## 6. API Summary (REST Endpoints)

*   **Auth**: `GET /api/v1/auth/me` - Profile context.
*   **Vendors**: `GET /vendors`, `POST /vendors`, `PATCH /vendors/:id/status`.
*   **Talent**: `GET /positions`, `GET /candidates`, `PATCH /candidates/:id/stage`.
*   **Finance**: `GET /invoices`, `POST /invoices`, `PATCH /invoices/:id/approve`.
*   **Ops**: `GET /tickets`, `POST /tickets`, `POST /tickets/:id/comments`.

## 7. Master Data Samples (Mock)

### Vendors
*   `V-001 | Apex Tech Solutions | Global IT | Score: 98% | Low Risk`
*   `V-002 | Nexus Staffing Group | Augmentation | Score: 85% | Med Risk`

### Recruitment
*   `POS-101 | Cloud Architect | AWS/Terraform | 1 Opening | High Priority`
*   `POS-102 | Product Designer | Figma/Prototyping | 2 Openings | Medium Priority`

### Finance Statuses
*   `Draft`, `Submitted`, `Under Review`, `Approved`, `Disputed`, `Paid`, `Overdue`.

## 8. Database Connection (Security & Persistence)
*   **Persistence**: Handled via Firebase Firestore (Google Cloud Platform).
*   **Security**: Firebase Auth provides background connection using system credentials (`sakthikumar.k@coherent.in`).
*   **Rules**: Document-level protection prevents cross-tenant data leakage.

---
*End of Specification. Last Updated: April 29, 2026*
