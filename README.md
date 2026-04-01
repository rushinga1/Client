# Agruni Waste Management Portal

A modern Vue 3 + TypeScript waste collection tracking and payment management system built for Rwanda's waste management ecosystem.

## 🚀 Features

- **Responsive Design** - Mobile-first with adaptive layouts
- **Multi-language Support** - English, Kinyarwanda, French, Swahili
- **Real-time Payment Processing** - Secure PIN-based transactions
- **Service Tracking** - Live collection agent monitoring
- **Debt Management** - Automated alerts and payment reminders
- **Bento Box Dashboard** - Modern widget-based interface

## 🛠️ Tech Stack

- **Vue 3** - Composition API with TypeScript
- **Vite** - Lightning fast build tool
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Vue I18n** - Internationalization
- **Iconify** - Icon system
- **CSS Custom Properties** - Design tokens

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd agruni-waste-management

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── assets/
│   └── styles/
│       └── tokens.css          # Design tokens
├── components/
│   ├── base/                   # Reusable base components
│   ├── domain/                 # Business-specific components
│   └── layout/                 # Layout components
├── composables/                # Vue composables
├── stores/                     # Pinia stores
├── views/                      # Page components
├── i18n/
│   ├── locales/               # Translation files
│   └── index.ts               # i18n configuration
├── utils/                      # Utility functions
├── App.vue                     # Root component
└── main.ts                     # Application entry point
```

## 🎨 Design System

The application follows the "Civic Clarity" design system with:

- **Color Palette** - Semantic, accessible colors
- **Typography** - Sora (display), DM Sans (body), DM Mono (code)
- **Spacing** - 8px base grid system
- **Components** - Token-based, reusable components
- **Responsive** - Mobile-first breakpoints

## 🌍 Internationalization

Supported languages:
- English (en)
- Kinyarwanda (rw)
- French (fr)
- Swahili (sw)

Translation files are located in `src/i18n/locales/`.

## 💾 State Management

- **auth.store.ts** - User authentication
- **payment.store.ts** - Payment processing
- **ui.store.ts** - UI state management

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
npm run lint         # ESLint with auto-fix
```

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_TITLE=Agruni Waste Management
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔐 Security Features

- PIN-based payment authentication
- Input validation and sanitization
- XSS protection
- CSRF protection

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Setup

The application is designed to work in various environments:

- **Development**: `npm run dev`
- **Staging**: Build with staging environment variables
- **Production**: Build with production environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🌟 Credits

Built with ❤️ for Rwanda's waste management ecosystem by the Agruni team.
