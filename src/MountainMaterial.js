import * as THREE from "three"
import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"

const MountainMaterial = shaderMaterial({
    uColorTop: new THREE.Color(0.5, 0.41, 0.34),
    uColorBottom: new THREE.Color(0.34, 0.16, 0.1),
    uColorMultiple : 0.1,
    uColorOffset : 0.25
  },

// Vertex Shader
`   
varying float vElevation;

    void main(){
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);     
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;

        vElevation = modelPosition.y;
    }   
`,


// Fragment Shader
`
varying float vElevation;
uniform vec3 uColorTop;
uniform vec3 uColorBottom;
uniform float uColorMultiple;
uniform float uColorOffset;

    void main(){

        
        // Calcule la couleur en fonction de la hauteur Y
        float mixStrength = (vElevation + uColorOffset) * uColorMultiple;
        vec3 color = mix(uColorBottom, uColorTop, mixStrength );
    
        // Sortie de la couleur calculée
        gl_FragColor = vec4(color, 1.0);
    }
`,


  (self) => {
    self.side = THREE.DoubleSide
  },
)

extend({ MountainMaterial })
