#ifdef GL_ES
precision highp float;
#endif

#include util/math.frag; 
#include util/constants.frag; 
#include util/struct/index.frag;

#include util/common/getNoise.frag;
#include util/common/getNoiseHeight.frag;

varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_normal;
varying mat4 v_modelViewMatrix;
varying vec4 v_glPosition;

uniform float u_time;
uniform NoiseParams noiseParams;
uniform float seedValue;
uniform int stretch;

uniform vec3 color1;
uniform vec3 color2;

// Gas Giant: (PERLIN, NOISE_SQUARED, seed, 8, 2.0, 1.0, 0.5, 2.0) / 2.0
// Moon Base: (NOISE, NOISE_SQUARED, seed, 8, 2.0, 1.0, 0.5, 2.0) / 1.8
// Star: (SIMPLEX, NOISE_SQUARED, seed, 8, 2.0, 1.0, 0.5, 2.0)) smoothstep(0.3, 1., terrain)
// Cool Star: (SIMPLEX, NOISE_ABS, seed, 8, 4.0, 2.0, 0.5, 2.0)

void main() {

  float seed = salt(seedValue);
  vec3 pos = v_position;

  if (stretch > 0) {
    pos.xz /= float(stretch) * 2.5;
  }

  NoiseParams noise1ParamsNormal = noiseParams;
  noise1ParamsNormal.octaves = 8;
  noise1ParamsNormal.amplitude = 1. + noiseParams.amplitude * .1;
  noise1ParamsNormal.persistence = .45; // .45 if PERLIN .3 if SIMPLEX
  noise1ParamsNormal.lacunarity = 2.;

  float terrain = smoothstep(0., 1., getNoise(pos, seed, noiseParams));
  
  //NoiseParams noise2Params = NoiseParams(SIMPLEX, NOISE_ABS, 8, 1.0, 5.0, 0.6, 2.0);
  //float terrain2 = getNoise(pos, seed, noise2Params);

  vec3 color = mix(color1, color2, terrain);
  //color = mix(color3, color, terrain2);

  float bumpStrength = 8.;
  
  vec3 normalMap = perturbNormalArb(pos, v_normal, seed, bumpStrength, noise1ParamsNormal);
  // N_ is orthogonal to N.
  vec3 N_ = normalMap - (dot(normalMap, v_normal) * v_normal);
  
  // need to do projection, and multiply by bumpStrength
  csm_Bump = mat3(v_modelViewMatrix) * N_;

  //csm_Metalness = 0.2;
  csm_Roughness = .8;
  csm_DiffuseColor = vec4(color, 1.0);
}