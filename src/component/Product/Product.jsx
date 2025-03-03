import React, { useEffect, useState } from "react";
import {useParams, useNavigate } from "react-router-dom";
import { Row, Col, Typography, Button, Radio, InputNumber, Image, Spin, Tooltip, Modal  } from "antd";
// import { Modal } from "antd";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { BASE_URL } from "../../API/BaseURL";

import './Product.css'
// import { useAuth } from "../../context/AuthContext"; // Uncomment if authentication is required

const { Title, Text } = Typography;

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // const { user } = useAuth(); // Uncomment if user authentication is needed

  useEffect(() => {
    if (!id) {
      message.error("Product ID is missing!");
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/product/get-by/${id}`);
        console.log("Fetched Product Data:", response.data);
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product details:", error.response?.data || error.message);
        message.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
  if (!product) return <h2 style={{ color: "red", textAlign: "center" }}>⚠ Product Not Found</h2>;

  const handleCartClick1 = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        Modal.confirm({
            title: "Login Required",
            content: "Please log in to add items to the cart.",
            okText: "Login",
            cancelText: "Cancel",
            onOk: () => navigate("/login"),
            className:'modal',
        });
        return;
      }

    const userId = user._id;
    console.log("User before sending:", user);

    const data = {
      userId: user._id,
      // userName: user.name || "Unknown User",
      userName: `${user.firstName} ${user.lastName}`.trim() || "unknown User",
      email: user.email,
      phone: user.phone ? user.phone : "Not Provided",
      productId: product._id,
      product: product.productName,
  };
  
  console.log("Data being sent to API:", data);
    // API call to notify admin (Add to Interested Users)
    try {
      const response = await axios.post(`${BASE_URL}/api/admin/add/interested-users`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Response:", response.data);
        // alert("Item added to the cart & admin notified!");
    } catch (error) {
        console.error("Error adding interested user:", error);
        alert("Failed to notify admin. Please try again.");
    }

    // Adding to cart
    const cartItem = {
        key: `${product._id}-${selectedSize}`,
        name: product.productName,
        price: product.price * quantity,
        size: selectedSize,
        quantity,
        userId: userId,
    };

   


    console.log("cart items are ",cartItem)
    addToCart(cartItem);
    alert("Item added to cart!");
};


  return (
    <div>
      <div style={{ padding: "20px", backgroundColor: "white", marginRight: "20px" }}>
        <Row gutter={24}>
          <Col span={12}>
          <Image
  src={`${BASE_URL}/uploads/${product.image.replace("/uploads/", "")}`}
  alt={product.productName}
  style={{ maxWidth: "100%", borderRadius: "8px" }}
  onError={(e) => { e.target.src = "/placeholder-image.png"; }} // Fallback if image is missing
/>

          </Col>
          <Col span={12}>
            <Title level={3}>{product.productName}</Title>
            <Title level={4}>₹{product.price}</Title>
            <Text>
              Product Code: <strong>{product.productCode || "N/A"}</strong>
            </Text>
            <br />
            <Text>Size:</Text>
            <div>
              <Radio.Group onChange={(e) => setSelectedSize(e.target.value)} value={selectedSize}>
                {Array.isArray(product?.size)
                  ? product.size.map((size) => (
                      <Radio.Button key={size} value={size}>
                        {size}
                      </Radio.Button>
                    ))
                  : typeof product?.size === "string"
                  ? product.size.split(",").map((size) => (
                      <Radio.Button key={size.trim()} value={size.trim()}>
                        {size.trim()}
                      </Radio.Button>
                    ))
                  : (
                      <Text> No sizes available </Text>
                    )}
              </Radio.Group>
            </div>
            <br />
            <Text>Quantity:</Text>
            <div>
              <InputNumber min={1} value={quantity} onChange={(value) => setQuantity(value)} />
            </div>
            <br />
           
            <Tooltip style={{backgroundColor:'white'}} title={!selectedSize ? "Please select a size" : ""}>
            <Button   className='button'
              style={{ backgroundColor: "#40476D", width: "200px", marginLeft: "30%" }}
              type="primary"
              onClick={ handleCartClick1 }
              disabled={!selectedSize}
            >
              I'm Interested
            </Button>
          </Tooltip>
          </Col>
        </Row>
      </div>
      <h2>Details</h2>
      <p style={{ fontSize: "18px" }}>{product?.description || "No Detailed Description Available"}</p>
    </div>
  );
};

export default Product;
