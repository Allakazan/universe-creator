varying vec3 v_normal;
varying vec3 v_eye_vector;

uniform float atmOpacity;
uniform float atmPowFactor;
uniform float atmMultiplier;

uniform float coeficient;
uniform float power;
uniform vec3 glowColor;

void main() { 
    // Starting from the rim to the center at the back, dotP would increase from 0 to 1
    float dotP = dot( v_normal, v_eye_vector );
    // This factor is to create the effect of a realistic thickening of the atmosphere coloring
    float factor = pow(dotP, atmPowFactor) * atmMultiplier;
    // Adding in a bit of dotP to the color to make it whiter while the color intensifies
    //vec3 atmColor = vec3(0.35 + dotP/4.5, 0.35 + dotP/4.5, 1.0);
    vec3 atmColor = glowColor * factor;
    // use atmOpacity to control the overall intensity of the atmospheric color
    gl_FragColor = vec4(atmColor, atmOpacity) * factor;
}