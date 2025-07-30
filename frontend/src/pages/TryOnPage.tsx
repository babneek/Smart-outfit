import React, { useState } from 'react';
import axios from 'axios';

const TryOnPage = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'user' | 'clothing') => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (type === 'user') setUserImage(ev.target?.result as string);
        else setClothingImage(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getBase64FromDataUrl = (dataUrl: string) => {
    return dataUrl.split(',')[1];
  };

  const handleTryOn = async () => {
    setLoading(true);
    setError(null);
    setResultImage(null);
    // Get pose and measurements from localStorage
    const poseResult = JSON.parse(localStorage.getItem('poseResult') || 'null');
    const measurements = JSON.parse(localStorage.getItem('measurements') || 'null');
    if (!userImage || !clothingImage || !poseResult || !measurements) {
      setError('Please upload images and ensure pose/measurements are available.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/virtual-tryon', {
        body_image: getBase64FromDataUrl(userImage),
        garment_image: getBase64FromDataUrl(clothingImage),
        pose_data: poseResult.pose_data,
        measurements,
      });
      if (response.data && response.data.result_image) {
        setResultImage('data:image/png;base64,' + response.data.result_image);
      } else {
        setError('No result image returned.');
      }
    } catch (err) {
      setError('Virtual try-on failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Virtual Try-On</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>User Image: </label>
        <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'user')} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Clothing Image: </label>
        <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'clothing')} />
      </div>
      <button onClick={handleTryOn} disabled={!userImage || !clothingImage || loading}>
        {loading ? 'Processing...' : 'Try On'}
      </button>
      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      {resultImage && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Try-On Result</h3>
          <img src={resultImage} alt="Try-On Result" style={{ maxWidth: 320, maxHeight: 400 }} />
        </div>
      )}
    </div>
  );
};

export default TryOnPage; 