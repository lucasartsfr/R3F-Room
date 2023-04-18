import { Suspense, useContext, useRef } from 'react'
import * as THREE from "three";
import { Center, Environment, Lightformer, OrbitControls, Sky, Sparkles , PivotControls, Mask, useMask} from '@react-three/drei'
import Placeholder from './Placeholder'
import Room from './Room'
import Grass from './Grass'
import WaterShader from './WaterShader'
import Galaxy from './Galaxy'
import CustomMask from './CustomMask'
import Sun from './Sun';
import { ThreeContext } from './Context';

export default function Import() {

  const orbitRef = useRef();

  const {debug} = useContext(ThreeContext);
 
  const eventClick = (event) => {

    // event.distance -> Distance to Object
    // event.point -> Hit point in 3D !
    // event.shiftKey -> If click while pressing shift
    console.log('ok')
  }
  
  const sphereMask = useMask(3);
  
  const limitPan = () =>{
    // Limit Pan Camera
    orbitRef.current.target.x = Math.max(orbitRef.current.minPan, Math.min(orbitRef.current.maxPan, orbitRef.current.target.x));
    orbitRef.current.target.z = Math.max(orbitRef.current.minPan, Math.min(orbitRef.current.maxPan, orbitRef.current.target.z));
    orbitRef.current.target.y = Math.max(1, Math.min(orbitRef.current.maxPan, orbitRef.current.target.y));
  }


  return (
    <>

      <OrbitControls makeDefault  

        ref={orbitRef}

        minPolarAngle={Math.PI / 5} 
        maxPolarAngle={ Math.PI / 2.2 }
        
        maxDistance={30} 
        minDistance={0} 
        
        maxAzimuthAngle={ Math.PI / 2 } 
        minAzimuthAngle={-Math.PI / 6 }

        target={[0,2.5,0]}

        minPan={-5}
        maxPan={5}

        // onChange={limitPan}
      
      />


      <directionalLight
        castShadow
        position={[1, 2, 3]}
        intensity={1.5}
        // shadow={{ normalBias: 0.05 }}
        shadow-normalBias={0.04}
      />
      <ambientLight intensity={0.5} />
       
       
      <Sparkles size={10} scale={15} radius={10} position={[0, 5, 0]} speed={5} intensity={1} count={10}/>   

      <Suspense fallback={<Placeholder position-y={0.5} scale={[2, 3, 2]} />}>
        <Center position={[0, 5, 0]}>
          <Room scale={3} />
        </Center>       
      </Suspense> 


      <PivotControls anchor={[0, 0, 0]} activeAxes={[false, false, false]}  depthTest={false}>
        <mesh position={[0,5.25,-6]} rotation={[0,Math.PI ,0]}>
          <sphereGeometry attach="geometry" args={[3, 24, 10, 0, Math.PI]} />
          <meshBasicMaterial attach="material" color="black" side={THREE.DoubleSide}  {...sphereMask}/>
        </mesh>
      </PivotControls>
   
      <Galaxy Gposition={[0,5,-6]} Grotation={[0,10,0]} stencil={sphereMask} />

      
      {/* <PivotControls anchor={[0, 0, 0]} activeAxes={[false, false, false]}  depthTest={false}>
        <Grass options={{bW: 0.12, bH: 1, joints: 5}} width={50} instances={50000} flat={0} groundColor="#361b11" segments={24} stencilCheck={true}/>  
      </PivotControls> */}
             
      {/* <PivotControls anchor={[0, 0, 0]} activeAxes={[true, true, true]}  depthTest={false}>
        <WaterShader position={[-46,0,-15]} />
      </PivotControls> */}

      <Sun />

      <CustomMask id={1} position={[-6, 5.25, 0.20]} rotation={[ -Math.PI/4, Math.PI / 2, 0]}  axis={false}>
        <circleGeometry args={[4, 4]} />
      </CustomMask>

      <CustomMask id={3} position={[0,5,-6]} rotation={[0,0,0]} axis={false}>
        <sphereGeometry attach="geometry" args={[3, 24, 10, 0, Math.PI]} />
      </CustomMask>


      <PivotControls anchor={[0, 0, 0]} activeAxes={[true, true, true]}  depthTest={false}>
        <Grass 
          options={{bW: 0.12, bH: 1, joints: 5}} 
          widthX={100} 
          widthZ={80}
          instances={100000} 
          flat={1.2} 
          hillScale={25}
          segments={96} 
          circle={false} 
          groundColor="#361b11" 
          stencilCheck={false} 
          position={[-56,0,-15]}
          rotation={[0,0, -Math.PI / 100 ]}
          holeRadius={3.0}
          hole={true}
          bW={0.12}
          bH={1} 
          joints={5}
          underWater={true}
        />  
      </PivotControls>

    </>
  )
}
