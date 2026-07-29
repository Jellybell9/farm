import './style.css'
import * as THREE from 'three'

type GameState = 'ready' | 'running' | 'gameover'

class NeonRunner {
  private readonly scene = new THREE.Scene()
  private readonly camera: THREE.PerspectiveCamera
  private readonly renderer: THREE.WebGLRenderer
  private readonly clock = new THREE.Clock()

  private readonly roadSegments: THREE.Mesh[] = []
  private readonly obstacles: THREE.Object3D[] = []
  private playerGroup!: THREE.Group
  private readonly overlay: HTMLDivElement
  private readonly overlayText: HTMLParagraphElement
  private readonly scoreValue: HTMLSpanElement
  private readonly startButton: HTMLButtonElement
  private readonly hud: HTMLDivElement

  private state: GameState = 'ready'
  private score = 0
  private spawnTimer = 0.8
  private targetLane = 1
  private jumpTime = 0
  private jumpDuration = 0.6
  private jumpRequested = false

  private readonly lanes = [-3.4, 0, 3.4]
  private readonly roadLength = 42
  private readonly speed = 24

  constructor() {
    const app = document.querySelector<HTMLDivElement>('#app')!
    app.innerHTML = ''

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    app.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200)
    this.camera.position.set(0, 7.5, -10)

    this.scene.background = new THREE.Color(0x020617)
    this.scene.fog = new THREE.Fog(0x020617, 16, 90)

    const ambient = new THREE.AmbientLight(0xffffff, 0.85)
    const sun = new THREE.DirectionalLight(0x8b5cf6, 1.3)
    sun.position.set(6, 12, 8)
    sun.castShadow = true

    this.scene.add(ambient, sun)

    this.createRoad()
    this.createPlayer()
    this.createLights()

    this.overlay = document.createElement('div')
    this.overlay.className = 'overlay'
    this.overlay.innerHTML = `
      <div class="panel">
        <h1>Neon Runner</h1>
        <p>Dash through the city at full speed.</p>
        <p id="overlayText">Use the arrow keys or A/D to switch lanes and Space to jump.</p>
        <button id="startButton">Start Run</button>
      </div>
    `
    app.appendChild(this.overlay)

    this.overlayText = this.overlay.querySelector<HTMLParagraphElement>('#overlayText')!
    this.startButton = this.overlay.querySelector<HTMLButtonElement>('#startButton')!
    this.startButton.addEventListener('click', () => this.startGame())

    this.hud = document.createElement('div')
    this.hud.className = 'hud'
    this.hud.innerHTML = '<div class="hud-card">Distance <span id="scoreValue">0</span></div>'
    app.appendChild(this.hud)
    this.scoreValue = this.hud.querySelector<HTMLSpanElement>('#scoreValue')!

    this.bindInput()
    window.addEventListener('resize', () => this.onResize())

    window.setTimeout(() => {
      if (this.state !== 'running') {
        this.startGame()
      }
    }, 250)

