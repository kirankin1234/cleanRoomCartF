import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Typography, Button, Radio, InputNumber, Image, Spin, Tooltip, Modal, message } from "antd";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { BASE_URL } from "../../API/BaseURL";

import "./Product.css";

const { Title, Text } = Typography;

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Get current page URL
  const [product, setProduct] = useState(null);
  const [subProducts, setSubProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) {
      message.error("Product ID is missing!");
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/product/get-by/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product details:", error.response?.data || error.message);
        message.error("Failed to load product details.");
      }
    };

    const fetchSubProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/subproduct/product/${id}`);
        setSubProducts(response.data);
      } catch (error) {
        console.error("Error fetching subproducts:", error);
        message.error("Failed to load subproduct details.");
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchProductDetails(), fetchSubProducts()]);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
  if (!product) return <h2 style={{ color: "red", textAlign: "center" }}>⚠ Product Not Found</h2>;

  const availableSizes = [...new Set(subProducts.map(sub => sub.size))];
  const availableColors = [...new Set(subProducts.map(sub => sub.color))];

  const updatedProductCode = `${product.productCode}${selectedSize ? `-${selectedSize}` : ""}${selectedColor ? `-${selectedColor}` : ""}`;

  const handleCartClick = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      // Store the current page before redirecting to login
      localStorage.setItem("redirectAfterLogin", location.pathname);
    
      Modal.confirm({
        title: "Login Required",
        content: "Please log in to continue.",
        okText: "Login",
        cancelText: "Cancel",
        onOk: () => {
          navigate("/login");
        },
      });
    
      return;
    }
    

    const cartItem = {
      key: `${product._id}-${selectedSize || ""}-${selectedColor || ""}`,
      name: product.productName,
      price: product.price * quantity,
      size: selectedSize || "",
      color: selectedColor || "",
      quantity,
      userId: user._id,
    };

    // Notify admin about interested user
    const data = {
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`.trim() || "unknown User",
      email: user.email,
      phone: user.phone ? user.phone : "Not Provided",
      productId: product._id,
      product: product.productName,
    };

    try {
      // API call to notify admin
      await axios.post(`${BASE_URL}/api/admin/add/interested-users`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Add to cart
      await axios.post(`${BASE_URL}/api/cart/add`, {
        userId: user._id,
        productId: product._id,
        name: product.productName,
        image: product.image,
        price: product.price,
        quantity,
        size: selectedSize || "",
        color: selectedColor || "",
      });

      addToCart(cartItem);
      message.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
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
              onError={(e) => { e.target.src = "/placeholder-image.png"; }}
            />
          </Col>
          <Col span={12}>
            <Title level={3}>{product.productName}</Title>
            <Title level={4}>₹{product.price}</Title>
            <Text>Product Code: <strong>{updatedProductCode}</strong></Text>
            <br /><br />

            {availableSizes.length > 0 && (
              <div>
                <Text>Size:</Text>
                <div>
                  <Radio.Group onChange={(e) => setSelectedSize(e.target.value)} value={selectedSize}>
                    {availableSizes.map((size) => (
                      <Radio.Button key={size} value={size}>
                        {size}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </div>
                <br />
              </div>
            )}

            {availableColors.length > 0 && (
              <div>
                <Text>Color:</Text>
                <div>
                  <Radio.Group onChange={(e) => setSelectedColor(e.target.value)} value={selectedColor}>
                    {availableColors.map((color) => (
                      <Radio.Button key={color} value={color} style={{ backgroundColor: color, color: "white", borderRadius: "50%", marginLeft: "10px" }}>
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </div>
                <br />
              </div>
            )}

            <Text>Quantity:</Text>
            <div>
              <InputNumber min={1} value={quantity} onChange={(value) => setQuantity(value)} />
            </div>
            <br />

            <Tooltip title={(availableSizes.length > 0 && !selectedSize) || (availableColors.length > 0 && !selectedColor) ? "Please select a size and/or color" : ""}>
              <Button
                className="button"
                style={{ backgroundColor: "#40476D", width: "200px", marginLeft: "30%" }}
                type="primary"
                onClick={handleCartClick}
                disabled={(availableSizes.length > 0 && !selectedSize) || (availableColors.length > 0 && !selectedColor)}
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
