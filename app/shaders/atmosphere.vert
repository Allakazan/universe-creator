
varying vec3 v_normal;
varying vec3 v_eye_vector;
varying vec2 v_uv;

void main() { 
  v_uv = uv;
  v_normal = normalize( normalMatrix * normal );
  v_eye_vector = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);

  gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}