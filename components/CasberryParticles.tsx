"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CasberryParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 700;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle Swarm Configuration: 20,000 points forming a colossal, dense purple sphere
    const count = 20000;
    const geometry = new THREE.TetrahedronGeometry(0.24);

    // Primary brand purple material
    const material = new THREE.MeshBasicMaterial({
      color: 0x635bff,
      transparent: true,
      opacity: 0.92,
    });

    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    const dummy = new THREE.Object3D();
    const pColor = new THREE.Color();

    // Store positions and target vectors
    const positions: THREE.Vector3[] = [];
    const targets: THREE.Vector3[] = [];

    // Distinct shades of ToolDeck Brand Purple (#635BFF)
    const PURPLE_PALETTE = [
      0x635bff, // Signature Brand Purple (#635BFF)
      0x7c3aed, // Vivid Violet (#7C3AED)
      0x8b5cf6, // Electric Indigo (#8B5CF6)
      0xa855f7, // Neon Amethyst (#A855F7)
      0xc084fc, // Lavender Light (#C084FC)
      0xe0e7ff, // Starlight Highlight (#E0E7FF)
    ];

    // Expanded sphere radius
    const SPHERE_RADIUS = 38;

    for (let i = 0; i < count; i++) {
      // Random starting position for smooth convergence
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 80
        )
      );

      // True Fibonacci Sphere Distribution (100% spherical symmetry)
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      targets.push(
        new THREE.Vector3(
          SPHERE_RADIUS * Math.cos(theta) * Math.sin(phi),
          SPHERE_RADIUS * Math.sin(theta) * Math.sin(phi),
          SPHERE_RADIUS * Math.cos(phi)
        )
      );

      // Distribute rich purple gradient
      pColor.setHex(PURPLE_PALETTE[i % PURPLE_PALETTE.length]);
      instancedMesh.setColorAt(i, pColor);
    }

    instancedMesh.instanceColor!.needsUpdate = true;
    scene.add(instancedMesh);

    // Dynamic Camera Distance calculation: sphere fills view smoothly without clipping on mobile or desktop
    const adjustCamera = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 700;
      const aspect = w / h;
      camera.aspect = aspect;

      const fovRad = THREE.MathUtils.degToRad(camera.fov);
      // Half-height of the sphere with breathing margin
      const targetHalfHeight = SPHERE_RADIUS * 1.14;
      const dist = targetHalfHeight / Math.tan(fovRad / 2);

      if (aspect < 1) {
        camera.position.z = dist / aspect;
      } else {
        camera.position.z = dist;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    adjustCamera();

    // Mouse and Touch tracking for reactive interaction across desktop and mobile
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width - 0.5;
        const y = (touch.clientY - rect.top) / rect.height - 0.5;
        mouseX = x * 2;
        mouseY = y * 2;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", adjustCamera);

    // Reusable vector to eliminate garbage collection stutters
    const tempTarget = new THREE.Vector3();
    const clock = new THREE.Clock();
    let animationFrameId: number;
    let isVisible = true;

    const animate = () => {
      if (!isVisible) return; // Auto pause when scrolled away
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth continuous orbit + mouse/touch tilt
      targetRotationY += 0.0028;
      instancedMesh.rotation.y = THREE.MathUtils.lerp(
        instancedMesh.rotation.y,
        targetRotationY + mouseX * 0.45,
        0.05
      );
      instancedMesh.rotation.x = THREE.MathUtils.lerp(
        instancedMesh.rotation.x,
        mouseY * 0.35,
        0.05
      );

      // Uniform radial breathing (preserves 100% spherical shape)
      const pulse = 1 + Math.sin(time * 1.3) * 0.032;

      for (let i = 0; i < count; i++) {
        tempTarget.copy(targets[i]).multiplyScalar(pulse);
        positions[i].lerp(tempTarget, 0.08);

        dummy.position.copy(positions[i]);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    // Auto-pause Three.js GPU rendering when user scrolls down to cards
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          clock.start();
          animate();
        } else {
          clock.stop();
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", adjustCamera);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[175px] sm:h-[220px] lg:h-[680px] xl:h-[740px] flex items-center justify-center select-none pointer-events-auto">
      {/* Soft brand purple radial aura */}
      <div className="pointer-events-none absolute -inset-6 sm:-inset-10 bg-radial from-brand/22 via-brand/6 to-transparent blur-2xl sm:blur-3xl -z-10" />

      {/* Pure Three.js Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
      />
    </div>
  );
}
