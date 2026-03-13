#!/usr/bin/env python3
"""
Process WhatsApp images for the Menschen section.
- Smart cropping with face detection
- Kinfolk/retro filter application
"""

import os
import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from pathlib import Path

# Paths
INPUT_DIR = Path("images/fromwhatsapp")
OUTPUT_DIR = Path("images/menschen-processed")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Target dimensions for web (10:13 portrait ratio for Menschen section)
TARGET_SIZE = (800, 1040)  # 10:13 aspect ratio


def detect_faces(img_cv):
    """Detect faces using OpenCV Haar cascades."""
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)

    # Use OpenCV's built-in face detector
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    profiles = profile_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    all_faces = list(faces) + list(profiles)
    return all_faces


def calculate_smart_crop(img_cv, target_size):
    """Calculate crop region based on face detection."""
    h, w = img_cv.shape[:2]
    tw, th = target_size

    faces = detect_faces(img_cv)

    if len(faces) > 0:
        # Calculate bounding box of all faces with padding
        face_boxes = np.array(faces)
        x_min = max(0, face_boxes[:, 0].min() - 100)
        y_min = max(0, face_boxes[:, 1].min() - 150)
        x_max = min(w, face_boxes[:, 0].max() + face_boxes[:, 2].max() + 100)
        y_max = min(h, face_boxes[:, 1].max() + face_boxes[:, 3].max() + 100)

        # Center of faces
        center_x = (x_min + x_max) // 2
        center_y = (y_min + y_max) // 2
    else:
        # No faces detected - use center
        center_x = w // 2
        center_y = h // 2

    # Calculate crop dimensions maintaining aspect ratio
    aspect = w / h
    target_aspect = tw / th

    if aspect > target_aspect:
        # Image is wider - crop width
        crop_h = h
        crop_w = int(h * target_aspect)
    else:
        # Image is taller - crop height
        crop_w = w
        crop_h = int(w / target_aspect)

    # Ensure we don't exceed image bounds
    crop_w = min(crop_w, w)
    crop_h = min(crop_h, h)

    # Calculate crop region centered on faces (or image center)
    left = max(0, min(center_x - crop_w // 2, w - crop_w))
    top = max(0, min(center_y - crop_h // 2, h - crop_h))
    right = left + crop_w
    bottom = top + crop_h

    return (left, top, right, bottom)


def apply_kinfolk_filter(img_pil):
    """Apply kinfolk/retro filter to image."""
    # Convert to RGB if needed
    if img_pil.mode != 'RGB':
        img_pil = img_pil.convert('RGB')

    # 1. Warm up the color temperature (add slight orange/yellow)
    img_array = np.array(img_pil, dtype=np.float32)

    # Add warmth by increasing red and slightly decreasing blue
    img_array[:, :, 0] = np.clip(img_array[:, :, 0] * 1.05, 0, 255)  # Red +5%
    img_array[:, :, 2] = np.clip(img_array[:, :, 2] * 0.95, 0, 255)  # Blue -5%

    # 2. Sepia undertones in shadows
    sepia = np.array([[1.0, 0.9, 0.7],
                      [0.9, 0.85, 0.7],
                      [0.7, 0.7, 0.65]])

    # Create luminance mask for shadows
    luminance = 0.299 * img_array[:, :, 0] + 0.587 * img_array[:, :, 1] + 0.114 * img_array[:, :, 2]
    shadow_mask = np.clip(1 - luminance / 255, 0, 1) * 0.15  # 15% max in shadows

    # Apply subtle sepia to shadows
    for i in range(3):
        img_array[:, :, i] = img_array[:, :, i] * (1 - shadow_mask) + \
                             (img_array[:, :, 0] * sepia[i, 0] +
                              img_array[:, :, 1] * sepia[i, 1] +
                              img_array[:, :, 2] * sepia[i, 2]) * shadow_mask

    img_pil = Image.fromarray(np.clip(img_array, 0, 255).astype(np.uint8))

    # 3. Reduce saturation (10-15%)
    enhancer = ImageEnhance.Color(img_pil)
    img_pil = enhancer.enhance(0.85)

    # 4. Reduce contrast slightly (5-10%)
    enhancer = ImageEnhance.Contrast(img_pil)
    img_pil = enhancer.enhance(0.92)

    # 5. Add subtle grain texture
    img_array = np.array(img_pil, dtype=np.float32)
    grain = np.random.normal(0, 8, img_array.shape)  # Fine grain
    img_array = np.clip(img_array + grain, 0, 255)
    img_pil = Image.fromarray(img_array.astype(np.uint8))

    # 6. Soft focus/diffusion effect (very subtle Gaussian blur)
    img_blur = img_pil.filter(ImageFilter.GaussianBlur(radius=0.8))
    img_pil = Image.blend(img_pil, img_blur, 0.15)

    # 7. Subtle vignette
    width, height = img_pil.size
    vignette_mask = create_vignette_mask(width, height, opacity=0.12)
    img_array = np.array(img_pil, dtype=np.float32)

    # Apply vignette mask to all channels
    for i in range(3):
        img_array[:, :, i] = img_array[:, :, i] * vignette_mask

    img_pil = Image.fromarray(np.clip(img_array, 0, 255).astype(np.uint8))

    return img_pil


def create_vignette_mask(width, height, opacity=0.15):
    """Create a subtle vignette mask as 2D array."""
    # Create radial gradient
    x = np.linspace(-1, 1, width)
    y = np.linspace(-1, 1, height)
    X, Y = np.meshgrid(x, y)

    # Distance from center (0 at center, 1 at corners)
    dist = np.sqrt(X**2 + Y**2)
    dist = np.clip(dist, 0, 1)

    # Smooth falloff
    vignette = 1 - (dist ** 2) * opacity * 2
    vignette = np.clip(vignette, 1 - opacity, 1)

    return vignette


def process_image(input_path, output_path, target_size=TARGET_SIZE):
    """Process a single image: smart crop + kinfolk filter."""
    print(f"Processing: {input_path.name}")

    # Read with OpenCV for face detection
    img_cv = cv2.imread(str(input_path))
    if img_cv is None:
        print(f"  ERROR: Could not read {input_path}")
        return False

    # Calculate smart crop region
    crop_region = calculate_smart_crop(img_cv, target_size)
    left, top, right, bottom = crop_region

    # Read with PIL for processing
    img_pil = Image.open(input_path)

    # Apply crop
    img_pil = img_pil.crop((left, top, right, bottom))

    # Resize to target size
    img_pil = img_pil.resize(target_size, Image.LANCZOS)

    # Apply kinfolk filter
    img_pil = apply_kinfolk_filter(img_pil)

    # Save with original name but as jpg
    final_output = output_path.with_suffix('.jpg')
    img_pil.save(final_output, 'JPEG', quality=90)
    print(f"  Saved: {final_output.name}")

    return True


def main():
    """Process all images in input directory."""
    # Get all JPEG images
    image_files = sorted(INPUT_DIR.glob("*.jpeg")) + sorted(INPUT_DIR.glob("*.jpg"))

    print(f"Found {len(image_files)} images to process")
    print(f"Output directory: {OUTPUT_DIR}")
    print("-" * 50)

    processed = 0
    for img_path in image_files:
        output_path = OUTPUT_DIR / img_path.name
        if process_image(img_path, output_path):
            processed += 1

    print("-" * 50)
    print(f"Complete! Processed {processed}/{len(image_files)} images")


if __name__ == "__main__":
    main()
