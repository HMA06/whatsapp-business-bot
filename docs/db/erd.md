\# ERD – SmartBiz AI (Multi-Tenant SaaS)



---



\## 📌 1. Tenant / Account

\- id (PK, uuid)

\- name (text)

\- domain (text, nullable)

\- created\_at (timestamp)



---



\## 📌 2. Users

\- id (PK, uuid)

\- tenant\_id (FK → tenants.id)

\- email (text)

\- password\_hash (text)

\- full\_name (text)

\- status (enum: active/suspended)

\- created\_at (timestamp)



Relation:

\- tenant 1 → many users



---



\## 📌 3. Roles

\- id (PK, uuid)

\- tenant\_id (FK, nullable → tenants.id)  # Global or tenant-defined

\- name (text)

\- created\_at (timestamp)



Relation:

\- tenant 1 → many roles (optional, for custom roles)



---



\## 📌 4. Permissions

\- id (PK, uuid)

\- code (text)  # e.g. users.read, billing.manage



Global table



---



\## 📌 5. RolePermissions (many-to-many)

\- role\_id (FK → roles.id)

\- permission\_id (FK → permissions.id)



Relation:

\- role many ↔ many permissions



---



\## 📌 6. UserRoles (many-to-many)

\- user\_id (FK → users.id)

\- role\_id (FK → roles.id)



Relation:

\- user many ↔ many roles



---



\## 📌 7. Plans

\- id (PK, uuid)

\- name (text)

\- price\_monthly (numeric)

\- features (jsonb)



---



\## 📌 8. Subscriptions

\- id (PK, uuid)

\- tenant\_id (FK → tenants.id)

\- plan\_id (FK → plans.id)

\- status (active, cancelled, expired)

\- current\_period\_end (timestamp)



Relation:

\- tenant 1 → 1 subscription

\- plan 1 → many subscriptions



---



\## 📌 9. Invoices

\- id (uuid PK)

\- tenant\_id (FK → tenants.id)

\- amount (numeric)

\- status (paid, unpaid)

\- created\_at (timestamp)



---



\## 📌 10. Payments

\- id (uuid PK)

\- invoice\_id (FK → invoices.id)

\- provider (stripe / paypal)

\- status (success / failed)

\- created\_at (timestamp)



---



\## 📌 11. Conversations

\- id (uuid PK)

\- tenant\_id (FK → tenants.id)

\- customer\_name (text)

\- updated\_at (timestamp)



Relation:

\- tenant 1 → many conversations



---



\## 📌 12. Messages

\- id (uuid PK)

\- conversation\_id (FK → conversations.id)

\- sender (customer/agent/ai)

\- content (text)

\- created\_at (timestamp)



Relation:

\- conversation 1 → many messages



---



\## 📌 13. WhatsAppSessions

\- id (uuid PK)

\- tenant\_id (FK → tenants.id)

\- phone\_number (text)

\- status (connected/disconnected)

\- client\_token (text)



---



\## 📌 14. AuditLog

\- id (uuid PK)

\- tenant\_id (FK → tenants.id)

\- user\_id (FK → users.id)

\- action (text)

\- meta (jsonb)

\- created\_at (timestamp)



---



\## 📌 15. Coupons

\- id (uuid PK)

\- code (text)

\- discount\_percent (int)

\- expires\_at (timestamp)



---



