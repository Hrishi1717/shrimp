# 🎯 AquaFlow Systems - Complete User Guide

## 🔐 Your Admin Access

**Your Email:** rishicool1717@gmail.com  
**Role:** Admin ✅

## 📱 How to Use the App

### 1. Login as Admin
1. Go to: https://shrimp-intake.preview.emergentagent.com
2. Click "Continue with Google"
3. **Logout and login again** to see all admin features

### 2. Admin Dashboard Access
Once logged in as admin, you'll see these menu items:
- **Intake** - Create batches
- **Processing** - Track processing stages
- **Inventory** - Manage cold storage
- **Dispatch** - Export management
- **QR Scanner** - Scan batch QR codes
- **Dashboard** - Analytics overview
- **User Management** ⭐ NEW - Assign roles and link farmers

---

## 👥 User Management (Admin Only)

### Assign Roles to Users

1. **Navigate to "User Management"** in the sidebar
2. You'll see all registered users
3. **Change roles** using the dropdown:
   - **Admin** - Full access (Dashboard, User Management, all features)
   - **Staff** - Intake, Processing, Inventory, Dispatch, QR Scanner
   - **Farmer** - Only see their own dashboard with supplies and payments

### Link Farmers to User Accounts

**Why link farmers?**
- Farmers can login and see their own data
- Transparent payment tracking
- Self-service access

**How to link:**
1. In "User Management" page, find the "Link Farmer to User Account" section
2. Select a user (person who will login)
3. Select a farmer (from your farmer records)
4. Click "Link Farmer to User"
5. ✅ That user's role automatically changes to "farmer"
6. They can now login and see their farmer dashboard

---

## 📋 Complete Workflow Example

### Scenario: New Farmer Registration

**Step 1: Create Farmer Record**
1. Go to "Intake" (Staff Dashboard)
2. Click "New Batch"
3. Click the "+" button next to Farmer dropdown
4. Add farmer details:
   - Name: John Smith
   - Contact: +1234567890
   - Address: 123 Farm Road

**Step 2: Create User Account for Farmer**
1. Ask John Smith to login once with his Google account
2. He'll automatically get a "staff" role initially

**Step 3: Link Farmer to User (Admin)**
1. Go to "User Management"
2. In "Link Farmer to User Account":
   - Select user: John Smith (his Google account)
   - Select farmer: John Smith (the farmer record)
   - Click "Link Farmer to User"
3. ✅ Done! John's role is now "farmer"

**Step 4: Farmer Access**
1. John Smith logs out and logs in again
2. He now sees his **Farmer Dashboard** with:
   - Total batches supplied
   - Total prawns supplied
   - Payments received
   - Pending payments
   - Complete payment history

---

## 🚀 Quick Actions

### Make Another User Admin
```bash
mongosh --eval "use test_database; db.users.updateOne({email: 'user@email.com'}, {\$set: {role: 'admin'}})"
```

### View All Users
```bash
mongosh --eval "use test_database; db.users.find({}, {_id: 0, name: 1, email: 1, role: 1}).pretty()"
```

### Reset User Role to Staff
```bash
mongosh --eval "use test_database; db.users.updateOne({email: 'user@email.com'}, {\$set: {role: 'staff'}})"
```

---

## 💡 Pro Tips

1. **First-time Setup:**
   - Login yourself first (admin)
   - Create 2-3 farmer records
   - Invite staff members to login
   - Assign roles from User Management

2. **For Farmers:**
   - Always create the farmer record FIRST (in Intake page)
   - Then ask them to login once with Google
   - Then link them in User Management

3. **Role Hierarchy:**
   - Admin > Staff > Farmer
   - Admins can see everything
   - Staff can manage operations
   - Farmers can only see their own data

4. **Security:**
   - Only admins can access User Management
   - Only admins can see Analytics Dashboard
   - Farmers are isolated to their own data

---

## 🆘 Need Help?

**Issue:** Can't see User Management menu
**Solution:** Logout and login again after role change

**Issue:** Farmer can't see their data
**Solution:** Make sure farmer is linked to user account in User Management

**Issue:** Want to test farmer view
**Solution:** 
1. Create a test farmer
2. Login with a different Google account
3. Link that account to test farmer
4. Login with that account to see farmer view

---

## 📊 What Each Role Sees

### Admin 👑
- Dashboard (Analytics)
- User Management
- Intake
- Processing
- Inventory
- Dispatch
- QR Scanner
- Export to Excel

### Staff 👷
- Intake
- Processing
- Inventory
- Dispatch
- QR Scanner

### Farmer 🌾
- Farmer Dashboard only
  - Their supplies
  - Their payments
  - Payment status

---

**App URL:** https://shrimp-process-flow.preview.emergentagest.com
**Your Admin Email:** rishicool1717@gmail.com

🎉 Happy Managing!
