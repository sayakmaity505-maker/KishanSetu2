You are an expert full-stack software architect, React/React Native developer,
Python FastAPI developer, UI/UX designer, database architect and agricultural
technology solution designer.

Your task is to BUILD a complete functional application and website called:

                         🌾 Kishanसेतु

              "किसान और केंद्र के बीच एक स्मार्ट सेतु"

Kishanसेतु is a digital agricultural procurement platform that connects
farmers with authorized procurement centres.

The system must digitize and connect the complete journey:

FARMER ONBOARDING
        ↓
HOME DASHBOARD
        ↓
SLOT BOOKING
        ↓
CENTRE DECISION
        ↓
WEIGHMENT
        ↓
BILL
        ↓
PAYMENT
        ↓
AUDIT

IMPORTANT:
The uploaded technical approach/process-flow diagram is the reference
architecture for this application.

You MUST follow the technology stack, platform architecture and process
flow described below.

Do not simplify the workflow into a generic farmer app.

Do not create only a UI mockup.

Build a FUNCTIONAL prototype with connected screens, working navigation,
backend APIs, realistic demo data, state changes and end-to-end workflow.

============================================================
                    1. TECHNOLOGY STACK
============================================================

FRONTEND — WEB
• React
• React-based Centre Agent Console
• React-based Admin Console

FARMER MOBILE APP
• React Native
• Android-first
• Mobile-first UX

BACKEND
• Python
• FastAPI
• REST APIs
• Queue Engine
• Notification Service

TELEPHONY
• SMS / IVR Gateway
• Exotel / Twilio India integration-ready

VOICE & LANGUAGE
• Bhashini API integration-ready
• Multilingual voice interaction
• Speech-to-text
• Text-to-speech

DATABASE
• PostgreSQL
• PostGIS for centre/geographical data

CLOUD & DEPLOYMENT
• Docker
• AWS/Azure ready

============================================================
                    2. PLATFORM ARCHITECTURE
============================================================

Implement this exact logical architecture:

                     DATA SOURCES
                           ↓
        ┌─────────────────────────────────────┐
        │ State Procurement APIs              │
        │ Farmer Registration Data             │
        │ Centre Capacity Data                │
        └─────────────────────────────────────┘
                           ↓
                       BACKEND
        ┌─────────────────────────────────────┐
        │ Python + FastAPI                    │
        │                                     │
        │ Queue Engine                        │
        │ Notification Service                │
        │ REST APIs                           │
        │ Authentication                      │
        │ Business Logic                      │
        └─────────────────────────────────────┘
                           ↓
                       FRONTEND
        ┌─────────────────────────────────────┐
        │ React Native Farmer App             │
        │ React Centre Agent Console          │
        │ React Admin Console                 │
        └─────────────────────────────────────┘
                           ↓
                        ACCESS
        ┌─────────────────────────────────────┐
        │ Farmer App                          │
        │ SMS / IVR                           │
        │ Centre Agent Console                │
        │ Admin Console                       │
        └─────────────────────────────────────┘

DATABASE LAYER:

PostgreSQL
      +
PostGIS

External communication:

Bhashini
Exotel/Twilio
Government/State Procurement APIs

For the prototype, external APIs can be mocked, but the architecture
must be integration-ready.

============================================================
             3. MOST IMPORTANT — PROCESS FLOW
============================================================

The process flow MUST exactly follow this structure.

------------------------------------------------------------
                    FARMER APP
------------------------------------------------------------

FARMER APP consists of these five primary stages:

1. ONBOARDING & KYC
2. HOME DASHBOARD
3. BOOK A SLOT
4. AWAIT DECISION
5. POST-COLLECTION

The sequence MUST be:

1. Onboarding & KYC
        ↓
2. Home Dashboard
        ↓
3. Book a Slot
        ↓
4. Await Decision
        ↓
5. Post-Collection

Do NOT allow the farmer to bypass the required stages.

============================================================
             FARMER STEP 1 — ONBOARDING & KYC
============================================================

Create a simple onboarding experience.

The farmer enters:

• Mobile number
• OTP
• Name
• State
• District
• Block
• Village
• Farmer ID

KYC verification should support:

• Aadhaar verification
• Land record verification
• Farmer registration verification

The process should display:

✓ Aadhaar verified
✓ Land record verified

After successful verification:

STATUS:
🟢 KYC VERIFIED

IMPORTANT:
Never expose the complete Aadhaar number.

Use masked information such as:

XXXX XXXX 4582

The KYC status must be available to the Centre Agent during
booking/request verification.

