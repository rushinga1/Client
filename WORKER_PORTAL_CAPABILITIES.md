# AGRUNI Worker Portal - Complete Feature Documentation

**Presented to Client**  
**System:** Agruni Waste Management Portal  
**User Type:** Field Workers / Collection Agents  
**Version:** 1.0  
**Last Updated:** March 31, 2026

---

## Executive Summary

The AGRUNI Worker Portal is a comprehensive mobile-responsive platform designed for field collection agents to efficiently manage customer accounts, track payments, and coordinate waste management operations. The portal provides real-time insights, payment monitoring, customer registration, and communication tools—all built with an intuitive, modern interface supporting multiple languages (English, Kinyarwanda, French, and Swahili).

---

## 1. Dashboard Overview

### 1.1 Welcome Banner
- **Personalized Greeting**: Displays agent's name (e.g., "Muraho, Agent Marie 👋")
- **Date Information**: Shows current date for reference
- **Quick Statistics Display**:
  - Payments collected this week
  - Unpaid customers this week
  - Visual status indicators with color coding (green for paid, red for unpaid)

### 1.2 Key Metrics Grid
Displays four primary performance indicators:

| Metric | Description |
|--------|-------------|
| **Total Customers** | Total number of households/customers in the agent's assigned area |
| **Paid This Week** | Number of successful payments collected with percentage trend |
| **Unpaid This Week** | Outstanding collections with percentage trend indicator |
| **Banned Houses** | Number of customers banned due to 4+ weeks non-payment |

### 1.3 Warning Alert System
- **Automated Alerts**: Shows when customers are in warning zone (approaching ban status)
- **Quick Access**: Click alert to navigate directly to reminders/warnings
- **Action Items**: Displays count of pending warnings requiring agent attention

### 1.4 Payment Performance by Category
Visualizes payment collection status across customer categories:

- **Abakire (Rich Class)**: 75% completion example - shows paid vs. total customers
- **Icyiciro cya 2 (Medium Class)**: 60% completion example
- **Abakene (Poor Class)**: Dynamic completion tracking
- **Business Customers**: Separate tracking for commercial entities

Each category includes:
- Visual progress bars with color coding
- Paid count vs. total count
- Percentage calculations automatically updated

### 1.5 Weekly Payment Trend Chart
- **7-Day Breakdown**: Displays paid and unpaid collections for each day of the week
- **Today Indicator**: Highlights current day for reference
- **Stacked Bar Visualization**: Shows combined paid/unpaid volume per day
- **Color Coding**: Green for paid, amber/orange for unpaid
- **Legend**: Clear identification of payment status indicators

---

## 2. Quick Actions

Accessible from the main dashboard, workers can immediately perform key operations:

### 2.1 Register New Customer
- **Full Multi-Step Registration Process**:
  - **Step 1**: Personal Information (first name, last name, phone number)
  - **Step 2**: Location Details (district, sector, cell, village, house number)
  - **Step 3**: Property Classification (category assignment: rich, medium, poor, or business)
  - **Step 4**: Confirmation and Submission
- **Progress Indicator**: Visual step progress bar showing completion status
- **Validation**: Real-time input validation for required fields
- **Mobile Phone Integration**: +250 country code preset for Rwanda
- **Instant Onboarding**: New customers immediately visible in the system

### 2.2 View Houses (Customer List)
- **Complete Customer Database**: Access full list of assigned customers
- **Advanced Search**: Filter by customer name, house number, or village
- **Status Filters**:
  - All Status
  - Paid (✅ completed)
  - Unpaid (❌ outstanding)
- **Category Filters**:
  - All Categories
  - Abakire (Rich)
  - Icyiciro cya 2 (Medium)
  - Abakene (Poor)
  - Business
- **Expandable House Cards**: Click to see detailed information including:
  - Customer name and contact
  - House location and ID
  - Current payment status
  - Weekly payment records
  - Collection history

