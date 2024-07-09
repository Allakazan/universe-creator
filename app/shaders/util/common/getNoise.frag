// Noise Functions
#include ../simplex.frag
#include ../perlinNoise.frag;
#include ../noise.frag;

float getNoiseValue(in int alg, in vec3 pos, in float freq) {
  if (alg == NOISE) {
    return noise(pos * freq);
  } else if (alg == SIMPLEX) {
    return snoise(pos * freq);
  } else if (alg == PERLIN) {
    return cnoise(pos * freq);
  }
}

float getNoiseMethod(in int alg, in int method, in vec3 pos, in float freq) {
  float noiseValue = getNoiseValue(alg, pos, freq);
  if (method == NOISE_SIMPLE) {
    return noiseValue;
  } else if (method == NOISE_ABS) {
    return abs(noiseValue);
  } else if (method == NOISE_ABS_INVERTED) {
    return max(0.0, 1.0 - abs(noiseValue));
  } else if (method == NOISE_SQUARED) {
    return pow(noiseValue, 2.);
  }
}

float getNoise(in vec3 pos, float seed, NoiseParams params) {
  float finalNoise = .0;

  vec3 seededPos = pos+vec3(seed, seed, 0.);

  float amplitude = params.amplitude;
  float frequency = params.frequency;

  for (int i = 0; i < params.octaves; i++) {
    finalNoise += amplitude * getNoiseMethod(params.alg, params.method, seededPos, frequency);

    amplitude *= params.persistence;
    frequency *= params.lacunarity;
  }

  return (finalNoise + 1.0) / 2.0; 
}