#include util/math.frag; 
#include util/simplex.frag;
#include util/perlinNoise.frag;
#include util/noise.frag;

#ifdef GL_ES
precision highp float;
#endif 

varying vec3 v_position;
varying vec3 v_normal;
varying mat4 v_modelViewMatrix;
varying vec4 v_glPosition;
varying float v_height;
varying vec2 v_uv;

vec3 displace(vec3 point) {
  float noise = noise(position * 3.0);

  v_height = noise;

  return position + normal * noise * 0.1; 
}

void main() {
  v_uv = uv; 
  v_normal = normal;
  v_position = position; //displace(position);
  v_modelViewMatrix = modelViewMatrix;
  v_glPosition = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
  
  csm_Position = v_position;
}