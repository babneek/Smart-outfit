import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const PosePage = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState<string | null>(null);
  const [poseResult, setPoseResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Capture image from webcam
  const capture = () => {
    if (webcamRef.current) {
      // @ts-ignore
      const imgSrc = webcamRef.current.getScreenshot();
      setImage(imgSrc);
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Convert data URL to base64 string
  const getBase64FromDataUrl = (dataUrl: string) => {
    return dataUrl.split(',')[1];
  };

  // Send image to ML service for pose estimation
  const handlePoseEstimation = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setPoseResult(null);
    try {
      const base64Image = getBase64FromDataUrl(image);
      const response = await axios.post('http://localhost:8000/pose-estimation', {
        image_data: base64Image,
      });
      setPoseResult(response.data);
    } catch (err: any) {
      setError('Pose estimation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Pose Estimation</h2>
      <div style={{ marginBottom: '1rem' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          width={320}
          height={240}
        />
        <br />
        <button onClick={capture}>Capture from Webcam</button>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      {image && (
        <div style={{ marginBottom: '1rem' }}>
          <img src={image} alt="Preview" style={{ maxWidth: 320, maxHeight: 240 }} />
        </div>
      )}
      <button onClick={handlePoseEstimation} disabled={!image || loading}>
        {loading ? 'Estimating Pose...' : 'Estimate Pose'}
      </button>
      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      {poseResult && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Pose Landmarks</h3>
          <pre style={{ textAlign: 'left', display: 'inline-block' }}>{JSON.stringify(poseResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PosePage; 