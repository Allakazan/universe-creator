
// This will sample the noise on three different positions to create some sort of derivative
vec2 dHdxy_fwd(vec3 pos, float seed, float bumpStrength, NoiseParams params) {
  vec3 dSTdx = dFdx(pos);
  vec3 dSTdy = dFdy(pos);

  float Hll = bumpStrength * getNoise(pos, seed, params);
  float dBx = bumpStrength * getNoise(pos + dSTdx, seed, params) - Hll;
  float dBy = bumpStrength * getNoise(pos + dSTdy, seed, params) - Hll;

  return vec2(dBx, dBy);
}

// Function to perturb normal. It has some bugs, but i couldn't find another one that works well
// https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/bumpmap_pars_fragment.glsl.js
vec3 perturbNormalArb(vec3 pos, vec3 surf_norm, float seed, float bumpStrength, NoiseParams params) {
  vec2 dHdxy = dHdxy_fwd(pos, seed, bumpStrength, params);

  vec3 vSigmaX = normalize(dFdx(pos));
  vec3 vSigmaY = normalize(dFdy(pos));
  vec3 vN = surf_norm; // normalized

  vec3 R1 = cross(vSigmaY, vN);
  vec3 R2 = cross(vN, vSigmaX);

  float faceDir = gl_FrontFacing ? 1.0 : -1.0;

  float fDet = dot(vSigmaX, R1) * faceDir; // face_direction

  vec3 vGrad = sign(fDet) * (dHdxy.x * R1 + dHdxy.y * R2);
  return normalize(abs(fDet) * surf_norm - vGrad);
}