# Domiva.pt - Portuguese Real Estate Platform

*"Sente-te em casa desde o primeiro clique."*

A modern Portuguese real estate platform where individuals and real estate agents can list properties for free in Portugal.

## 🎯 **PROJECT VISION & OBJECTIVES**

### **Core Mission**
Create a modern, user-friendly real estate platform focused on the Portuguese market, enabling both private individuals ("particulares") and real estate agents ("agentes") to list properties with ease.

### **Target Users**
- **Particulares**: Private individuals selling/renting their properties
- **Agentes**: Professional real estate agents and agencies
- **Buyers/Renters**: People looking for properties in Portugal

### **Key Differentiators**
- **Portuguese-first**: Built specifically for the Portuguese market
- **Free listings**: No cost for basic property listings
- **Dual user types**: Support for both individuals and professionals
- **Modern UX**: Clean, mobile-first design
- **RGPD compliant**: Full compliance with European data protection

## 🚀 **IMPLEMENTED FEATURES (Working)**

### ✅ **Authentication System**
- **Real Supabase integration** working
- **User registration** with email confirmation
- **Login/logout** functionality  
- **Protected routes** (dashboard requires login)
- **Role-based access** (particular/agente)
- **Password validation** and confirmation

### ✅ **Core Pages Structure**
- **Landing Page (/)**: Hero section, featured properties, call-to-action
- **Property Listings (/listings)**: Grid view with filtering capabilities
- **Property Details (/listing/[id])**: Individual property pages with galleries
- **Authentication (/login)**: Login/register with role selection
- **Agent Dashboard (/dashboard)**: Protected area for property management

### ✅ **UI/UX Features**
- **Responsive Design**: Mobile-first approach
- **Portuguese localization**: All text in Portuguese
- **Clean aesthetics**: Modern Tailwind CSS styling
- **Interactive elements**: Hover states, loading states
- **Error handling**: User-friendly error messages

## 🔄 **NEXT PRIORITY FEATURES**

### **Phase 1 - Core Functionality**
1. **Property Creation Form**: Allow agents to add new properties
2. **Real Database Integration**: Connect to Supabase instead of mock data
3. **Image Upload**: Property photo upload functionality
4. **Working Filters**: Make listing filters functional

### **Phase 2 - Enhanced Features**
5. **Google Maps Integration**: Show property locations on maps
6. **Property Management**: Edit/delete properties in dashboard
7. **Search Functionality**: Advanced property search
8. **Favorites System**: Users can save favorite properties

### **Phase 3 - Advanced Features**
9. **Contact System**: Messaging between users and agents
10. **Property Status**: Pending/approved/rejected moderation
11. **Statistics Dashboard**: Analytics for agents
12. **Email Notifications**: System notifications

## 🛠️ **TECH STACK**

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: JavaScript ES6+ (converted from TypeScript)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Type Safety**: JSDoc comments for documentation

### **Backend & Database**
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for images)
- **Real-time**: Supabase real-time subscriptions

### **Future Integrations**
- **Maps**: Google Maps API
- **Payments**: Stripe (for premium features)
- **Email**: Supabase/SendGrid for notifications

## 🗄️ **DATABASE SCHEMA (Supabase)**

### **Tables Implemented**

#### `profiles`
```sql
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('particular', 'agente')) DEFAULT 'particular',
  nif TEXT,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `listings`
```sql
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  typology TEXT NOT NULL, -- T1, T2, T3, T4, etc.
  location_text TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  images TEXT[], -- Array of image URLs
  area DECIMAL(8, 2), -- Square meters
  rooms INTEGER,
  bathrooms INTEGER,
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('pendente', 'aprovado', 'rejeitado')) DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `favorites` (planned)
```sql
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);
```

## 📱 **PAGE STRUCTURE & COMPONENTS**

### **Pages**
- `src/app/page.jsx` - Landing page with hero and featured properties
- `src/app/layout.jsx` - Root layout with navigation
- `src/app/login/page.jsx` - Authentication (login/register)
- `src/app/listings/page.jsx` - Property listings with filters
- `src/app/listing/[id]/page.jsx` - Individual property details
- `src/app/dashboard/page.jsx` - Protected agent dashboard

### **Components**
- `src/components/Header.jsx` - Navigation header
- `src/components/Footer.jsx` - Site footer
- `src/components/PropertyCard.jsx` - Property display component
- `src/components/Map.jsx` - Map integration component

### **Utilities**
- `src/lib/supabaseClient.js` - Supabase configuration
- `src/lib/mockData.js` - Sample property data
- `src/types/index.js` - JSDoc type definitions

## 🎨 **DESIGN SYSTEM**