============================================================
             FARMER STEP 2 — HOME DASHBOARD
============================================================

After successful KYC, take the farmer to:

HOME DASHBOARD

The dashboard must show exactly the information needed to proceed
with procurement.

Display:

Farmer Name

KYC Status

Available Procurement Centres

Centre Status

Current Crop Prices / MSP

Centre Capacity

Existing Bookings

Upcoming Slot

Queue Status

Bills

Payment & P&L / transaction information

Create large action buttons:

📍 Find Centre
💰 Check Price
📅 Book a Slot
🎫 My Booking
📊 My Transactions
💳 Payment Status

The farmer should be able to understand the dashboard without
technical knowledge.

============================================================
             FARMER STEP 3 — BOOK A SLOT
============================================================

The farmer selects:

1. Crop
2. Quantity
3. Procurement Centre
4. Date
5. Available time slot

Example:

Crop:
Wheat

Quantity:
50 Quintal

Centre:
Government Wheat Procurement Centre

Date:
12 September 2026

Available slots:

09:00 – 10:00
🟢 Available

10:00 – 11:00
🟢 Available

11:00 – 12:00
🔴 Full

IMPORTANT:

Slot availability MUST come from the backend.

The backend must check:

• Centre capacity
• Existing bookings
• Daily intake limit
• Slot availability

Do not perform the actual business logic only in React Native.

After submitting:

STATUS:

🟡 REQUEST SUBMITTED

Generate:

Booking ID:
KS-2026-001284

Generate a QR code containing the booking reference.

============================================================
             FARMER STEP 4 — AWAIT DECISION
============================================================

After slot booking, the farmer enters:

AWAIT DECISION

The farmer must see:

Booking ID
Crop
Quantity
Centre
Date
Requested slot

Status:

🟡 Awaiting Centre Decision

Possible outcomes:

🟢 ACCEPTED
🔴 REJECTED
🟡 RESCHEDULED

If accepted:

"Your procurement request has been accepted."

If rejected:

Show the authorized rejection reason.

If rescheduled:

Show:

Original slot
New slot
Reason

The Centre Agent controls this decision.

The farmer cannot approve their own request.

============================================================
             FARMER STEP 5 — POST-COLLECTION
============================================================

After the centre completes collection:

POST-COLLECTION

The farmer must see:

Actual Weighment
↓
Bill
↓
Payment

Display:

Scheduled Quantity
Actual Quantity
Quality Grade
Applicable Price
Deductions
Final Payable Amount

Example:

Scheduled:
50 Q

Actual:
48.5 Q

Price:
₹2,585/Q

Gross Amount:
₹1,25,372.50

Quality Deduction:
₹2,500

Final Amount:
₹1,22,872.50

Then:

🧾 BILL GENERATED

↓
💳 PAYMENT INITIATED

↓
🟢 PAYMENT COMPLETED

This completes the Farmer App flow.

============================================================
                    CENTRE PORTAL
============================================================

The Centre Portal MUST also follow the exact five-stage flow:

1. LOGIN & ID CHECK
2. PRICE & CAPACITY
3. MANAGE QUEUE
4. TRANSACTION CLOSING
5. AUDIT EXPORT

Sequence:

LOGIN & ID CHECK
       ↓
PRICE & CAPACITY
       ↓
MANAGE QUEUE
       ↓
TRANSACTION CLOSING
       ↓
AUDIT EXPORT

============================================================
             CENTRE STEP 1 — LOGIN & ID CHECK
============================================================

Create Centre Agent login.

Fields:

Centre ID
Agent ID
Password / OTP

After authentication:

Verify that the agent is authorized for that centre.

Display:

Centre Name
Centre ID
Agent Name
Authorization Status

Example:

Government Procurement Centre
Centre ID: CTR-024

Agent:
Rajesh Kumar

Status:
🟢 Authorized

If the centre/agent is not approved:

🔴 ACCESS DENIED

Do not allow unauthorized agents to manage procurement.

============================================================
             CENTRE STEP 2 — PRICE & CAPACITY
============================================================

Centre Agent dashboard must allow authorized agents to view/manage:

• MSP / procurement price
• Crop
• Daily intake capacity
• Remaining capacity
• Available slots

Example:

Wheat

Price:
₹2,585 / Quintal

Daily Capacity:
1,200 Quintal

Booked:
850 Quintal

Remaining:
350 Quintal

The system must use backend validation.

Every price/capacity modification must create an audit log.

============================================================
             CENTRE STEP 3 — MANAGE QUEUE
