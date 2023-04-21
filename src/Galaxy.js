import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva';
import { ThreeContext } from "./Context.js";
import { PivotControls } from "@react-three/drei";
import { useSpring } from "@react-spring/core";
import GalaxyGenerator from "./GalaxyGenerator.js";


export default function Galaxy({Gposition, Grotation, stencil}){
     
     // Debug With Leva
     const [Gparameters, set] = useControls("Galaxy", () => ({         
        count : {value : 300000, step : 100, min : 10000, max : 500000},
        Brightness : {value : 35.5, step : 0.5, min : 0, max : 100},
        speed : {value : 0.0, step : 0.01, min : 0.01, max : 20},
        radius : {value : 1.6, step : 0.05, min : 0.5, max : 10},
        branches : {value : 4, step : 1, min : 2, max : 20},
        spin : {value : 4, step : 0.05, min : -10, max : 10},
        randomness : {value : 0.35, step : 0.01, min : 0, max : 5},
        power : {value : 3.0, step : 0.05, min : -4, max : 4},
        Grotation : { value : {x : 10, y : 0, z : 0}, step : 0.1 },
        colorInside : "#ff8c69",
        colorOutside : "#547cff",
    }))

     
     
     const { debug } = useContext(ThreeContext);  
     const GalaxyRef = useRef();

     // Click Galaxy
    const hoverGalaxy = (e) =>  {
        setIsAnimating(false);      
           
        setTimeout(() => {
            setIsAnimating(true);
            set({ 
                Brightness : (Math.random() * (50 - 0) + 0),
                radius :  (Math.random() * (2 - 1) + 1),
                branches :  Math.round((Math.random() * (6 - 2) + 2)),
                spin :  Math.round((Math.random() * (8 - (-8)) + (-8))),
                randomness :  (Math.random() * (1 - 0.2) + 0.2),
                power : (Math.random() * (3 - (2)) + (2)),
                colorInside : "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
                colorOutside :  "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
            })
        }, 1000)
    }

      // Animation 
      const [isAnimating, setIsAnimating] = useState(true);
      const delayRef = useRef(1000);
      const { scale, rotation } = useSpring({
          from: { scale: 0, rotation : GalaxyRef?.current?.rotation?.y || 0},
          to: { scale: isAnimating ? 1 : 0, rotation: isAnimating ? Math.PI * 2 : 0},
          config: { mass: 5, tension: 400, friction: 50, precision: 0.01 },
          delay: delayRef.current,
          //onRest: () => setIsAnimating(false) // Réinitialiser l'état de l'animation une fois terminée
      });

       // Jouer l'animation une seule fois au démarrage de l'application
     useEffect(() => {
        setIsAnimating(true);
        delayRef.current = 0;
    }, []); 

    // Each Frame
    useFrame((state, delta) => {
        GalaxyRef.current.rotation.y += 0.1 * delta; // increment rotation angle
    })
    
    
    return(
        <>
        
            {/* SPACE BLACK */}
            <PivotControls anchor={[0, 0, 0]} activeAxes={[true, true, true]}  visible={debug} depthTest={false}> 
                <mesh position={[0,5.25,-6]} rotation={[0,Math.PI ,0]}>
                <sphereGeometry attach="geometry" args={[3, 5, 5, 0, Math.PI]} />
                <meshBasicMaterial attach="material" color="black" side={THREE.DoubleSide}  {...stencil}/>
                </mesh>
            </PivotControls> 

            <GalaxyGenerator 
                GalaxyRef={GalaxyRef}
                Gposition={Gposition} 
                Grotation={Gparameters.Grotation} 
                stencil={stencil} 
                Count={Gparameters.count}
                gcolorInside={Gparameters.colorInside}
                gcolorOutside={Gparameters.colorOutside}
                radius={Gparameters.radius}
                spin={Gparameters.spin}
                branches={Gparameters.branches}
                power={Gparameters.power}
                randomness={Gparameters.randomness}
                Brightness={Gparameters.Brightness}
                speed={Gparameters.speed}
                scale={scale}
                rotation={rotation}
                hoverGalaxy={hoverGalaxy}
            />
        </>
    )
}