### **Colors**
- **Primary Blue**: `#2563eb` (blue-600)
- **Primary Blue Light**: `#3b82f6` (blue-500)
- **Secondary Gray**: `#6b7280` (gray-500)
- **Background**: `#f9fafb` (gray-50)
- **Success Green**: `#10b981` (emerald-500)
- **Error Red**: `#ef4444` (red-500)

### **Typography**
- **Font Family**: Inter (Google Fonts)
- **Headings**: Font weights 600-700
- **Body Text**: Font weight 400
- **Portuguese Content**: All UI text in Portuguese

### **Layout Principles**
- **Mobile-first**: Responsive design starting from mobile
- **Clean spacing**: Consistent padding and margins
- **Card-based layout**: Properties displayed in clean cards
- **Grid systems**: CSS Grid and Flexbox for layouts

## ⚖️ **LEGAL & COMPLIANCE**

### **Terms & Conditions**
- Content responsibility lies with users
- Platform acts as listing service, not real estate broker
- Right to remove fraudulent or violating listings
- Clear user agreement terms

### **RGPD Compliance**
- **Data Collection**: Name, Email, IP, Images, Login data, Cookies
- **Data Usage**: Site functionality, authentication, user contact
- **Third-party Sharing**: Google Maps, Supabase hosting, Stripe payments
- **User Rights**: Data rectification and deletion on request

## 🛡️ **MODERATION & SECURITY**

### **Content Moderation**
- All properties require approval before going live
- Basic moderation system: "pendente/aprovado/rejeitado"
- User reporting system for inappropriate listings
- Image upload limits (max 10 per property)

### **Security Features**
- Supabase Row Level Security (RLS) policies
- Email verification for accounts
- Optional NIF verification for agents
- Secure password requirements

## 💰 **MONETIZATION STRATEGY (Future)**

### **Freemium Model**
- **Free**: Basic property listings
- **Premium**: Featured listings at top of search
- **Professional**: Advanced analytics for agents

### **Revenue Streams**
- **Featured Listings**: Paid promotion in search results
- **Lead Generation**: Charge agents for qualified contacts
- **Advertising**: Google Ads or local business ads
- **Premium Tools**: CRM, statistics, export tools for agencies

## 🚀 **SETUP & DEPLOYMENT**

### **Development Environment**
```bash
# Install dependencies
npm install

# Environment variables needed
NEXT_PUBLIC_SUPABASE_URL=https://fgojmyairpxbadxcmgbp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run development server
npm run dev
```

### **Supabase Configuration**
- **Project URL**: https://fgojmyairpxbadxcmgbp.supabase.co
- **Database**: PostgreSQL with RLS enabled
- **Authentication**: Email/password with role-based access
- **Storage**: For property images (planned)

### **Deployment Options**
- **Recommended**: Vercel (automatic deployment)
- **Alternative**: Netlify, Railway, DigitalOcean

## 📋 **CURRENT STATUS**

### **Working Features** ✅
- User authentication (register/login/logout)
- Protected dashboard access
- Responsive navigation and layout
- Property display with mock data
- Portuguese localization

### **Known Issues** ⚠️
- Some Unsplash image URLs return 404 errors
- Property creation form not yet implemented
- Filters are UI-only (not functional)
- Using mock data instead of real database

### **Immediate Next Steps** 🎯
1. **Fix broken image URLs** in mock data
2. **Implement property creation form** in dashboard
3. **Connect real Supabase data** instead of mock data
4. **Add functional filters** to listings page
5. **Implement image upload** functionality

## 📝 **DEVELOPMENT NOTES**

### **Code Structure**
- **Language**: JavaScript ES6+ (converted from TypeScript)
- **Type Safety**: JSDoc comments for documentation
- **Code Style**: ESLint + Prettier
- **CSS Framework**: Tailwind CSS utility classes

### **API Integration**
- **Supabase Client**: Configured for auth and database
- **Error Handling**: User-friendly error messages
- **Loading States**: Spinners and loading indicators
- **Form Validation**: Client-side validation for all forms

### **Performance Considerations**
- **Image Optimization**: Next.js Image component
- **Responsive Images**: Multiple sizes for different screens
- **Code Splitting**: Automatic with Next.js App Router
- **SEO Ready**: Meta tags and structured data planned

## 📊 **COMPETITIVE ANALYSIS & DIFFERENTIATION**

### **Main Competitors**
- **Idealista.pt**: Market leader but complex interface, high costs for agents
- **Imovirtual.com**: Strong brand but limited innovation, traditional approach
- **ERA.pt**: Agency network but closed ecosystem, high commission fees
- **OLX.pt**: Popular but not specialized, poor user experience for real estate