============================================================

This is the operational core of Kishanसेतु.

The Centre Agent receives farmer requests.

Display:

Booking ID
Farmer
Crop
Quantity
Requested Slot
KYC Status
Request Status

Example:

KS-2026-001284
Ramesh Kumar
Wheat
50 Q
10:30 AM
✓ KYC Verified
🟡 Pending

Actions:

[ ACCEPT ]

[ REJECT ]

[ RESCHEDULE ]

------------------------------------------------------------
ACCEPT
------------------------------------------------------------

When accepted:

Update booking status.

Add farmer to queue.

Notify farmer.

------------------------------------------------------------
REJECT
------------------------------------------------------------

Require a valid rejection reason.

Do not allow blank rejection reasons.

------------------------------------------------------------
RESCHEDULE
------------------------------------------------------------

Allow agent to select:

New date
New time slot

Require a reason.

============================================================
                  QUEUE ENGINE
============================================================

Implement Queue Engine in Python/FastAPI backend.

Queue Engine must:

• Assign queue positions
• Maintain queue order
• Update queue status
• Handle accepted bookings
• Handle cancellations
• Handle rescheduling
• Calculate estimated waiting time
• Update farmer queue position
• Trigger notifications

Example farmer view:

YOUR QUEUE

#17

CURRENTLY SERVING

#12

ESTIMATED WAIT:

45 minutes

The queue logic MUST NOT live only in the frontend.

============================================================
          CENTRE STEP 4 — TRANSACTION CLOSING
============================================================

After farmer arrives at the centre:

Agent scans the farmer's QR code.

System retrieves:

Booking
Farmer
Crop
Quantity
Slot
KYC status

Agent records:

Actual Quantity
Quality Grade
Moisture / quality data
Authorized deductions

Example:

Scheduled:
50 Q

Actual:
48.5 Q

Quality:
A

Then backend performs transaction calculation.

FORMULA:

Gross Amount =
Actual Accepted Quantity × Applicable Price

Net Amount =
Gross Amount - Authorized Deductions

Display the entire calculation.

Example:

48.5 Q × ₹2,585

Gross:
₹1,25,372.50

Quality Deduction:
₹2,500

Other Deduction:
₹0

NET PAYABLE:
₹1,22,872.50

All calculation must happen in FastAPI.

============================================================
               POST-COLLECTION BILL
============================================================

After transaction closing:

Generate a digital bill.

Bill must include:

Kishanसेतु
Digital Procurement Receipt

Transaction ID
Booking ID
Farmer ID
Centre ID
Centre Name
Crop
Scheduled Quantity
Actual Quantity
Price
Gross Amount
Deductions
Net Amount
Date
Time
Agent ID

Generate QR verification code.

Buttons:

[ View Bill ]
[ Download Bill ]

============================================================
             CENTRE STEP 5 — AUDIT EXPORT
============================================================

After transaction closing, all transaction records must be available
for authorized audit.

Create:

AUDIT EXPORT

Allow:

CSV
Excel-compatible export
PDF-ready report

Include:

Transaction ID
Booking ID
Farmer ID
Centre
Crop
Quantity
Price
Gross Amount
Deductions
Net Amount
Agent
Timestamp
Status

Every important action must have an audit trail.

============================================================
                    4. CRITICAL FLOW CONNECTIONS
============================================================

The two process flows MUST communicate with each other.

FARMER APP:

Onboarding & KYC
       ↓
Home Dashboard
       ↓
Book Slot
       ↓
Await Decision
       ↓
Post-Collection

CENTRE PORTAL:

Login & ID Check
       ↓
Price & Capacity
       ↓
Manage Queue
       ↓
Transaction Closing
       ↓
Audit Export

CONNECT THEM as follows:

FARMER:
Book Slot
      ↓
CENTRE:
Manage Queue

CENTRE:
Accept / Reject / Reschedule
      ↓
FARMER:
Await Decision

CENTRE:
Transaction Closing
      ↓
FARMER:
Post-Collection

CENTRE:
Audit Export
      ↓
ADMIN / GOVERNMENT AUDITOR

This connection is ESSENTIAL.

============================================================
                   5. DATA FLOW
============================================================

Example complete data flow:

Farmer registers
      ↓
FastAPI
      ↓
PostgreSQL
      ↓
KYC status updated
      ↓
Farmer dashboard
      ↓
Centre discovery using PostGIS
      ↓
Price & capacity retrieved
      ↓
Farmer books slot
      ↓
FastAPI creates booking
      ↓
