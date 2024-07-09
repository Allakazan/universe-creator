#ifdef GL_ES
precision highp float;
#endif

#include util/math.frag; 
#include util/constants.frag; 
#include util/struct/index.frag;

#include util/common/getNoise.frag;

varying vec3 v_position;
varying float v_height;

uniform float u_time;
uniform NoiseParams noiseParams;
uniform NoiseParams turbulanceParams;
uniform float seedValue;
uniform float turbulanceStrength;
uniform float turbulanceWindForce; 

uniform vec3 color1;
uniform vec3 color2;

uniform int stretch;

void main() {

  float seed = salt(seedValue);
  vec3 pos = v_position;
  
  if (stretch > 0) {
    pos.xz /= float(stretch) * 2.5;
  }

  vec3 turbulancePos = pos + (u_time * turbulanceWindForce);
  float turbulance = getNoise(turbulancePos, seed, turbulanceParams);

  vec3 terrainPos = pos + (turbulance * turbulanceStrength); // pos * or pos + ???
  float terrain = getNoise(terrainPos, seed, noiseParams);
  
  vec3 color = mix(color1, color2, terrain);

  //csm_AO = invert(v_height) * .4;
  csm_Metalness = 0.1;
  csm_Roughness = .8;
  csm_DiffuseColor = vec4(color, 1.0);
}