import base64
from PIL import Image, ImageDraw
import io

def create_test_image():
    """Create a simple test image with a person-like shape"""
    # Create a 640x480 image with white background
    img = Image.new('RGB', (640, 480), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Draw a simple stick figure (person-like shape)
    # Head
    draw.ellipse([280, 80, 320, 120], fill='black')
    
    # Body
    draw.line([300, 120, 300, 200], fill='black', width=3)
    
    # Arms
    draw.line([300, 140, 260, 160], fill='black', width=3)  # Left arm
    draw.line([300, 140, 340, 160], fill='black', width=3)  # Right arm
    
    # Legs
    draw.line([300, 200, 280, 280], fill='black', width=3)  # Left leg
    draw.line([300, 200, 320, 280], fill='black', width=3)  # Right leg
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG', quality=85)
    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    return img_base64

def create_curl_command(base64_image):
    """Generate curl command for testing"""
    curl_command = f'''curl -X 'POST' \\
  'http://localhost:8000/pose-estimation' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '{{
  "image_data": "{base64_image}"
}}' '''
    return curl_command

if __name__ == "__main__":
    # Create test image
    test_image_base64 = create_test_image()
    
    print("Test image created successfully!")
    print(f"Base64 image length: {len(test_image_base64)} characters")
    print("\n" + "="*50)
    print("CURL COMMAND FOR TESTING:")
    print("="*50)
    print(create_curl_command(test_image_base64))
    
    # Save the base64 string to a file for easy copying
    with open('test_image_base64.txt', 'w') as f:
        f.write(test_image_base64)
    
    print("\n" + "="*50)
    print("Base64 image data saved to 'test_image_base64.txt'")
    print("You can copy the base64 string from that file to use in your tests.")
    print("="*50) 