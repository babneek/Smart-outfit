import cv2
import numpy as np
from typing import Dict, Any
import mediapipe as mp

class PoseEstimationService:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=True,
            model_complexity=2,
            enable_segmentation=True,
            min_detection_confidence=0.5
        )
    
    async def estimate_pose(self, image_data: str) -> Dict[str, Any]:
        """
        Estimate body pose from base64 encoded image.
        
        Args:
            image_data: Base64 encoded image string
            
        Returns:
            Dictionary containing pose data and confidence
        """
        try:
            # Decode base64 image
            import base64
            image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Convert BGR to RGB
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Process image
            results = self.pose.process(image_rgb)
            
            if results.pose_landmarks:
                # Extract pose landmarks
                landmarks = []
                for landmark in results.pose_landmarks.landmark:
                    landmarks.append({
                        'x': landmark.x,
                        'y': landmark.y,
                        'z': landmark.z,
                        'visibility': landmark.visibility
                    })
                
                return {
                    "pose_data": {
                        "landmarks": landmarks,
                        "image_width": image.shape[1],
                        "image_height": image.shape[0]
                    },
                    "confidence": 0.85  # Placeholder confidence
                }
            else:
                return {
                    "pose_data": {
                        "landmarks": [],
                        "image_width": image.shape[1],
                        "image_height": image.shape[0]
                    },
                    "confidence": 0.0
                }
                
        except Exception as e:
            raise Exception(f"Pose estimation failed: {str(e)}") 