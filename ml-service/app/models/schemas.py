from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class PoseEstimationRequest(BaseModel):
    image_data: str = Field(..., description="Base64 encoded image data")

class PoseEstimationResponse(BaseModel):
    success: bool
    pose_data: Dict[str, Any] = Field(..., description="Pose estimation results")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")

class BodyMeasurementRequest(BaseModel):
    image_data: str = Field(..., description="Base64 encoded image data")
    pose_data: Dict[str, Any] = Field(..., description="Pose estimation results")

class BodyMeasurementResponse(BaseModel):
    success: bool
    measurements: Dict[str, float] = Field(..., description="Body measurements")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")

class VirtualTryOnRequest(BaseModel):
    body_image: str = Field(..., description="Base64 encoded body image")
    garment_image: str = Field(..., description="Base64 encoded garment image")
    pose_data: Dict[str, Any] = Field(..., description="Pose estimation results")
    measurements: Dict[str, float] = Field(..., description="Body measurements")

class VirtualTryOnResponse(BaseModel):
    success: bool
    result_image: str = Field(..., description="Base64 encoded result image")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score") 