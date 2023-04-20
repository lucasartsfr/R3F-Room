import * as THREE from "three";
import { Suspense, useContext } from 'react'
import { Center, PivotControls,useMask} from '@react-three/drei'
import Room from './Room'
import Grass from './Grass'
import WaterShader from './WaterShader'
import Galaxy from './Galaxy'
import { ThreeContext } from './Context';
import { useFrame, useThree } from '@react-three/fiber';
import Lights from './Lights';
import Masks from './Masks';

export default function Import({render}) {


  const {debug} = useContext(ThreeContext);
 
  const eventClick = (event) => {

    // event.distance -> Distance to Object
    // event.point -> Hit point in 3D !
    // event.shiftKey -> If click while pressing shift
    console.log('ok')
  }
  
  const sphereMask = useMask(3);


  return (
    < >      
           
      {/* LIGHTS  */}
        <Lights />

      <Suspense>
        {/* MOEDLS  */}
          <Center position={[0, 5, 0]}>
            <Room scale={3} />
          </Center>       

        {/* Galaxy  */}
          <Galaxy Gposition={[0,5,-6]} Grotation={[0,10,0]} stencil={sphereMask} />        

        {/* MASKS  */}            
          <Masks />
      </Suspense> 
     
     
      
      {/* GRASS */}
        <PivotControls anchor={[0, 0, 0]} activeAxes={[true, true, true]} visible={debug} depthTest={false} >
          <Grass 
            options={{bW: 0.12, bH: 1, joints: 5}} 
            widthX={100} 
            widthZ={60}
            instances={40000} 
            flat={1.2} 
            hillScale={25}
            segments={32} 
            circle={false} 
            groundColor="#361b11" 
            stencilCheck={true} 
            position={[-56,0,-15]}
            rotation={[0,0, -Math.PI / 100 ]}
            holeRadius={3.0}
            hole={true}
            bW={0.12}
            bH={0.9} 
            joints={5}
            underWater={true}
            IsCenterHole={false}
          />  
        </PivotControls>


      {/* WATER */}
        
      <WaterShader position={[-46,0,-15]} />
          

    </>
  )
}
