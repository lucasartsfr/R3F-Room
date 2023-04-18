import { Center, Environment, OrbitControls, Text3D, useMatcapTexture } from '@react-three/drei'

export default function Text3DComp(){

    const [ matcapTexture ] = useMatcapTexture('1A2461_3D70DB_2C3C8F_2C6CAC', 256); // Load a MatCap
    
    return(
        <Center position-y={1}>
            <Text3D 
                font="./fonts/helvetiker_regular.typeface.json"
                size={0.75}
                height={0.2}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
            >
                    Hello
                    <meshMatcapMaterial matcap={matcapTexture} />
            </Text3D>
        </Center>
    )
}