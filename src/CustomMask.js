import { PivotControls, Mask, useMask} from '@react-three/drei';
import * as THREE from "three";

export default function CustomMask({position, rotation, id, innerSize, outerSize, segments, axis, children}){

    const stencil = useMask(id);

    //disableRotations
    return(
    <PivotControls anchor={[0, 0, 0]} activeAxes={[axis, axis, axis]}  depthTest={false}>
        {/* <mesh position={position} rotation={rotation}>
            <ringGeometry args={[innerSize, outerSize, segments]} />
            <meshPhongMaterial color="black" side={THREE.DoubleSide} />
        </mesh> */}
        <Mask id={id} position={position} rotation={rotation} depthWrite={false}>
            {/* <circleGeometry args={[outerSize, segments]} /> */}
            {children}
        </Mask>
    </PivotControls>
    )
}