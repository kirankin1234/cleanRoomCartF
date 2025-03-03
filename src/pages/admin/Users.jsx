import React, { useEffect, useState } from 'react';
import { Table, Card, Statistic } from 'antd';
import axios from 'axios';
import { BASE_URL } from "../../API/BaseURL";


const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/consumer/list`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching consumers:', error);
      });
  }, []);

  const columns = [
    {
      title: 'S.No.',
      key: 'serialNo',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    }
  ];

  return (
    <Card title="User Information">
      {/* ✅ Display Total Users Count */}
      <Statistic title="Total Users" value={users.length} style={{ marginBottom: 16 }} />
      
      <Table columns={columns} dataSource={users} rowKey="_id" />
    </Card>
  );
};

export default Users;
