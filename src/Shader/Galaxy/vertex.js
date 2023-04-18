export default /* glsl */ `

varying vec2 vUv;
varying vec3 vColor;

uniform float uSize;
uniform float uTime;
uniform float uSpeed;


attribute float aScale;
attribute vec3 aRandom;


void main(){
    // DEfault 
        vec4 modelPosition = vec4(position, 1.0); // modelMatrix * vec4(position, 1.0);
        vec4 galaxyCenter = modelMatrix * vec4(0.,0.,0.,1.);

        float angle = atan(modelPosition.x, modelPosition.z);   // Get Angle for Spin Particle
        float distanceToCenter = length(modelPosition.xz);       // Get distance from CENTER scene
        float angleOffset = (1.0 / distanceToCenter) * uTime * uSpeed; // Rotate faster if close
        //angle += angleOffset; // Add Angle
        
        modelPosition.x = cos(angle) * distanceToCenter; // Update Positon
        modelPosition.z = sin(angle) * distanceToCenter; // Update Positon

        // Random
        modelPosition.xyz += aRandom.xyz; // Update Randomness
        

        vec4 viewPosition = viewMatrix * modelMatrix * modelPosition; // viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;

        gl_PointSize = uSize * aScale;
        gl_PointSize *= ( 1.0 / - viewPosition.z );

    // Send to Fragment
        vUv = uv;
        vColor = color;
} 
`