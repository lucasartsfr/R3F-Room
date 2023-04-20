import { useContext } from 'react'
import CustomMask from './CustomMask'
import { ThreeContext } from './Context';

export default function Masks(){
    
  const {debug} = useContext(ThreeContext);

    return(
        <>
        <CustomMask id={1} position={[-6, 5.25, 0.20]} rotation={[ -Math.PI/4, Math.PI / 2, 0]}  axis={debug}>
            <circleGeometry args={[4, 4]} />
        </CustomMask>

        <CustomMask id={3} position={[0,5,-5.8]} rotation={[0,0,0]} axis={debug}>
            <sphereGeometry attach="geometry" args={[3, 4, 4, 0, Math.PI]} />
        </CustomMask>

        <CustomMask id={999} position={[10, 0, 10]} rotation={[ 0, 0, 0]}  axis={debug}>
            <circleGeometry args={[0, 0]} />
        </CustomMask>
        </>
    )
}