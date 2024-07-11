#ifdef GL_ES
precision highp float;
#endif

#include util/math.frag; 
#include util/constants.frag; 
#include util/struct/index.frag;

#include util/common/getNoise.frag;

varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_normal;
varying mat4 v_modelViewMatrix;
varying vec4 v_glPosition;

uniform float u_time;
uniform NoiseParams noiseParams;
uniform float seedValue;

uniform vec3 color1;
uniform vec3 color2;

// Star: (SIMPLEX, NOISE_SQUARED, seed, 8, 2.0, 1.0, 0.5, 2.0)) smoothstep(0.3, 1., terrain)
// Cool Star: (SIMPLEX, NOISE_ABS, seed, 8, 4.0, 2.0, 0.5, 2.0)

void main() {

  float seed = salt(seedValue);
  vec3 pos = v_position;
  pos.x += u_time * .01;
  pos.yz -= u_time * .01;

  float terrain = getNoise(pos, seed, noiseParams) / (noiseParams.amplitude * .5);
  
  vec3 color = mix(color1, color2, terrain);

  //csm_Metalness = 0.;
  //csm_Roughness = 1.;
  csm_Emissive = (color - invert(terrain)) * .6;
  csm_DiffuseColor = vec4(color, 1.0);
}