Queue/booking system
      ↓
Centre Agent receives request
      ↓
Agent accepts
      ↓
Queue Engine updates queue
      ↓
Notification Service informs farmer
      ↓
Farmer arrives
      ↓
Centre scans QR
      ↓
Weighment recorded
      ↓
FastAPI calculates bill
      ↓
Transaction stored
      ↓
Payment status updated
      ↓
Farmer receives bill/payment notification
      ↓
Admin/Auditor can see transaction
      ↓
Audit Export

============================================================
                    6. NOTIFICATION SERVICE
============================================================

Build a dedicated Notification Service in the FastAPI backend.

Supported channels:

• App Push Notification
• SMS
• IVR

Notifications:

After booking:

"Your procurement request KS-2026-001284 has been submitted."

After acceptance:

"Your procurement request has been accepted."

After rejection:

"Your request has been rejected.
Reason: [reason]"

After rescheduling:

"Your slot has been rescheduled to 12 September,
10:30 AM."

Queue:

"You are #5 in the queue."

Weighment:

"Your crop weighment has been completed."

Bill:

"Your digital procurement bill is ready."

Payment:

"Your payment has been initiated."

============================================================
                       7. SMS / IVR
============================================================

Kishanसेतु MUST also support farmers who do not have smartphones.

Architecture:

Farmer
  ↓
SMS / IVR
  ↓
Exotel / Twilio India
  ↓
FastAPI
  ↓
Database / Queue / Booking
  ↓
Response

Example SMS:

"Kishanसेतु:
Booking KS-2026-001284 confirmed.
Centre: Burdwan
Date: 12 Sept
Time: 10:30 AM."

IVR example:

"किशानसेतु में आपका स्वागत है।"

"भाषा चुनने के लिए 1 दबाएं।"

"अपने स्लॉट की जानकारी के लिए 2 दबाएं।"

"भुगतान की जानकारी के लिए 3 दबाएं।"

============================================================
                       8. BHASHINI
============================================================

Integrate Bhashini API-ready voice/language architecture.

Create a large button:

🎙️ बोलकर पूछें

Example:

Farmer:
"मेरा स्लॉट कब है?"

System:
"आपका स्लॉट 12 सितंबर को सुबह 10:30 बजे है।"

Farmer:
"मेरी पेमेंट कब आएगी?"

System:
"आपकी पेमेंट अभी प्रोसेसिंग में है।"

Support Indian languages.

If information cannot be verified:

"इस जानकारी की पुष्टि केंद्र से करना आवश्यक है।"

Never invent government prices or payment information.

============================================================
                       9. POSTGRESQL + POSTGIS
============================================================

Use PostgreSQL for application data.

Use PostGIS for geographic centre information.

Tables:

users
farmers
farmer_kyc
land_records

procurement_centres
centre_agents

crops
crop_prices
centre_capacity

slots
booking_requests
queue_entries

weighments
transactions
payments

notifications
complaints
audit_logs

PostGIS should support:

Find nearest centre
Distance calculation
Centre radius search
District/state geographic filtering

============================================================
                      10. ADMIN CONSOLE
============================================================

Create a separate React Admin Console.

Admin dashboard:

TOTAL FARMERS
ACTIVE CENTRES
TODAY'S BOOKINGS
PENDING REQUESTS
COMPLETED TRANSACTIONS
TOTAL PROCUREMENT
TOTAL PROCUREMENT VALUE
PENDING PAYMENTS

Analytics:

Crop-wise procurement
Centre-wise procurement
District-wise procurement
Capacity utilization
Queue statistics
Booking status
Payment status

Admin can:

• Manage farmers
• Manage centres
• Manage centre agents
• View bookings
• View transactions
• View payments
• View audit logs
• Export reports

============================================================
                    11. SECURITY
============================================================

Implement:

• OTP authentication
• JWT/session authentication
• Role-based access control
• API validation
• Rate limiting
• Secure database access
• Sensitive-data masking
• Audit logging

Roles:

FARMER
CENTRE_AGENT
ADMIN
GOVERNMENT_AUDITOR

Permissions must be strictly separated.

============================================================
                    12. RESPONSIVE UX
============================================================

FARMER:

React Native Android-first.

Design for:

• Rural users
• Older smartphones
• Low digital literacy
• Weak internet
• Low bandwidth

Use:

Large buttons
Large fonts
Simple navigation
Icon + text
Minimal typing
Voice support

CENTRE:

React web dashboard.

Optimize for desktop/tablet.

ADMIN:

React web dashboard.