### **Our Competitive Advantages** 🎯
- **Free for Individuals**: Unlike competitors who charge listing fees
- **Modern UX/UI**: Clean, mobile-first design vs outdated competitor interfaces
- **Portuguese-first**: Built specifically for PT market vs international adaptations
- **Dual User Types**: Seamless experience for both particulares and agentes
- **Real-time Features**: Live chat, instant notifications, real-time updates
- **AI-Powered**: Smart property recommendations and automated descriptions

## 🚀 **INNOVATIVE FEATURES (Differentiators)**

### **🤖 AI-Powered Features** (Phase 2-3)
1. **Smart Property Descriptions**: AI generates compelling property descriptions in Portuguese
2. **Price Prediction**: Machine learning model suggests optimal pricing based on market data
3. **Property Matching**: AI recommends properties to buyers based on preferences and behavior
4. **Virtual Assistant**: Chatbot to answer common questions 24/7
5. **Photo Enhancement**: AI-powered photo editing and virtual staging
6. **Market Insights**: AI analysis of market trends and investment opportunities

### **📱 Mobile-First Innovations**
1. **Progressive Web App (PWA)**: App-like experience without app store download
2. **Offline Viewing**: Cache favorite properties for offline viewing
3. **Location-Based Alerts**: Push notifications for new properties in desired areas
4. **Augmented Reality (AR)**: View property information overlaid on camera view
5. **Voice Search**: Search properties using voice commands in Portuguese
6. **Quick Share**: One-tap sharing to WhatsApp/social media with beautiful property cards

### **🔥 Unique Selling Features**
1. **Virtual Property Tours**: 360° immersive property walkthroughs
2. **Property Stories**: Timeline view of property history, renovations, market value changes
3. **Neighborhood Insights**: Crime stats, schools, transport, local businesses
4. **Investment Calculator**: ROI calculator for rental properties with market data
5. **Property Comparison**: Side-by-side comparison tool with detailed metrics
6. **Social Proof**: Verified reviews from previous tenants/buyers

### **💡 Community Features**
1. **Property Questions**: Q&A system where potential buyers can ask agents/owners
2. **Local Guides**: Community-generated guides about neighborhoods
3. **Property Events**: Open houses, virtual tours scheduling
4. **Referral System**: Users earn credits for successful referrals
5. **Property Alerts**: Smart notifications based on saved searches and ML preferences

## 📈 **MARKETING STRATEGY**

### **🎯 Target Acquisition Strategy**

#### **Phase 1: Organic Growth (Months 1-6)**
1. **Content Marketing**
   - **Blog articles**: "Guia do Primeiro Comprador", "Investir em Imóveis 2025"
   - **SEO optimization**: Target "apartamentos Lisboa", "casas Porto" etc.
   - **YouTube channel**: Property tours, market analysis, tips for buyers/sellers
   - **Local partnerships**: Collaborate with real estate lawyers, banks, insurance companies

2. **Social Media Strategy**
   - **Instagram**: Beautiful property photos, before/after renovations, market insights
   - **Facebook Groups**: Active participation in Portuguese real estate communities
   - **TikTok**: Quick property tours, market tips, first-time buyer content
   - **LinkedIn**: Target real estate professionals and investors

3. **Referral & Word-of-Mouth**
   - **Referral bonuses**: €50 credit for successful referrals
   - **Agent incentives**: Free premium features for first 100 agents
   - **User testimonials**: Video testimonials from successful users

#### **Phase 2: Paid Acquisition (Months 6-12)**
1. **Google Ads Strategy**
   - **Search campaigns**: Target high-intent keywords like "apartamento para comprar Lisboa"
   - **Display remarketing**: Retarget users who viewed properties
   - **YouTube ads**: Target property-related content viewers
   - **Local campaigns**: Target specific Portuguese cities and regions

2. **Facebook/Instagram Ads**
   - **Lookalike audiences**: Based on successful user profiles
   - **Interest targeting**: Real estate, home improvement, investment content
   - **Dynamic ads**: Show relevant properties to users based on browsing behavior
   - **Video ads**: Property tour highlights and success stories

3. **Influencer Partnerships**
   - **Real estate YouTubers**: Collaborate with Portuguese property influencers
   - **Lifestyle bloggers**: Partner with home design and lifestyle content creators
   - **Micro-influencers**: Local influencers in major Portuguese cities

#### **Phase 3: Advanced Marketing (Year 2+)**
1. **Strategic Partnerships**
   - **Banks**: Integration with mortgage pre-approval systems
   - **Insurance companies**: Bundled home insurance offers
   - **Moving companies**: Discounted moving services for platform users
   - **Furniture stores**: Partnership discounts for new homeowners

2. **Event Marketing**
   - **Property fairs**: Presence at major Portuguese real estate events
   - **Webinars**: "Como Investir em Imóveis", "Mercado Imobiliário 2025"
   - **Local meetups**: Monthly real estate networking events in major cities
   - **University talks**: First-time buyer education at Portuguese universities

