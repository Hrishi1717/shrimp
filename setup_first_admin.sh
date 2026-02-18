#!/bin/bash

echo "=================================="
echo "AquaFlow Systems - Admin Setup"
echo "=================================="
echo ""
echo "📋 STEP-BY-STEP GUIDE:"
echo ""
echo "1️⃣  Login to the app first:"
echo "    👉 https://shrimp-process-flow.preview.emergentagent.com"
echo "    👉 Click 'Continue with Google'"
echo ""
echo "2️⃣  Find your user account:"
echo ""

mongosh --quiet --eval "
use('test_database');
print('📧 Your registered users:');
print('');
db.users.find({}, {_id: 0, email: 1, name: 1, role: 1}).forEach(function(user) {
  print('  Name: ' + user.name);
  print('  Email: ' + user.email);
  print('  Current Role: ' + user.role);
  print('  ---');
});
"

echo ""
echo "3️⃣  Make yourself admin (copy and run this command with YOUR email):"
echo ""
echo "    mongosh --eval \"use test_database; db.users.updateOne({email: 'your.email@gmail.com'}, {\\\$set: {role: 'admin'}})\""
echo ""
echo "4️⃣  Logout and login again to see:"
echo "    ✅ Dashboard (Analytics)"
echo "    ✅ User Management (Assign roles)"
echo ""
echo "=================================="
