---
name: gaze-detection
description: MediaPipe FaceLandmarker head-pose yaw/pitch math, thresholds, and debounce logic
---

# Gaze Detection Subsystem Architecture

## Overview
Gaze Detection in GazeCam utilizes MediaPipe's `@mediapipe/tasks-vision` `FaceLandmarker` with facial transformation matrix output. Rather than literal eye iris tracking (which is volatile under varying lighting), head pose orientation provides reliable and intuitive "looking at camera" detection.

## MediaPipe FaceLandmarker Setup
- **Options**: `outputFacialTransformationMatrixes: true`, `delegate: "GPU"` (with CPU fallback), `runningMode: "VIDEO"`, `numFaces: 1`.
- **WASM Resolver**: `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm`
- **Model Asset**: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`

## Head Pose Math
Extracted from the 4x4 facial transformation matrix (`matrix.data`):
```typescript
const yaw = (Math.atan2(matrix[2], matrix[10]) * 180) / Math.PI;
const pitch = (Math.atan2(-matrix[6], matrix[10]) * 180) / Math.PI;
```

## Thresholds & Debouncing
- **Looking at Camera**: Classified as `looking` if `|yaw| < 15°` AND `|pitch| < 12°`.
- **Looking Away**: Classified as `away` if either angle exceeds threshold.
- **No Face Detected**: Classified as `none`.
- **Debounce Grace Period**: `400ms` debounce timer (`DEBOUNCE_MS`) prevents state flickering caused by momentary frame drops.

## State Machine Rules
1. `IDLE` + Shutter Click -> `ARMED`
2. `ARMED` + `gaze = looking` -> `ARMED_WAITING`
3. `ARMED_WAITING` + `gaze flips to away` -> `CAPTURING`
4. `CAPTURING` -> canvas mirror snapshot + white flash overlay -> `CAPTURED` -> `IDLE`
