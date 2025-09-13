
import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import ChatAdmin from '@/components/admin/ChatAdmin';

const AdminChats = () => {
  return (
    <AdminLayout title="Customer Chats">
      <Helmet>
        <title>Admin - Customer Chats</title>
      </Helmet>
      
      <ChatAdmin />
    </AdminLayout>
  );
};

export default AdminChats;