Optimize for analytics and monitoring.

============================================================
                  13. LOW CONNECTIVITY
============================================================

Farmer app should cache:

• Farmer profile
• KYC status
• Booking ID
• Upcoming slot
• Centre information
• Important notifications

If offline:

Show:

⚠️ आप ऑफलाइन हैं।

Allow cached information to be viewed.

Synchronize when internet returns.

============================================================
                 14. DEMO MODE
============================================================

Create a complete DEMO MODE because this is an SIH prototype.

Use realistic simulated data.

Clearly label:

⚠️ DEMO DATA

Create:

10+ farmers
5+ procurement centres
5+ crops
20+ bookings
Multiple queue entries
Multiple transactions
Multiple payment statuses

Example farmer:

Ramesh Kumar

Example centre:

Burdwan Government Procurement Centre

Example booking:

KS-2026-001284

Example:

Wheat
48.5 Quintal
₹2,585/Q

============================================================
               15. COMPLETE LIVE DEMO
============================================================

The prototype MUST support this complete journey:

SCENE 1 — FARMER

Open Kishanसेतु
      ↓
Select Hindi
      ↓
Login with OTP
      ↓
KYC Verified
      ↓
Home Dashboard
      ↓
Find Centre
      ↓
Check Price
      ↓
Check Capacity
      ↓
Book Slot
      ↓
Booking ID generated
      ↓
QR generated

SCENE 2 — CENTRE

Centre Agent Login
      ↓
ID Check
      ↓
View Price & Capacity
      ↓
New Booking appears
      ↓
Manage Queue
      ↓
Accept Request
      ↓
Queue position generated

SCENE 3 — FARMER

Farmer receives notification
      ↓
Booking Accepted
      ↓
Tracks Queue
      ↓
Arrives at Centre

SCENE 4 — CENTRE

Agent scans QR
      ↓
Booking retrieved
      ↓
Actual weight entered
      ↓
Quality entered
      ↓
Transaction calculated
      ↓
Bill generated

SCENE 5 — FARMER

Post-Collection
      ↓
View Weighment
      ↓
View Bill
      ↓
Track Payment
      ↓
Payment Completed
      ↓
Digital Receipt

SCENE 6 — ADMIN

Admin Dashboard
      ↓
View Transaction
      ↓
View Centre
      ↓
View Procurement
      ↓
View Audit Trail
      ↓
Export Audit

============================================================
                16. PROJECT STRUCTURE
============================================================

Create a clean scalable structure:

KISHANSETU/

frontend/
    farmer-mobile/
        React Native application

    centre-console/
        React application

    admin-console/
        React application

backend/
    FastAPI application

    api/
    models/
    schemas/
    services/
    database/
    utils/

    services/
        queue_engine.py
        notification_service.py
        bhashini_service.py
        sms_service.py
        ivr_service.py

database/
    migrations/
    seed_data/

deployment/
    Dockerfile
    docker-compose.yml
    .env.example

documentation/
    API documentation
    architecture documentation

============================================================
                     17. API DESIGN
============================================================

Authentication:

POST /api/auth/send-otp
POST /api/auth/verify-otp

Farmer:

GET /api/farmer/profile
POST /api/farmer/kyc

Centres:

GET /api/centres
GET /api/centres/{id}
GET /api/centres/nearby

Prices:

GET /api/crops/prices

Capacity:

GET /api/centres/{id}/capacity

Bookings:

POST /api/bookings
GET /api/bookings/{id}
POST /api/bookings/{id}/cancel

Centre:

GET /api/centre/bookings
POST /api/centre/bookings/{id}/accept
POST /api/centre/bookings/{id}/reject
POST /api/centre/bookings/{id}/reschedule

Queue:

GET /api/queue/{booking_id}

Weighment:

POST /api/weighments

Transactions:

POST /api/transactions
GET /api/transactions/{id}

Payments:

GET /api/payments/{id}

Notifications:

POST /api/notifications/send

Admin:

GET /api/admin/dashboard
GET /api/admin/analytics

Audit:

GET /api/admin/audit
GET /api/admin/audit/export

============================================================
                  18. UI SCREENS
============================================================

FARMER APP:

1. Splash
2. Language Selection
3. Login
4. OTP
5. Registration
6. KYC
7. KYC Success
8. Home Dashboard
9. Find Centre
10. Centre Details
11. Crop Price
12. Capacity
13. Book Slot
14. Booking Confirmation
15. My Booking
16. Await Decision
17. Accepted
18. Rejected
19. Rescheduled
20. Queue Tracking
21. Post-Collection
22. Weighment
23. Digital Bill
24. Payment
25. Notifications
26. Complaints
27. Voice Assistant
28. Profile

