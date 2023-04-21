import { Suspense, useRef } from "react";
import * as THREE from "three";
import galaxytVertexShader from './Shader/Galaxy/vertex.js';
import galaxyFragmentShader from './Shader/Galaxy/fragment.js';
import { useFrame, useThree } from '@react-three/fiber'
import { a } from "@react-spring/three";

export default function GalaxyGenerator(props){

    const shaderRef = useRef();
    const { gl } = useThree();

    const { Gposition, Grotation, stencil, Count, gcolorInside, gcolorOutside, radius, spin, branches, power, randomness, Brightness, speed, GalaxyRef, scale, rotation, hoverGalaxy  } = props;


    // Generate Galaxy
    function GenerateGalaxy(Count, gcolorInside, gcolorOutside, radius, spin, branches, power, randomness){
        // Generate Galaxy
        const positionsGalaxy = new Float32Array(Count*3);
        const positionsRandomGalaxy = new Float32Array(Count*3);
        const colorsGalaxy = new Float32Array(Count*3);
        const scalesStar = new Float32Array(Count*1);
        const colorInside = new THREE.Color(gcolorInside);
        const colorOutside = new THREE.Color(gcolorOutside);   

        for(let i=0; i< Count; i++){
            const i3 = i * 3;
            const Ra = Math.random() * radius; // Rayon
            

            const SpinAngle = Ra * spin; // Spin More if far from center
            const BranchesAngles = (i % branches) / branches * Math.PI * 2; // Cal Angle for each branch

            // Mine
            positionsGalaxy[i3+0] = Math.cos(BranchesAngles + SpinAngle) * Ra + 0;
            positionsGalaxy[i3+1] = 0;
            positionsGalaxy[i3+2] = Math.sin(BranchesAngles + SpinAngle) * Ra + 0;


            // Random
            const RandomX = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness;
            //*  radius; // Center
            const RandomY = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness;
            //*  radius; // Center
            const RandomZ = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness;
            //*  radius; // Center
            //const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius -- (Math.random() < 0.5 ? Math.random()*2 : Math.random()*-2
            
            positionsRandomGalaxy[i3 + 0] = RandomX;
            positionsRandomGalaxy[i3 + 1] = RandomY;
            positionsRandomGalaxy[i3 + 2] = RandomZ;

            // Mixed Color For Galaxy Center to Edge
            const colorMixed = colorInside.clone();
            colorMixed.lerp(colorOutside, Ra / radius);

            colorsGalaxy[i3 + 0] = colorMixed.r;
            colorsGalaxy[i3 + 1] = colorMixed.g;
            colorsGalaxy[i3 + 2] = colorMixed.b;
            
            scalesStar[i] = Math.random();
        }

        return {
            positionsGalaxy,
            positionsRandomGalaxy,
            colorsGalaxy,
            scalesStar,
        }
    }

    // Galaxy Variable
    const { positionsGalaxy, positionsRandomGalaxy, colorsGalaxy, scalesStar} = GenerateGalaxy(Count, gcolorInside, gcolorOutside, radius, spin, branches, power, randomness)
  


    // Each Frame
    useFrame((state, delta) => {
        shaderRef.current.uniforms.uTime.value += delta;
    })
 

    return(
        <>
        <Suspense>
                <a.group  
                    scale={scale} 
                    rotation-y={rotation} 
                    ref={GalaxyRef} 
                    position={Gposition} 
                    rotation={[Grotation.x, Grotation.y, Grotation.z]}
                >
                    <mesh 
                        onClick={(e) => hoverGalaxy(e)} 
                        onPointerEnter={() => document.body.style.cursor = 'pointer'} 
                        onPointerLeave={() => document.body.style.cursor = 'default'}
                    >
                        <sphereGeometry args={[radius / 10]}/>
                        <meshBasicMaterial color="#000000" {...stencil}/>
                    </mesh>           

                    <points key={Math.random()}>
                        <bufferGeometry>
                            <bufferAttribute attach="attributes-position" args={[positionsGalaxy, 3]} />
                            <bufferAttribute attach="attributes-color" args={[colorsGalaxy, 3]} />
                            <bufferAttribute attach="attributes-aScale" args={[scalesStar ,1]} />
                            <bufferAttribute attach="attributes-aRandom" args={[positionsRandomGalaxy, 3]} />
                        </bufferGeometry>
                        <shaderMaterial 
                            ref={shaderRef}
                            vertexShader={galaxytVertexShader}
                            fragmentShader={galaxyFragmentShader}
                            vertexColors={true}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                            uniforms={
                                {                        
                                    uTime : { value : 0 },
                                    uSize : { value : Brightness * gl.getPixelRatio() },
                                    uSpeed : { value : speed}
                                }
                            }
                            {...stencil}
                        />
                    </points>          
                </a.group>
            </Suspense>     
        </>
    )
}