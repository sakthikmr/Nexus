# Coherent Nexus VMP - REST API Specification

## 1. Architecture Overview
- **Base URL**: `/api/v1`
- **Format**: JSON
- **Auth**: Firebase ID Tokens (Bearer)
- **Tenant Isolation**: `X-Vendor-ID` header required for Vendor Persona; Backend validates `uid` path vs `vendorId`.

## 2. API Modules & Endpoints

### AUTH & USERS
| Method | Endpoint | Purpose | Persona |
|--------|----------|---------|---------|
| GET | `/auth/me` | Get current user profile & permissions | ALL |
| GET | `/users` | List all system users (with filters) | ADMIN |
| POST | `/users` | Create new system user | ADMIN |
| PATCH | `/users/:id` | Update user role/status | ADMIN |
| DELETE | `/users/:id` | Archive user (Soft delete) | ADMIN |

### VENDORS & ONBOARDING
| Method | Endpoint | Purpose | Persona |
|--------|----------|---------|---------|
| GET | `/vendors` | List vendors (Risk/Score filters) | ADMIN |
| POST | `/vendors` | Initiate new vendor onboarding | ADMIN |
| GET | `/vendors/:id` | Detailed vendor 360 view | ADMIN, VENDOR(Self) |
| GET | `/vendors/:id/onboarding` | Current onboarding stage & docs | ADMIN, VENDOR(Self) |
| POST | `/vendors/:id/assessments` | Submit section-wise responses | VENDOR |
| PATCH | `/vendors/:id/status` | Advance onboarding stage | ADMIN |

### PROCUREMENT & REQUIREMENTS
| Method | Endpoint | Purpose | Persona |
|--------|----------|---------|---------|
| GET | `/procurement` | List all open requirements | ALL |
| POST | `/procurement` | Create new SOW/Resource Req | ADMIN |
| POST | `/procurement/:id/bids` | Submit vendor bid | VENDOR |
| GET | `/procurement/:id/bids` | Compare bids | ADMIN |

### RECRUITMENT & CANDIDATES
| Method | Endpoint | Purpose | Persona |
|--------|----------|---------|---------|
| GET | `/positions` | List open positions | ALL |
| GET | `/candidates` | List candidates (cross-vendor) | ADMIN |
| POST | `/candidates` | Submit candidate (Vendor specific) | VENDOR |
| PATCH | `/candidates/:id/stage` | Move candidate through funnels | ADMIN |
| POST | `/candidates/:id/feedback` | Post interview feedback | ADMIN |

### FINANCE (CONTRACTS & INVOICES)
| Method | Endpoint | Purpose | Persona |
|--------|----------|---------|---------|
| GET | `/contracts` | List active contracts | ADMIN, VENDOR(Self) |
| GET | `/invoices` | List invoices (Status filters) | ADMIN, VENDOR(Self) |
| POST | `/invoices` | Submit new invoice (XML/PDF upload) | VENDOR |
| PATCH | `/invoices/:id/approve` | Approve for payment | FINANCE |

### SUPPORT (TICKETS)
| Method | Endpoint | Purpose | Persona |
|--------|----------|---------|---------|
| GET | `/tickets` | List tickets | ALL |
| POST | `/tickets` | Raise new support ticket | ALL |
| POST | `/tickets/:id/comments` | Add thread comment | ALL |

## 3. Sample Payloads

### POST /api/v1/candidates (Submit Candidate)
```json
{
  "positionId": "POS-001",
  "name": "Jane Doe",
  "experience": 8,
  "skills": ["Java", "Spring", "AWS"],
  "currentCompany": "Tech Solutions",
  "resumeUrl": "https://storage.nexus.com/resumes/jane_doe.pdf",
  "vendorId": "V001",
  "source": "Vendor"
}
```

### POST /api/v1/invoices (Submit Invoice)
```json
{
  "vendorId": "V001",
  "contractId": "CON-2024-05",
  "billingPeriod": "2024-05",
  "items": [
    { "description": "Senior Java Developer (Alex Rivera)", "hours": 160, "rate": 95, "total": 15200 }
  ],
  "totalAmount": 15200,
  "currency": "USD"
}
```

## 4. Admin Masters & System
- `GET /masters/categories`: List valid vendor categories.
- `GET /masters/stages`: List recruitment funnel stages.
- `POST /system/audit`: Fetch audit logs with resource filters.

## 5. Bulk & Export
- `POST /bulk/candidates/upload`: CSV ingestion for candidate batches.
- `GET /exports/vendors/summary`: Generate Excel/PDF vendor risk report.
- `GET /exports/finance/aging`: Generate invoice aging report.