CENTRE CONSOLE:

1. Login
2. ID Verification
3. Dashboard
4. Price & Capacity
5. Booking Requests
6. Manage Queue
7. Booking Details
8. Accept
9. Reject
10. Reschedule
11. QR Scanner
12. Weighment
13. Transaction Closing
14. Bill
15. Payment
16. Audit Export

ADMIN:

1. Login
2. Dashboard
3. Farmers
4. Centres
5. Agents
6. Bookings
7. Procurement
8. Payments
9. Analytics
10. Audit Logs
11. Export Reports

============================================================
                 19. DESIGN PRINCIPLE
============================================================

The entire application should communicate:

                    SIMPLE FOR FARMER
                            +
                    POWERFUL FOR CENTRE
                            +
                    TRANSPARENT FOR GOVERNMENT

Farmer:

Simple + Voice-first + Multilingual

Centre:

Fast + Operational + Queue-focused

Government:

Data + Analytics + Audit

============================================================
                20. CRITICAL BUSINESS RULE
============================================================

The process flow is the backbone of the application.

DO NOT create disconnected pages.

Every action must change the corresponding state.

Example:

BOOK SLOT
     ↓
Booking = PENDING

CENTRE ACCEPT
     ↓
Booking = ACCEPTED
     ↓
Queue entry created

CENTRE REJECT
     ↓
Booking = REJECTED
     ↓
Reason stored
     ↓
Farmer notified

CENTRE RESCHEDULE
     ↓
Booking = RESCHEDULED
     ↓
New slot stored
     ↓
Farmer notified

WEIGHMENT COMPLETE
     ↓
Transaction created

TRANSACTION COMPLETE
     ↓
Bill generated

PAYMENT INITIATED
     ↓
Payment = PROCESSING

PAYMENT COMPLETE
     ↓
Payment = COMPLETED

AUDIT
     ↓
Complete immutable transaction history

============================================================
                  21. FINAL REQUIREMENT
============================================================

The final Kishanसेतु prototype should NOT feel like a generic
agriculture app.

It must specifically demonstrate:

• Farmer onboarding & KYC
• Home dashboard
• Procurement centre discovery
• Price information
• Centre capacity
• Slot booking
• Centre decision
• Queue management
• QR-based arrival
• Weighment
• Transaction closing
• Transparent bill
• Payment tracking
• SMS/IVR support
• Bhashini multilingual voice
• PostgreSQL/PostGIS geographic data
• FastAPI backend
• React Native farmer app
• React Centre Console
• React Admin Console
• Notification Service
• Queue Engine
• Audit Export
• Docker deployment
• AWS/Azure readiness

============================================================
                    FINAL PRODUCT STORY
============================================================

Kishanसेतु should tell one continuous story:

                 👨‍🌾 FARMER
                     ↓
              ONBOARDING & KYC
                     ↓
              HOME DASHBOARD
                     ↓
                BOOK A SLOT
                     ↓
              AWAIT DECISION
                     ↓
                  QUEUE
                     ↓
                 WEIGHMENT
                     ↓
                   BILL
                     ↓
                 PAYMENT
                     ↓
              DIGITAL RECEIPT
                     ↓
              GOVERNMENT AUDIT

At the same time, the Centre follows:

                🏢 CENTRE
                    ↓
             LOGIN & ID CHECK
                    ↓
            PRICE & CAPACITY
                    ↓
              MANAGE QUEUE
                    ↓
           TRANSACTION CLOSING
                    ↓
               AUDIT EXPORT

These two flows must be connected through the FastAPI backend.

The final product statement is:

"Kishanसेतु is a multilingual, voice-enabled digital procurement
platform that creates a transparent bridge between farmers,
procurement centres and government — from KYC and slot booking
to queue management, weighment, payment and audit."

============================================================
          22. GOVERNMENT PORTAL COMPLIANCE & BRANDING
============================================================

Kishanसेतु must LOOK AND FEEL like an authentic Indian government
digital service, following GIGW (Government of India Guidelines
for Websites) conventions — WITHOUT impersonating any real
government identity.

DO NOT:

• Reproduce the actual National Emblem (Ashoka Lion Capital)
• Reproduce the UIDAI/Aadhaar logo
• Use any real ministry's official letterhead, seal, or crest
• Claim live integration with any real government system

DO:

