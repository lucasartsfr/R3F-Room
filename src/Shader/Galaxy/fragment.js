export default /* glsl */ `

varying vec2 vUv;
varying vec3 vColor;

float random (vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
 }

void main(){

        // Disc
            // float strength = distance(gl_PointCoord, vec2(0.5));
            // strength = step(0.5, strength);
            // strength = 1.0 - strength;

        // Diffuse
            // float strength = distance(gl_PointCoord, vec2(0.5));
            // strength *= 2.0;
            // strength = 1.0 - strength;

        // LightPoint
            float strength = distance(gl_PointCoord, vec2(0.5));
            strength = 1.0 - strength;
            strength = pow(strength, 10.0);
        // Final Color
        vec3 color = mix(vec3(0.0), vColor, strength);

        gl_FragColor = vec4(color, 1.0);
}
`