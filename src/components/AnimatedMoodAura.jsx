import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function AnimatedMoodAura({ className = '' }) {
  const mountRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

  const width = mount.clientWidth || 1
  const height = mount.clientHeight || 1

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0b1220, 0.18)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const light = new THREE.PointLight(0xffffff, 2, 50)
    light.position.set(0, 5, 10)
    scene.add(light)

    const ambient = new THREE.AmbientLight(0x7480ff, 0.6)
    scene.add(ambient)

    const auraGeometry = new THREE.SphereGeometry(4.5, 64, 64)
    const auraMaterial = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      emissive: 0x1f264f,
      transparent: true,
      opacity: 0.1,
      shininess: 120,
    })
    const aura = new THREE.Mesh(auraGeometry, auraMaterial)
    aura.scale.set(1.3, 1.2, 1.3)
    scene.add(aura)

  const pointGeometry = new THREE.BufferGeometry()
  const pointCount = 900
  const positions = new Float32Array(pointCount * 3)
    const colors = new Float32Array(pointCount * 3)
    const color = new THREE.Color()

    for (let i = 0; i < pointCount; i += 1) {
      const radius = 4.5 + Math.random() * 1.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      color.setHSL(0.62 + Math.random() * 0.08, 0.9, 0.58)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

  pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const basePositions = positions.slice()

    const pointMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    })

    const particles = new THREE.Points(pointGeometry, pointMaterial)
    scene.add(particles)

    const clock = new THREE.Clock()

    const animate = () => {
      const elapsed = clock.getElapsedTime()
      aura.rotation.y += 0.0008
      aura.rotation.x = Math.sin(elapsed * 0.15) * 0.1

      particles.rotation.y += 0.0004
      particles.rotation.x = Math.sin(elapsed * 0.08) * 0.01

      const positionsAttribute = pointGeometry.getAttribute('position')
      for (let i = 0; i < pointCount; i += 1) {
        const ix = i * 3
        const iy = ix + 1
        const iz = ix + 2

        const bx = basePositions[ix]
        const by = basePositions[iy]
        const bz = basePositions[iz]

        const originalRadius = Math.sqrt(bx * bx + by * by + bz * bz)
        const wave = 0.15 * Math.sin(elapsed * 0.6 + originalRadius * 2)
        const scale = 1 + wave * 0.02

        positionsAttribute.array[ix] = bx * scale
        positionsAttribute.array[iy] = by * scale
        positionsAttribute.array[iz] = bz * scale
      }
      positionsAttribute.needsUpdate = true

      renderer.render(scene, camera)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
  const newWidth = mount.clientWidth || 1
  const newHeight = mount.clientHeight || 1
  camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
  renderer.dispose()
      auraGeometry.dispose()
  auraMaterial.dispose()
      pointGeometry.dispose()
      pointMaterial.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className={`mood-aura ${className}`} aria-hidden />
}
