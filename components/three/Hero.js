import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Section } from "./section";
import {
  CubeCamera,
  Environment,
  Html,
  MeshReflectorMaterial,
  PerspectiveCamera,
  useGLTF,
  useAnimations,
  Text,
  ScrollControls,
  Scroll,
  Image as ImageImpl,
  useScroll,
} from "@react-three/drei";
import * as THREE from "three";

import { Physics, usePlane, useSphere } from "@react-three/cannon";
import { EffectComposer, SSAO, Bloom } from "@react-three/postprocessing";
import { LayerMaterial, Depth, Noise } from "lamina";

const Lights = () => {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <directionalLight
        castShadow
        intensity={4}
        position={[50, 50, 25]}
        shadow-mapSize={[256, 256]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  );
};

function InstancedSpheres({ count = 100 }) {
  const { viewport } = useThree();
  const [ref] = useSphere((index) => ({
    mass: 100,
    position: [4 - Math.random() * 8, viewport.height, 0, 0],
    args: [1.2],
  }));
  return (
    <instancedMesh
      ref={ref}
      castShadow
      receiveShadow
      args={[null, null, count]}
    >
      <sphereBufferGeometry args={[1.2, 32, 32]} />
      <meshLambertMaterial color="red" />
    </instancedMesh>
  );
}
function Borders() {
  const { viewport } = useThree();
  return (
    <>
      <Plane
        position={[0, -viewport.height / 2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Plane
        position={[-viewport.width / 2 - 1, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Plane
        position={[viewport.width / 2 + 1, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <Plane position={[0, 0, -1]} rotation={[0, 0, 0]} />
      <Plane position={[0, 0, 12]} rotation={[0, -Math.PI, 0]} />
    </>
  );
}
function Plane({ color, ...props }) {
  usePlane(() => ({ ...props }));
  return null;
}

function Mouse() {
  const { viewport } = useThree();
  const [, api] = useSphere(() => ({ type: "Kinematic", args: [6] }));
  return useFrame((state) =>
    api.position.set(
      (state.mouse.x * viewport.width) / 2,
      (state.mouse.y * viewport.height) / 2,
      7
    )
  );
}
function Rig({ v = new THREE.Vector3() }) {
  return useFrame((state) => {
    state.camera.position.lerp(
      v.set(state.mouse.x / 2, state.mouse.y / 2, 20),
      0.05
    );
  });
}
const Par = () => {
  return (
    <>
      <mesh position={[40, 1, 1]}>
        <planeBufferGeometry args={[0.55, 10.2, 16, 16]} />
        <meshBasicMaterial color={"lightblue"} />
      </mesh>
    </>
  );
};

function Caption({ children }) {
  const { width } = useThree((state) => state.viewport);
  return (
    <Text
      position={[0, 0, -5]}
      lineHeight={0.8}
      font="/Ki-Medium.ttf"
      fontSize={width / 10}
      material-toneMapped={false}
      anchorX="center"
      anchorY="middle"
    >
      {children}
    </Text>
  );
}
function Pages() {
  const { width } = useThree((state) => state.viewport);
  return (
    <>
      <Page
        position={[width * 4, 0, 0]}
        urls={["/dayplanner.png", "/Deliciosoo.png", "/weatherproject.png"]}
      />
      <Page
        position={[width * 5, 0, 0]}
        urls={["/dayplanner.png", "/weatherproject.png", "/Deliciosoo.png"]}
      />
      <Page
        position={[width * 6, 0, 0]}
        urls={["/dayplanner.png", "/weatherproject.png", "/Deliciosoo.png"]}
      />
      <Page
        position={[width * 7, 0, 0]}
        urls={["/dayplanner.png", "/Deliciosoo.png", "/weatherproject.png"]}
      />
      <Page
        position={[width * 8, 0, 0]}
        urls={["/dayplanner.png", "/Deliciosoo.png", "/weatherproject.png"]}
      />
    </>
  );
}
function Image(props) {
  const ref = useRef();
  const group = useRef();
  const data = useScroll();
  useFrame((state, delta) => {
    group.current.position.z = THREE.MathUtils.damp(
      group.current.position.z,
      Math.max(0, data.delta * 50),
      4,
      delta
    );
    ref.current.material.grayscale = THREE.MathUtils.damp(
      ref.current.material.grayscale,
      Math.max(0, 1 - data.delta * 1000),
      4,
      delta
    );
  });

  return (
    <group ref={group}>
      <ImageImpl ref={ref} {...props} />
    </group>
  );
}
function Page({ m = 0.4, urls, ...props }) {
  const { width } = useThree((state) => state.viewport);
  const w = width < 10 ? 1.5 / 3 : 1 / 3;
  return (
    <group {...props}>
      <Image
        position={[-width * w, 0, -1]}
        scale={[width * w - m * 2, 5, 1]}
        url={urls[0]}
        alt="hello"
      />
      <Image
        position={[0, 0, 0]}
        scale={[width * w - m * 2, 5, 1]}
        url={urls[1]}
        alt="hello"
      />
      <Image
        position={[width * w, 0, 1]}
        scale={[width * w - m * 2, 5, 1]}
        url={urls[2]}
        alt="hello"
      />
    </group>
  );
}

function Bg() {
  return (
    <mesh scale={100}>
      <boxGeometry args={[1, 1, 1]} />
      <LayerMaterial side={THREE.BackSide}>
        <Depth
          colorB="red"
          colorA="skyblue"
          alpha={1}
          mode="normal"
          near={130}
          far={200}
          origin={[100, 100, -100]}
        />
        <Noise
          mapping="local"
          type="white"
          scale={1000}
          colorA="white"
          colorB="black"
          mode="subtract"
          alpha={0.2}
        />
      </LayerMaterial>
    </mesh>
  );
}
export default function Hero() {
  return (
    <>
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
        }}
        id="main-canvas"
        shadows
        gl={{ stencil: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 50, near: 17, far: 40 }}
      >
        <Lights />

        <Suspense fallback={null}>
          <ScrollControls horizontal damping={4} pages={4} distance={1}>
            <Scroll>
              <Physics
                gravity={[0, -50, 0]}
                defaultContactMaterial={{ restitution: 0.5 }}
              >
                <group position={[0, 0, -10]}>
                  <Mouse />
                  <Borders />

                  <InstancedSpheres />
                </group>
              </Physics>

              <Par />

              <Caption>{`Hello!\nMy name is\nAyad Al-Shaikhli\nFull Stack Web Developer.`}</Caption>
              <Rig />
              <Pages />
            </Scroll>
            <Scroll html>
              <div style={{ position: "absolute", top: "20vh", left: "130vw" }}>
                <div className="h1 text-6xl text-orange-400">About</div>
                <div className="parag text-xl w-96 mt-10">
                  Hi, My name is <span className="text-orange-400">Ayad</span>.
                  I amm 26 years old Web Developer Welcome to my portfolio
                  website. Dive into some fun projects I have done over the
                  years. I design and develop websites for businesses using
                  HTML, CSS, JavaScript. I have also worked as a video and photo
                  editor using Adobe PhotoShop and Adobe Premiere. I am also
                  passionate about building animated websites using three.js
                  blender webgl.
                </div>
              </div>
              <h1 style={{ position: "absolute", top: "20vh", left: "225vw" }}>
                home
              </h1>
              <h1 style={{ position: "absolute", top: "20vh", left: "325vw" }}>
                to
              </h1>
              <h1 style={{ position: "absolute", top: "20vh", left: "425vw" }}>
                be
              </h1>
            </Scroll>
          </ScrollControls>
        </Suspense>
        <Bg />
        <EffectComposer>
          <SSAO
            radius={0.4}
            intensity={50}
            luminanceInfluence={0.4}
            color="red"
          />
          <Bloom
            intensity={1.25}
            kernelSize={3}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.0}
          />
        </EffectComposer>
      </Canvas>
    </>
  );
}
