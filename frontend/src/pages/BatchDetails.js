import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

function BatchDetails({ user }) {
  return (
    <Layout user={user} activePage="staff">
      <div className="p-6 md:p-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-8">Batch Details</h1>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Batch Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Batch details coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default BatchDetails;