### **🎨 Brand Positioning**

#### **Brand Personality**
- **Friendly**: "Sente-se em casa" - warm, welcoming, approachable
- **Modern**: Cutting-edge technology, clean design, innovation
- **Trustworthy**: Transparent pricing, verified listings, secure transactions
- **Portuguese**: Deep understanding of local market and culture

#### **Content Themes**
1. **Educational**: Market insights, buying guides, investment tips
2. **Inspirational**: Dream home features, renovation stories, success cases
3. **Community**: Local neighborhood spotlights, resident stories
4. **Practical**: Legal advice, financing options, moving tips

#### **Messaging Framework**
- **Primary**: "Sente-te em casa desde o primeiro clique"
- **Secondary**: "A casa dos seus sonhos está aqui"
- **For Agents**: "Venda mais, venda melhor, venda grátis"
- **For Buyers**: "Encontre a casa perfeita em Portugal"

### **📊 Marketing KPIs & Goals**

#### **Year 1 Targets**
- **10,000** registered users (5,000 particulares + 5,000 agentes)
- **25,000** property listings
- **100,000** monthly website visitors
- **5,000** social media followers across platforms
- **500** successful transactions through platform

#### **Marketing Metrics to Track**
- **Acquisition cost (CAC)** per user type
- **Lifetime value (LTV)** of users
- **Conversion rates** from visitor to registered user
- **Time to first listing** for new agents
- **Property view to contact rate**
- **Search to shortlist conversion rate**

### **🌟 Launch Strategy**

#### **Pre-Launch (2 months before)**
1. **Beta testing**: 50 selected agents and 100 potential buyers
2. **Landing page**: "Venho em Breve" with email collection
3. **Social media teasers**: Behind-the-scenes content, countdown
4. **Press kit**: Prepare materials for tech and real estate media

#### **Launch Week**
1. **Press release**: Send to major Portuguese tech and real estate publications
2. **Social media campaign**: #LarifyLaunch hashtag, user-generated content
3. **Agent onboarding**: Free premium features for first 100 agents
4. **Launch event**: Virtual event with industry experts and early users

#### **Post-Launch (First 3 months)**
1. **User feedback collection**: Regular surveys and improvement cycles
2. **Feature announcements**: Weekly feature releases and improvements
3. **Case studies**: Document and share success stories
4. **Media interviews**: Founder interviews on Portuguese podcasts and media

## 🎯 **ADVANCED FEATURES ROADMAP**

### **🏠 Smart Property Features**
1. **Virtual Staging**: AI-powered furniture placement in empty properties
2. **Property Score**: Algorithmic rating based on location, condition, price, potential
3. **Investment Analytics**: Detailed ROI calculations, rental yield predictions
4. **Market Predictions**: ML-powered price forecasting and trend analysis
5. **Smart Notifications**: Personalized alerts based on user behavior and preferences

### **🤝 Transaction Features**
1. **Digital Contracts**: E-signature integration with legal compliance
2. **Escrow Service**: Secure payment holding for transactions
3. **Document Vault**: Secure storage for all property-related documents
4. **Transaction Timeline**: Visual progress tracking for buyers and sellers
5. **Instant Offers**: Quick offer system with automated negotiations

### **📍 Location Intelligence**
1. **Walkability Scores**: Calculated accessibility to amenities
2. **Public Transport**: Real-time data integration with CP, Metro, Carris
3. **School Districts**: Detailed information about local schools and ratings
4. **Crime Statistics**: Safety data visualization for neighborhoods
5. **Future Development**: Information about planned infrastructure projects

### **🎭 Personalization Engine**
1. **Smart Recommendations**: ML-based property suggestions
2. **Saved Searches**: Advanced filters with instant notifications
3. **Property History**: Track all viewed and favorited properties
4. **Preference Learning**: System learns and adapts to user behavior
5. **Custom Dashboards**: Personalized interface based on user type and preferences

---

**Last Updated**: December 2024
**Project Status**: MVP Development Phase
**Next Milestone**: Functional property management system

## 🏁 **MARKET POSITION**

### **Competitors**
- **Imovirtual.com**: Líder but heavy/complex
- **OLX**: Popular but not specialized
- **CustoJusto**: Local but dated UX

### **Our Advantage**
- Modern UX specifically for PT market
- Free for individuals (vs paid competitors)
- Mobile-first approach

## 👤 **USER JOURNEYS**

### **Private Seller Journey**
1. Register → 2. Verify Email → 3. Create Listing → 4. Wait Approval → 5. Receive Contacts

### **Agent Journey** 
1. Register → 2. NIF Verification → 3. Bulk Upload → 4. Analytics Dashboard → 5. Lead Management
