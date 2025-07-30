import cv2
import numpy as np
from typing import Dict, Any

class VirtualTryOnService:
    def __init__(self):
        pass
    
    async def try_on(self, body_image: str, garment_image: str, pose_data: Dict[str, Any], measurements: Dict[str, float]) -> Dict[str, Any]:
        """
        Perform virtual try-on with garment overlay.
        
        Args:
            body_image: Base64 encoded body image
            garment_image: Base64 encoded garment image
            pose_data: Pose estimation results
            measurements: Body measurements
            
        Returns:
            Dictionary containing result image and confidence
        """
        try:
            # Decode base64 images
            import base64
            
            # Decode body image
            body_bytes = base64.b64decode(body_image.split(',')[1] if ',' in body_image else body_image)
            body_nparr = np.frombuffer(body_bytes, np.uint8)
            body_img = cv2.imdecode(body_nparr, cv2.IMREAD_COLOR)
            
            # Decode garment image
            garment_bytes = base64.b64decode(garment_image.split(',')[1] if ',' in garment_image else garment_image)
            garment_nparr = np.frombuffer(garment_bytes, np.uint8)
            garment_img = cv2.imdecode(garment_nparr, cv2.IMREAD_COLOR)
            
            # Simple overlay implementation (placeholder)
            result_image = self._overlay_garment(body_img, garment_img, pose_data, measurements)
            
            # Encode result image back to base64
            _, buffer = cv2.imencode('.jpg', result_image)
            result_base64 = base64.b64encode(buffer.tobytes()).decode('utf-8')
            
            return {
                "result_image": f"data:image/jpeg;base64,{result_base64}",
                "confidence": 0.75
            }
                
        except Exception as e:
            raise Exception(f"Virtual try-on failed: {str(e)}")
    
    def _overlay_garment(self, body_img: np.ndarray, garment_img: np.ndarray, pose_data: Dict[str, Any], measurements: Dict[str, float]) -> np.ndarray:
        """
        Overlay garment on body image.
        
        Args:
            body_img: Body image as numpy array
            garment_img: Garment image as numpy array
            pose_data: Pose estimation results
            measurements: Body measurements
            
        Returns:
            Result image with garment overlay
        """
        # Create a copy of the body image
        result = body_img.copy()
        
        # Get body dimensions
        body_height, body_width = body_img.shape[:2]
        
        # Resize garment to fit body proportions
        # This is a simplified approach - in reality, you'd use more sophisticated warping
        garment_height, garment_width = garment_img.shape[:2]
        
        # Calculate scaling based on shoulder width
        shoulder_width = measurements.get("shoulder_width", 40)
        scale_factor = shoulder_width / body_width
        
        # Resize garment
        new_width = int(garment_width * scale_factor)
        new_height = int(garment_height * scale_factor)
        resized_garment = cv2.resize(garment_img, (new_width, new_height))
        
        # Calculate position for overlay (center of body)
        x_offset = (body_width - new_width) // 2
        y_offset = body_height // 3  # Place garment in upper third
        
        # Ensure coordinates are within bounds
        x_offset = max(0, min(x_offset, body_width - new_width))
        y_offset = max(0, min(y_offset, body_height - new_height))
        
        # Simple alpha blending (placeholder)
        # In a real implementation, you'd use proper segmentation and warping
        try:
            # Create a simple mask for the garment
            garment_gray = cv2.cvtColor(resized_garment, cv2.COLOR_BGR2GRAY)
            _, mask = cv2.threshold(garment_gray, 10, 255, cv2.THRESH_BINARY)
            
            # Apply mask to garment
            garment_masked = cv2.bitwise_and(resized_garment, resized_garment, mask=mask)
            
            # Create ROI for overlay
            roi = result[y_offset:y_offset+new_height, x_offset:x_offset+new_width]
            
            # Blend images
            roi_bg = cv2.bitwise_and(roi, roi, mask=cv2.bitwise_not(mask))
            roi_fg = garment_masked
            
            # Combine
            roi_combined = cv2.add(roi_bg, roi_fg)
            result[y_offset:y_offset+new_height, x_offset:x_offset+new_width] = roi_combined
            
        except Exception:
            # Fallback: simple overlay without masking
            if x_offset >= 0 and y_offset >= 0 and x_offset + new_width <= body_width and y_offset + new_height <= body_height:
                result[y_offset:y_offset+new_height, x_offset:x_offset+new_width] = resized_garment
        
        return result 