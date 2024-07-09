float contrast(float value, float contrast) {
  // Normalize the input value to the range [0, 1]
  float normalizedValue = clamp(value, 0.0, 1.0);

  // Apply the contrast adjustment
  float contrastedValue = ((normalizedValue - 0.5) * contrast) + 0.5;

  // Clamp the result to the range [0, 1]
  return clamp(contrastedValue, 0.0, 1.0);
}

const int MAX_COLORS = 4;

vec3 interpolateColor(float t, vec3 colors[MAX_COLORS], int numColors) {
  if (numColors == 1) {
      return colors[0];
  } else if (numColors == 2) {
      return mix(colors[0], colors[1], t);
  } else {
      float segmentLength = 1.0 / float(numColors - 1);
      int segment = int(t / segmentLength);
      float segmentT = (t - float(segment) * segmentLength) / segmentLength;
      
      if (segment >= numColors - 1) {
          return colors[numColors - 1];
      } else {
          return mix(colors[segment], colors[segment + 1], segmentT);
      }
  }
}