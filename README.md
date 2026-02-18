# 🌊 AquaFlow Systems
### Prawn Processing Plant Management System

> A comprehensive full-stack application for managing prawn processing operations from intake to export, with complete transparency for farmers and powerful analytics for management.

---

## 🚀 Quick Links

- **🌐 Live App:** https://shrimp-process-flow.preview.emergentagent.com
- **📖 User Guide:** [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)
- **🛠️ Technical Docs:** [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)
- **📱 Mobile App:** [MOBILE_APP_GUIDE.md](MOBILE_APP_GUIDE.md)

---

## ✨ Features

### 👥 Multi-Role System
- **👑 Owner** - Complete system control
- **🛡️ Admin** - Analytics & user management
- **👷 Staff** - Daily operations
- **🌾 Farmer** - Personal dashboard

### 🎯 Core Functionality
- ✅ **Raw Material Intake** - Record incoming prawns with QR codes
- ✅ **Processing Tracking** - Washing → Peeling → Grading → Packing
- ✅ **Yield Calculation** - Automatic efficiency tracking
- ✅ **Inventory Management** - Cold storage monitoring
- ✅ **Dispatch & Export** - Customer order management
- ✅ **Payment System** - Transparent farmer payments
- ✅ **Analytics Dashboard** - Real-time business metrics
- ✅ **QR Code Scanner** - Quick batch access
- ✅ **Excel Export** - Download data for analysis
- ✅ **Mobile PWA** - Install on Android & iPhone

---

## 🛠️ Technology Stack

### Frontend
- React 18
- Tailwind CSS
- Shadcn/UI
- Axios
- React Router
- html5-qrcode

### Backend
- FastAPI
- MongoDB (Motor)
- Pydantic
- QRCode
- openpyxl

### Infrastructure
- Docker
- Kubernetes
- Supervisord
- Emergent Auth (Google OAuth)

---

## 📚 Documentation

### For Users
- **Quick Start:** [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) - 5 min overview
- **Complete Guide:** See User Guide section in Quick Start
- **Mobile Install:** [MOBILE_APP_GUIDE.md](MOBILE_APP_GUIDE.md)

### For Developers
- **Technical Docs:** [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)
  - Architecture
  - API endpoints
  - Database schema
  - Development setup
  - Deployment guide

---

## 🎯 Quick Start

### 1. Access the App
Go to: https://shrimp-process-flow.preview.emergentagent.com

### 2. Login
Click "Continue with Google"

### 3. Start Using
- **Staff:** Create batches, track processing
- **Admin:** View analytics, manage users
- **Farmer:** Check your supplies & payments

---

## 📱 Mobile App

Your app is already installable on phones!

**Android:**
1. Open Chrome
2. Menu → "Add to Home screen"

**iPhone:**
1. Open Safari
2. Share → "Add to Home Screen"

[Full mobile guide →](MOBILE_APP_GUIDE.md)

---

## 👥 User Roles Explained

| Role | Access | Primary Tasks |
|------|--------|---------------|
| 👑 **Owner** | Everything | User management, full control |
| 🛡️ **Admin** | Analytics + Ops | Dashboard, reports, user management |
| 👷 **Staff** | Operations | Intake, processing, inventory, dispatch |
| 🌾 **Farmer** | Personal data | View supplies & payments |

---

## 🔥 Key Features Explained

### 📦 Batch Management
- Unique batch IDs (e.g., BATCH20260218ABC123)
- QR code generation for physical tracking
- Status tracking: RECEIVED → PROCESSED → STORED → SHIPPED

### 🏭 Processing Stages
- **Washing** - Remove dirt and debris
- **Peeling** - Remove shells
- **Grading** - Sort by quality
- **Packing** - Prepare for storage

**Automatic calculations:**
- Wastage = Input - Output
- Yield % = (Output / Input) × 100

### 💰 Payment System
```
Gross Amount = Weight × Price per kg
Net Amount = Gross - Deductions
Status: Pending → Paid
```

Farmers see complete transparency!

### 📊 Analytics Dashboard
- Total procurement (kg)
- Processing yield (%)
- Farmer payments (pending & paid)
- Average selling price
- Total farmers, batches, dispatches

### 📤 Excel Export
Download data for:
- Batches
- Payments
- Processing stages

Clean, professional format ready for analysis.

