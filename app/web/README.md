# VITAL-ETHIO Partner Portal

A modern SaaS-style partner intelligence portal for wellness centers, gyms, spas, nutrition clinics, and wellness coaches to monitor customer referrals and wellness demand from the VITAL-ETHIO mobile application ecosystem.

## 🎯 Purpose

This portal is used by wellness partners to:
- Monitor customer referrals from VITAL-ETHIO
- Track wellness demand analytics
- Manage promotional campaigns
- Verify bookings and visits
- Access business intelligence insights

**Note**: This is NOT a full admin dashboard or booking management system. Partners use their own internal systems for those functions.

## 🚀 Features

### Authentication
- **Professional Login Page** with email/password authentication
- Session persistence using localStorage
- Secure logout functionality

### 7 Complete Pages

1. **Dashboard** - KPI cards, weekly trends, revenue charts, conversion funnel
2. **Referrals** - Searchable referral table with filters and status management
3. **Wellness Insights** - Demand analytics, trends, age distribution, top services
4. **Campaigns** - Create and manage promotional campaigns with performance metrics
5. **Booking Verification** - Verify visits, mark no-shows, confirm appointments
6. **Notifications** - Activity feed with read/unread states
7. **Settings** - Business information and notification preferences

## 🔐 Login Credentials

**Demo Access:**
- Email: Any valid email format (e.g., `admin@wellness.com`)
- Password: Any password with 6+ characters (e.g., `password123`)

The system uses a simple authentication flow for demonstration purposes. In production, this would connect to a secure backend API.

## 📊 Mock Data

The application includes realistic mock data:
- ✅ 100 referrals with Ethiopian names
- ✅ 50 bookings across different statuses
- ✅ 10 promotional campaigns
- ✅ 30 days of analytics data
- ✅ Wellness insights across 5 categories (Stress, Sleep, Recovery, Nutrition, Fitness)

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **Vite** - Build tool

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/        # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── KPICard.tsx
│   │   └── StatusBadge.tsx
│   ├── pages/            # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Referrals.tsx
│   │   ├── WellnessInsights.tsx
│   │   ├── Campaigns.tsx
│   │   ├── Bookings.tsx
│   │   ├── Notifications.tsx
│   │   └── Settings.tsx
│   └── App.tsx           # Main application
├── data/                 # Mock JSON data
│   ├── referrals.json
│   ├── bookings.json
│   ├── campaigns.json
│   ├── analytics.json
│   ├── wellnessInsights.json
│   └── notifications.json
├── services/             # API service layer
│   ├── referralService.ts
│   ├── bookingService.ts
│   ├── campaignService.ts
│   ├── analyticsService.ts
│   ├── insightsService.ts
│   └── notificationService.ts
└── lib/
    └── utils.ts          # Utility functions
```

## 🎨 Design Features

- Modern SaaS platform aesthetic
- Premium healthcare technology design
- Minimalistic interface
- Clean white background with soft gradients
- Rounded cards with elegant shadows
- Responsive desktop-first design
- **Dark mode support** with theme toggle
- Smooth animations and hover effects
- Professional typography

## 🔄 Backend Integration

The application is structured for easy backend integration:

1. **Service Layer**: All data access is abstracted through service files in `src/services/`
2. **TODO Comments**: Each service method includes comments like:
   ```typescript
   // TODO: Replace with GET /api/referrals
   // TODO: Replace with POST /api/campaigns
   ```
3. **Type Safety**: Full TypeScript interfaces for all data models
4. **Mock Data**: Can be easily replaced by updating service methods to call REST APIs

## 📱 Features & Interactions

### Global Features
- Collapsible sidebar navigation
- Global search across referrals and bookings
- Real-time notification badge
- User profile menu with logout
- Dark/light mode toggle

### Dashboard
- Clickable KPI cards that navigate to filtered views
- Interactive charts with hover tooltips
- Recent activity feed with navigation
- Trend indicators (+/- percentages)

### Referrals
- Advanced filtering (status, category, date)
- Real-time search
- Slide-over detail panel
- Status updates (New → Booked → Visited)
- CSV export functionality

### Campaigns
- Create new campaigns with modal form
- Pause/resume campaigns
- View performance metrics
- Delete campaigns with confirmation

### Bookings
- Filter by today, pending, or all bookings
- Confirm visits
- Mark no-shows
- Status management

### Notifications
- Mark individual as read
- Mark all as read
- Delete notifications
- Unread badge count

## 🚀 Development

The Vite dev server is already running. The application auto-reloads on changes.

## 📝 License

Proprietary - VITAL-ETHIO Partner Portal
