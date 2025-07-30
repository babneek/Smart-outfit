from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv

from app.services.pose_estimation import PoseEstimationService
from app.services.body_measurement import BodyMeasurementService
from app.services.virtual_tryon import VirtualTryOnService
from app.models.schemas import (
    PoseEstimationRequest,
    PoseEstimationResponse,
    BodyMeasurementRequest,
    BodyMeasurementResponse,
    VirtualTryOnRequest,
    VirtualTryOnResponse,
)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="SmartFit ML Service",
    description="AI-powered virtual try-on system for fashion MSMEs",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Initialize services
pose_service = PoseEstimationService()
body_measurement_service = BodyMeasurementService()
virtual_tryon_service = VirtualTryOnService()

@app.get("/")
async def root():
    """Root endpoint with service information."""
    return {
        "message": "SmartFit ML Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "pose_estimation": "/pose-estimation",
            "body_measurement": "/body-measurement",
            "virtual_tryon": "/virtual-tryon",
            "health": "/health",
        },
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "services": {
            "pose_estimation": "available",
            "body_measurement": "available",
            "virtual_tryon": "available",
        },
    }

@app.post("/pose-estimation", response_model=PoseEstimationResponse)
async def estimate_pose(request: PoseEstimationRequest):
    """Estimate body pose from image."""
    try:
        result = await pose_service.estimate_pose(request.image_data)
        return PoseEstimationResponse(
            success=True,
            pose_data=result["pose_data"],
            confidence=result["confidence"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/body-measurement", response_model=BodyMeasurementResponse)
async def measure_body(request: BodyMeasurementRequest):
    """Measure body dimensions from image."""
    try:
        result = await body_measurement_service.measure_body(
            request.image_data, request.pose_data
        )
        return BodyMeasurementResponse(
            success=True,
            measurements=result["measurements"],
            confidence=result["confidence"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/virtual-tryon", response_model=VirtualTryOnResponse)
async def virtual_tryon(request: VirtualTryOnRequest):
    """Perform virtual try-on with garment overlay."""
    try:
        result = await virtual_tryon_service.try_on(
            request.body_image,
            request.garment_image,
            request.pose_data,
            request.measurements,
        )
        return VirtualTryOnResponse(
            success=True,
            result_image=result["result_image"],
            confidence=result["confidence"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload and process image."""
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, detail="File must be an image"
            )
        
        # Read file content
        content = await file.read()
        
        # Process image (placeholder)
        return {
            "success": True,
            "filename": file.filename,
            "size": len(content),
            "message": "Image uploaded successfully",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc),
        },
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info",
    ) 