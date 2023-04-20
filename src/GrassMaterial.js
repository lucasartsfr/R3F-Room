import * as THREE from "three"
import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"

const GrassMaterial = shaderMaterial(  
  {
    bladeHeight: 1,
    map: null,
    alphaMap: null,
    time: 0,

    tipColor: new THREE.Color(0.0, 0.6, 0.0).convertSRGBToLinear(),
    bottomColor: new THREE.Color(0.0, 0.1, 0.0).convertSRGBToLinear(),
    
    uCircle : false,
    uHole : false,
    uSquareHole : false,
    uSquareSize : new THREE.Vector2(1.0, 1.0),
    uRadius : 16.0,
    uHoleRadius : 3.0,
    uUnderWater : true,
    uFogNear : 0.1,
    uFogFar : 50.0,
    uFogColor : new THREE.Color(1.0, 0.0, 0.0).convertSRGBToLinear(),
    uUnderWaterHeight : 1.0,
    uPosition : new THREE.Vector3(0.0, 0.0, 0.0),
    uIsCenterHole : true,
  },
  `   
      #include <fog_pars_vertex>

      precision highp float;
      attribute vec3 offset;
      attribute vec4 orientation;
      attribute float halfRootAngleSin;
      attribute float halfRootAngleCos;
      attribute float stretch;

      uniform float time;
      uniform float bladeHeight;

      varying vec2 vUv;
      varying float frc;
      varying vec3 pos;
      
      varying vec3 vWorldPosition;
      
      //WEBGL-NOISE FROM https://github.com/stegu/webgl-noise

        vec3 mod289(vec3 x) {return x - floor(x * (1.0 / 289.0)) * 289.0;} 
        vec2 mod289(vec2 x) {return x - floor(x * (1.0 / 289.0)) * 289.0;} 
        vec3 permute(vec3 x) {return mod289(((x*34.0)+1.0)*x);} 
        
        float snoise(vec2 v){          
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);           
          vec2 i  = floor(v + dot(v, C.yy) );         
          vec2 x0 = v -   i + dot(i, C.xx); 
          vec2 i1; 
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0); 
          vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
      
      //https://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
        vec3 rotateVectorByQuaternion( vec3 v, vec4 q){
          return 2.0 * cross(q.xyz, v * q.w + cross(q.xyz, v)) + v;
        }
      
      //https://en.wikipedia.org/wiki/Slerp
      vec4 slerp(vec4 v0, vec4 v1, float t) {
        // Only unit quaternions are valid rotations.
        // Normalize to avoid undefined behavior.
        normalize(v0);
        normalize(v1);
      
        // Compute the cosine of the angle between the two vectors.
        float dot_ = dot(v0, v1);
      
        // If the dot product is negative, slerp won't take
        // the shorter path. Note that v1 and -v1 are equivalent when
        // the negation is applied to all four components. Fix by 
        // reversing one quaternion.
          if (dot_ < 0.0) {
            v1 = -v1;
            dot_ = -dot_;
          }  
      
        const float DOT_THRESHOLD = 0.9995;
        if (dot_ > DOT_THRESHOLD) {
          // If the inputs are too close for comfort, linearly interpolate
          // and normalize the result.
          vec4 result = t*(v1 - v0) + v0;
          normalize(result);
          return result;
        }
      
        // Since dot is in range [0, DOT_THRESHOLD], acos is safe
        float theta_0 = acos(dot_);       // theta_0 = angle between input vectors
        float theta = theta_0*t;          // theta = angle between v0 and result
        float sin_theta = sin(theta);     // compute this value only once
        float sin_theta_0 = sin(theta_0); // compute this value only once
        float s0 = cos(theta) - dot_ * sin_theta / sin_theta_0;  // == sin(theta_0 - theta) / sin(theta_0)
        float s1 = sin_theta / sin_theta_0;
        return (s0 * v0) + (s1 * v1);
      }
      
      void main() {

        #include <fog_vertex>

        //Relative position of vertex along the mesh Y direction
          frc = position.y/float(bladeHeight);
        
        //Get wind data from simplex noise 
          float noise = 1.0 - (snoise(vec2((time-offset.x/50.0), (time-offset.z/50.0))));

        //Define the direction of an unbent blade of grass rotated around the Y axis
          vec4 direction = vec4(0.0, halfRootAngleSin, 0.0, halfRootAngleCos);

        //Interpolate between the unbent direction and the direction of growth calculated on the CPU. 
        //Using the relative location of the vertex along the Y axis as the weight, we get a smooth bend
          direction = slerp(direction, orientation, frc);
          vec3 vPosition = vec3(position.x, position.y + position.y * stretch, position.z);       
          vPosition = rotateVectorByQuaternion(vPosition, direction);
      
       //Apply wind
        float halfAngle =  noise * 0.15 ;//noise * 0.15;
        vPosition = rotateVectorByQuaternion(vPosition, normalize( vec4( sin(halfAngle), 0.0, -sin(halfAngle), cos(halfAngle) ) ) );
      

        //UV for texture
         vUv = uv;
         pos = (modelMatrix * vec4(offset + vPosition, 1.0 )).xyz;
         vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

        //Calculate final position of the vertex from the world offset and the above shenanigans 
         gl_Position = projectionMatrix * modelViewMatrix * vec4(offset + vPosition, 1.0 );
         
      }`,






  `
      #include <fog_pars_fragment>    
      uniform float fogNear;
		  uniform float fogFar;
      uniform vec3 fogColor;

      precision highp float;

      uniform sampler2D map;
      uniform sampler2D alphaMap;
      uniform vec3 tipColor;
      uniform vec3 bottomColor;
      uniform bool uCircle;
      uniform float uRadius;
      uniform float uHoleRadius;
      uniform bool uHole;
      uniform bool uSquareHole;
      uniform vec2 uSquareSize;
      uniform bool uUnderWater;
      uniform float uUnderWaterHeight;

      uniform bool uIsCenterHole;

      uniform vec3 uPosition;

      uniform float uFogNear;
      uniform float uFogFar;
      uniform vec3 uFogColor;

      varying vec2 vUv;
      varying float frc;
      varying vec3 pos;

      varying vec3 vWorldPosition;
      ${THREE.ShaderChunk[ "common" ]}
      ${THREE.ShaderChunk[ "fog_pars_fragment" ]}
      
      void main() {

              #include <fog_fragment>

              // Calcul de la distance entre le fragment et la caméra fog
                float distance = length(cameraPosition - vWorldPosition);

              // Calcul de la densité du fog
                float fogFactor = smoothstep(uFogNear, uFogFar, distance);


        //Get transparency information from alpha map
          float alpha = texture2D(alphaMap, vUv).r;

        //If transparent, don't draw
          if(alpha < 0.15) discard;

        //Get colour data from texture
          vec4 col = vec4(texture2D(map, vUv));

        //Add more green towards root
          col = mix(vec4(tipColor, 1.0), col, frc);

        //Add a shadow towards root
          col = mix(vec4(bottomColor, 1.0), col, frc);     
          
          // Shape as Circle || Hole as Circle
          vec3 updatePose = vec3(pos.x - uPosition.x, pos.y, pos.z - uPosition.z); // Hole at the Center Even if move
          vec3 isCenter = (uIsCenterHole) ? updatePose : pos;
          float len = length(isCenter);  //length(updatePose);
          float square = max( abs(isCenter.x) * uSquareSize.x,  max( abs(isCenter.y), abs(isCenter.z) ) * uSquareSize.y );
          if( (len > uRadius && uCircle) || (len < uHoleRadius && uHole && !uSquareHole) || (square < uHoleRadius && uHole && uSquareHole) )
            discard;
          // float alphaGrass = smoothstep(uUnderWaterHeight - 0.1, uUnderWaterHeight, pos.y);
          if( uUnderWater && (pos.y < -50.0))
            discard;


        //gl_FragColor = col;
        gl_FragColor = vec4(mix(col.rgb, uFogColor, fogFactor), 1.0); // WITH FOG

        #include <tonemapping_fragment>
	      #include <encodings_fragment>
      }`,
  (self) => {
    self.side = THREE.DoubleSide
  },
)

extend({ GrassMaterial })
