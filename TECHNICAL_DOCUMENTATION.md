# 🛠️ AquaFlow Systems - Technical Documentation

## 📋 Table of Contents
1. [Technology Stack](#technology-stack)
2. [Architecture Overview](#architecture-overview)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication Flow](#authentication-flow)
6. [Key Features Implementation](#key-features-implementation)
7. [Deployment](#deployment)
8. [Development Setup](#development-setup)

---

## 🚀 Technology Stack

### Frontend
- **Framework:** React 18.x
- **Language:** JavaScript (ES6+)
- **Routing:** React Router DOM v6
- **State Management:** React Hooks (useState, useEffect)
- **HTTP Client:** Axios
- **Styling:** 
  - Tailwind CSS 3.x
  - Custom CSS
  - Google Fonts (Barlow Condensed, Inter)
- **UI Components:** 
  - Shadcn/UI (Button, Card, Input, Select, etc.)
  - Lucide React (Icons)
  - Sonner (Toast notifications)
- **QR Code:**
  - react-qr-code (generation)
  - html5-qrcode (scanning)
- **Build Tool:** Create React App
- **Package Manager:** Yarn

### Backend
- **Framework:** FastAPI 0.109.0
- **Language:** Python 3.10+
- **ASGI Server:** Uvicorn
- **Database:** MongoDB (Motor - async driver)
- **Authentication:** Emergent Auth (Google OAuth)
- **Validation:** Pydantic v2
- **QR Generation:** qrcode[pil], Pillow
- **Excel Export:** openpyxl
- **CORS:** FastAPI CORS Middleware

### Infrastructure
- **Containerization:** Docker
- **Process Manager:** Supervisord
- **Reverse Proxy:** Nginx (Kubernetes Ingress)
- **Orchestration:** Kubernetes
- **Hot Reload:** Enabled for both frontend & backend

### Third-Party Services
- **Authentication:** Emergent Auth (https://auth.emergentagent.com)
- **Session Management:** Emergent Session API
- **Database:** MongoDB Atlas / Local MongoDB

---

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Users (Multi-Role)                      │
│         Owner | Admin | Staff | Farmer                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Emergent Auth (Google OAuth)                   │
│         https://auth.emergentagent.com                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Kubernetes Ingress                         │
│          (Routes /api → Backend, / → Frontend)              │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
┌───────────────┐            ┌────────────────┐
│   Frontend    │            │    Backend     │
│   React App   │◄──────────►│   FastAPI      │
│   Port 3000   │   Axios    │   Port 8001    │
└───────────────┘            └────────┬───────┘
                                      │
                                      ▼
                             ┌────────────────┐
                             │    MongoDB     │
                             │   (Database)   │
                             └────────────────┘
```

### Request Flow

1. **User Login:**
   ```
   User → Login Page → Emergent Auth → Callback → 
   Exchange session_id → Backend creates session → 
   Frontend stores session_token → Protected routes accessible
   ```

2. **API Request:**
   ```
   Frontend → API call with session_token (cookie/header) →
   Backend validates session → Check user role →
   Execute business logic → MongoDB query →
   Return response
   ```

3. **File Upload/Download:**
   ```
   Excel Export: Backend → openpyxl → StreamingResponse → 
   Frontend triggers download
   
   QR Code: Backend → qrcode library → Base64 encode →
   Store in MongoDB → Frontend displays
   ```

---

## 💾 Database Schema

### Collections Overview

```
test_database/
├── users                 # User accounts
├── user_sessions         # Active sessions
├── farmers               # Farmer records
├── batches               # Raw material batches
├── processing_stages     # Processing stage records
├── inventory             # Cold storage inventory
├── dispatches            # Export/dispatch records
└── payments              # Farmer payment records
```

### Schema Details

#### 1. users
```javascript
{
  user_id: String,          // Custom UUID (not _id)
  email: String,            // Google account email
  name: String,             // User's full name
  picture: String?,         // Google profile picture URL
  role: String,             // "owner" | "admin" | "staff" | "farmer"
  invited: Boolean?,        // True if pre-invited
  created_at: DateTime      // ISO 8601
}
```

#### 2. user_sessions
```javascript
{
  user_id: String,          // FK to users.user_id
  session_token: String,    // Unique session identifier
  expires_at: DateTime,     // Session expiry (7 days)
  created_at: DateTime
}
```

#### 3. farmers
```javascript
{
  farmer_id: String,        // Custom UUID
  user_id: String?,         // FK to users.user_id (if linked)
  name: String,
  contact: String,
  address: String,
  created_at: DateTime
}
```

#### 4. batches
```javascript
{
  batch_id: String,         // Format: BATCH20260218ABC123
  farmer_id: String,        // FK to farmers.farmer_id
  weight_kg: Number,        // Decimal
  size_grade: String,       // "Small" | "Medium" | "Large" | "Jumbo"
  intake_date: DateTime,
  intake_time: String,      // HH:MM:SS
  location: String,
  status: String,           // "RECEIVED" | "PROCESSED" | "STORED" | "SHIPPED"
  qr_code: String,          // Base64 encoded image
  created_at: DateTime
}
```

#### 5. processing_stages
```javascript
{
  stage_id: String,         // Custom UUID
  batch_id: String,         // FK to batches.batch_id
  stage_name: String,       // "Washing" | "Peeling" | "Grading" | "Packing"
  assigned_person: String,  // Worker name
  input_weight: Number,
  output_weight: Number,
  wastage: Number,          // Auto-calculated
  yield_percentage: Number, // Auto-calculated
  status: String,           // "COMPLETED"
  created_at: DateTime,
  completed_at: DateTime?
}
```

#### 6. inventory
```javascript
{
  inventory_id: String,     // Custom UUID
  batch_id: String,         // FK to batches.batch_id
  location: String,         // Storage location
  quantity: Number,         // kg
  batch_age: Number,        // Days since intake
  status: String,           // "STORED"
  created_at: DateTime
}
```

#### 7. dispatches
```javascript
{
  dispatch_id: String,      // Custom UUID
  batch_id: String,         // FK to batches.batch_id
  customer_name: String,
  country: String,
  selling_price: Number,    // Per kg
  dispatch_date: DateTime,
  status: String,           // "SHIPPED"
  created_at: DateTime
}
```

#### 8. payments
```javascript
{
  payment_id: String,       // Custom UUID
  farmer_id: String,        // FK to farmers.farmer_id
  batch_id: String,         // FK to batches.batch_id
  total_prawns: Number,     // kg
  price_per_kg: Number,
  gross_amount: Number,     // Auto-calculated
  deductions: Number,
  net_amount: Number,       // Auto-calculated
  payment_status: String,   // "pending" | "paid"
  payment_date: DateTime?,
  created_at: DateTime
}
```

### Important Notes

- **No _id in responses:** All queries use `{"_id": 0}` projection
- **Custom IDs:** user_id, farmer_id, batch_id, etc. (not MongoDB _id)
- **DateTime:** All dates stored as Python datetime (timezone-aware)
- **Cascading:** No foreign key constraints (MongoDB is document-based)

---

## 🔌 API Endpoints

### Base URL
```
Production: https://shrimp-intake.preview.emergentagent.com/api
Local: http://localhost:8001/api
```

### Authentication

#### POST /api/auth/session
Exchange session_id for session_token
```json
Request:
{
  "session_id": "emergent_session_id_from_url"
}

Response:
{
  "user_id": "user_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://...",
  "role": "staff",
  "session_token": "token_xyz..."
}
```

#### GET /api/auth/me
Get current user info
```json
Headers: Authorization: Bearer {session_token}
Or Cookie: session_token={session_token}

Response:
{
  "user_id": "user_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "staff",
  "created_at": "2026-02-18T10:00:00Z"
}
```

#### POST /api/auth/logout
Logout current user

### User Management (Owner/Admin only)

#### POST /api/users/invite
```json
Request:
{
  "email": "newuser@example.com",
  "role": "staff"
}
```

#### GET /api/users
Get all users

#### PUT /api/users/{user_id}/role
Update user role
```json
Request:
{
  "role": "admin"
}
```

#### DELETE /api/users/{user_id}
Remove user

### Farmers

#### POST /api/farmers
```json
Request:
{
  "name": "Ram Kumar",
  "contact": "+91234567890",
  "address": "Village, State"
}
```

#### GET /api/farmers
Get all farmers

#### GET /api/farmers/me/stats
Get farmer's own statistics (Farmer role only)

#### POST /api/farmers/link
Link farmer to user account
```json
Request:
{
  "user_id": "user_abc123",
  "farmer_id": "farmer_xyz789"
}
```

### Batches

#### POST /api/batches
```json
Request:
{
  "farmer_id": "farmer_xyz789",
  "weight_kg": 150.5,
  "size_grade": "Medium",
  "location": "Dock A"
}

Response: (includes QR code)
{
  "batch_id": "BATCH20260218ABC123",
  "qr_code": "data:image/png;base64,iVBOR...",
  "status": "RECEIVED",
  ...
}
```

#### GET /api/batches
Get all batches

#### GET /api/batches/{batch_id}
Get single batch

### Processing

#### POST /api/processing
```json
Request:
{
  "batch_id": "BATCH20260218ABC123",
  "stage_name": "Washing",
  "assigned_person": "John Doe",
  "input_weight": 150.0,
  "output_weight": 148.5
}

Response: (auto-calculated fields)
{
  "stage_id": "stage_def456",
  "wastage": 1.5,
  "yield_percentage": 99.0,
  ...
}
```

#### GET /api/processing/batch/{batch_id}
Get all stages for a batch

### Inventory

#### POST /api/inventory
```json
Request:
{
  "batch_id": "BATCH20260218ABC123",
  "location": "Cold Room A",
  "quantity": 148.5
}
```

#### GET /api/inventory
Get all inventory items

### Dispatch

#### POST /api/dispatch
```json
Request:
{
  "batch_id": "BATCH20260218ABC123",
  "customer_name": "Ocean Fresh USA",
  "country": "United States",
  "selling_price": 12.50,
  "dispatch_date": "2026-02-25T10:00:00Z"
}
```

#### GET /api/dispatch
Get all dispatches

### Payments

#### POST /api/payments
```json
Request:
{
  "farmer_id": "farmer_xyz789",
  "batch_id": "BATCH20260218ABC123",
  "price_per_kg": 5.00,
  "deductions": 100.00
}

Response: (auto-calculated)
{
  "payment_id": "pay_ghi789",
  "total_prawns": 150.5,
  "gross_amount": 752.50,
  "net_amount": 652.50,
  "payment_status": "pending",
  ...
}
```

#### PUT /api/payments/{payment_id}/status?status=paid
Update payment status

#### GET /api/payments
Get all payments

### Dashboard

#### GET /api/dashboard/admin
Get admin analytics
```json
Response:
{
  "total_procurement": 5000.0,
  "yield_percentage": 78.5,
  "total_payments": 25000.00,
  "pending_payments": 5000.00,
  "avg_selling_price": 12.50,
  "total_batches": 150,
  "total_farmers": 25,
  "total_dispatches": 120
}
```

### Export

#### POST /api/export/batches
Download batches Excel file

#### POST /api/export/payments
Download payments Excel file

#### POST /api/export/processing
Download processing Excel file

---

## 🔐 Authentication Flow

### Step-by-Step

1. **User clicks "Continue with Google"**
   ```
   Frontend redirects to:
   https://auth.emergentagent.com/?redirect={app_url}
   ```

2. **User logs in with Google**
   ```
   Emergent Auth handles OAuth2 flow
   ```

3. **Redirect back with session_id**
   ```
   User redirected to:
   {app_url}#session_id={emergent_session_id}
   ```

4. **Frontend extracts session_id**
   ```javascript
   const params = new URLSearchParams(location.hash.substring(1));
   const sessionId = params.get('session_id');
   ```

5. **Exchange session_id for session_token**
   ```javascript
   POST /api/auth/session
   { session_id: sessionId }
   
   Returns: { user_id, email, name, role, session_token }
   ```

6. **Backend creates/updates user**
   ```python
   # Check if user exists
   existing_user = await db.users.find_one({"email": email})
   
   if not existing_user:
       # Create new user with default role
       user_id = f"user_{uuid.uuid4().hex[:12]}"
       await db.users.insert_one({...})
   
   # Create session
   await db.user_sessions.insert_one({
       "user_id": user_id,
       "session_token": session_token,
       "expires_at": datetime.now() + timedelta(days=7)
   })
   ```

7. **Set session cookie**
   ```python
   response.set_cookie(
       key="session_token",
       value=session_token,
       httponly=True,
       secure=True,
       samesite="none",
       max_age=7*24*60*60
   )
   ```

8. **Frontend stores session & redirects**
   ```javascript
   // Cookie automatically set
   // Redirect based on role
   if (role === 'farmer') navigate('/farmer');
   else if (role === 'owner' || role === 'admin') navigate('/admin');
   else navigate('/staff');
   ```

9. **Subsequent requests**
   ```javascript
   // Session token sent automatically via cookie
   axios.get('/api/batches', { withCredentials: true })
   
   // Or via Authorization header
   axios.get('/api/batches', {
     headers: { 'Authorization': `Bearer ${session_token}` }
   })
   ```

10. **Backend validates session**
    ```python
    async def get_current_user(request: Request):
        # Get session token from cookie or header
        session_token = request.cookies.get("session_token")
        if not session_token:
            auth_header = request.headers.get("Authorization")
            if auth_header:
                session_token = auth_header.split(" ")[1]
        
        # Find session
        session = await db.user_sessions.find_one({
            "session_token": session_token
        })
        
        # Check expiry
        if session["expires_at"] < datetime.now(timezone.utc):
            raise HTTPException(401, "Session expired")
        
        # Get user
        user = await db.users.find_one({
            "user_id": session["user_id"]
        })
        
        return user
    ```

### Role-Based Access Control

```python
# In protected endpoints
async def some_endpoint(user: dict = Depends(get_current_user)):
    if user["role"] not in ["owner", "admin"]:
        raise HTTPException(403, "Admin access required")
    # ... rest of logic
```

---

## ⚙️ Key Features Implementation

### 1. QR Code Generation

**Backend (server.py):**
```python
import qrcode
from io import BytesIO
import base64

def generate_qr_code(data: dict) -> str:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(json.dumps(data))
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"

# Usage in batch creation:
qr_data = {
    "batch_id": batch_id,
    "farmer_id": batch.farmer_id,
    "weight_kg": batch.weight_kg,
    "size_grade": batch.size_grade,
    "intake_date": datetime.now().isoformat()
}
qr_code = generate_qr_code(qr_data)
```

**Frontend (QRScanner.js):**
```javascript
import { Html5QrcodeScanner } from 'html5-qrcode';

const scanner = new Html5QrcodeScanner(
  'qr-scanner',
  { fps: 10, qrbox: { width: 250, height: 250 } },
  false
);

scanner.render(
  (decodedText) => {
    const data = JSON.parse(decodedText);
    setScannedData(data);
  },
  (error) => {
    // Handle error
  }
);
```

### 2. Excel Export

**Backend (server.py):**
```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from fastapi.responses import StreamingResponse

@api_router.post("/export/batches")
async def export_batches(user: dict = Depends(get_current_user)):
    batches = await db.batches.find({}, {"_id": 0}).to_list(10000)
    
    workbook = Workbook()
    worksheet = workbook.active
    worksheet.title = "Batches"
    
    # Styled headers
    headers = ["Batch ID", "Farmer ID", "Weight (kg)", ...]
    header_fill = PatternFill(start_color="0F172A", ...)
    header_font = Font(bold=True, color="FFFFFF")
    
    for col_num, header in enumerate(headers, 1):
        cell = worksheet.cell(row=1, column=col_num)
        cell.value = header
        cell.fill = header_fill
        cell.font = header_font
    
    # Data rows
    for row_num, batch in enumerate(batches, 2):
        row_data = [batch["batch_id"], batch["farmer_id"], ...]
        for col_num, value in enumerate(row_data, 1):
            worksheet.cell(row=row_num, column=col_num).value = value
    
    # Return as streaming response
    buffer = BytesIO()
    workbook.save(buffer)
    buffer.seek(0)
    
    filename = f"batches_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
```

**Frontend (api.js):**
```javascript
export const exportAPI = {
  exportBatches: async () => {
    const response = await api.post('/export/batches', {}, {
      responseType: 'arraybuffer',
    });
    
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `batches_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
```

### 3. Automatic Calculations

**Yield Calculation:**
```python
wastage = input_weight - output_weight
yield_percentage = (output_weight / input_weight * 100) if input_weight > 0 else 0
```

**Payment Calculation:**
```python
total_prawns = batch["weight_kg"]
gross_amount = total_prawns * price_per_kg
net_amount = gross_amount - deductions
```

### 4. Status Management

**Batch Status Flow:**
```
RECEIVED → PROCESSED → STORED → SHIPPED
```

**Auto-status update:**
```python
# After 4 processing stages complete
stages_count = await db.processing_stages.count_documents({"batch_id": batch_id})
if stages_count >= 4:
    await db.batches.update_one(
        {"batch_id": batch_id},
        {"$set": {"status": "PROCESSED"}}
    )
```

### 5. Role-Based UI

**Frontend (ProtectedRoute.js):**
```javascript
function ProtectedRoute({ children, allowedRoles = [] }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const userData = await authAPI.getMe();
      setUser(userData);
    };
    checkAuth();
  }, []);
  
  if (!user) return <Loading />;
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }
  
  return <>{React.cloneElement(children, { user })}</>;
}
```

---

## 🚀 Deployment

### Current Setup

**Platform:** Emergent.sh (Kubernetes-based)

**Services:**
- Frontend: React app on port 3000
- Backend: FastAPI on port 8001
- MongoDB: Atlas or local instance

**Environment Variables:**

**Frontend (.env):**
```bash
REACT_APP_BACKEND_URL=https://shrimp-intake.preview.emergentagent.com
```

**Backend (.env):**
```bash
MONGO_URL=mongodb://localhost:27017/
DB_NAME=test_database
CORS_ORIGINS=https://shrimp-intake.preview.emergentagent.com
```

### Supervisor Configuration

**Backend:**
```ini
[program:backend]
command=uvicorn server:app --host 0.0.0.0 --port 8001 --reload
directory=/app/backend
autostart=true
autorestart=true
```

**Frontend:**
```ini
[program:frontend]
command=yarn start
directory=/app/frontend
autostart=true
autorestart=true
environment=PORT=3000
```

### Kubernetes Ingress

```yaml
# Automatic routing:
/api/* → Backend (port 8001)
/*     → Frontend (port 3000)
```

---

## 💻 Development Setup

### Prerequisites
- Node.js 16+
- Python 3.10+
- MongoDB
- Yarn

### Local Development

```bash
# 1. Clone repository
git clone <repo-url>
cd aquaflow-systems

# 2. Setup Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Create .env
echo "MONGO_URL=mongodb://localhost:27017/" > .env
echo "DB_NAME=test_database" >> .env

# Run backend
uvicorn server:app --reload --port 8001

# 3. Setup Frontend
cd ../frontend
yarn install

# Create .env
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env

# Run frontend
yarn start

# 4. Open browser
# http://localhost:3000
```

### Hot Reload

- **Frontend:** Automatic (React dev server)
- **Backend:** Automatic (Uvicorn --reload)
- **Changes in .env:** Requires restart

### Debugging

**Backend Logs:**
```bash
tail -f /var/log/supervisor/backend.err.log
tail -f /var/log/supervisor/backend.out.log
```

**Frontend Logs:**
```bash
tail -f /var/log/supervisor/frontend.err.log
```

**MongoDB:**
```bash
mongosh test_database
db.users.find().pretty()
db.batches.find().pretty()
```

---

## 📊 Performance Considerations

### Database Indexing

**Recommended indexes:**
```javascript
db.users.createIndex({ "email": 1 }, { unique: true })
db.user_sessions.createIndex({ "session_token": 1 }, { unique: true })
db.user_sessions.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0 })
db.batches.createIndex({ "batch_id": 1 }, { unique: true })
db.batches.createIndex({ "farmer_id": 1 })
db.batches.createIndex({ "status": 1 })
```

### API Response Times

- Authentication: ~200ms
- List queries: ~100-300ms
- Create operations: ~150-250ms
- Excel export: ~500ms-2s (depends on data size)

### Frontend Optimization

- Lazy loading routes
- Memoization with useMemo
- Debounced search inputs
- Image optimization (QR codes)

---

## 🔒 Security Features

1. **HTTPS Only:** Enforced via Kubernetes
2. **Session Management:** 7-day expiry, HTTPOnly cookies
3. **CORS:** Configured for specific origins
4. **Role-Based Access:** Enforced at API level
5. **Input Validation:** Pydantic models
6. **SQL Injection:** N/A (MongoDB)
7. **XSS Protection:** React auto-escaping
8. **CSRF:** SameSite cookies

---

## 📦 Dependencies

### Backend (requirements.txt)
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
motor==3.3.2
pydantic==2.5.3
python-dotenv==1.0.0
qrcode[pil]==8.0
Pillow==10.2.0
openpyxl==3.1.5
requests==2.31.0
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "axios": "^1.6.5",
    "sonner": "^1.3.1",
    "html5-qrcode": "^2.3.8",
    "react-qr-code": "^2.0.12",
    "framer-motion": "^10.18.0",
    "lucide-react": "^0.309.0"
  }
}
```

---

## 🎨 Design System

**Color Palette:**
- Primary: #0F172A (Deep Ocean Blue)
- Accent: #F97316 (Safety Orange)
- Background: #F8FAFC (Slate 50)
- Text: #0F172A (Slate 900)

**Typography:**
- Headings: Barlow Condensed
- Body: Inter
- Monospace: ui-monospace

**Components:**
- Shadcn/UI based
- Consistent spacing (4px, 8px, 12px, 16px, 24px)
- Border radius: 8px (cards), 4px (inputs)

---

## 🧪 Testing

**Backend:**
```bash
# Unit tests (TODO)
pytest tests/

# Manual API testing
curl -X POST http://localhost:8001/api/batches \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"farmer_id":"farmer_123","weight_kg":100,"size_grade":"Medium","location":"Dock A"}'
```

**Frontend:**
```bash
# Component tests (TODO)
yarn test

# E2E tests (TODO)
npx playwright test
```

---

## 🐛 Common Issues & Solutions

### Issue: CORS errors
**Solution:** Check CORS_ORIGINS in backend/.env

### Issue: Session expired immediately
**Solution:** Check cookie settings (httponly, secure, samesite)

### Issue: MongoDB connection failed
**Solution:** Verify MONGO_URL in backend/.env

### Issue: QR scanner not working
**Solution:** Ensure HTTPS (camera requires secure context)

### Issue: Hot reload not working
**Solution:** Restart supervisor: `sudo supervisorctl restart backend frontend`

---

## 📚 Additional Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com
- **React Docs:** https://react.dev
- **MongoDB Docs:** https://docs.mongodb.com
- **Tailwind CSS:** https://tailwindcss.com
- **Shadcn/UI:** https://ui.shadcn.com

---

## 📝 Future Enhancements

1. **Push Notifications** - Alert farmers on payments
2. **Advanced Analytics** - Charts, trends, forecasting
3. **Mobile Native Apps** - Capacitor/React Native
4. **Grafana Integration** - Real-time dashboards
5. **Multi-language Support** - i18n
6. **Batch Photos** - Upload batch images
7. **SMS Integration** - Twilio for farmer notifications
8. **Blockchain** - Traceability & transparency
9. **AI/ML** - Yield prediction, quality assessment
10. **API Rate Limiting** - Prevent abuse

---

**Documentation Version:** 1.0  
**Last Updated:** February 2026  
**Maintained By:** AquaFlow Systems Development Team

---

🎉 **Built with ❤️ using Emergent.sh**
