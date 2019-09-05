#version 300 es
precision highp float;

const int DATA_LENGTH = 128;

uniform Block {
  float data[DATA_LENGTH];
};

uniform float iTime;
uniform vec2 iResolution;

in vec2 fragCoord;
out vec4 fragColor;

const float PI = 3.141592653589793;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

void main() {

  vec2 uv = fragCoord / iResolution;
  // vec2 p = (-iResolution + 2. * (fragCoord)) / iResolution.x; // -1 <> 1 by height
  // vec2 pm = (-iResolution + 2. * (vec2(iMouse.x, iResolution.y-iMouse.y))) / iResolution.y;
  
  // float rotation = acos(dot(vec2(0., 1.), normalize(p)));
  // if (p.x < 0.) {
  //   rotation = 2. * PI - rotation;
  // }
  // int idx = int(rotation/(PI*2.) * 128.);
  // float circle = length(p) - 0.8 - (a.data[idx])/1024. ; //;
  // float g = pow((abs(circle)), 0.2);

  vec2 pos = vec2(uv.x, 100.);
  if (fragCoord.y < 32.) {
    pos.y = fragCoord.y/32. - 1.;
  }
  int idx = int(pos.x * float(DATA_LENGTH));
  float dx = (data[idx]+30.)/70.; // -30 <> -100 => -0 <> -1
  float note = step(0., pos.y - dx); 

  float g = -0.3*note+0.3;
  float shadow = 1. - mix(pow(abs(abs(uv.y - 0.5) - 1.), 0.2), pow(abs(abs(uv.x-0.5) - 1.), 0.2), 0.5);
  float alpha = clamp(shadow + (1.-note), 0., 1.) ;
  fragColor = vec4(vec3(g), alpha);
}