    this.animate()
  }

  private createRoad(): void {
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9, metalness: 0.2 })
    const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0x452100 })

    for (let index = 0; index < 4; index += 1) {
      const road = new THREE.Mesh(new THREE.BoxGeometry(12, 0.35, this.roadLength), roadMaterial)
      road.position.set(0, 0, index * this.roadLength - this.roadLength * 1.5)
      road.receiveShadow = true
      this.scene.add(road)
      this.roadSegments.push(road)

      const line = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.36, this.roadLength), lineMaterial)
      line.position.set(0, 0.2, road.position.z)
      this.scene.add(line)
    }

    const sideLeft = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 200), new THREE.MeshStandardMaterial({ color: 0x0f172a }))
    sideLeft.position.set(-6.5, 0.2, 0)
    sideLeft.receiveShadow = true
    this.scene.add(sideLeft)

    const sideRight = sideLeft.clone() as THREE.Mesh
    sideRight.position.set(6.5, 0.2, 0)
    this.scene.add(sideRight)
  }

  private createPlayer(): void {
    this.playerGroup = new THREE.Group()
    this.playerGroup.position.set(0, 1.1, 0)

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.05, 1.05, 1.05),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0f172a, roughness: 0.2, metalness: 0.25 })
    )
    body.castShadow = true
    body.receiveShadow = true

    const visor = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.28, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x020617 })
    )
    visor.position.set(0, 0.15, 0.55)
    visor.castShadow = true

    this.playerGroup.add(body, visor)
    this.scene.add(this.playerGroup)
  }

  private createLights(): void {
    const glow = new THREE.PointLight(0x22d3ee, 22, 30, 2)
    glow.position.set(0, 2.5, 1.2)
    this.playerGroup.add(glow)
  }

  private bindInput(): void {
    window.addEventListener('keydown', (event) => {
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        this.targetLane = Math.max(0, this.targetLane - 1)
        event.preventDefault()
      }

      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        this.targetLane = Math.min(this.lanes.length - 1, this.targetLane + 1)
        event.preventDefault()
      }

      if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
        this.jumpRequested = true
        event.preventDefault()
      }

      if (event.code === 'Enter' && this.state !== 'running') {
        this.startGame()
      }
    })
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private startGame(): void {
    this.state = 'running'
    this.score = 0
    this.spawnTimer = 0.8
    this.targetLane = 1
    this.playerGroup.position.set(this.lanes[this.targetLane], 1.1, 0)
    this.overlay.classList.add('hidden')
    this.hud.classList.remove('hidden')
    this.updateHud()
    this.obstacles.splice(0)
    this.scene.children.forEach((child: THREE.Object3D) => {
      if (child.userData.obstacle) {
        this.scene.remove(child)
      }
    })
  }

  private updateHud(): void {
    this.scoreValue.textContent = Math.floor(this.score).toString()
  }

  private animate(): void {
    const delta = this.clock.getDelta()
    requestAnimationFrame(() => this.animate())

    if (this.state === 'running') {
      this.updateWorld(delta)
    }

    this.renderer.render(this.scene, this.camera)
  }

  private updateWorld(delta: number): void {
    this.score += delta * 16
    this.updateHud()

    this.spawnTimer -= delta
    if (this.spawnTimer <= 0) {
      this.spawnObstacle()
      this.spawnTimer = Math.max(0.45, 0.9 - this.score / 250)
    }

    this.roadSegments.forEach((segment) => {
      segment.position.z -= this.speed * delta
      if (segment.position.z < -this.roadLength * 1.5) {
        segment.position.z += this.roadLength * 4
      }
    })

    for (let index = this.obstacles.length - 1; index >= 0; index -= 1) {
      const obstacle = this.obstacles[index]
      obstacle.position.z -= this.speed * delta * 0.6
      if (obstacle.position.z < -18) {
        this.scene.remove(obstacle)
        this.obstacles.splice(index, 1)
      }
    }

    this.playerGroup.position.x = THREE.MathUtils.lerp(this.playerGroup.position.x, this.lanes[this.targetLane], 0.2)
    this.playerGroup.position.z += this.speed * delta * 0.18

    if (this.jumpRequested && this.jumpTime <= 0) {
      this.jumpTime = this.jumpDuration
      this.jumpRequested = false
    }

    if (this.jumpTime > 0) {
      this.jumpTime -= delta
      const t = 1 - this.jumpTime / this.jumpDuration
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      this.playerGroup.position.y = 1.1 + Math.sin(eased * Math.PI) * 1.8
    } else {
      this.playerGroup.position.y = 1.1
    }

    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.playerGroup.position.x * 0.2, 0.06)
    this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, this.playerGroup.position.z - 8.5, 0.06)
    this.camera.lookAt(this.playerGroup.position.x * 0.25, 1.2, this.playerGroup.position.z + 2)

    this.checkCollisions()
  }

  private spawnObstacle(): void {
    const lane = Math.floor(Math.random() * this.lanes.length)
    const obstacle = new THREE.Group()

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.2, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0x3f0d1f, roughness: 0.25, metalness: 0.25 })
    )
    body.castShadow = true
    body.receiveShadow = true

    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(1.05, 0.3, 1.05),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, emissive: 0x4f2d09, roughness: 0.4, metalness: 0.2 })
    )
    cap.position.set(0, 0.75, 0)
    cap.castShadow = true

    const glow = new THREE.PointLight(0xff4d6d, 10, 6, 2)
    glow.position.set(0, 0.6, 0)

    obstacle.add(body, cap, glow)
    obstacle.position.set(this.lanes[lane], 0.9, 20)
    obstacle.userData.obstacle = true
    obstacle.userData.lane = lane

    this.scene.add(obstacle)
    this.obstacles.push(obstacle)
  }

  private checkCollisions(): void {
    const playerBox = new THREE.Box3().setFromObject(this.playerGroup)
    for (const obstacle of this.obstacles) {
      const obstacleBox = new THREE.Box3().setFromObject(obstacle)
      const overlap = playerBox.intersectsBox(obstacleBox)
      const jumping = this.jumpTime > 0
      if (overlap && !jumping) {
        this.state = 'gameover'
        this.overlayText.textContent = 'You crashed. Press restart to try again.'
        this.startButton.textContent = 'Restart Run'
        this.overlay.classList.remove('hidden')
        this.hud.classList.add('hidden')
        break
      }
    }
  }
}

new NeonRunner()
