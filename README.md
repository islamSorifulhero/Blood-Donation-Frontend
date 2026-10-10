# 🩸 RaktoSheba — Blood Donation & Emergency Assistance Platform

A modern, role-based blood donation and emergency assistance platform built with **Next.js 16, TypeScript, and Tailwind CSS v4**. RaktoSheba connects blood donors and hospitals, helping streamline donor management, hospital verification, and emergency blood donation workflows.

The frontend communicates with a separately deployed REST API and implements secure authentication flows, role-based dashboards, and real backend data integration.

## 🌐 Live Demo & Resources

| Resource | Link |
|---|---|
| **Live Frontend** | [RaktoSheba Frontend](https://blood-donation-frontend2026.vercel.app) |
| **Live Backend API** | [Backend API](https://blood-donation-backend-bice.vercel.app) |
| **Frontend Repository** | [GitHub — Frontend](https://github.com/islamSorifulhero/Blood-Donation-Frontend) |
| **Backend Repository** | [GitHub — Backend](https://github.com/islamSorifulhero/Blood-Donation-Backend) |
| **API Documentation** | [Postman API Documentation](https://documenter.getpostman.com/view/54865231/2sBYAvvqZz) |
| **Demo Video** | [Watch Project Demo](https://drive.google.com/file/d/1rvqAotXv5MoZpe8bevRFKlQGLUc3sUMn/view?usp=sharing) |

## ✨ Key Features

### 🔐 Authentication & Authorization
- User registration and login with form validation.
- Separate registration flows for donors and hospitals.
- Role-based access for Admin, Donor, and Hospital users.
- Secure access-token management using Zustand.
- Automatic access-token refresh on unauthorized API responses.
- Same-origin authentication proxy using Next.js Route Handlers.
- HTTP-only refresh-token cookie managed by the frontend server.
- Middleware-based role-aware route protection.
- Logout with refresh-token revocation.

### 🩸 Donor Dashboard
- View personal donor profile information.
- Toggle blood donation availability.
- Access a dedicated donor dashboard.

### 🏥 Hospital Dashboard
- View hospital profile information.
- Check hospital verification status.
- Access a dedicated hospital dashboard.

### 🛡️ Admin Dashboard
- View live dashboard statistics fetched from the backend.
- Access a dedicated administrative dashboard.
- Role-restricted access to administrative routes.

### 🎨 User Interface & Experience
- Responsive, modern interface with a healthcare-focused visual identity.
- Custom shadcn-style UI components.
- Crimson, pine, amber, slate, and ink design system.
- Newsreader and IBM Plex Sans typography.
- Donor and hospital registration tabs.
- City selection with automatic latitude and longitude population.
- Loading, error, and not-found boundaries.
- Reusable form components powered by React Hook Form and Zod.

### ⚙️ API Integration
- Centralized Axios API client.
- Automatic Bearer access-token attachment.
- Deduplicated refresh requests when multiple API calls fail with `401`.
- Automatic retry of requests after successful token refresh.
- Real backend data integration instead of fabricated dashboard statistics.

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework and App Router |
| [React](https://react.dev/) | User interface |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling and responsive design |
| [Zustand](https://zustand.docs.pmnd.rs/) | Client-side authentication state |
| [TanStack Query](https://tanstack.com/query/latest) | Server-state and data-fetching management |
| [Axios](https://axios-http.com/) | HTTP requests and API integration |
| [React Hook Form](https://react-hook-form.com/) | Form management |
| [Zod](https://zod.dev/) | Schema validation |
| [Recharts](https://recharts.org/) | Planned dashboard charts |
| [Stripe](https://stripe.com/) / SSLCommerz | Planned payment integration |
| [Vercel](https://vercel.com/) | Frontend deployment |

## 🏗️ Authentication Architecture

The frontend and backend are deployed on separate domains. The backend issues its refresh token as an HTTP-only cookie scoped to the backend domain. Browser JavaScript running on the frontend cannot directly access that cookie.

RaktoSheba solves this cross-domain authentication problem using a **Backend-for-Frontend (BFF) authentication proxy** implemented with Next.js Route Handlers.

```text
                       Browser
                          |
                          v
                Next.js Auth Proxy
                /api/auth/login
                          |
                          v
                   Express Backend
                          |
              Authentication succeeds
                          |
                          v
             Backend returns Set-Cookie
                          |
                          v
               Next.js Route Handler
               captures refresh token
                          |
                          v
             Frontend-domain HTTP-only
                 rakto_refresh cookie
                          |
                          v
               Access token returned
                  to the browser
                          |
                          v
                Zustand Auth Store
```

### Token Refresh Flow

```text
1. Browser sends an API request with the access token.
2. Backend responds with 401 when the token is no longer valid.
3. Axios intercepts the response.
4. The frontend calls /api/auth/refresh.
5. The Next.js Route Handler reads the HTTP-only cookie.
6. The refresh token is forwarded to the backend.
7. The backend validates the token and issues a new access token.
8. The frontend updates its auth store.
9. The original request is retried.
```

Concurrent `401` responses share a single refresh operation to avoid unnecessary refresh requests.

### Authentication Implementation

- `app/api/auth/_proxy.ts` — Shared authentication proxy helper.
- `app/api/auth/login/route.ts` — Login proxy.
- `app/api/auth/register/donor/route.ts` — Donor registration proxy.
- `app/api/auth/register/hospital/route.ts` — Hospital registration proxy.
- `app/api/auth/refresh/route.ts` — Refresh-token handling.
- `app/api/auth/logout/route.ts` — Logout and cookie clearing.
- `lib/api-client.ts` — Axios client, Bearer token attachment, refresh handling, and request retry.
- `store/auth-store.ts` — Zustand authentication store and role-cookie synchronization.
- `middleware.ts` — Role-aware route guarding.

> **Security note:** The `role` cookie is used only for user experience and navigation. It is not a trusted authorization mechanism. The backend must enforce authentication and role-based permissions on protected API endpoints. The refresh token is kept in an HTTP-only cookie, while the short-lived access token is held in the client-side auth store.

## 👥 User Roles

| Role | Responsibilities |
|---|---|
| **Admin** | View dashboard statistics and manage administrative workflows. |
| **Donor** | View personal profile information and manage donation availability. |
| **Hospital** | View hospital profile information and verification status. |

Additional management features are planned for upcoming development phases.

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js (a version compatible with Next.js 16).
- npm.
- Git.
- Access to the deployed RaktoSheba backend or a locally running backend instance.

### 1. Clone the Repository

```bash
git clone https://github.com/islamSorifulhero/Blood-Donation-Frontend.git
cd Blood-Donation-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

On Windows Command Prompt, you can use:

```cmd
copy .env.example .env.local
```

Update `.env.local` with the appropriate values:

```env
# Backend API
NEXT_PUBLIC_API_URL=https://blood-donation-backend-bice.vercel.app/api/v1

# Demo Admin Credentials
NEXT_PUBLIC_DEMO_ADMIN_EMAIL=admin@blooddonation.app
NEXT_PUBLIC_DEMO_ADMIN_PASSWORD=ChangeMe123!

# Demo Donor Credentials
NEXT_PUBLIC_DEMO_DONOR_NAME=Demo Donor
NEXT_PUBLIC_DEMO_DONOR_EMAIL=your_registered_donor_email
NEXT_PUBLIC_DEMO_DONOR_PASSWORD=your_registered_donor_password

# Demo Hospital Credentials
NEXT_PUBLIC_DEMO_HOSPITAL_NAME=Demo Hospital
NEXT_PUBLIC_DEMO_HOSPITAL_EMAIL=your_registered_hospital_email
NEXT_PUBLIC_DEMO_HOSPITAL_PASSWORD=your_registered_hospital_password
```

**Important:**
- Keep the API URL consistent with the backend's configured base path.
- The donor and hospital demo accounts must be registered through the application before using their demo login buttons.
- Replace the donor and hospital placeholder credentials with the actual registered account credentials.
- Ensure the admin credentials match the seeded admin account configured in the backend environment.
- Never commit `.env.local` or real credentials to GitHub.
- Variables prefixed with `NEXT_PUBLIC_` are exposed to browser-side code after the application is built. Do not put secrets that must remain private in these variables.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
```

Start the production server locally:

```bash
npm run start
```

### 6. Run Code Quality Checks

```bash
npx tsc --noEmit
npx eslint .
```

## 🔑 Demo Login

RaktoSheba includes one-click demo login options for Admin, Donor, and Hospital users.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@blooddonation.app` | `ChangeMe123!` |
| Donor | Configure in `.env.local` | Configure in `.env.local` |
| Hospital | Configure in `.env.local` | Configure in `.env.local` |

**Admin:** The admin account is expected to be seeded by the backend. The demo credentials must match the backend's actual seed configuration.

**Donor:** Register a donor account using the credentials configured in `.env.local`.

**Hospital:** Register a hospital account using the configured credentials. Log in as an admin and verify the hospital if verification is required for its intended workflow.

> Demo login depends on the availability of the deployed backend and valid account credentials. For security, change any publicly exposed demo password before using the account for sensitive operations.

## 📁 Project Structure

The main application structure follows the Next.js App Router convention.

```text
Blood-Donation-Frontend/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── _proxy.ts
│   │       ├── login/
│   │       │   └── route.ts
│   │       ├── logout/
│   │       │   └── route.ts
│   │       ├── refresh/
│   │       │   └── route.ts
│   │       └── register/
│   │           ├── donor/
│   │           │   └── route.ts
│   │           └── hospital/
│   │               └── route.ts
│   ├── globals.css
│   ├── error.tsx
│   ├── not-found.tsx
│   └── ...
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── separator.tsx
│       ├── skeleton.tsx
│       ├── tabs.tsx
│       ├── select.tsx
│       └── ...
├── lib/
│   └── api-client.ts
├── store/
│   └── auth-store.ts
├── middleware.ts
├── public/
├── .env.example
├── package.json
└── README.md
```

*Note: This is a high-level overview. Additional routes, dashboard pages, utilities, hooks, and components may exist in the repository.*

## 🔌 Backend Integration

The frontend consumes the separately deployed RaktoSheba REST API.

**Base API URL**

```text
https://blood-donation-backend-bice.vercel.app/api/v1
```

**API Documentation:** [View Postman Collection](https://documenter.getpostman.com/view/54865231/2sBYAvvqZz)

The frontend integrates with backend endpoints for authentication, user profiles, donor availability, and administrative dashboard statistics. Further integration will be added as the remaining modules are implemented.

## 🗺️ Development Roadmap

### Phase 1 — Core Foundation ✅

- [x] Design system and reusable UI components.
- [x] Login and registration interfaces.
- [x] Donor and hospital registration flows.
- [x] Authentication proxy and refresh-token handling.
- [x] Zustand authentication store.
- [x] Role-aware middleware.
- [x] Public landing page.
- [x] Admin dashboard statistics.
- [x] Donor profile and availability toggle.
- [x] Hospital profile and verification status.
- [x] Error and not-found boundaries.
- [x] TypeScript and ESLint checks.
- [x] Production build verification, with external font fetching requiring separate consideration in the build sandbox.

### Phase 2 — Donor & Hospital Workflows 🚧

- [ ] Donor matches list.
- [ ] Donation history.
- [ ] Donor profile editing.
- [ ] Hospital blood request creation.
- [ ] Hospital request list and detail pages.
- [ ] Request-matching interface.

### Phase 3 — Admin Management 🚧

- [ ] User management.
- [ ] Hospital verification management.
- [ ] Blood request management.
- [ ] Audit log interface.
- [ ] Pagination, filtering, and sorting.
- [ ] Search-state synchronization with `useSearchParams`.

### Phase 4 — Extended Features 📋

- [ ] Stripe or SSLCommerz payment flow.
- [ ] Notifications and notification bell.
- [ ] Recharts dashboard visualizations.
- [ ] Public About, Services, and Contact pages.
- [ ] File upload, if supported by the backend.
- [ ] Consistent loading skeletons for remaining data views.
- [ ] Responsive design and accessibility improvements.

*Roadmap items are planned features and should not be considered implemented until they are completed and verified.*

## 🧪 Quality & Reliability

The initial implementation has been checked for:

- TypeScript compilation using `tsc --noEmit`.
- ESLint checks.
- Production build compilation.

External Google Fonts could not be fetched in the original restricted build sandbox. The application compiled with fonts stubbed out, but deployment should be verified in an environment with working font access.

## 🔒 Security Considerations

- Access tokens are attached to API requests through the centralized Axios client.
- Refresh tokens are handled through HTTP-only cookies.
- Refresh requests are deduplicated across concurrent failed requests.
- Role cookies are used for route navigation only, not as proof of authorization.
- The backend remains responsible for validating tokens and enforcing permissions.
- Environment variables containing sensitive values must not be committed.
- Public demo credentials should be treated as disposable and restricted to demo data.
- Cookie settings, including `Secure`, `SameSite`, and expiration, should be configured appropriately for the deployment environment.
- Authentication proxy routes should validate upstream responses and avoid exposing tokens or sensitive backend errors in logs.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Implement your changes.
4. Run the available quality checks.
5. Commit your changes:

   ```bash
   git commit -m "feat: add your feature"
   ```

6. Push the branch and open a pull request.

## 👨‍💻 Developer

**MD. Soriful Islam**  
Full-Stack Developer | React | Next.js | Node.js | TypeScript

- **Portfolio:** [shoriful.vercel.app](https://shoriful.vercel.app)
- **GitHub:** [islamSorifulhero](https://github.com/islamSorifulhero)
- **LinkedIn:** [MD. Soriful Islam](https://www.linkedin.com/in/md-soriful-islam-hero2)

## 📄 License

A license has not yet been specified for this repository. Add a `LICENSE` file before distributing the project under a particular open-source license.

---

**RaktoSheba — Connecting donors, hospitals, and communities to support timely blood donation.** 🩸