---

## 🎨 Design

**Theme:** "The Performance Pro" - Industrial aesthetic

**Colors:**
- Primary: Deep Ocean Blue (#0F172A)
- Accent: Safety Orange (#F97316)
- Background: Slate 50 (#F8FAFC)

**Typography:**
- Headings: Barlow Condensed (bold, condensed)
- Body: Inter (clean, readable)
- Data: Monospace (batch IDs, codes)

---

## 🔒 Security

- ✅ Google OAuth authentication
- ✅ Role-based access control
- ✅ HTTPOnly secure cookies
- ✅ HTTPS only
- ✅ Session management (7-day expiry)
- ✅ Input validation

---

## 📖 User Workflows

### Creating Your First Batch (Staff)

1. **Add Farmer** (if new)
   - Name, contact, address

2. **Create Batch**
   - Select farmer
   - Enter weight
   - Choose size grade
   - Set location

3. **QR Code Generated**
   - Print and attach to physical batch

4. **Track Processing**
   - Add 4 stages
   - System calculates yield

5. **Move to Storage**
   - Select cold room
   - Track batch age

6. **Create Dispatch**
   - Assign to customer
   - Set selling price

7. **Process Payment**
   - Farmer sees in dashboard
   - Transparent payment history

---

## 🆘 Getting Help

### Common Questions

**Q: How do I invite users?**  
A: Go to User Management → Enter email → Select role → Grant Access

**Q: How do farmers access their data?**  
A: Link their user account to farmer record in User Management

**Q: Can I export data?**  
A: Yes! Dashboard → Export buttons → Excel download

**Q: Is there a mobile app?**  
A: Yes! Install as PWA from browser (3 clicks)

**Q: How do I print QR codes?**  
A: Created automatically when batch is made. Click QR icon to reprint.

---

## 📈 Business Impact

### For Management
- **Real-time visibility** into operations
- **Data-driven decisions** with analytics
- **Efficiency tracking** via yield metrics
- **Export-ready reports** for stakeholders

### For Staff
- **Streamlined workflows** - no paperwork
- **Quick batch lookup** via QR scanner
- **Clear task tracking** through status system
- **Mobile access** for on-the-go

### For Farmers
- **Complete transparency** - see all their data
- **Payment tracking** - know what to expect
- **Self-service access** - login anytime
- **Trust building** - blockchain-ready architecture

---

## 🚀 Deployment

**Current:** Emergent.sh (Kubernetes)

**URL:** https://shrimp-process-flow.preview.emergentagent.com

**Services:**
- Frontend: React (Port 3000)
- Backend: FastAPI (Port 8001)
- Database: MongoDB

**Hot reload:** ✅ Enabled for both frontend & backend

---

## 🔮 Future Enhancements

Potential additions:
- 📱 Native mobile apps (Android APK, iOS IPA)
- 📊 Grafana dashboards
- 🔔 Push notifications for farmers
- 📸 Batch photos
- 📈 Advanced analytics & forecasting
- 🌍 Multi-language support
- 📲 SMS integration
- 🔗 Blockchain traceability
- 🤖 AI quality assessment

---

## 📞 Support

**For Users:**
- Check [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)
- Contact your system administrator

**For Developers:**
- See [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)
- Check logs: `/var/log/supervisor/`

---

## 📄 License

Copyright © 2026 AquaFlow Systems  
All rights reserved.

---

## 🙏 Credits

**Built with:**
- [Emergent.sh](https://emergent.sh) - AI-powered development platform
- [FastAPI](https://fastapi.tiangolo.com)
- [React](https://react.dev)
- [MongoDB](https://mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)

---

## 📊 Project Stats

- **Lines of Code:** ~8,000+
- **API Endpoints:** 30+
- **Database Collections:** 8
- **User Roles:** 4
- **Features:** 15+
- **Pages:** 10+
- **Development Time:** 1 day (with Emergent AI)

---

## 🎉 Get Started Now!

1. **Visit:** https://shrimp-process-flow.preview.emergentagent.com
2. **Login:** Click "Continue with Google"
3. **Explore:** Based on your role
4. **Install:** Add to home screen (mobile)
5. **Learn:** Check user guide

---

**Made with ❤️ using Emergent AI**

*Transforming prawn processing, one batch at a time.* 🌊🦐
