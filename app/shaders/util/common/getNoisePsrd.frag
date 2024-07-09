#include ../psrdNoise.frag;

float getNoiseHeight(
  in vec3 pos,
  in float time,
  float seed, 
  NoiseParams params,
  out vec3 gradient
) {

  vec3 g;
  vec3 gsum = vec3(0.0);
  vec3 period = vec3(0.0);
  
  //float bump = psrdnoise((1. / bumpSize) * (pos+vec3(seed, seed, 0.)), vec3(8.0), 0.0, gradient);
  vec3 seededPos = pos+vec3(seed, seed, 0.);
  float finalNoise = 0.0;
  
  float amplitude = params.amplitude;
  float frequency = params.frequency;

  for (int i = 0; i < params.octaves; i++) {
    finalNoise += amplitude * psrdnoise(frequency * seededPos - (.05 * gsum), period, 0.0, g);
    gsum += amplitude * g;

    amplitude *= params.persistence;
    frequency *= params.lacunarity;
  }

  gradient = gsum;

  return finalNoise;
}