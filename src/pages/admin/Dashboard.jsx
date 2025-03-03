import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col } from "antd";
import { BASE_URL } from "../../API/BaseURL";


const { Title } = Typography;

const Dashboard = () => {
  const [queryCount, setQueryCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Fetch Customer Queries Count
    const fetchQueryCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/contact/get`);
        const data = await response.json();
        setQueryCount(data.length); // Assuming API returns an array of queries
      } catch (error) {
        console.error("Error fetching query count:", error);
      }
    };

    // Fetch Users Count
    const fetchUserCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/consumer/list`);
        const data = await response.json();
        setUserCount(data.length); // Assuming API returns an array of users
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchQueryCount();
    fetchUserCount();
  }, []);

  return (
    <div className="dashboard-container">
      <Row gutter={16}>
        {/* ✅ Total Customer Queries */}
        <Col span={12}>
          <Card className="query-card">
            <Title level={4} className="card-title">Total Customer Queries</Title>
            <Title level={2} className="query-count">{queryCount}</Title>
          </Card>
        </Col>

        {/* ✅ Total Users Count */}
        <Col span={12}>
          <Card className="user-card">
            <Title level={4} className="card-title">Total Registered Users</Title>
            <Title level={2} className="user-count">{userCount}</Title>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
