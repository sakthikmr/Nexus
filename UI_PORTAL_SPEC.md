# Coherent Nexus VMP - UI Functional Specification

## 1. System Navigation & Sitemap

### Internal Navigation (Admin/Manager/Finance/Recruiter)
- **Dashboard**: Global KPIs & Predictive Analytics
- **Vendors**: 
  - Master List
  - Onboarding Pipeline
  - Compliance Monitor
- **Talent (Recruitment)**:
  - Positions (Openings)
  - Candidate Board (Kanban)
  - Resource Bench
- **Procurement**:
  - Requirements (SOW/Asset Requests)
  - Bid Comparison
- **Finance**:
  - Contracts & SLAs
  - Invoices & Payments
- **Operations**:
  - Deployments & Work Orders
  - Support Tickets
- **Governance**:
  - Audit Logs
  - System Masters

### Vendor Portal Navigation
- **Home**: Performance Scorecard & Alerts
- **Opportunities**: Open Requirements & Bidding
- **Talent**: Submit Candidates & Pipeline Progress
- **Finance**: Submit Invoices & Payment Status
- **Contracts**: Active MSAs/SOWs
- **Support**: Raise/Track Tickets

---

## 2. Screen Specifications

### 2.1. Internal: Vendor Master List
- **Path**: `/vendors`
- **Visibility**: Super Admin, Procurement, Governance
- **Header Actions**: `+ Add Vendor`, `Export CSV`, `Bulk Risk Update`
- **Filters**: Category (Multi-select), Status (Active, Suspended, etc), Risk Level (Low/Med/High), Compliance Score (Range)
- **List View**: Dense Table with tooltips
- **Table Columns**:
  - `Vendor Name` (Click opens Drawer)
  - `Category` (Badge)
  - `Score` (Circular Progress Mini)
  - `Risk` (Indicator Tag: Red/Yellow/Green)
  - `Onboarding Date`
  - `Active Hires` (Count)
- **Detail Drawer (Vendor 360)**:
  - **Tabs**: Overview, Documents, Contracts, Hires, Tickets, Audit
  - **Timeline**: 3-step visualization of onboarding history
- **Sample Data**: `Global Talent Solutions | Contract Staffing | 94% | Low | 15-Mar-2024 | 12`

### 2.2. Internal: Recruitment Kanban Board
- **Path**: `/talent/recruitment`
- **Visibility**: Recruiter, Manager
- **Header Actions**: `New Position`, `Share with Customer`, `Bulk Stage Move`
- **UI Structure**: Trello-style Kanban Columns
- **Columns**: `Sourcing` -> `Discussion` -> `Interview R1` -> `Assessment` -> `Final Selection` -> `Hired`
- **Card Fields**:
  - Candidate Name
  - Position Title
  - Vendor (if applicable)
  - Source Badge (Internal/Referral/Vendor)
  - Last Activity (e.g., "Interview 2h ago")
- **Row Actions**: `Quick Edit`, `Schedule Interview`, `Reject`, `View Profile`
- **Drawer**: Full resume viewer + interview scoring widget

### 2.3. Vendor: Opportunity Dashboard
- **Path**: `/portal/opportunities`
- **Visibility**: Vendor Admin
- **Sections**:
  - **Action Needed**: Upcoming deadlines (Bids closing soon)
  - **Recommended**: AI-matched requirements based on vendor category
- **Grid Layout**: Card-based view for Requirements
- **Card Fields**:
  - Title (e.g., "SAP Phase 2 Migration")
  - Budget/Value Range
  - Deadline (Countdown timer)
  - Bid Status (Not Started, Draft, Submitted)
- **Actions**: `View Specs`, `Submit Bid`, `Ask Clarification`

### 2.4. Financials: Invoice Manager
- **Path**: `/finance/invoices`
- **Visibility**: Finance, Vendor Admin
- **Header Actions**: `[Vendor] Upload Invoice`, `[Admin] Run Payment Cycle`
- **Filters**: Payment Status, Billing Period, Vendor
- **Table Columns**:
  - `Inv #`
  - `Vendor`
  - `Amount`
  - `Due Date`
  - `Status` (Draft, Under Review, Disputed, Paid)
- **Status Badges**:
  - `Disputed`: Red + Tooltip (Reason: "Hours Mismatch")
  - `Paid`: Green + Payment Date
  - `Overdue`: Pulsing Amber
- **Interaction**: Row clicking opens line-item breakdown with timesheet attachments.

---

## 3. Global Interaction States & Patterns

### Loading States
- **Skeleton Screens**: Preferred for table rows and dashboard KPI cards.
- **Micro-interactions**: Pulse effects on status badges during background updates.

### Empty States (EmptyStateWidget)
- Dashboard: "No pending actions. You're all caught up!" + `Recenter` button.
- Search: "No candidates match these skills. Try broader keywords."

### Global Search
- Floating `Cmd + K` bar for jumping between Vendors, Candidates, and Tickets.

---

## 4. Development Suggested Order

1.  **Phase 1: Foundation**: Auth, Layout, Sidebar, Identity Sync.
2.  **Phase 2: Master Data**: Vendors & Positions CRUD with Table patterns.
3.  **Phase 3: Recruitment**: Kanban board and Candidate submission.
4.  **Phase 4: Finance**: Invoicing workflow and Contract management.
5.  **Phase 5: Operations**: Resource deployment bench and Ticketing.
6.  **Phase 6: Portals**: Refine Vendor-specific views and tenant isolation.
7.  **Phase 7: Governance**: Audit trails and User management.
8.  **Phase 8: Polish**: Animations, Charts, and Mobile responsiveness.
