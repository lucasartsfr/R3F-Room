import { Suspense, useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import galaxytVertexShader from './Shader/Galaxy/vertex.js';
import galaxyFragmentShader from './Shader/Galaxy/fragment.js';
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva';
import { ThreeContext } from "./Context.js";
import { PivotControls } from "@react-three/drei";

import { useSpring } from "@react-spring/core";
import { a } from "@react-spring/three";


export default function Galaxy({Gposition, Grotation, stencil}){

    const {debug} = useContext(ThreeContext);   


     // Debug With Leva
     const Gparameters = useControls("Galaxy",
     {         
        count : {value : 300000, step : 100, min : 10000, max : 500000},
        Brightness : {value : 35.5, step : 0.5, min : 0, max : 100},
        speed : {value : 0.0, step : 0.01, min : 0.01, max : 20},
        radius : {value : 1.6, step : 0.05, min : 0.5, max : 10},
        branches : {value : 4, step : 1, min : 2, max : 20},
        spin : {value : 4, step : 0.05, min : -10, max : 10},
        randomness : {value : 0.35, step : 0.01, min : 0, max : 5},
        power : {value : 3.0, step : 0.05, min : -4, max : 4},
        Grotation : {
            value : {x : 10, y : 0, z : 0},
            step : 0.1
        },
        colorInside : "#ff8c69",
        colorOutside : "#547cff",
     }, [debug])

     const shaderRef = useRef();
     const GalaxyRef = useRef();
     const { gl } = useThree();


     useFrame((state, delta) => {
        shaderRef.current.uniforms.uTime.value += delta;
        GalaxyRef.current.rotation.y += 0.1 * delta; // increment rotation angle
    })

  
    let geometryGalaxy = null;
    let materialGalaxy = null;
    let pointsGalaxy = null;  

    const positionsGalaxy = new Float32Array(Gparameters.count*3);
    const positionsRandomGalaxy = new Float32Array(Gparameters.count*3);
    const colorsGalaxy = new Float32Array(Gparameters.count*3);
    const scalesStar = new Float32Array(Gparameters.count*1);
    const colorInside = new THREE.Color(Gparameters.colorInside);
    const colorOutside = new THREE.Color(Gparameters.colorOutside);   

    for(let i=0; i< Gparameters.count; i++){
        const i3 = i * 3;
        const Ra = Math.random() * Gparameters.radius; // Rayon
        

        const SpinAngle = Ra * Gparameters.spin; // Spin More if far from center
        const BranchesAngles = (i % Gparameters.branches) / Gparameters.branches * Math.PI * 2; // Cal Angle for each branch

        // Mine
        positionsGalaxy[i3+0] = Math.cos(BranchesAngles + SpinAngle) * Ra + 0;
        positionsGalaxy[i3+1] = 0;
        positionsGalaxy[i3+2] = Math.sin(BranchesAngles + SpinAngle) * Ra + 0;


        // Random
        const RandomX = Math.pow(Math.random(), Gparameters.power) * (Math.random() < 0.5 ? 1 : -1) * Gparameters.randomness;
        //*  Gparameters.radius; // Center
        const RandomY = Math.pow(Math.random(), Gparameters.power) * (Math.random() < 0.5 ? 1 : -1) * Gparameters.randomness;
        //*  Gparameters.radius; // Center
        const RandomZ = Math.pow(Math.random(), Gparameters.power) * (Math.random() < 0.5 ? 1 : -1) * Gparameters.randomness;
        //*  Gparameters.radius; // Center
        //const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius -- (Math.random() < 0.5 ? Math.random()*2 : Math.random()*-2
        
        positionsRandomGalaxy[i3 + 0] = RandomX;
        positionsRandomGalaxy[i3 + 1] = RandomY;
        positionsRandomGalaxy[i3 + 2] = RandomZ;

        // Mixed Color For Galaxy Center to Edge
        const colorMixed = colorInside.clone();
        colorMixed.lerp(colorOutside, Ra / Gparameters.radius);

        colorsGalaxy[i3 + 0] = colorMixed.r;
        colorsGalaxy[i3 + 1] = colorMixed.g;
        colorsGalaxy[i3 + 2] = colorMixed.b;
        
        scalesStar[i] = Math.random();
    }

    const [isAnimating, setIsAnimating] = useState(true);
    const delayRef = useRef(1000);
    const { scale, rotation } = useSpring({
        from: { scale: 0, rotation : GalaxyRef?.current?.rotation?.y || 0},
        to: { scale: isAnimating ? 1 : 0, rotation: isAnimating ? Math.PI * 2 : 0},
        config: { mass: 5, tension: 400, friction: 50, precision: 0.01 },
        delay: delayRef.current,
        //onRest: () => setIsAnimating(false) // Réinitialiser l'état de l'animation une fois terminée
      });

      const hoverGalaxy = (e) =>  {
        setIsAnimating(false)
        setTimeout(() => {
            setIsAnimating(true)
        }, 1000)
      }

      useEffect(() => {
        setIsAnimating(true);
        delayRef.current = 0;
      }, []); // Jouer l'animation une seule fois au démarrage de l'application
    

    return(
        <>
        
            {/* SPACE BLACK */}
            <PivotControls anchor={[0, 0, 0]} activeAxes={[true, true, true]}  visible={debug} depthTest={false}> 
                <mesh position={[0,5.25,-6]} rotation={[0,Math.PI ,0]}>
                <sphereGeometry attach="geometry" args={[3, 5, 5, 0, Math.PI]} />
                <meshBasicMaterial attach="material" color="black" side={THREE.DoubleSide}  {...stencil}/>
                </mesh>
            </PivotControls> 

            <Suspense>
                <a.group  scale={scale} rotation-y={rotation} ref={GalaxyRef} position={Gposition} rotation={[Gparameters.Grotation.x, Gparameters.Grotation.y, Gparameters.Grotation.z]}>
                    <mesh onClick={(e) => hoverGalaxy(e)} onPointerEnter={() => document.body.style.cursor = 'pointer'} onPointerLeave={() => document.body.style.cursor = 'default'}>
                        <sphereGeometry args={[Gparameters.radius / 10]}/>
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
                                    uSize : { value : Gparameters.Brightness * gl.getPixelRatio() },
                                    uSpeed : { value : Gparameters.speed}
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