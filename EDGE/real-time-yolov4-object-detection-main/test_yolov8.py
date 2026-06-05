import cv2
import numpy as np
import os
import time
from ultralytics import YOLO

# Paths
DIR_PATH = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(DIR_PATH, "..", "..", "EDGE", "yolov8n.pt")
TEST_IMAGE_PATH = os.path.join(DIR_PATH, "..", "Face_recognition_facenet512-main", "cropped_faces", "Aaron_Eckhart.jpg")
OUTPUT_IMAGE_PATH = os.path.join(DIR_PATH, "yolov8_result.jpg")

try:
    if not os.path.exists(MODEL_PATH):
        print(f"YOLOv8 model not found at {MODEL_PATH}, will download default yolov8n.pt")
        MODEL_PATH = "yolov8n.pt" # automatic download
        
    print(f"Loading YOLOv8 network from {MODEL_PATH}...")
    model = YOLO(MODEL_PATH)
    
    # Run warm-up
    print("Running warm-up...")
    dummy_img = np.zeros((416, 416, 3), dtype=np.uint8)
    model(dummy_img, verbose=False)
    
    # Load Test Image
    if not os.path.exists(TEST_IMAGE_PATH):
        print(f"Test image not found at: {TEST_IMAGE_PATH}")
        image = np.zeros((480, 640, 3), dtype=np.uint8)
        cv2.putText(image, "Test Image", (100, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    else:
        print(f"Loading test image from: {TEST_IMAGE_PATH}")
        image = cv2.imread(TEST_IMAGE_PATH)
        
    # Run YOLO detection and measure time
    start_time = time.perf_counter()
    results = model(image, verbose=False)[0]
    end_time = time.perf_counter()
    
    inference_time_ms = (end_time - start_time) * 1000
    print(f"Inference Time: {inference_time_ms:.2f} ms")
    
    # Parse outputs
    print(f"Detections found: {len(results.boxes)}")
    
    # Draw detections
    for box in results.boxes:
        # Get coordinates
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        conf = float(box.conf[0])
        cls = int(box.cls[0])
        label = model.names[cls]
        
        print(f"- Detected {label} with confidence {conf:.2f} at box [{x1}, {y1}, {x2}, {y2}]")
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
        text = f"{label}: {conf:.2f}"
        cv2.putText(image, text, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
            
    # Save output image
    cv2.imwrite(OUTPUT_IMAGE_PATH, image)
    print(f"Result image saved to {OUTPUT_IMAGE_PATH}")
    
    # Write summary files for benchmarking
    with open(os.path.join(DIR_PATH, "perf_summary_yolov8.txt"), "w") as f:
        f.write(f"Model: YOLOv8-nano\n")
        f.write(f"Inference Time (CPU): {inference_time_ms:.2f} ms\n")
        f.write(f"Detections Count: {len(results.boxes)}\n")
        
except Exception as e:
    print(f"Error during test: {e}")