• Use a fictional/generic Kishanसेतु seal or emblem
• Label the platform clearly as:
  "A Digital Agriculture Initiative — SIH 2026 Prototype"
• Follow the VISUAL LANGUAGE of government portals without
  copying protected government marks

------------------------------------------------------------
TOP UTILITY BAR (every screen, web consoles)
------------------------------------------------------------

Skip to Main Content | Screen Reader Access
Font size: A- A A+ | High Contrast Toggle
भाषा: हिंदी / English (top-right, always visible)

------------------------------------------------------------
FOOTER (every screen, web consoles)
------------------------------------------------------------

Terms of Use · Privacy Policy · Accessibility Statement
Sitemap · Contact Us · RTI
Last Updated: [dynamic date]
"Best viewed in Chrome/Firefox, 1366x768 resolution"
"Content Owned by Kishanसेतु Project Team (SIH 2026 Prototype)"

============================================================
          23. GRIEVANCE REDRESSAL MODULE
============================================================

Build a dedicated, ticketed grievance system — not a contact form.
This is standard on real Indian government portals (CPGRAMS-style)
and its absence is immediately noticeable to an evaluator.

FARMER FLOW:

File Grievance
      ↓
Select Category
  (Booking / Payment / Quality Dispute / Agent Behaviour / Other)
      ↓
Enter Description + Optional Photo/Booking ID
      ↓
Grievance ID Generated
  Example: GRV-2026-00341
      ↓
Status Tracker:
  🟡 Registered → 🔵 Under Review → 🟢 Resolved / 🔴 Rejected

ADMIN FLOW:

View all grievances (filterable by centre, category, status, date)
      ↓
Assign to Centre Agent / Admin
      ↓
Respond with resolution note
      ↓
Farmer notified (App/SMS) of resolution
      ↓
Grievance closed with permanent audit record

DATABASE:

grievances table:
  grievance_id, farmer_id, booking_id (nullable), category,
  description, photo_url (nullable), status, assigned_to,
  resolution_note, created_at, resolved_at

API:

POST /api/grievances
GET  /api/grievances/{id}
GET  /api/farmer/grievances
GET  /api/admin/grievances
POST /api/admin/grievances/{id}/respond

============================================================
     24. DATA PRIVACY & CONSENT (DPDP Act, 2023)
============================================================

Kishanसेतु handles Aadhaar, land records, and financial data.
It MUST implement explicit, auditable consent — not implied consent.

ONBOARDING CONSENT SCREEN (mandatory, blocking):

"I consent to Kishanसेतु processing my Aadhaar and land record
data solely for the purpose of procurement verification, as per
the Digital Personal Data Protection Act, 2023."

[ ] I Agree        [ Decline ]

If declined: onboarding halts, no KYC data is stored.
Consent timestamp + version must be logged (consent_logs table).

FARMER PROFILE — DATA RIGHTS PANEL:

📥 Download My Data (JSON/PDF export of all personal records)
🗑️ Request Account Deletion
  → creates an admin-reviewed deletion request, not instant
    (financial/audit records are retained per grievance/audit
    law even after deletion request, and this must be disclosed
    to the farmer on the same screen)

DATABASE:

consent_logs table:
  farmer_id, consent_type, consent_version, granted (bool),
  timestamp, ip_address (nullable for demo)

data_deletion_requests table:
  farmer_id, requested_at, status, reviewed_by, reviewed_at

============================================================
        25. PAYMENT REALISM — PFMS / DBT RAILS
============================================================

Do NOT show a generic "Payment Completed" — real MSP payments
in India move through DBT (Direct Benefit Transfer) via PFMS
(Public Financial Management System) to an Aadhaar-seeded bank
account. The digital receipt must reflect this.

DIGITAL RECEIPT — PAYMENT SECTION MUST SHOW:

Bank Account (masked): XXXXXXXX4821
IFSC (masked): SBIN0XXXXX
UTR Number: UTR2026091234567
PFMS Reference ID: PFMS/WB/2026/0098123
Payment Status: 🟢 Credited / 🟡 Processing / 🔴 Failed - Reason

If Payment Status = Failed:
  Show failure reason (e.g. "Bank account not seeded with
  Aadhaar") and a "Re-initiate Payment" action for the Admin.

Label clearly:
  "PFMS/DBT integration-ready — demo mode simulates the
  settlement response."

============================================================
      26. DATA SOURCE OF TRUTH — MSP PRICES
============================================================

Crop prices must not look hardcoded. State the real-world
integration point explicitly:

"Crop prices integration-ready with CACP (Commission for
Agricultural Costs and Prices) and Agmarknet data feeds.
Demo mode uses static seed values, clearly labeled ⚠️ DEMO PRICE,
refreshed [seed date]."

