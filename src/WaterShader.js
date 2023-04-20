import * as THREE from 'three';
import vertexShader from './Shader/SeaJS/vertex.js';
import fragmentShader from './Shader/SeaJS/fragment.js';
import { PivotControls, shaderMaterial, useMask } from '@react-three/drei';
import { extend, useFrame, useThree } from '@react-three/fiber'
import { useContext, useEffect, useRef } from 'react';
import { button, useControls } from 'leva';
import { ThreeContext } from './Context.js';

const WaterMaterial = shaderMaterial(
    {
        uTime :  0 ,
        uBigWavesElevation :  0.2 ,
        uWavesFrequency :  new THREE.Vector2(4, 1.5),
        uWavesSpeed :  0.75,

        uDepthColor :  new THREE.Color('#2e84bb'),
        uSurfaceColor :  new THREE.Color('#ebebeb'),
        uColorOffset :  0.20,
        uColorMultiplier :  2.6,

        uDetails :  3,
        uSmallWavesElevation :  0.15,
        uSmallWavesFrequency :  3,
        uSallWavesSpeed :  0.2,
        
        uFogNear : 0.1,
        uFogFar : 50.0,
        uFogColor : new THREE.Color(1.0, 0.0, 0.0).convertSRGBToLinear(),

        uCircle : false,
        uHole : false,
        uSquareHole : false,
        uSquareSize : new THREE.Vector2(1.0, 1.0),
        uRadius : 16.0,
        uHoleRadius : 3.0,
    },
    vertexShader,
    fragmentShader,
);

extend({ WaterMaterial })


export default function WaterShader({position}){

       // Debug With Leva
     const { 
            uBigWavesElevation,
            uWavesFrequency,
            uWavesSpeed,
            uColorOffset,
            uColorMultiplier,
            uDetails,
            uSmallWavesElevation,
            uSmallWavesFrequency,
            uSallWavesSpeed,
            uDepthColor,
            uSurfaceColor,
            cSize,
            cSegment,
            uRadius,
            uCircle,
            uHoleRadius,
            uHole,
            uSquareHole,
            uSquareSize,
            uWindowMask
        } = useControls("Water",
     {  
       uWindowMask : { value : true},
       uBigWavesElevation : {value : 0.1, step : 0.01, min : 0, max : 3},
       uWavesFrequency : {
            value : {x : 1.0, y : 1.0},
            step : 0.1
        },
       uWavesSpeed : {value : 0.75, step : 0.01, min : -3, max : 3},
       uColorOffset : {value : 0.14, step : 0.01, min : 0, max : 1},
       uColorMultiplier : {value : 4.0, step : 0.01, min : 0, max : 5},
       uDetails : {value : 1, step : 1, min : 0, max : 10},
       uSmallWavesElevation : {value : 0.34, step : 0.01, min : 0, max : 3},
       uSmallWavesFrequency : {value : 0.28, step : 0.01, min : 0, max : 10},
       uSallWavesSpeed : {value : 0.46, step : 0.01, min : 0, max : 3},
       uDepthColor : "#3da8ff",
       uSurfaceColor : "#ffffff",
       cSize : {value : 80, step : 0.5, min : 0, max : 200},
       cSegment : {value : 196, step : 2, min : 4, max : 2048},
       uCircle : false,
       uRadius : {value : 50.0, step : 0.1, min : 1.0, max : 100.0},        
       uHole : false,
       uSquareHole : false,
       uSquareSize : {
         value : {x : 0.5, y : 0.5},
         step : 0.05
       },
       uHoleRadius : {value : 16.0, step : 0.1, min : 1.0, max : 50.0},    
     })

     const waterRef = useRef();
     const THR = useThree();
     const stencil = uWindowMask && useMask(1);
     const {debug} = useContext(ThreeContext);
    
     useFrame((state, delta) => {
         waterRef.current.uTime += delta;
     })

    return(
        <PivotControls anchor={[0, 0, 0]} activeAxes={[true, true, true]}  visible={debug} depthTest={false}>
        <mesh position={position} rotation-x={- Math.PI / 2} transparent geometry={new THREE.PlaneGeometry(cSize, cSize, cSegment, cSegment)}>      
            <waterMaterial 
                ref={waterRef}
                uBigWavesElevation={uBigWavesElevation}
                uWavesFrequency={new THREE.Vector2(uWavesFrequency.x, uWavesFrequency.y)}
                uWavesSpeed={uWavesSpeed}
                uColorOffset={uColorOffset}
                uColorMultiplier={uColorMultiplier}
                uDetails={uDetails}
                uSmallWavesElevation={uSmallWavesElevation}
                uSmallWavesFrequency={uSmallWavesFrequency}
                uSallWavesSpeed={uSallWavesSpeed}
                uDepthColor={new THREE.Color(uDepthColor)}
                uSurfaceColor={new THREE.Color(uSurfaceColor)}

                uCircle={uCircle} 
                uRadius={uRadius}
                uHole={uHole}
                uHoleRadius={uHoleRadius}
                uSquareHole={uSquareHole}
                uSquareSize={new THREE.Vector2(uSquareSize.x, uSquareSize.y)}

                uFogNear={THR.scene.fog && THR.scene.fog.near}
                uFogFar={THR.scene.fog && THR.scene.fog.far}
                uFogColor={THR.scene.fog && new THREE.Color(THR.scene.fog.color.r, THR.scene.fog.color.g, THR.scene.fog.color.b).convertSRGBToLinear()}
                
                {...stencil}
            />
        </mesh>
        </PivotControls>  
    )
}