### 2.3 View Reminders (Payment Warnings)
- **Severity-Based Organization**:
  - **Critical** (4+ weeks overdue): Highest priority, approaching ban
  - **High** (3 weeks overdue): Urgent action needed
  - **Medium** (2 weeks overdue): Attention required
  - **Low** (1 week overdue): Preventive collection
- **Quick Statistics**: Card-based view showing count in each severity level
- **Filterable List**: Sort by severity to prioritize collections
- **Customer Details**: Full contact info and payment history for each reminder
- **Call Integration**: One-click calling button for customer follow-up
- **Last Payment Info**: Shows when customer last paid and outstanding amount

### 2.4 Send Announcements
- **Template Support**: Pre-built announcement templates:
  - Service Interruption notices
  - Schedule Change notifications
  - Weather Delay alerts
  - Holiday Notices
- **Custom Messages**: Full custom composition option
- **Subject Line**: Professional announcement headers
- **Recipient Selection**:
  - All customers
  - Specific category selection
  - Individual customer targeting
- **Message Composition**: Multi-line message editor
- **Delivery Confirmation**: Successful broadcast notification

---

## 3. Core Features

### 3.1 Banned Houses Management
- **Auto-Ban System**: Customers automatically banned after 4+ weeks non-payment
- **Comprehensive List**: View all banned customers with details
- **Ban Status Display**:
  - Ban date information
  - Customer name and location
  - House number and address
  - Reason for ban (non-payment duration)
- **Ban Lifting Information**: Shows that only system admin or payment settlement can lift bans
- **Contact Information**: Full customer details for follow-up communication
- **Protection Status**: Visual indicators showing ban is active

### 3.2 Messages (Two-Way Communication)
- **Conversation Management**: Thread-based messaging with customers
- **Dual Panel Layout**:
  - Left: Conversation list with search capability
  - Right: Active conversation message thread
- **Message Threads**: Full history of communication with each customer
- **Active Indicators**: Shows online/offline status of customers
- **New Conversation**: Ability to initiate contact with customers
- **Unread Tracking**: Highlights unread messages
- **Message Preview**: Last message snippet in conversation list
- **Timestamp**: Message timing for reference
- **Search Conversations**: Find specific customers or threads

### 3.3 Notifications Center
- **Multi-Type Notifications**:
  - **Payment Alerts**: When customers make payments (MTN MoMo, Airtel Money, Bank)
  - **Warning Alerts**: Customer payment warnings and upcoming bans
  - **System Messages**: Important system updates and maintenance notices
  - **Info Messages**: General informational updates
- **Unread Counter**: Displays total unread notifications
- **Mark as Read**: Individual notification or "mark all read" functionality
- **Filter Options**: Sort by notification type (All, Payments, Warnings, System)
- **Dismiss Function**: Remove individual notifications
- **Timestamp**: When each notification was generated
- **Empty State**: Friendly message when all caught up

### 3.4 User Profile Management
- **Agent Information Display**:
  - Full name and employee ID
  - Contact phone number and email
  - Employment start date
  - Current active status indicator
  - Profile avatar with initials
- **Assigned Area Details**:
  - District assignment (e.g., Kigali)
  - Assigned sectors (e.g., Nyarugenge, Gasabo, Kicukiro)
  - Cell assignments
  - Villages covered
- **Performance Statistics**:
  - Total customers managed
  - Collections made (this week/month/year)
  - Average collection rate
  - Performance ranking within team
- **Account Settings**: Profile picture and personal information management

---

## 4. Advanced Analytics & Insights

### 4.1 Real-Time Dashboard Metrics
- **Weekly Performance Summary**:
  - Paid collections count
  - Unpaid/outstanding count
  - Collection percentage
  - Week-over-week comparison
- **Category Breakdown**: Performance by customer class (rich, medium, poor, business)
- **Trend Indicators**: Up/down arrows showing improvement or decline

### 4.2 Payment Tracking
- **Recent Payments List**: Last 5 most recent collections showing:
  - Customer name
  - Village/location
  - Collection amount in RWF
  - Time collected (e.g., "10 min ago")
- **Transaction Details**: Click any payment to see full details
- **Payment Methods**: Track collection method used

