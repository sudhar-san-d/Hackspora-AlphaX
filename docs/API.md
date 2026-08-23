# CivicTrack AI contract examples

## Member 1

```http
POST /api/ai/analyze-image
Content-Type: application/json

{
  "complaint_id": "CT-1001",
  "image_url": "https://example.org/pothole.jpg",
  "citizen_description": "Huge pothole near bus stop"
}
```

The response `data` contains `complaint_id` and the strict `image_analysis` object. Unknown or unclear evidence uses `Unknown`, empty indicator arrays, severity `0`, and low confidence.

## Member 2

```http
POST /api/ai/decide
Content-Type: application/json

{
  "complaint_id": "CT-1001",
  "citizen": { "description": "Huge pothole near bus stop causing danger to vehicles." },
  "location": {
    "latitude": 11.0168,
    "longitude": 76.9558,
    "ward": "Ward 14",
    "zone": "Central",
    "nearby_landmark": "Bus Stand",
    "nearby_sensitive_places": ["School"],
    "traffic_level": "HIGH"
  },
  "image_analysis": {
    "detected_issue": "Pothole",
    "infrastructure": "Road",
    "visual_description": "Large pothole with broken asphalt and a deep road depression.",
    "damage_indicators": ["broken asphalt"],
    "safety_indicators": ["vehicle hazard"],
    "estimated_visual_severity": 8,
    "confidence": 0.94
  }
}
```

The backend calculates the final score, level, SLA, and routing after validating contextual model output.
