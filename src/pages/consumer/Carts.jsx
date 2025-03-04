import React from "react";
import { Table, Typography, Button, InputNumber, Row, Col, Empty } from "antd";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const { Title, Text } = Typography;

const CartPage = () => {
  const { cartItems, handleQuantityChange, handleRemoveItem, loading } = useCart();

  if (loading) return <div>Loading...</div>;

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <>
      <Link style={{ textDecoration: "none", color: "black" }} to="/"> HOME</Link>
      <div style={{ padding: 20 }}>
        {cartItems.length === 0 ? (
          <Empty description={<Title level={4}>Your cart is empty</Title>} />
        ) : (
          <>
            <Title level={2}>Your Cart (Interested {cartItems.length} items)</Title>
            <Table
              dataSource={cartItems}
              columns={[
                {
                  title: "Item",
                  dataIndex: "name",
                  render: (text) => <Text>{text}</Text>,
                },
                {
                  title: "Price",
                  dataIndex: "price",
                  render: (price) => `₹${price}`,
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                  render: (quantity, record) => (
                    <InputNumber
                      min={1}
                      value={quantity}
                      onChange={(value) => handleQuantityChange(value, record)}
                    />
                  ),
                },
                {
                  title: "Total",
                  render: (_, record) => `₹${record.price * record.quantity}`,
                },
                {
                  title: "Action",
                  render: (_, record) => (
                    <Button type="link" danger onClick={() => handleRemoveItem(record.key)}>
                      Remove
                    </Button>
                  ),
                },
              ]}
            />
            <Row justify="end" style={{ marginTop: 20 }}>
              <Col>
                <Title level={3}>Total: ₹{calculateTotal()}</Title>
                <Button type="primary" size="large">Proceed to Checkout</Button>
              </Col>
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
