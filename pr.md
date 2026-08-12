# PR Title
feat: implement end-to-end counsellor booking, registration, and management flow across student, counsellor, and admin apps

## Summary
This branch delivers the first major feature set for CampusCare across the platform:

- Student app: sidebar, daily check-in UI, peer support forum UI, counsellor discovery, and counsellor booking flow.
- Counsellor app: appointments dashboard, institutional data integration, chat UI, and invitation/management workflow.
- Admin app: sidebar, counsellor management pages, registration form connectivity, and backend integration.
- Backend and database: authentication scaffolding, student/counsellor/institution TRPC routes, Prisma schema updates, and initial migration setup.

## What is included
### Student experience
- Added a redesigned student sidebar with all core application navigation.
- Implemented daily check-in UI.
- Added peer support forum UI for student engagement.
- Implemented counsellor booking frontend and connected it to backend services.
- Added TRPC support for fetching counsellors and student-related data.
- Connected registration forms to backend APIs.

### Counsellor experience
- Implemented counsellor registration and backend support.
- Added institutions page connected to backend data.
- Added appointments page with modularized structure.
- Added chat UI basics and counselling management workflows.
- Fixed bugs related to invitation flows for counsellors marked as LEFT or REJECTED.
- Improved counsellor booking page UI.

### Admin experience
- Implemented admin sidebar UI.
- Built counsellor management frontend and connected it to backend.
- Added institution creation and registration-related frontend flow.
- Connected admin dashboard pages to backend APIs.

### Backend and data layer
- Initial backend structure, logging, and router setup.
- Added authentication flow and related auth routes.
- Implemented backend support for student, counsellor, and institution creation/management.
- Added TRPC endpoints for communication between frontend and backend.
- Updated Prisma schema and generated the initial migration for the database model.

## Commit groups represented in this branch
- Initial project setup and frontend scaffolding for apps and shared UI packages.
- Student login, registration, and base UI creation.
- Institutions, counsellor registration, and backend creation flow.
- Admin-side management features and counsellor invitation logic.
- Student booking flow, TRPC integration, and UI refinements.
- Counsellor booking page modifications and final frontend polish.

## Notes
This branch represents a substantial integration of the initial CampusCare product features across all user roles. It includes both UI implementation and backend/data wiring, laying the foundation for the next phase of testing, bug fixing, and production hardening.
