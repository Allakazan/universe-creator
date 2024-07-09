vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec3  mod289(vec3  x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4  mod289(vec4  x){return x - floor(x * (1.0 / 289.0)) * 289.0;}

// permute variante that uses mod289
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float rnd(float n){return fract(sin(n) * 43758.5453123);}
float rnd(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0);}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float clamp01(float value) {
  return clamp(value, 0.0, 1.0);
}

float invert(float value) {
  return 1.0 - value;
}

float sigmoid(float x) {
  return 1.0 / (1.0 + exp(-x));
}

// Salt is added to limit the x,y values. No matter what you input,
// it returns a float around ~ 0-6000.
float salt(float seed) {
  float a = mod(seed, 5901.);
  float b = mod(a,2.)==0. ? -0.01 : 0.11; 
  
	return a+4179./sqrt(a*5.)*b+1001.*a/seed;
}