### 4.3 Collection Analytics
- **Daily Performance**: See collections for each day of the week
- **Weekly Totals**: Aggregate collection numbers
- **Customer Segments**: Performance by wealth category
- **Payment Patterns**: Identify peak collection times and days
- **Outstanding Analysis**: See which categories have most unpaid amounts

---

## 5. Mobile Responsiveness

The Worker Portal is fully optimized for mobile devices with responsive breakpoints:

| Device Type | Breakpoint | Features |
|------------|-----------|----------|
| **Mobile** | < 768px | Single column layouts, hamburger navigation |
| **Tablet** | 768px - 1024px | 2-column metrics grid, optimized touch targets |
| **Desktop** | > 1024px | Full 4-column metrics grid, expanded layouts |

- **Touch-Optimized**: Large buttons and tap targets for field use
- **Offline-Aware**: Cached data for areas with connectivity issues
- **Fast Loading**: Optimized for slow network conditions
- **Battery Efficient**: Minimal resource consumption

---

## 6. Internationalization Support

The portal is fully multilingual with support for:

- **English (en)**: Default language
- **Kinyarwanda (rw)**: Native local language
- **French (fr)**: Regional support
- **Swahili (sw)**: East African coverage

**Language Features:**
- Language switcher in header
- Automatic UI translation
- Number and date formatting per locale
- Currency display in RWF with local conventions
- RTL support where applicable

---

## 7. Navigation & Accessibility

### 7.1 Main Navigation
- **Dashboard**: Home view with all key metrics
- **Houses**: Full customer list with advanced filtering
- **Register**: Add new customers to the system
- **Reminders**: Payment warnings and follow-ups
- **Banned**: View banned customers
- **Messages**: Communication with customers
- **Announcements**: Broadcast messages to customers
- **Notifications**: System and payment alerts
- **Profile**: Agent profile and settings

### 7.2 Header Components
- **Logo/Branding**: AGRUNI Worker Portal identification
- **Language Switcher**: Quick language selection
- **User Menu**: Profile access and logout
- **Search**: Quick search across customers and payments
- **Notifications Bell**: Quick access to alerts

### 7.3 Sidebar Navigation
- **Collapsible Design**: Save screen space when needed
- **Icon Labels**: Easy recognition of sections
- **Active State**: Highlight current page
- **Quick Links**: One-click access to each feature

---

## 8. Data Security & Privacy

### 8.1 Authentication
- **Secure Login**: User credentials protected
- **Session Management**: Automatic timeout for security
- **Password Protection**: Encrypted password storage

### 8.2 Data Protection
- **Input Validation**: Prevent invalid data entry
- **XSS Protection**: Secure against cross-site scripting
- **CSRF Protection**: Secure form submissions
- **PIN Verification**: Optional PIN for sensitive operations

### 8.3 Customer Privacy
- **Encrypted Communications**: Secure messaging
- **Data Minimization**: Only necessary information collected
- **Access Control**: Workers only see assigned customers

---

## 9. Performance & Technical

### 9.1 Technology Stack
- **Frontend Framework**: Vue 3 with Composition API
- **Build Tool**: Vite (ultra-fast builds)
- **State Management**: Pinia (scalable state handling)
- **Routing**: Vue Router with lazy loading
- **Styling**: CSS Custom Properties (design tokens)
- **Icons**: Iconify (700K+ icons available)
- **Internationalization**: Vue I18n

### 9.2 Performance Features
- **Code Splitting**: Lazy-loaded components for faster initial load
- **Asset Optimization**: Compressed images and resources
- **Caching**: Intelligent browser caching
- **Real-Time Updates**: WebSocket support for live data

---

## 10. Use Cases & Workflows

### 10.1 Daily Collection Workflow
1. **Morning Login**: Agent logs into portal
2. **Dashboard Review**: Check daily metrics and warning alerts
3. **Prioritize Collections**: Sort by severity of reminders
4. **Contact Customers**: Use messaging or call feature
5. **Record Payments**: System automatically updates when payment received
6. **Track Progress**: Monitor daily total vs. goals
7. **Evening Report**: Review daily performance

