#version 300 es
precision highp float;

const int DATA_LENGTH = 512;

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
  vec2 p = (-iResolution + 2. * (fragCoord)) / iResolution.y; // -1 <> 1 by height  
  // vec2 pm = (-iResolution + 2. * (vec2(iMouse.x, iResolution.y-iMouse.y))) / iResolution.y;
  
  // float rotation = acos(dot(vec2(0., 1.), normalize(p)));
  // if (p.x < 0.) {
  //   rotation = 2. * PI - rotation;
  // }
  // int idx = int(rotation/(PI*2.) * 128.);
  // float circle = length(p) - 0.8 - (a.data[idx])/1024. ; //;
  // float g = pow((abs(circle)), 0.2);
  p = uv * 2. - 1.;
  p.x = p.x*0.5 + .5;
  int idx = int(p.x * float(DATA_LENGTH)) - 1;
  float note = step(0.0025, abs(p.y - data[idx]/1024.)); 
  float g = min(smoothstep(0.28, 0.3, note), pow(abs(p.y + 1.)+0.2, 0.2));
  fragColor = vec4(vec3(g), 1.);
}
