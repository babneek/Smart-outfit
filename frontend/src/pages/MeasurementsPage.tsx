import React, { useState } from 'react';
import axios from 'axios';

const defaultMeasurements = {
  height: '',
  chest: '',
  waist: '',
  hips: '',
  inseam: '',
};

const MeasurementsPage = () => {
  const [measurements, setMeasurements] = useState(defaultMeasurements);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeasurements({ ...measurements, [e.target.name]: e.target.value });
  };

  const fetchFromML = async () => {
    setLoading(true);
    setMessage('');
    // Try to get pose result and image from localStorage (set by PosePage)
    const poseResult = JSON.parse(localStorage.getItem('poseResult') || 'null');
    const image = localStorage.getItem('poseImage');
    if (!poseResult || !image) {
      setLoading(false);
      setMessage('Please estimate pose first on the Pose Estimation page.');
      return;
    }
    try {
      const base64Image = image.split(',')[1];
      const response = await axios.post('http://localhost:8000/body-measurement', {
        image_data: base64Image,
        pose_data: poseResult.pose_data,
      });
      if (response.data && response.data.measurements) {
        setMeasurements(response.data.measurements);
        setMessage('Measurements fetched from ML.');
      } else {
        setMessage('Failed to get measurements from ML.');
      }
    } catch (err) {
      setMessage('Error fetching measurements from ML.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setMessage('Measurements saved!');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Body Measurements</h2>
      <form style={{ display: 'inline-block', textAlign: 'left' }}>
        {Object.keys(measurements).map((key) => (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <label style={{ width: 100, display: 'inline-block' }}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            <input
              type="number"
              name={key}
              value={measurements[key as keyof typeof measurements]}
              onChange={handleChange}
              style={{ width: 80 }}
            />
            <span style={{ marginLeft: 8 }}>cm</span>
          </div>
        ))}
      </form>
      <div style={{ margin: '1rem 0' }}>
        <button onClick={fetchFromML} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch from ML'}
        </button>
        <button onClick={handleSave} style={{ marginLeft: 16 }}>
          Save
        </button>
      </div>
      {message && <div style={{ color: 'green', marginTop: '1rem' }}>{message}</div>}
    </div>
  );
};

export default MeasurementsPage; 