#include util/math.frag; 
#include util/constants.frag; 

#include util/common/getNoise.frag;

varying vec3 v_position;
varying float v_height;

vec3 waterColor = vec3(0.0314, 0.1725, 0.8118);
vec3 colorA = vec3(0.2, 0.8196, 0.0471);
vec3 colorB = vec3(0.9608, 0.8745, 0.1137);

void main() {

  float seed = salt(3111311.);
  vec3 pos = v_position;

  float oceanMask = step(getNoise(pos, PERLIN, seed, 8, 10.0, 0.7, 0.5, 2.0),  .5);

  float terrain = getNoise(pos, SIMPLEX, seed, 8, 2.0, 10.0, 0.5, 2.0);

  float terrainMasked = clamp(terrain, 0., 1.) * invert(oceanMask);

  vec3 color = mix(mix(colorA, colorB, terrainMasked), waterColor, oceanMask);

  float ocenRougness = getNoise(pos, NOISE, seed, 3, .5, 10.0, 0.3, 2.0);

  //csm_AO = invert(v_height) * .4;
  csm_Metalness = map(oceanMask, 0., 1., .1, .4);
  csm_Roughness = map(invert(oceanMask), 0., 1., .45, .99) * clamp(ocenRougness, 0., 1.);
  csm_DiffuseColor = vec4(color, 1.0);
}