### 10.2 New Customer Onboarding
1. **Meet Customer**: Field visit or phone registration
2. **Register in Portal**: Multi-step registration process
3. **Assign Category**: Classify by wealth/capacity to pay
4. **Set Initial Payment**: Establish payment schedule
5. **Send Confirmation**: Announcement or message to customer
6. **Track First Payment**: Monitor initial collection

### 10.3 Overdue Management
1. **Receive Warning Notification**: System alerts to overdue customers
2. **Review Reminders**: Check severity of overdue accounts
3. **Initiate Contact**: Call or message customer
4. **Record Payment**: Once payment received
5. **Update Status**: System auto-clears warning or ban if eligible
6. **Follow-Up**: For previously banned customers

---

## 11. Benefits & Value Proposition

### 11.1 For Field Agents
- ✅ **Simplified Operations**: One dashboard for all needs
- ✅ **Real-Time Visibility**: Know collection status at any moment
- ✅ **Reduced Paperwork**: Digital-first approach
- ✅ **Mobile Accessibility**: Work from anywhere
- ✅ **Better Decision Making**: Data-driven insights
- ✅ **Faster Collections**: Streamlined workflows
- ✅ **Improved Customer Relations**: Direct communication tools
- ✅ **Performance Tracking**: See personal metrics and improvements

### 11.2 For Management
- ✅ **Agent Accountability**: Real-time collection tracking
- ✅ **Customer Analytics**: Understand payment patterns
- ✅ **Risk Management**: Early warning system for defaults
- ✅ **Resource Optimization**: Identify high/low performers
- ✅ **Operational Efficiency**: Reduced collection costs
- ✅ **Revenue Growth**: Improved payment recovery rates
- ✅ **Data-Driven Strategy**: Comprehensive reporting

### 11.3 For the Business
- ✅ **Scalability**: Manage unlimited agents and customers
- ✅ **Reliability**: Enterprise-grade infrastructure
- ✅ **Cost-Effective**: Reduces manual admin burden
- ✅ **Competitive Advantage**: Modern technology stack
- ✅ **Customer Satisfaction**: Professional, modern interface
- ✅ **Future-Ready**: Built for expansion and integration

---

## 12. Support & Maintenance

### 12.1 Training Requirements
- **Basic Training**: 2-3 hours for field staff
- **Advanced Training**: Optional for power users
- **Video Tutorials**: Available in all supported languages
- **Documentation**: Comprehensive user guides
- **On-Demand Support**: Help desk assistance

### 12.2 System Maintenance
- **Regular Updates**: Feature enhancements and security patches
- **Backup & Recovery**: Daily data backups
- **Performance Monitoring**: 24/7 system health checks
- **Support Response**: Dedicated technical support team

---

## 13. Future Roadmap

Planned enhancements for upcoming versions:

- **Offline Mode**: Full functionality without internet
- **GPS Tracking**: Route optimization and location services
- **AI Predictions**: Machine learning for payment predictions
- **Invoice Generation**: Automated digital receipts
- **Payment Integration**: Direct mobile money integration
- **Advanced Analytics**: Predictive analytics dashboard
- **Blockchain**: Transparent payment ledger
- **Team Collaboration**: Multi-agent coordination tools

---

## 14. Contact & Support

For questions, feature requests, or technical support:

**Technical Support**: support@agruni.rw  
**Sales Inquiries**: sales@agruni.rw  
**Documentation**: docs.agruni.rw/worker-portal  
**Training**: training@agruni.rw

---

## Conclusion

The AGRUNI Worker Portal represents a comprehensive, modern solution for waste collection management in Rwanda and the East African region. Built with field workers in mind, it combines powerful analytics, intuitive design, and mobile-first accessibility to drive operational excellence and revenue growth. The platform is scalable, secure, and ready for enterprise deployment.

**Ready to transform your waste collection operations. Let's connect.**

---

*Document prepared: March 31, 2026 | Version 1.0*
