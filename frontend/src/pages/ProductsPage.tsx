import React, { useState, useRef } from 'react';
import './ProductsPage.css';

const products = [
  {
    id: 1,
    name: 'Summer Floral Dress',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Classic Black Gown',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    name: 'Trendy Yellow Top',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    name: 'Denim Jacket',
    image: 'https://images.unsplash.com/photo-1469398715555-76331a6c7c9b?auto=format&fit=crop&w=400&q=80',
  },
];

type Product = typeof products[0];

const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleTryOn = (product: Product) => {
    setSelectedProduct(product);
    setShowCamera(true);
    setUserImage(null);
    setTryOnResult(null);
  };

  const startCamera = async () => {
    setCameraActive(true);
    if (navigator.mediaDevices && videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 320, 400);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setUserImage(dataUrl);
      }
      // Stop camera
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setCameraActive(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendToML = async () => {
    if (!userImage || !selectedProduct) return;
    setTryOnResult(null);
    // Send userImage and selectedProduct.image to backend/ML service
    try {
      const response = await fetch('http://localhost:8000/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body_image: userImage,
          garment_image: selectedProduct.image,
          pose_data: {}, // Placeholder, can be extended
          measurements: {}, // Placeholder, can be extended
        }),
      });
      const data = await response.json();
      setTryOnResult('data:image/jpeg;base64,' + data.result_image);
    } catch (err) {
      alert('Error contacting ML service.');
    }
  };

  return (
    <div className="products-page">
      <h2>Product Catalog</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <button onClick={() => handleTryOn(product)}>Try On</button>
          </div>
        ))}
      </div>
      {showCamera && (
        <div className="camera-modal">
          <h3>Take your photo for: {selectedProduct?.name}</h3>
          {!userImage && !cameraActive && (
            <>
              <button onClick={startCamera}>Open Camera</button>
              <span style={{ margin: '0 1rem' }}>or</span>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </>
          )}
          {cameraActive && (
            <div>
              <video ref={videoRef} width={320} height={400} />
              <br />
              <button onClick={capturePhoto}>Capture Photo</button>
            </div>
          )}
          {userImage && (
            <div>
              <img src={userImage} alt="User" style={{ width: 180, height: 240, objectFit: 'cover', borderRadius: 8 }} />
              <br />
              <button onClick={handleSendToML}>Try On Garment</button>
            </div>
          )}
          <canvas ref={canvasRef} width={320} height={400} style={{ display: 'none' }} />
          {tryOnResult && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Try-On Result:</h4>
              <img src={tryOnResult} alt="Try-On Result" style={{ width: 180, height: 240, objectFit: 'cover', borderRadius: 8 }} />
            </div>
          )}
          <button onClick={() => {
            setShowCamera(false);
            setUserImage(null);
            setTryOnResult(null);
            setCameraActive(false);
          }}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage; 