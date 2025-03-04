import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, message, Modal } from 'antd';
import { loginApi } from '../../../utils/api'; // Ensure this function is correctly implemented
import './login.css';
import { LoginOutlined } from "@ant-design/icons";
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get previous page path

  const handleSubmit = async (values) => {
    try {
      const data = await loginApi(values);

      if (data.token) {
        localStorage.setItem("userToken", data.token); // Store JWT token
        message.success('Login successful');

        const user = data.user;
        localStorage.setItem("user", JSON.stringify(user)); // Store user details

        // Retrieve stored path and remove it
        const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");

        navigate(redirectTo); // Redirect back to the previous page
      } else {
        message.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error("An error occurred");
    }
  };

  return (
    <div className="container">
      <Form onFinish={handleSubmit}>
        <h2>
          <LoginOutlined style={{ marginRight: "8px", fontSize: "22px" }} />
          Login
        </h2>
        <Form.Item name="email" style={{ paddingLeft: '10px', paddingRight: '10px' }} rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" style={{ paddingLeft: '10px', paddingRight: '10px' }} rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Button className='button' style={{ backgroundColor: '#40476D' }} type="primary" htmlType="submit">Login</Button>
        <p style={{ paddingLeft: '99px' }}>Don't have an account? <Link to="/signup">Create account</Link></p>
      </Form>
    </div>
  );
};

export default Login;
