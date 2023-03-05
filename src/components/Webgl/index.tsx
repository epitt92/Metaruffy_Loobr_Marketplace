import React, { Suspense, useLayoutEffect, useRef } from 'react';
// import { Canvas } from "@react-three-fiber";
import { OrbitControls, useGLTF, useProgress, Html, Box } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Image from 'next/image';

type Props = {
    src: string;
    preview?: string;
    ref?: any;
};

function Loader({ preview }: any) {
    const { progress } = useProgress();
    return (
        <Html className="weblg  !rounded-xl" center>
            <img className="!rounded-xl  " src={preview} />
        </Html>
    );
}

function Model({ src }: Props) {
    const gltf = useGLTF(src);
    const ref = useRef<any>(null);

    var mroot = gltf.scene;
    var bbox = new THREE.Box3().setFromObject(mroot);
    var cent = bbox.getCenter(new THREE.Vector3());
    var size = bbox.getSize(new THREE.Vector3());

    //Rescale the object to normalized space
    var maxAxis = Math.max(size.x, size.y, size.z);
    mroot.scale.multiplyScalar(8.0 / maxAxis);
    bbox.setFromObject(mroot);
    bbox.getCenter(cent);
    bbox.getSize(size);

    mroot.position.copy(cent).multiplyScalar(-1);
    mroot.position.y -= size.y * 0.5;

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ref.current) {
            ref.current.rotation.y = t / 5;
        }
    });

    const three = useThree((props) => {
        console.log({ props });
        props.camera.position.y = 4;
        props.camera.lookAt(0, 0, 0);
    });

    console.log({ scene: mroot });

    return <primitive ref={ref} object={mroot} />;
}

const Webgl = ({ src, preview }: Props) => {
    return (
        // <Canvas pixelRatio={[1, 2]} camera={{ position: [-10, 5, 20], zoom:2, fov: 50 }}>
        <Canvas className="index   ">
            <ambientLight intensity={1} />
            <pointLight position={[-1, -1, -20]} />
            <pointLight position={[-10, 10, 10]} />
            <pointLight position={[10, 10, 10]} />
            <pointLight position={[10, -20, 10]} />
            <pointLight position={[1, 20, 1]} />
            <pointLight position={[-101, 10, -10]} />
            <pointLight position={[101, 10, -10]} />
            <Suspense fallback={<Loader preview={preview} />}>
                <Model src={src} preview={preview} />
            </Suspense>
            <OrbitControls minDistance={2} maxDistance={20} />
        </Canvas>
    );
};

export default Webgl;
