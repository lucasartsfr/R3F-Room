export default /* glsl */ `

varying vec2 vUv;
varying float vElevation;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorMultiplier;
uniform float uColorOffset;

uniform bool uCircle;
uniform float uRadius;
uniform float uHoleRadius;
uniform bool uHole;
uniform bool uSquareHole;
uniform vec2 uSquareSize;

uniform float uFogNear;
uniform float uFogFar;
uniform vec3 uFogColor;
varying vec3 vWorldPosition;
varying vec3 vPos;

float random (vec2 st){ return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }

void main(){

    // float strength = cnoise(vUv * 10.0);

    // Calcul de la distance entre le fragment et la caméra
      float distance = length(cameraPosition - vWorldPosition);

    // Calcul de la densité du fog
      float fogFactor = smoothstep(uFogNear, uFogFar, distance);

    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    // Default 
    //gl_FragColor = vec4(color, 1.0);


    float len = length(vPos);
    float square = max( abs(vPos.x) * uSquareSize.x,  max( abs(vPos.y), abs(vPos.z) ) * uSquareSize.y );
    if( (len > uRadius && uCircle) || (len < uHoleRadius && uHole && !uSquareHole) || (square < uHoleRadius && uHole && uSquareHole) )
      discard;

    gl_FragColor = vec4(mix(color.rgb, uFogColor, fogFactor), 1.0); // WITH FOG
}
`