Every price shown on Farmer/Centre/Admin screens must carry
this demo-price label somewhere visible (small caption, not
hidden) so no judge mistakes it for a live feed claim.

============================================================
            27. DEMO-DAY REQUIREMENTS
============================================================

These matter as much as the architecture — a judge who can't
navigate your prototype in the first 60 seconds marks it down
regardless of backend quality.

LANDING PAGE:

▶ "Start Guided Demo" button
  — auto-walks through Scene 1–6 from the master prompt
    (Farmer → Centre → Farmer → Centre → Farmer → Admin)
    with a "Next Step →" control, so judges are never lost.

DEMO CREDENTIALS PANEL (visible on login screens, not hidden
in documentation):

  Farmer Login       → OTP: 123456
  Centre Agent Login → CTR-024 / agent123
  Admin Login        → admin / demo123

PERMANENT DEMO BADGE (every screen, non-intrusive corner):

  ⚠️ DEMO — Simulated Data. Not Connected to Live Government
  Systems.

This protects you from a judge assuming (and then penalizing
you for) an overclaimed live integration.

============================================================
          28. NON-FUNCTIONAL REQUIREMENTS
============================================================

State these explicitly so the build has real targets, not just
"it should be fast":

PERFORMANCE:
  • Target ≤3 second page load on a simulated 3G connection
  • Farmer app must run acceptably on Android 8+ / 2GB RAM devices

CONCURRENCY (critical — this is a real bug risk):
  • Slot booking MUST use row-level locking or optimistic
    concurrency control in PostgreSQL on the capacity-check step
  • Two farmers requesting the last available slot simultaneously
    must never both succeed — one must receive:
    "🔴 Slot no longer available — please choose another slot."

SCALE (stated target, demo can simulate at smaller scale):
  • Designed for 10,000+ concurrent bookings platform-wide
  • Queue Engine must not degrade linearly with queue size
    (index queue_entries by centre_id + status)

ACCESSIBILITY:
  • WCAG 2.1 AA color contrast on all farmer-facing screens
  • All icons paired with text labels (never icon-only nav)

============================================================
        29. EDGE CASES & FAILURE STATES
============================================================

The flow as originally specified only covers the happy path.
Explicitly build these:

• FARMER CANCELS an accepted booking
    → Booking = CANCELLED, slot released back to capacity,
      queue re-indexed, Centre Agent notified

• DOUBLE-BOOKING RACE
    → Last slot requested by 2 farmers within the same second
      → second request fails cleanly (see Concurrency above)

• KYC / AADHAAR VERIFICATION FAILS
    → Explicit failure screen:
      "🔴 KYC Verification Failed — [reason]. Please visit your
      nearest Common Service Centre (CSC) to update your records."
    → Farmer cannot proceed to booking until resolved

• PAYMENT FAILURE / BOUNCE-BACK
    → Status = 🔴 Failed, reason shown, Admin can re-initiate
      (see Section 25)

• CENTRE AGENT SESSION / AUTHORIZATION REVOKED MID-SHIFT
    → Agent is immediately logged out on next action;
      in-progress unsaved actions are discarded, not partially
      committed

• FARMER MISSES ACCEPTED SLOT (no-show)
    → Booking auto-transitions to NO_SHOW after a grace window,
      slot released, recorded in audit log

============================================================
        30. SCOPE GUARDRAIL — DO NOT ADD
============================================================

To keep Kishanसेतु tightly scoped to the actual problem
statement (wait time, schedule visibility, status uncertainty),
explicitly DO NOT build:

• Open-ended "AI analyzes farmer's personal sales/profit data"
  features. If a financial summary is needed, scope it ONLY to:
  "MSP amount expected vs. amount received for this transaction"
  — nothing broader, and nothing that infers farmer income,
  creditworthiness, or profitability beyond the single booking.

• Any feature that stores or displays a farmer's full Aadhaar
  number, full bank account number, or full IFSC anywhere in
  the UI — masked display only, everywhere, always (Section 22
  of the original prompt already requires this for Aadhaar;
  this extends the same rule to all financial identifiers).

============================================================
                    BUILD INSTRUCTION
============================================================

Build the complete working prototype now, including every
section above — the original process-flow specification AND
the Government Portal Compliance / Demo-Day addendum. Treat
both as one unified requirement set.   CREATE ME A WEBSITE /APP    