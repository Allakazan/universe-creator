#include util/math.frag; 
#include util/constants.frag; 
#include util/struct/index.frag;

#include util/common/getNoise.frag;
#include util/common/getNoisePsrd.frag;

varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_normal;
varying mat4 v_modelViewMatrix;
varying vec4 v_glPosition;

uniform float u_time;

vec3 colorDark = vec3(0.6275, 0.1216, 0.0314);
vec3 colorLight = vec3(0.6863, 0.6157, 0.4157);

// Gas Giant: (PERLIN, NOISE_SQUARED, seed, 8, 2.0, 1.0, 0.5, 2.0) / 2.0
// Moon Base: (NOISE, NOISE_SQUARED, seed, 8, 2.0, 1.0, 0.5, 2.0) / 1.8
// Star: (SIMPLEX, NOISE_SQUARED, seed, 8, 2.0, 1.0, 0.5, 2.0)) smoothstep(0.3, 1., terrain)
// Cool Star: (SIMPLEX, NOISE_ABS, seed, 8, 4.0, 2.0, 0.5, 2.0)

// This uses the PSRD noise, i found pretty cool the cratr pattern that generates
void main() {

  float seed = salt(3111311.);
  vec3 pos = v_position;

  NoiseParams noise1Params = NoiseParams(PERLIN, NOISE_SQUARED, seed, 8, 4.0, 5.0, 0.7, 2.0);

  float terrain = getNoise(pos, seed, noise1Params);

  vec3 color = mix(colorDark, colorLight, terrain);

  float bumpStrength = 0.01;   // How much it perturbs the normals, looks best between 0 and 0.1

  //vec3 gradient; // declare g to be assigned by psrdnoise, its the gradient aka derivative of the noise we use to define bump normal

  vec3 gradient;
  float bump = getNoiseHeight(pos, u_time, seed, noise1Params, gradient); 
  
  // N_ is orthogonal to N.
  vec3 N_ = gradient - (dot(gradient, v_normal) * v_normal);
  // need to do projection, and multiply by bumpStrength
  csm_Bump = mat3(v_modelViewMatrix) * (bumpStrength * N_);

  csm_Metalness = 0.1;
  csm_Roughness = .8;
  csm_DiffuseColor = vec4(color, 1.0);
}