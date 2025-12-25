\# SmartBiz AI – ERD (Multi-Tenant SaaS)



\## Tenants

TENANT (

&nbsp; id UUID PK,

&nbsp; name TEXT,

&nbsp; created\_at TIMESTAMP

)



\## Users

USER (

&nbsp; id UUID PK,

&nbsp; tenant\_id UUID FK → TENANT.id,

&nbsp; email TEXT UNIQUE,

&nbsp; password TEXT,

&nbsp; name TEXT,

&nbsp; role\_id UUID FK → ROLE.id,

&nbsp; created\_at TIMESTAMP

)



\## Roles

ROLE (

&nbsp; id UUID PK,

&nbsp; tenant\_id UUID FK → TENANT.id,

&nbsp; name TEXT,

&nbsp; description TEXT

)



\## Permissions

PERMISSION (

&nbsp; id UUID PK,

&nbsp; code TEXT UNIQUE,

&nbsp; description TEXT

)



\## RolePermission

ROLE\_PERMISSION (

&nbsp; id UUID PK,

&nbsp; role\_id UUID FK → ROLE.id,

&nbsp; permission\_id UUID FK → PERMISSION.id

)



\## UserRole

USER\_ROLE (

&nbsp; id UUID PK,

&nbsp; user\_id UUID FK → USER.id,

&nbsp; role\_id UUID FK → ROLE.id

)



\## Plans

PLAN (

&nbsp; id UUID PK,

&nbsp; name TEXT,

&nbsp; price NUMERIC,

&nbsp; limits JSONB,

&nbsp; created\_at TIMESTAMP

)



\## Subscriptions

SUBSCRIPTION (

&nbsp; id UUID PK,

&nbsp; tenant\_id UUID FK → TENANT.id,

&nbsp; plan\_id UUID FK → PLAN.id,

&nbsp; status TEXT,

&nbsp; renew\_at TIMESTAMP

)



\## Invoice

INVOICE (

&nbsp; id UUID PK,

&nbsp; tenant\_id UUID FK → TENANT.id,

&nbsp; subscription\_id UUID FK → SUBSCRIPTION.id,

&nbsp; amount NUMERIC,

&nbsp; status TEXT,

&nbsp; created\_at TIMESTAMP

)



\## Payment

PAYMENT (

&nbsp; id UUID PK,

&nbsp; invoice\_id UUID FK → INVOICE.id,

&nbsp; tenant\_id UUID FK → TENANT.id,

&nbsp; provider TEXT,

&nbsp; status TEXT,

&nbsp; created\_at TIMESTAMP

)



\## Conversations

CONVERSATION (

&nbsp; id UUID PK,

&nbsp; tenant\_id UUID FK → TENANT.id,

&nbsp; customer\_name TEXT,

&nbsp; created\_at TIMESTAMP

)



\## Messages

MESSAGE (

&nbsp; id UUID PK,

&nbsp; tenant\_id UUID FK → TENANT.id,

&nbsp; conversation\_id UUID FK → CONVERSATION.id,

&nbsp; sender TEXT,

&nbsp; content TEXT,

&nbsp; created\_at TIMESTAMP

)



\## WhatsApp Session

WHATSAPP\_SESSION (

&nbsp; id UUID PK,

&nbsp; tenant\_id UUID FK → TENANT.id,

&nbsp; phone\_number TEXT,

&nbsp; status TEXT,

&nbsp; created\_at TIMESTAMP

)



\## Audit Logs

AUDIT\_LOG (

&nbsp; id UUID PK,

&nbsp; tenant\_id UUID FK → TENANT.id,

&nbsp; user\_id UUID FK → USER.id,

&nbsp; action TEXT,

&nbsp; metadata JSONB,

&nbsp; created\_at TIMESTAMP

)



\## Coupon

COUPON (

&nbsp; id UUID PK,

&nbsp; code TEXT UNIQUE,

&nbsp; discount NUMERIC,

&nbsp; expires\_at TIMESTAMP

)

