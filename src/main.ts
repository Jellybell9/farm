import "./style.css";
import * as THREE from "three";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `<div class="ui"><header><div class="brand"><b>✦</b><div><h1>GREENACRE FARM</h1><small>OPEN COUNTRY EXPLORATION</small></div></div><div class="compass"><span>W</span><i></i><b>N</b><i></i><span>E</span></div><div class="shards">♧ <strong id="shards">0</strong><small> FARM LEVEL</small></div></header><aside class="quest"><p>FARM JOURNAL</p><h2>A farmer's first day</h2><span id="questText">Make three bales and feed the cattle before ending the day.</span><div><i></i><i></i><i></i></div></aside><aside class="farm-status"><p>FARM SUPPLIES</p><div>Wheat <b id="wheat">0</b></div><div>Cattle care <b id="care">50%</b></div><div>Bales fed today <b id="fedBales">0 / 3</b></div><div>Ripe plots <b id="plots">18</b></div><div>Field bales <b id="bales">0</b></div><div>Barn stack <b id="stored">0</b></div><button id="dropBale">DROP BALE (F)</button><button id="sleep">END DAY</button></aside><div class="location" id="location">HOMESTEAD</div><div class="toast" id="toast">Drive the orange combine through ripe wheat to harvest it.</div></div>`;
document.querySelector(".ui")!.insertAdjacentHTML(
  "beforeend",
  `<section class="home-screen" id="homeScreen"><div class="home-card"><p>WELCOME TO</p><h1>GREENACRE FARM</h1><span>Choose the farmer who will build your homestead.</span><div class="farmer-choices"><button class="farmer-choice selected" data-farmer="avery"><i class="farmer-avatar avery"></i><b>Avery</b><small>Steady hand</small></button><button class="farmer-choice" data-farmer="rowan"><i class="farmer-avatar rowan"></i><b>Rowan</b><small>Field expert</small></button><button class="farmer-choice" data-farmer="sage"><i class="farmer-avatar sage"></i><b>Sage</b><small>Animal friend</small></button></div><button class="start-farm" id="startFarm">START FARM</button><small class="home-note">Your choice can be changed the next time you begin a session.</small></div></section>`,
);
document.querySelector(".ui")!.insertAdjacentHTML(
  "beforeend",
  `<button class="market-toggle" id="marketToggle" style="min-width:176px;min-height:52px;border:2px solid #f4cf68;border-radius:8px;background:linear-gradient(135deg,#b16c28,#754420);color:#fff7d7;font:800 13px Manrope;letter-spacing:1.1px;text-shadow:0 1px 2px #3c2413;box-shadow:0 0 0 3px #173336aa,0 8px 20px #17333688">MARKETPLACE</button><aside class="marketplace" id="marketplace" hidden><button class="market-close" id="marketClose" aria-label="Close marketplace">×</button><p>FARM MARKET</p><h2>Farm Exchange</h2><div>Coins <b id="coins">0</b></div><div>Bale price <b>25</b></div><div>Chilled milk <b>15</b></div><button id="sellBale">SELL 1 BALE</button><button id="sellMilk">SELL 1 MILK</button></aside>`,
);
document.querySelector("#wheat")!.parentElement!.insertAdjacentHTML(
  "afterend",
  `<div>Milk <b id="milk">0</b></div><div>Vegetables <b id="vegetables">0 fridge</b></div><div>Pig meals <b id="pigMeals">0 / 0</b></div><div>New farm stock <b id="farmStock">0</b></div>`,
);
document.querySelector("#sellMilk")!.insertAdjacentHTML(
  "afterend",
  `<p class="market-section">BUILD YOUR FARM</p><div class="market-items"><button class="market-item" data-buy="sheep"><span><b>Sheep</b><small>Grazing companion</small></span><em>80</em></button><button class="market-item" data-buy="pig"><span><b>Pig</b><small>Happy mud lover</small></span><em>100</em></button><button class="market-item" data-buy="vegetables"><span><b>Vegetable plot</b><small>Fresh garden beds</small></span><em>40</em></button><button class="market-item" data-buy="horse"><span><b>Horse</b><small>Strong farm friend</small></span><em>200</em></button></div><p class="market-section">EQUIPMENT UPGRADES</p><div class="market-items"><button class="market-item" data-buy="wideHeader"><span><b>Wide combine header</b><small>Cut a wider swath of wheat</small></span><em>225</em></button><button class="market-item" data-buy="fastBaler"><span><b>Power baler</b><small>Make bales from 2 sheaves</small></span><em>180</em></button><button class="market-item" data-buy="tractorEngine"><span><b>Tractor engine</b><small>Drive farm vehicles faster</small></span><em>160</em></button></div><p class="market-section">FARM DEFENSE</p><div class="market-items"><button class="market-item" data-buy="rifle"><span><b>Rifle</b><small>Press Q to protect livestock</small></span><em>300</em></button></div><small class="market-note" id="marketNote">Build your farm or upgrade your equipment.</small>`,
);
document.querySelector("#sleep")!.outerHTML =
  `<div>Day remaining <b id="dayTimer">20:00</b></div>`;
document.querySelector(".ui")!.insertAdjacentHTML(
  "beforeend",
  `<div class="interact-prompt" id="milkPrompt" hidden>PRESS <b>E</b> TO MILK COW</div>`,
);
document.querySelector(".ui")!.insertAdjacentHTML(
  "beforeend",
  `<button class="save-button" id="saveButton">SAVE GAME</button>`,
);
document.querySelector(".ui")!.insertAdjacentHTML(
  "beforeend",
  `<button class="restart-button" id="restartButton">RESTART GAME</button>`,
);
document.querySelector(".ui")!.insertAdjacentHTML(
  "beforeend",
  `<button class="help-button" id="helpButton" aria-expanded="false">? HELP</button><aside class="help-panel" id="helpPanel" hidden><button class="help-close" id="helpClose" aria-label="Close help">×</button><p>HOW TO PLAY</p><h2>Farm Handbook</h2><section><b>Move and interact</b><span>Use Arrow keys to move and drag to look around. Hold Shift to sprint. Press Space to jump; you can steer a little in the air. Press E to interact, enter a vehicle, milk, harvest, plant, or feed animals. Press P to pick up the milk pail. F places a pending vegetable plot, or drops a bale while driving the blue loader.</span></section><section><b>Make and feed bales</b><span>Drive the orange combine through ripe wheat. Drive the green tractor over fallen sheaves; every few sheaves make a bale. Use the blue loader to pick up a bale, then place it in the pasture. Cows, sheep, and horses share pasture bales; pigs do not eat them. Feed three bales daily to protect the cattle.</span></section><section><b>Milk and sell</b><span>Open the fridge with E, pick up the pail with P, then milk a nearby cow with E. Return the full pail to the open fridge with E to chill it. Marketplace sells loose bales and chilled milk for coins.</span></section><section><b>Vegetables and pigs</b><span>Buy a vegetable plot, walk to clear ground, face the spot, and press F. At a plot, press E to harvest ripe vegetables; four go straight into the fridge. Press E again on an empty plot to plant it, using one stored vegetable. It ripens next day. Feed every pig one fridge vegetable each day with E or some unfed pigs die.</span></section><section><b>Marketplace upgrades</b><span>Buy animals and vegetable plots under Build Your Farm. Equipment Upgrades improve existing machinery: the wide header cuts more wheat, the power baler uses fewer sheaves, and the tractor engine makes farm vehicles faster.</span></section><section><b>Day, night, and danger</b><span>Day lasts 20 minutes, then night lasts 5 minutes. Watch the DAY/NIGHT timer. Wolves live in the forest and a bear lives in the mountains. At night they hunt pasture livestock, so keep an eye on the herd.</span></section></aside>`,
);

const scene = new THREE.Scene();
const daySky = new THREE.Color(0x87c7db);
const nightSky = new THREE.Color(0x071226);
const skyColor = daySky.clone();
scene.background = skyColor;
scene.fog = new THREE.FogExp2(skyColor, 0.012);
const camera = new THREE.PerspectiveCamera(
  57,
  innerWidth / innerHeight,
  0.1,
  180,
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
app.prepend(renderer.domElement);
const skyLight = new THREE.HemisphereLight(0xdaf2ff, 0x355a55, 2.2);
scene.add(skyLight);
const sun = new THREE.DirectionalLight(0xffecae, 3);
sun.position.set(-18, 30, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);
const moonLight = new THREE.DirectionalLight(0xaac8ff, 0);
moonLight.position.set(-28, 32, -38);
scene.add(moonLight);
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(1.25, 16, 12),
  new THREE.MeshBasicMaterial({ color: 0xf1f4dc, fog: false }),
);
moon.position.set(-30, 28, -48);
moon.visible = false;
scene.add(moon);
const starPositions: number[] = [];
for (let star = 0; star < 220; star++) {
  starPositions.push(
    (Math.random() - 0.5) * 170,
    18 + Math.random() * 70,
    (Math.random() - 0.5) * 170,
  );
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({
  color: 0xf7f2d3,
  size: 0.55,
  transparent: true,
  opacity: 0,
  depthWrite: false,
  fog: false,
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);
const water = new THREE.Mesh(
  new THREE.PlaneGeometry(260, 260),
  new THREE.MeshStandardMaterial({
    color: 0x65aebd,
    roughness: 0.35,
    metalness: 0.18,
  }),
);
water.rotation.x = -Math.PI / 2;
water.position.y = -3;
scene.add(water);
const ground = new THREE.Group();
scene.add(ground);
const heights = new Map<string, number>(),
  cellSize = 2.4;
const grassMats = [0x5c9858, 0x70a85d, 0x4c8758].map(
    (c) => new THREE.MeshStandardMaterial({ color: c, flatShading: true }),
  ),
  dirt = new THREE.MeshStandardMaterial({ color: 0x826440, flatShading: true }),
  snow = new THREE.MeshStandardMaterial({ color: 0xdbe7e2, flatShading: true });
function noise(x: number, z: number) {
  return (
    Math.sin(x * 0.19) * 1.2 +
    Math.cos(z * 0.16) * 1.15 +
    Math.sin((x + z) * 0.08) * 1.6 +
    Math.cos(Math.sqrt(x * x + z * z) * 0.12) * 0.8
  );
}
function hAt(x: number, z: number) {
  return heights.get(`${x},${z}`) ?? 0;
}
for (let x = -23; x <= 23; x++)
  for (let z = -23; z <= 23; z++) {
    const edge = Math.max(Math.abs(x), Math.abs(z));
    const inForest = x < -6 && z > 1;
    let h = 0;
    if (inForest)
      h = Math.max(0, Math.round((noise(x, z) * 0.75 + 0.8) * 2) / 2);
    if (edge > 18)
      h = Math.max(
        h,
        Math.round(
          (2.5 + (edge - 18) * 0.9 + Math.abs(noise(x, z)) * 0.7) * 2,
        ) / 2,
      );
    heights.set(`${x},${z}`, h);
    const mat = h > 3.5 ? snow : grassMats[Math.abs((x * 3 + z) % 3)];
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(cellSize, Math.max(0.35, h + 2.5), cellSize),
      mat,
    );
    block.position.set(x * cellSize, (h - 2.5) / 2, z * cellSize);
    block.castShadow = true;
    block.receiveShadow = true;
    ground.add(block);
    if (h > 0.8) {
      const side = new THREE.Mesh(
        new THREE.BoxGeometry(
          cellSize + 0.02,
          Math.max(0.1, h + 2.25),
          cellSize + 0.02,
        ),
        dirt,
      );
      side.position.set(x * cellSize, (h - 2.5) / 2 - 0.08, z * cellSize);
      ground.add(side);
    }
  }
function yWorld(x: number, z: number) {
  return hAt(Math.round(x / cellSize), Math.round(z / cellSize)) + 0.12;
}
type WalkableFloor = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  topY: number;
};
const walkableFloors: WalkableFloor[] = [];
function playerGroundY(x: number, z: number) {
  const terrainY = yWorld(x, z);
  const floorY = walkableFloors.reduce(
    (highest, floor) =>
      x >= floor.minX && x <= floor.maxX && z >= floor.minZ && z <= floor.maxZ
        ? Math.max(highest, floor.topY + 0.01)
        : highest,
    terrainY,
  );
  return floorY;
}
const trunk = new THREE.MeshStandardMaterial({ color: 0x68482d }),
  leaf = new THREE.MeshStandardMaterial({ color: 0x246946, flatShading: true }),
  rockM = new THREE.MeshStandardMaterial({
    color: 0x6f7d7c,
    flatShading: true,
  });
type CircleCollider = { x: number; z: number; radius: number };
type BoxCollider = { x: number; z: number; width: number; depth: number };
const solidCircles: CircleCollider[] = [];
const solidBoxes: BoxCollider[] = [];
function addSolidBox(x: number, z: number, width: number, depth: number) {
  solidBoxes.push({ x, z, width, depth });
}
function tree(x: number, z: number, scale = 1) {
  const y = yWorld(x, z);
  const g = new THREE.Group();
  const t = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15 * scale, 0.22 * scale, 1.7 * scale, 6),
    trunk,
  );
  t.position.y = 0.85 * scale;
  const c = new THREE.Mesh(
    new THREE.ConeGeometry(0.9 * scale, 2.4 * scale, 7),
    leaf,
  );
  c.position.y = 2 * scale;
  g.add(t, c);
  g.position.set(x, y, z);
  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  scene.add(g);
  solidCircles.push({ x, z, radius: 0.3 + scale * 0.2 });
}
function rock(x: number, z: number) {
  const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45, 0), rockM);
  r.position.set(x, yWorld(x, z) + 0.25, z);
  r.scale.set(1.4, 0.75, 1);
  r.castShadow = true;
  scene.add(r);
  solidCircles.push({ x, z, radius: 0.52 });
}
for (let i = 0; i < 180; i++) {
  const x = (Math.random() - 0.5) * 96,
    z = (Math.random() - 0.5) * 96;
  const insideField = x > -40 && x < -2 && z > -40 && z < -2;
  const insidePasture = x > 4 && x < 25.8 && z > 2 && z < 17.5;
  // Leave the farmhouse footprint and its open front as a usable yard.
  const insideHouseGrounds = x > 4.5 && x < 15.5 && z > -9.5 && z < 0.5;
  // Keep the whole barn pad and its north-facing approach clear for machinery.
  const insideBarnGrounds = x > 1.5 && x < 18.5 && z > -31 && z < -17;
  if (
    Math.hypot(x, z) < 10 ||
    (Math.abs(x - 27) < 8 && Math.abs(z + 22) < 9) ||
    insideField ||
    insidePasture ||
    insideHouseGrounds ||
    insideBarnGrounds
  )
    continue;
  if (Math.random() > 0.34) tree(x, z, 0.65 + Math.random() * 0.7);
  else rock(x, z);
}
const shards: THREE.Group[] = [];
let refrigerator: THREE.Group | null = null;
let refrigeratorDoor: THREE.Group | null = null;
// Farm landmarks: barn, fields, fences and a windmill
const farmWood = new THREE.MeshStandardMaterial({ color: 0x7b4930 }),
  barnRed = new THREE.MeshStandardMaterial({ color: 0xad4e35 }),
  hay = new THREE.MeshStandardMaterial({ color: 0xd8b34a }),
  fence = new THREE.MeshStandardMaterial({ color: 0x815b36 });
function addBox(
  mat: THREE.Material,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
) {
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  b.position.set(x, y, z);
  b.castShadow = true;
  b.receiveShadow = true;
  scene.add(b);
  return b;
}
function barn(x: number, z: number) {
  const y = yWorld(x, z);
  // A broad, open-front equipment barn: like the farmhouse, the yard-facing
  // side is left open so the interior reads as part of the homestead.
  const width = 15,
    depth = 10,
    wallHeight = 3.6;
  const floor = new THREE.MeshStandardMaterial({ color: 0x8f6745 });
  addBox(floor, x, y + 0.1, z, width, 0.2, depth);
  // Back and end walls shelter the machinery while the north side opens to the house.
  addBox(barnRed, x, y + wallHeight / 2, z - depth / 2 + 0.12, width, wallHeight, 0.24);
  addBox(barnRed, x - width / 2 + 0.12, y + wallHeight / 2, z, 0.24, wallHeight, depth);
  addBox(barnRed, x + width / 2 - 0.12, y + wallHeight / 2, z, 0.24, wallHeight, depth);
  addSolidBox(x, z - depth / 2 + 0.12, width, 0.24);
  addSolidBox(x - width / 2 + 0.12, z, 0.24, depth);
  addSolidBox(x + width / 2 - 0.12, z, 0.24, depth);
  // Timber posts make four generous parking bays without enclosing them.
  for (const px of [x - width / 2 + 0.3, x - 3.75, x, x + 3.75, x + width / 2 - 0.3])
    addBox(farmWood, px, y + 2.15, z + depth / 2 - 0.3, 0.28, 4.3, 0.28);
  for (const px of [x - width / 2 + 0.3, x - 3.75, x, x + 3.75, x + width / 2 - 0.3])
    solidCircles.push({ x: px, z: z + depth / 2 - 0.3, radius: 0.2 });
  // A simple gable roof follows the rectangular wall footprint exactly.
  const roofOverhang = 0.22,
    halfRoofWidth = width / 2 + roofOverhang,
    halfRoofDepth = depth / 2 + roofOverhang,
    roofRise = 2.55;
  const roofGeometry = new THREE.BufferGeometry();
  roofGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [
        -halfRoofWidth, 0, -halfRoofDepth,
        halfRoofWidth, 0, -halfRoofDepth,
        -halfRoofWidth, 0, halfRoofDepth,
        halfRoofWidth, 0, halfRoofDepth,
        0, roofRise, -halfRoofDepth,
        0, roofRise, halfRoofDepth,
      ],
      3,
    ),
  );
  roofGeometry.setIndex([0, 1, 4, 2, 5, 3, 0, 4, 5, 0, 5, 2, 1, 3, 5, 1, 5, 4]);
  roofGeometry.computeVertexNormals();
  const roof = new THREE.Mesh(
    roofGeometry,
    new THREE.MeshStandardMaterial({ color: 0x5c3d2d, side: THREE.DoubleSide }),
  );
  roof.position.set(x, y + wallHeight, z);
  roof.castShadow = true;
  scene.add(roof);
}
function farmhouse(x: number, z: number) {
  const y = yWorld(x, z);
  // The farmhouse is intentionally open to the yard: a broad living room at
  // the front, with a tucked-away bedroom and kitchen along the back wall.
  const wall = new THREE.MeshStandardMaterial({ color: 0xe8ddbd });
  const trim = new THREE.MeshStandardMaterial({ color: 0x76543a });
  const floor = new THREE.MeshStandardMaterial({ color: 0xb9895e });
  const linen = new THREE.MeshStandardMaterial({ color: 0xe8e0c8 });
  const quilt = new THREE.MeshStandardMaterial({ color: 0x5c8191 });
  const cabinet = new THREE.MeshStandardMaterial({ color: 0x7b9b78 });
  const counter = new THREE.MeshStandardMaterial({ color: 0xd6c7aa });
  const sofa = new THREE.MeshStandardMaterial({ color: 0x8c604c });
  const charcoal = new THREE.MeshStandardMaterial({ color: 0x374342 });

  // An oversized plank floor makes the interior feel continuous with the lawn.
  addBox(floor, x, y + 0.12, z, 8.2, 0.22, 6.2);
  walkableFloors.push({
    minX: x - 4.1,
    maxX: x + 4.1,
    minZ: z - 3.1,
    maxZ: z + 3.1,
    topY: y + 0.23,
  });
  // Back and side walls frame the rooms, leaving the whole south face open.
  addBox(wall, x, y + 1.65, z + 2.95, 8.2, 3.3, 0.22);
  addBox(wall, x - 4, y + 1.65, z + 1.85, 0.22, 3.3, 2.2);
  addBox(wall, x + 4, y + 1.65, z + 1.85, 0.22, 3.3, 2.2);
  // Short dividers define the private rooms without closing them off.
  addBox(wall, x - 1.2, y + 1.25, z + 1.6, 0.18, 2.5, 2.7);
  addBox(wall, x + 1.2, y + 1.25, z + 1.6, 0.18, 2.5, 2.7);
  addSolidBox(x, z + 2.95, 8.2, 0.22);
  addSolidBox(x - 4, z + 1.85, 0.22, 2.2);
  addSolidBox(x + 4, z + 1.85, 0.22, 2.2);
  addSolidBox(x - 1.2, z + 1.6, 0.18, 2.7);
  addSolidBox(x + 1.2, z + 1.6, 0.18, 2.7);

  // Four timber posts and a roof matched to the actual house footprint.
  for (const [px, pz] of [
    [x - 3.75, z - 2.75], [x + 3.75, z - 2.75],
    [x - 3.75, z + 2.75], [x + 3.75, z + 2.75],
  ]) addBox(trim, px, y + 2.05, pz, 0.24, 4.1, 0.24);
  const roofOverhang = 0.18,
    halfRoofWidth = 4.1 + roofOverhang,
    halfRoofDepth = 3.1 + roofOverhang,
    roofRise = 2.05;
  const houseRoofGeometry = new THREE.BufferGeometry();
  houseRoofGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [
        -halfRoofWidth, 0, -halfRoofDepth,
        halfRoofWidth, 0, -halfRoofDepth,
        -halfRoofWidth, 0, halfRoofDepth,
        halfRoofWidth, 0, halfRoofDepth,
        0, roofRise, -halfRoofDepth,
        0, roofRise, halfRoofDepth,
      ],
      3,
    ),
  );
  houseRoofGeometry.setIndex([
    0, 1, 4, 2, 5, 3, 0, 4, 5, 0, 5, 2, 1, 3, 5, 1, 5, 4,
  ]);
  houseRoofGeometry.computeVertexNormals();
  const top = new THREE.Mesh(
    houseRoofGeometry,
    new THREE.MeshStandardMaterial({ color: 0x66513e, side: THREE.DoubleSide }),
  );
  top.position.set(x, y + 3.3, z);
  top.castShadow = true;
  scene.add(top);

  // Bedroom, back left: bed, headboard, and a little bedside table.
  addBox(trim, x - 2.6, y + 0.5, z + 2.05, 2.15, 0.45, 1.65);
  addBox(linen, x - 2.6, y + 0.8, z + 1.9, 2.05, 0.25, 1.45);
  addBox(quilt, x - 2.6, y + 0.94, z + 1.6, 2.02, 0.12, 0.82);
  addBox(trim, x - 2.6, y + 1.35, z + 2.72, 2.18, 1.3, 0.16);
  addBox(trim, x - 3.65, y + 0.45, z + 0.75, 0.48, 0.7, 0.48);

  // Kitchen, back right: long counter, sink, stove, and a warm cabinet wall.
  addBox(cabinet, x + 2.65, y + 0.55, z + 2.55, 2.45, 1.05, 0.58);
  addBox(counter, x + 2.65, y + 1.12, z + 2.55, 2.55, 0.12, 0.68);
  addBox(charcoal, x + 3.35, y + 1.24, z + 2.55, 0.58, 0.08, 0.48);
  const sink = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.055, 6, 12), charcoal);
  sink.position.set(x + 2.05, y + 1.22, z + 2.55);
  sink.rotation.x = Math.PI / 2;
  scene.add(sink);
  refrigerator = new THREE.Group();
  refrigerator.position.set(x + 3.35, y + 1.18, z + 1.48);
  const fridgeMat = new THREE.MeshStandardMaterial({
    color: 0xe4ebe4,
    metalness: 0.15,
    roughness: 0.38,
  });
  // Build the refrigerator as a shallow cabinet rather than a solid block so
  // the milk pail is visible on its shelf when the door is open.
  const fridgeParts = [
    [0, 1.1, 0.34, 0.88, 2.2, 0.1],
    [-0.4, 1.1, 0, 0.08, 2.2, 0.78],
    [0.4, 1.1, 0, 0.08, 2.2, 0.78],
    [0, 0.04, 0, 0.88, 0.08, 0.78],
    [0, 2.16, 0, 0.88, 0.08, 0.78],
    [0, 0.72, 0.02, 0.74, 0.06, 0.62],
  ];
  fridgeParts.forEach(([px, py, pz, w, h, d]) => {
    const part = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), fridgeMat);
    part.position.set(px, py, pz);
    refrigerator!.add(part);
  });
  refrigeratorDoor = new THREE.Group();
  refrigeratorDoor.position.set(-0.4, 1.12, -0.42);
  const fridgeFront = new THREE.Mesh(
    new THREE.BoxGeometry(0.82, 2.04, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xf4f5ed, metalness: 0.12, roughness: 0.32 }),
  );
  fridgeFront.position.x = 0.41;
  const fridgeHandle = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.75, 0.07), charcoal);
  fridgeHandle.position.set(0.7, 0, -0.06);
  refrigeratorDoor.add(fridgeFront, fridgeHandle);
  refrigerator.add(refrigeratorDoor);
  refrigerator.traverse((object) => {
    if (object instanceof THREE.Mesh) object.castShadow = true;
  });
  scene.add(refrigerator);

  // Living room spans the open front, oriented toward the fireplace on the back wall.
  addBox(sofa, x, y + 0.55, z - 1.45, 2.35, 0.7, 0.72);
  addBox(sofa, x, y + 1.05, z - 1.72, 2.35, 0.48, 0.2);
  addBox(charcoal, x, y + 1.05, z + 2.76, 1.05, 1.7, 0.3);
  addBox(new THREE.MeshStandardMaterial({ color: 0xe2a24c, emissive: 0x5c260c }), x, y + 0.72, z + 2.55, 0.52, 0.62, 0.08);
  // Furniture is solid too, so the open rooms still feel like real spaces.
  addSolidBox(x - 2.6, z + 2.05, 2.15, 1.65); // bed
  addSolidBox(x - 3.65, z + 0.75, 0.48, 0.48); // bedside table
  addSolidBox(x + 2.65, z + 2.55, 2.55, 0.68); // kitchen counter
  addSolidBox(x + 3.35, z + 1.48, 0.88, 0.78); // refrigerator
  addSolidBox(x, z - 1.45, 2.35, 0.72); // sofa
  addSolidBox(x, z + 2.76, 1.05, 0.3); // fireplace
}
function fenceLine(
  x: number,
  z: number,
  length: number,
  vertical: boolean,
  gateAt = -10,
) {
  for (let i = 0; i < length; i++) {
    if (Math.abs(i - gateAt) <= 1) continue;
    const px = x + (vertical ? 0 : i * 0.9),
      pz = z + (vertical ? i * 0.9 : 0),
      y = yWorld(px, pz);
    addBox(
      fence,
      px,
      y + 0.42,
      pz,
      vertical ? 0.08 : 0.9,
      0.08,
      vertical ? 0.9 : 0.08,
    );
    addBox(fence, px, y + 0.38, pz, 0.1, 0.75, 0.1);
    addSolidBox(px, pz, vertical ? 0.1 : 0.9, vertical ? 0.9 : 0.1);
  }
}
barn(10, -25);
farmhouse(10, -5);
// Two farm vehicles: a green baler tractor and an orange wheat-cutting combine.
const tractor = new THREE.Group(),
  tractorGreen = new THREE.MeshStandardMaterial({
    color: 0x2f7351,
    roughness: 0.65,
  }),
  tractorYellow = new THREE.MeshStandardMaterial({ color: 0xe0b642 }),
  tire = new THREE.MeshStandardMaterial({ color: 0x202522 });
const tractorBody = new THREE.Mesh(
  new THREE.BoxGeometry(1.45, 0.55, 2),
  tractorGreen,
);
tractorBody.position.y = 0.62;
tractor.add(tractorBody);
const hood = new THREE.Mesh(
  new THREE.BoxGeometry(1.22, 0.48, 0.9),
  tractorGreen,
);
hood.position.set(0, 0.82, -0.55);
tractor.add(hood);
const seat = new THREE.Mesh(
  new THREE.BoxGeometry(0.7, 0.65, 0.6),
  tractorYellow,
);
seat.position.set(0, 1.05, 0.52);
tractor.add(seat);
for (const [x, z, r] of [
  [-0.78, -0.62, 0.38],
  [0.78, -0.62, 0.38],
  [-0.86, 0.7, 0.56],
  [0.86, 0.7, 0.56],
] as number[][]) {
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, 0.25, 10),
    tire,
  );
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(x, r, z);
  wheel.castShadow = true;
  tractor.add(wheel);
}
tractor.position.set(5.25, yWorld(5.25, -25) + 0.05, -25);
tractor.rotation.y = Math.PI;
tractor.traverse((o) => {
  if (o instanceof THREE.Mesh) o.castShadow = true;
});
scene.add(tractor);
const harvester = new THREE.Group(),
  orange = new THREE.MeshStandardMaterial({ color: 0xd66a28, roughness: 0.6 }),
  darkOrange = new THREE.MeshStandardMaterial({ color: 0xa8471f });
const combineBody = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 1.1, 2.45),
  orange,
);
combineBody.position.y = 1;
harvester.add(combineBody);
const cab = new THREE.Mesh(
  new THREE.BoxGeometry(1.1, 0.85, 0.8),
  new THREE.MeshStandardMaterial({ color: 0x8fc1c0, metalness: 0.2 }),
);
cab.position.set(0, 1.65, 0.4);
harvester.add(cab);
const cutter = new THREE.Mesh(
  new THREE.BoxGeometry(2.8, 0.2, 0.45),
  darkOrange,
);
cutter.position.set(0, 0.48, -1.45);
harvester.add(cutter);
for (const [x, z, r] of [
  [-0.98, -0.55, 0.42],
  [0.98, -0.55, 0.42],
  [-1, 0.72, 0.63],
  [1, 0.72, 0.63],
] as number[][]) {
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, 0.27, 10),
    tire,
  );
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(x, r, z);
  harvester.add(wheel);
}
harvester.position.set(8.85, yWorld(8.85, -25) + 0.05, -25);
harvester.rotation.y = Math.PI;
harvester.traverse((o) => {
  if (o instanceof THREE.Mesh) o.castShadow = true;
});
scene.add(harvester);
const planter = new THREE.Group(),
  purple = new THREE.MeshStandardMaterial({ color: 0x7548a3, roughness: 0.6 });
const planterBody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.62, 2), purple);
planterBody.position.y = 0.7;
planter.add(planterBody);
const planterCab = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.7, 0.68),
  new THREE.MeshStandardMaterial({ color: 0xa9c5c1 }),
);
planterCab.position.set(0, 1.25, 0.42);
planter.add(planterCab);
const seeder = new THREE.Mesh(
  new THREE.BoxGeometry(2.5, 0.25, 0.38),
  new THREE.MeshStandardMaterial({ color: 0x513276 }),
);
seeder.position.set(0, 0.42, -1.18);
planter.add(seeder);
for (const [x, z, r] of [
  [-0.75, -0.58, 0.37],
  [0.75, -0.58, 0.37],
  [-0.82, 0.65, 0.5],
  [0.82, 0.65, 0.5],
] as number[][]) {
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, 0.24, 10),
    tire,
  );
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(x, r, z);
  planter.add(wheel);
}
planter.position.set(12.45, yWorld(12.45, -25) + 0.05, -25);
planter.rotation.y = Math.PI;
planter.traverse((o) => {
  if (o instanceof THREE.Mesh) o.castShadow = true;
});
scene.add(planter);
const loader = new THREE.Group(),
  loaderBlue = new THREE.MeshStandardMaterial({
    color: 0x32739a,
    roughness: 0.55,
  });
const loaderBody = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 0.7, 1.9),
  loaderBlue,
);
loaderBody.position.y = 0.75;
loader.add(loaderBody);
const loaderCab = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.8, 0.7),
  new THREE.MeshStandardMaterial({ color: 0x9dced1 }),
);
loaderCab.position.set(0, 1.32, 0.35);
loader.add(loaderCab);
const forks = new THREE.Mesh(
  new THREE.BoxGeometry(1.25, 0.1, 1.1),
  new THREE.MeshStandardMaterial({ color: 0x555a58 }),
);
forks.position.set(0, 0.42, -1.35);
loader.add(forks);
for (const [x, z, r] of [
  [-0.75, -0.55, 0.36],
  [0.75, -0.55, 0.36],
  [-0.8, 0.62, 0.5],
  [0.8, 0.62, 0.5],
] as number[][]) {
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, 0.24, 10),
    tire,
  );
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(x, r, z);
  loader.add(wheel);
}
loader.position.set(16.05, yWorld(16.05, -25) + 0.05, -25);
loader.rotation.y = Math.PI;
loader.traverse((o) => {
  if (o instanceof THREE.Mesh) o.castShadow = true;
});
scene.add(loader);
function canStandAt(x: number, z: number, radius = 0.32) {
  if (
    solidCircles.some(
      (obstacle) => Math.hypot(x - obstacle.x, z - obstacle.z) < radius + obstacle.radius,
    )
  )
    return false;
  if (
    solidBoxes.some((obstacle) => {
      const nearestX = THREE.MathUtils.clamp(
        x,
        obstacle.x - obstacle.width / 2,
        obstacle.x + obstacle.width / 2,
      );
      const nearestZ = THREE.MathUtils.clamp(
        z,
        obstacle.z - obstacle.depth / 2,
        obstacle.z + obstacle.depth / 2,
      );
      return Math.hypot(x - nearestX, z - nearestZ) < radius;
    })
  )
    return false;
  // Livestock and wildlife have physical bodies: the farmer must walk around
  // them, except for the horse currently being ridden.
  if (
    cattle.some(
      (cow) => Math.hypot(x - cow.position.x, z - cow.position.z) < radius + 0.72,
    )
  )
    return false;
  if (
    [...marketAnimals, ...wildAnimals].some(
      (animal) =>
        animal.visible &&
        animal !== ridingHorse &&
        Math.hypot(x - animal.position.x, z - animal.position.z) <
          radius +
            (animal.userData.kind === "horse" || animal.userData.kind === "bear"
              ? 0.68
              : 0.55),
    )
  )
    return false;
  if (
    vegetableGardens.some(
      (garden) => Math.hypot(x - garden.position.x, z - garden.position.z) < radius + 1.1,
    )
  )
    return false;
  if (
    baleObjects.some(
      (bale) => Math.hypot(x - bale.position.x, z - bale.position.z) < radius + 0.48,
    )
  )
    return false;
  // Parked vehicles are solid too, but do not block the player while driving one.
  if (!driving) {
    const vehicleCollisionRadii = [
      [tractor, 1.05],
      [harvester, 1.35],
      [planter, 1.05],
      [loader, 1.05],
    ] as const;
    if (
      vehicleCollisionRadii.some(
        ([vehicle, vehicleRadius]) =>
          Math.hypot(x - vehicle.position.x, z - vehicle.position.z) < radius + vehicleRadius,
      )
    )
      return false;
  }
  return true;
}

// Try several positions around a vehicle before placing the farmer outside it.
// A fixed offset can land inside a wheel, a wall, or another parked vehicle.
function findVehicleExitPosition(vehicle: THREE.Object3D) {
  const distances = [1.8, 2.4, 3];
  const angleOffsets = [
    Math.PI / 2,
    -Math.PI / 2,
    Math.PI,
    0,
    (3 * Math.PI) / 4,
    (-3 * Math.PI) / 4,
    Math.PI / 4,
    -Math.PI / 4,
  ];

  for (const distance of distances) {
    for (const offset of angleOffsets) {
      const angle = vehicle.rotation.y + offset;
      const x = vehicle.position.x + Math.sin(angle) * distance;
      const z = vehicle.position.z + Math.cos(angle) * distance;
      if (canStandAt(x, z))
        return new THREE.Vector3(x, playerGroundY(x, z), z);
    }
  }
  return null;
}
const baleStack = new THREE.Group();
baleStack.position.set(3.25, yWorld(3.25, -28.9) + 0.05, -28.9);
scene.add(baleStack);
function isBaleOnBarnStack(bale: THREE.Mesh) {
  return Math.hypot(
    bale.position.x - baleStack.position.x,
    bale.position.z - baleStack.position.z,
  ) < 1.35;
}
// The southwest quarter is dedicated to one large working field.
const soil = new THREE.MeshStandardMaterial({ color: 0x704a2d, roughness: 1 }),
  darkSoil = new THREE.MeshStandardMaterial({ color: 0x4d301f, roughness: 1 }),
  waterMat = new THREE.MeshStandardMaterial({
    color: 0x4b9fbb,
    roughness: 0.35,
    metalness: 0.1,
  });
const fieldX = -21,
  fieldZ = -21,
  fieldW = 36,
  fieldD = 36,
  fieldY = yWorld(fieldX, fieldZ),
  wheatPlants: THREE.Mesh[] = [];
addBox(soil, fieldX, fieldY + 0.035, fieldZ, fieldW, 0.09, fieldD);
for (let row = -fieldD / 2 + 0.65; row < fieldD / 2; row += 0.8) {
  addBox(
    darkSoil,
    fieldX,
    fieldY + 0.095,
    fieldZ + row,
    fieldW - 0.5,
    0.06,
    0.15,
  );
  for (let col = -fieldW / 2 + 0.75; col < fieldW / 2; col += 1.6) {
    const plant = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.72, 5), hay);
    plant.position.set(
      fieldX + col + (Math.random() - 0.5) * 0.12,
      fieldY + 0.43,
      fieldZ + row,
    );
    plant.rotation.z = (Math.random() - 0.5) * 0.18;
    plant.rotation.y = Math.random() * Math.PI;
    plant.userData.baseY = fieldY + 0.43;
    plant.userData.row = row;
    plant.castShadow = true;
    scene.add(plant);
    wheatPlants.push(plant);
  }
}
// Irrigation splits the huge field into manageable plots.
addBox(waterMat, fieldX, fieldY + 0.05, fieldZ, 0.32, 0.05, fieldD - 0.6);
addBox(waterMat, fieldX, fieldY + 0.05, fieldZ + 9, fieldW - 0.6, 0.05, 0.28);
fenceLine(fieldX - fieldW / 2, fieldZ - fieldD / 2, 41, false);
fenceLine(fieldX - fieldW / 2, fieldZ - fieldD / 2, 41, true);
fenceLine(fieldX + fieldW / 2, fieldZ - fieldD / 2, 41, true);
fenceLine(fieldX - fieldW / 2, fieldZ + fieldD / 2, 41, false, 37);
// Pasture: a broad grass pen with room for a larger grazing herd.
const pasture = { minX: 5, maxX: 24.8, minZ: 3, maxZ: 16.5 };
fenceLine(pasture.minX, pasture.minZ, 23, false, 7);
fenceLine(pasture.minX, pasture.minZ, 16, true);
fenceLine(pasture.maxX, pasture.minZ, 16, true);
fenceLine(pasture.minX, pasture.maxZ, 23, false);
const cowWhite = new THREE.MeshStandardMaterial({ color: 0xf4f1e8, roughness: 0.9 });
const cowBlack = new THREE.MeshStandardMaterial({ color: 0x1e2020, roughness: 0.92 });
const cowMuzzle = new THREE.MeshStandardMaterial({ color: 0x6c5d60, roughness: 0.95 });
const cowUdder = new THREE.MeshStandardMaterial({ color: 0xff9eae, roughness: 0.82 });
const cattle: THREE.Group[] = [];
for (const [cowIndex, [x, z]] of [
  [7, 5],
  [10, 7],
  [13, 5.5],
  [8, 9.5],
  [16, 4.8],
  [19, 7.2],
  [22, 5.6],
  [15, 10.5],
  [19, 12.2],
  [22, 14.2],
  [10, 13.2],
  [6.8, 14.8],
].entries()) {
  const cow = new THREE.Group();
  // A cow's mass runs from shoulder to rump; keeping that axis aligned with the
  // face makes the silhouette read as an animal rather than a round ornament.
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 12, 10),
    cowWhite,
  );
  body.position.set(0, 0.69, -0.05);
  body.scale.set(1.12, 1.08, 1.62);
  const shoulder = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 10, 8),
    cowWhite,
  );
  shoulder.position.set(0, 0.72, 0.48);
  shoulder.scale.set(1.05, 1.12, 0.85);
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.27, 0.42, 10),
    cowWhite,
  );
  neck.position.set(0, 0.82, 0.67);
  neck.rotation.x = Math.PI / 2.8;
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.27, 10, 8),
    cowWhite,
  );
  head.position.set(0, 0.88, 0.96);
  head.scale.set(0.86, 1.05, 1.18);
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), cowMuzzle);
  muzzle.position.set(0, 0.79, 1.19);
  muzzle.scale.set(1.05, 0.68, 0.82);
  const headParts: THREE.Object3D[] = [head, muzzle];
  const cowLegs: {
    upper: THREE.Mesh;
    lower: THREE.Mesh;
    upperZ: number;
    lowerZ: number;
  }[] = [];
  cow.add(body, shoulder, neck, head, muzzle);
  // Staggered, slightly tapered legs give the animal a stable natural stance.
  for (const [legX, legZ, kneeX] of [[-0.35, -0.52, -0.03], [0.35, -0.52, 0.03], [-0.36, 0.48, 0.025], [0.36, 0.48, -0.025]]) {
    const upperLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.3, 8), cowWhite);
    upperLeg.position.set(legX, 0.43, legZ);
    upperLeg.rotation.z = kneeX * 1.5;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.34, 8), cowWhite);
    leg.position.set(legX + kneeX, 0.14, legZ + 0.025);
    leg.rotation.z = -kneeX;
    const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.1, 8), cowBlack);
    hoof.position.set(legX + kneeX, -0.04, legZ + 0.065);
    hoof.scale.set(1, 0.65, 1.28);
    cowLegs.push({
      upper: upperLeg,
      lower: leg,
      upperZ: upperLeg.position.z,
      lowerZ: leg.position.z,
    });
    cow.add(upperLeg, leg, hoof);
  }
  for (const xOffset of [-0.2, 0.2]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), cowWhite);
    ear.position.set(xOffset * 1.25, 1.05, 0.95);
    ear.scale.set(1.45, 0.36, 0.68);
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.18, 6), cowMuzzle);
    horn.position.set(xOffset, 1.15, 0.92);
    horn.rotation.x = -0.75;
    headParts.push(ear, horn);
    cow.add(ear, horn);
  }
  const tail = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.74, -0.73),
        new THREE.Vector3(0.04, 0.57, -0.91),
        new THREE.Vector3(-0.04, 0.31, -1.02),
        new THREE.Vector3(0.02, 0.14, -0.98),
      ]),
      12,
      0.028,
      6,
      false,
    ),
    cowWhite,
  );
  const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 7, 6), cowBlack);
  tailTip.position.set(0.02, 0.11, -0.98);
  cow.add(tail, tailTip);
  const udder = new THREE.Mesh(new THREE.SphereGeometry(0.19, 10, 8), cowUdder);
  udder.position.set(0, 0.3, -0.32);
  udder.scale.set(1.22, 0.7, 1.15);
  cow.add(udder);
  for (const [teatX, teatZ] of [[-0.09, -0.4], [0.09, -0.4], [-0.09, -0.24], [0.09, -0.24]]) {
    const teat = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.035, 0.09, 4, 6),
      cowUdder,
    );
    teat.position.set(teatX, 0.2, teatZ);
    cow.add(teat);
  }
  // Paper-thin decal meshes sit tangent to the hide, avoiding the raised,
  // pebble-like spots created by flattened spheres.
  for (const [spotY, spotZ, spotSize] of [[0.72, -0.3, 0.2], [0.84, 0.26, 0.16], [0.96, -0.02, 0.13]]) {
    for (const side of [-1, 1]) {
      const spot = new THREE.Mesh(new THREE.CircleGeometry(spotSize, 9), cowBlack);
      spot.position.set(side * 0.51, spotY, spotZ);
      spot.rotation.y = side * Math.PI / 2;
      spot.scale.set(1 + (cowIndex % 2) * 0.25, 0.8, 1);
      cow.add(spot);
    }
  }
  const facePatch = new THREE.Mesh(new THREE.CircleGeometry(0.11, 8), cowBlack);
  facePatch.position.set(cowIndex % 2 ? -0.1 : 0.1, 0.93, 1.265);
  facePatch.scale.set(0.75, 1, 0.18);
  headParts.push(facePatch);
  cow.add(facePatch);
  cow.position.set(x, yWorld(x, z), z);
  cow.rotation.y = Math.random() * Math.PI;
  cow.userData.grazeParts = headParts.map((part) => ({
    part,
    y: part.position.y,
    z: part.position.z,
  }));
  cow.userData.legs = cowLegs;
  cow.userData.target = new THREE.Vector2(x, z);
  cow.userData.state = "grazing";
  cow.userData.stateTimer = 1 + Math.random() * 4;
  cow.userData.speed = 0.28 + Math.random() * 0.12;
  cow.userData.milkedToday = false;
  cow.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  scene.add(cow);
  cattle.push(cow);
}
const wildAnimals: THREE.Group[] = [];
function addWildAnimal(kind: "wolf" | "bear", x: number, z: number) {
  const animal = new THREE.Group();
  const bear = kind === "bear";
  const fur = new THREE.MeshStandardMaterial({
    color: bear ? 0x4a3025 : 0x69706b,
    roughness: 1,
  });
  const darkFur = new THREE.MeshStandardMaterial({ color: 0x1b1b1a, roughness: 1 });
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(bear ? 0.72 : 0.43, 12, 9),
    fur,
  );
  body.position.y = bear ? 0.78 : 0.58;
  body.scale.set(bear ? 1 : 0.9, bear ? 0.95 : 0.82, bear ? 1.35 : 1.65);
  animal.add(body);
  const headPivot = new THREE.Group();
  headPivot.position.set(0, bear ? 1.06 : 0.76, bear ? 0.64 : 0.52);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(bear ? 0.38 : 0.27, 10, 8),
    fur,
  );
  head.position.set(0, bear ? 0.2 : 0.14, bear ? 0.3 : 0.26);
  const muzzle = new THREE.Mesh(
    new THREE.SphereGeometry(bear ? 0.17 : 0.12, 9, 7),
    darkFur,
  );
  muzzle.position.set(0, bear ? 0.09 : 0.04, bear ? 0.59 : 0.48);
  headPivot.add(head, muzzle);
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(
      new THREE.ConeGeometry(bear ? 0.12 : 0.1, bear ? 0.2 : 0.24, 7),
      fur,
    );
    ear.position.set(side * (bear ? 0.21 : 0.16), bear ? 0.5 : 0.4, bear ? 0.2 : 0.15);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 7, 6), darkFur);
    eye.position.set(side * (bear ? 0.22 : 0.16), bear ? 0.25 : 0.2, bear ? 0.46 : 0.38);
    headPivot.add(ear, eye);
  }
  animal.add(headPivot);
  const legs: THREE.Group[] = [];
  const legHeight = bear ? 0.72 : 0.52;
  for (const [legX, legZ] of [[-0.32, -0.42], [0.32, -0.42], [-0.32, 0.42], [0.32, 0.42]]) {
    const leg = new THREE.Group();
    leg.position.set(legX * (bear ? 1.35 : 1), legHeight, legZ * (bear ? 1.3 : 1));
    const limb = new THREE.Mesh(
      new THREE.CylinderGeometry(bear ? 0.12 : 0.075, bear ? 0.1 : 0.065, legHeight, 7),
      fur,
    );
    limb.position.y = -legHeight / 2;
    const paw = new THREE.Mesh(new THREE.BoxGeometry(bear ? 0.23 : 0.15, 0.09, bear ? 0.3 : 0.22), darkFur);
    paw.position.set(0, -legHeight + 0.045, 0.04);
    leg.add(limb, paw);
    animal.add(leg);
    legs.push(leg);
  }
  const tail = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, bear ? 0.82 : 0.7, bear ? -0.9 : -0.72),
        new THREE.Vector3(0, bear ? 0.68 : 0.55, bear ? -1.02 : -1.03),
        new THREE.Vector3(0.06, bear ? 0.54 : 0.44, bear ? -0.92 : -1.12),
      ]),
      10,
      bear ? 0.07 : 0.055,
      6,
      false,
    ),
    fur,
  );
  animal.add(tail);
  animal.position.set(x, yWorld(x, z), z);
  animal.rotation.y = Math.random() * Math.PI * 2;
  animal.userData.kind = kind;
  animal.userData.home = new THREE.Vector2(x, z);
  animal.userData.target = new THREE.Vector2(x, z);
  animal.userData.roamTimer = 2 + Math.random() * 5;
  animal.userData.speed = bear ? 0.72 : 1.05;
  animal.userData.head = headPivot;
  animal.userData.legs = legs;
  animal.userData.tail = tail;
  animal.userData.attackTime = 0;
  animal.userData.killsTonight = 0;
  animal.traverse((object) => {
    if (object instanceof THREE.Mesh) object.castShadow = true;
  });
  scene.add(animal);
  wildAnimals.push(animal);
}
addWildAnimal("wolf", -24, 11);
addWildAnimal("wolf", -19, 17);
addWildAnimal("bear", -37, 25);
// Dense woodland occupies the west of the valley.
for (let x = -27; x <= -14; x += 1.5)
  for (let z = 6; z <= 20; z += 1.6) {
    if (Math.random() > 0.22)
      tree(
        x + (Math.random() - 0.5) * 0.5,
        z + (Math.random() - 0.5) * 0.5,
        0.85 + Math.random() * 0.65,
      );
  }
// A mountain wall frames the playable map on every side.
const mountainMat = new THREE.MeshStandardMaterial({
  color: 0x586866,
  flatShading: true,
});
for (let i = -55; i <= 55; i += 6) {
  for (const [x, z] of [
    [i, -55],
    [i, 55],
    [-55, i],
    [55, i],
  ]) {
    const peak = new THREE.Mesh(
      new THREE.ConeGeometry(3.8 + Math.random() * 2, 8 + Math.random() * 6, 7),
      mountainMat,
    );
    peak.position.set(x, -0.4, z);
    peak.rotation.y = Math.random();
    peak.castShadow = true;
    scene.add(peak);
  }
}
const beacon = new THREE.Group();
const millBase = new THREE.Mesh(
  new THREE.CylinderGeometry(1.5, 1.8, 5, 8),
  new THREE.MeshStandardMaterial({ color: 0xe6dfc8 }),
);
millBase.position.y = 2.5;
beacon.add(millBase);
const roof = new THREE.Mesh(new THREE.ConeGeometry(1.95, 1.7, 8), farmWood);
roof.position.y = 5.8;
beacon.add(roof);
const sails = new THREE.Group();
for (let i = 0; i < 4; i++) {
  const blade = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 3.4, 0.1),
    new THREE.MeshStandardMaterial({ color: 0xe9dbc0 }),
  );
  blade.position.y = 1.55;
  blade.rotation.z = (i * Math.PI) / 2;
  sails.add(blade);
}
sails.position.set(0, 5.1, -1.55);
beacon.add(sails);
beacon.userData.sails = sails;
beacon.position.set(27, yWorld(27, -22), -22);
scene.add(beacon);
const hero = new THREE.Group(),
  denim = new THREE.MeshStandardMaterial({ color: 0x2460ad, roughness: 0.8 }),
  flannel = new THREE.MeshStandardMaterial({
    color: 0x2767b5,
    roughness: 0.85,
  }),
  leather = new THREE.MeshStandardMaterial({
    color: 0x6d4228,
    roughness: 0.85,
  }),
  skin = new THREE.MeshStandardMaterial({ color: 0xf0bd91, roughness: 0.8 }),
  boot = new THREE.MeshStandardMaterial({ color: 0x2b211d, roughness: 0.9 }),
  darkHair = new THREE.MeshStandardMaterial({
    color: 0x34251e,
    roughness: 0.9,
  }),
  eyeMat = new THREE.MeshStandardMaterial({ color: 0x263749, roughness: 0.45 }),
  beardMat = new THREE.MeshStandardMaterial({ color: 0x704631, roughness: 1 });
const coat = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.26, 0.68, 6, 10),
  flannel,
);
coat.position.y = 0.72;
const jeansWaist = new THREE.Mesh(
  new THREE.CylinderGeometry(0.27, 0.27, 0.18, 12),
  denim,
);
jeansWaist.position.y = 0.52;
const belt = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.024, 6, 16), leather);
belt.position.set(0, 0.62, 0);
belt.rotation.x = Math.PI / 2;
const buckle = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 0.08, 0.025),
  new THREE.MeshStandardMaterial({
    color: 0xd3a33c,
    metalness: 0.45,
    roughness: 0.4,
  }),
);
buckle.position.set(0, 0.62, -0.275);
const neck = new THREE.Mesh(
  new THREE.CylinderGeometry(0.11, 0.12, 0.16, 9),
  skin,
);
neck.position.y = 1.14;
const head = new THREE.Mesh(new THREE.SphereGeometry(0.235, 12, 10), skin);
head.position.y = 1.31;
const nose = new THREE.Mesh(new THREE.SphereGeometry(0.045, 7, 6), skin);
nose.position.set(0, 1.29, -0.225);
const hair = new THREE.Mesh(
  new THREE.SphereGeometry(0.24, 12, 7, 0, Math.PI * 2, 0, Math.PI * 0.48),
  darkHair,
);
hair.position.y = 1.4;
const beard = new THREE.Mesh(
  new THREE.SphereGeometry(
    0.205,
    10,
    7,
    0,
    Math.PI,
    Math.PI * 0.45,
    Math.PI * 0.55,
  ),
  beardMat,
);
beard.position.set(0, 1.23, -0.035);
beard.scale.set(1, 1, 0.92);
const mustache = new THREE.Group();
for (const x of [-0.065, 0.065]) {
  const curl = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), beardMat);
  curl.position.set(x, 1.265, -0.23);
  curl.scale.set(1.15, 0.38, 0.4);
  curl.rotation.z = x < 0 ? -0.22 : 0.22;
  mustache.add(curl);
}
for (const x of [-0.075, 0.075]) {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.026, 7, 6), eyeMat);
  eye.position.set(x, 1.34, -0.21);
  const brow = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.018, 0.018),
    darkHair,
  );
  brow.position.set(x, 1.385, -0.205);
  brow.rotation.z = x < 0 ? 0.12 : -0.12;
  hero.add(eye, brow);
}
for (const x of [-0.235, 0.235]) {
  const ear = new THREE.Mesh(new THREE.SphereGeometry(0.052, 7, 6), skin);
  ear.position.set(x, 1.31, 0);
  hero.add(ear);
}
const hatBrim = new THREE.Mesh(
  new THREE.CylinderGeometry(0.4, 0.4, 0.055, 20),
  leather,
);
hatBrim.position.y = 1.53;
const hatCrown = new THREE.Mesh(
  new THREE.CylinderGeometry(0.18, 0.25, 0.3, 14),
  leather,
);
hatCrown.position.y = 1.69;
const hatBand = new THREE.Mesh(
  new THREE.CylinderGeometry(0.255, 0.255, 0.055, 14),
  new THREE.MeshStandardMaterial({ color: 0xc19a4a, metalness: 0.15 }),
);
hatBand.position.y = 1.59;
const legs: THREE.Group[] = [];
for (const x of [-0.125, 0.125]) {
  const leg = new THREE.Group();
  leg.position.set(x, 0.63, 0);
  const jeans = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.12, 0.62, 10),
    denim,
  );
  jeans.position.y = -0.31;
  const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.29), boot);
  shoe.position.set(0, -0.55, -0.06);
  leg.add(jeans, shoe);
  legs.push(leg);
  hero.add(leg);
}
const arms: THREE.Group[] = [];
for (const x of [-0.32, 0.32]) {
  const armGroup = new THREE.Group();
  armGroup.position.set(x, 1, 0);
  armGroup.rotation.z = x < 0 ? 0.12 : -0.12;
  const arm = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.07, 0.4, 5, 7),
    flannel,
  );
  arm.position.y = -0.2;
  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 7), skin);
  hand.position.set(0, -0.45, -0.02);
  armGroup.add(arm, hand);
  arms.push(armGroup);
  hero.add(armGroup);
}
const rifleModel = new THREE.Group();
const rifleWood = new THREE.MeshStandardMaterial({ color: 0x5d3823, roughness: 0.88 });
const rifleMetal = new THREE.MeshStandardMaterial({ color: 0x293238, metalness: 0.7, roughness: 0.35 });
const rifleStock = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.36), rifleWood);
rifleStock.position.set(0, 0, -0.12);
const rifleBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.54, 8), rifleMetal);
rifleBarrel.rotation.x = Math.PI / 2;
rifleBarrel.position.set(0, 0.035, -0.53);
const rifleSight = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.04, 0.11), rifleMetal);
rifleSight.position.set(0, 0.08, -0.35);
rifleModel.add(rifleStock, rifleBarrel, rifleSight);
rifleModel.position.set(0.27, 0.8, -0.27);
rifleModel.rotation.set(0.08, -0.08, -0.08);
rifleModel.visible = false;
rifleModel.traverse((object) => {
  if (object instanceof THREE.Mesh) object.castShadow = true;
});
hero.add(rifleModel);
const milkBucket = new THREE.Group();
const bucketMetal = new THREE.MeshStandardMaterial({
  color: 0x9eabb0,
  metalness: 0.7,
  roughness: 0.3,
});
const bucket = new THREE.Mesh(
  new THREE.CylinderGeometry(0.16, 0.13, 0.26, 12, 1, true),
  bucketMetal,
);
bucket.position.y = 0.13;
const bucketMilk = new THREE.Mesh(
  new THREE.CylinderGeometry(0.125, 0.125, 0.015, 12),
  new THREE.MeshStandardMaterial({ color: 0xfff8df, roughness: 0.55 }),
);
bucketMilk.position.y = 0.24;
bucketMilk.visible = false;
const bucketHandle = new THREE.Mesh(
  new THREE.TorusGeometry(0.14, 0.018, 6, 12, Math.PI),
  bucketMetal,
);
bucketHandle.position.set(0, 0.26, 0);
bucketHandle.rotation.x = Math.PI / 2;
milkBucket.add(bucket, bucketMilk, bucketHandle);
// The bucket begins on the refrigerator's lower shelf, ready to be picked up.
const fridgePosition = (refrigerator as THREE.Group | null)?.position;
if (fridgePosition) {
  milkBucket.position.copy(fridgePosition).add(new THREE.Vector3(0, 0.06, -0.18));
} else {
  milkBucket.position.set(7.3, yWorld(7.3, -6.2) + 0.01, -6.2);
}
hero.add(
  coat,
  jeansWaist,
  belt,
  buckle,
  neck,
  head,
  nose,
  hair,
  beard,
  mustache,
  hatBrim,
  hatCrown,
  hatBand,
);
hero.position.set(0, yWorld(0, 0), 0);
hero.traverse((o) => {
  if (o instanceof THREE.Mesh) o.castShadow = true;
});
scene.add(hero);
// A small basket of freshly picked vegetables is carried in front of the
// farmer's hands until it is stored or fed to a pig.
const vegetableBundle = new THREE.Group();
const basketMaterial = new THREE.MeshStandardMaterial({
  color: 0x8b5a2b,
  roughness: 0.95,
});
const carrotMaterial = new THREE.MeshStandardMaterial({
  color: 0xe8782d,
  roughness: 0.85,
});
const leafMaterial = new THREE.MeshStandardMaterial({
  color: 0x3f852f,
  roughness: 0.9,
});
const vegetableBasket = new THREE.Mesh(
  new THREE.BoxGeometry(0.36, 0.16, 0.25),
  basketMaterial,
);
vegetableBasket.position.y = 0.04;
vegetableBundle.add(vegetableBasket);
for (const [x, z, tilt] of [
  [-0.1, -0.04, -0.4],
  [0.02, -0.07, 0.1],
  [0.11, 0.03, 0.45],
] as const) {
  const carrot = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.21, 7), carrotMaterial);
  carrot.position.set(x, 0.19, z);
  carrot.rotation.z = tilt;
  const leaves = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.14, 5), leafMaterial);
  leaves.position.set(x, 0.33, z);
  leaves.rotation.z = tilt;
  vegetableBundle.add(carrot, leaves);
}
vegetableBundle.position.set(0.32, 0.55, -0.42);
vegetableBundle.rotation.set(0.08, -0.18, 0.04);
vegetableBundle.visible = false;
vegetableBundle.traverse((object) => {
  if (object instanceof THREE.Mesh) object.castShadow = true;
});
hero.add(vegetableBundle);
scene.add(milkBucket);
const milkStream = new THREE.Mesh(
  new THREE.CylinderGeometry(0.022, 0.022, 0.45, 6),
  new THREE.MeshStandardMaterial({ color: 0xfff8df, emissive: 0x443d29 }),
);
milkStream.visible = false;
scene.add(milkStream);
const keys = new Set<string>();
let vy = 0,
  shardCount = 1,
  interacted = false,
  orbitYaw = 0.55,
  orbitPitch = 0.55,
  dragging = false,
  lastX = 0,
  lastY = 0,
  lastRightClick = 0,
  wheat = 0,
  milk = 0,
  chilledMilk = 0,
  fridgeVegetables = 0,
  carriedVegetables = 0,
  carryingFridgeVegetable = false,
  cattleCare = 50,
  ripePlots = 45,
  farmDay = 1,
  cropMaturity = 1,
  driving = false,
  usingHarvester = false,
  usingPlanter = false,
  usingLoader = false,
  lastCut = 0,
  looseStraw = 0,
  bales = 0,
  fedBales = 0,
  coins = 0,
  dayElapsed = 0,
  storedBales = 0,
  sheep = 0,
  pigs = 0,
  vegetablePlots = 0,
  horses = 0,
  wideHeader = false,
  fastBaler = false,
  tractorEngine = false,
  hasRifle = false,
  selectedFarmer: "avery" | "rowan" | "sage" = "avery",
  gameStarted = false,
  pendingVegetablePlot = false;
const homeScreen = document.querySelector<HTMLElement>("#homeScreen")!;
const startFarmButton = document.querySelector<HTMLButtonElement>("#startFarm")!;
const farmerChoices = [...document.querySelectorAll<HTMLButtonElement>("[data-farmer]")];
function applyFarmerStyle(farmer: "avery" | "rowan" | "sage") {
  selectedFarmer = farmer;
  const styles = {
    avery: { shirt: 0x2767b5, jeans: 0x2460ad, hat: 0x6d4228, skin: 0xf0bd91, hair: 0x34251e },
    rowan: { shirt: 0xa7473c, jeans: 0x344f79, hat: 0x4d2b20, skin: 0xc98b67, hair: 0x2b1b16 },
    sage: { shirt: 0x4c7d58, jeans: 0x3d6170, hat: 0x775b2d, skin: 0xe0aa7d, hair: 0x3d2921 },
  } as const;
  const style = styles[farmer];
  flannel.color.setHex(style.shirt);
  denim.color.setHex(style.jeans);
  leather.color.setHex(style.hat);
  skin.color.setHex(style.skin);
  darkHair.color.setHex(style.hair);
  farmerChoices.forEach((choice) =>
    choice.classList.toggle("selected", choice.dataset.farmer === farmer),
  );
}
farmerChoices.forEach((choice) =>
  choice.addEventListener("click", () => applyFarmerStyle(choice.dataset.farmer as "avery" | "rowan" | "sage")),
);
startFarmButton.addEventListener("click", () => {
  gameStarted = true;
  homeScreen.hidden = true;
  toast.textContent = `Welcome, ${selectedFarmer[0].toUpperCase()}${selectedFarmer.slice(1)}. Your farm is ready.`;
});
let milkingCow: THREE.Group | null = null,
  milkingElapsed = 0,
  hasMilkBucket = false,
  resting: "sitting" | "lying" | null = null,
  ridingHorse: THREE.Group | null = null;
const couchSpot = new THREE.Vector2(10, -6.45);
const bedSpot = new THREE.Vector2(7.4, -2.95);
function mountHorse(horse: THREE.Group) {
  ridingHorse = horse;
  horse.userData.ridden = true;
  horse.userData.feedBale = undefined;
  hero.position.set(horse.position.x, horse.position.y + 1.47, horse.position.z);
  hero.rotation.y = horse.rotation.y - Math.PI;
  vy = 0;
  toast.textContent = "You mount the horse. Use the arrow keys to ride faster; press E to dismount.";
}
function dismountHorse() {
  if (!ridingHorse) return;
  const horse = ridingHorse;
  const side = new THREE.Vector3(1.25, 0, 0).applyAxisAngle(
    new THREE.Vector3(0, 1, 0),
    horse.rotation.y,
  );
  const options = [
    side,
    side.clone().multiplyScalar(-1),
    new THREE.Vector3(0, 0, -1.35).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      horse.rotation.y,
    ),
  ];
  const exit = options
    .map(
      (offset) =>
        new THREE.Vector3(
          horse.position.x + offset.x,
          0,
          horse.position.z + offset.z,
        ),
    )
    .find((position) => canStandAt(position.x, position.z));
  if (!exit) {
    toast.textContent = "There is no clear space to dismount here.";
    return;
  }
  horse.userData.ridden = false;
  ridingHorse = null;
  hero.position.set(exit.x, playerGroundY(exit.x, exit.z), exit.z);
  hero.rotation.y = horse.rotation.y - Math.PI;
  toast.textContent = "You dismount the horse.";
}
function restOnFurniture(mode: "sitting" | "lying") {
  resting = mode;
  vy = 0;
  if (mode === "sitting") {
    // Sit naturally on the couch with both feet resting on the floor.
    hero.position.set(
      couchSpot.x,
      playerGroundY(couchSpot.x, couchSpot.y) + 0.25,
      couchSpot.y,
    );
    hero.rotation.set(0, Math.PI, 0);
    legs.forEach((leg) => (leg.rotation.x = 0));
    arms.forEach((arm) => (arm.rotation.x = 0.35));
    toast.textContent = "The farmer sits down on the couch. Press E to stand.";
  } else {
    hero.position.set(bedSpot.x, playerGroundY(bedSpot.x, bedSpot.y) + 0.92, bedSpot.y);
    hero.rotation.set(Math.PI / 2, 0, 0);
    legs.forEach((leg) => (leg.rotation.x = 0));
    arms.forEach((arm) => (arm.rotation.x = 0));
    toast.textContent = "The farmer lies down on the bed. Press E to get up.";
  }
}
function standUp() {
  const previousRest = resting;
  resting = null;
  hero.rotation.set(0, 0, 0);
  if (previousRest === "sitting") hero.position.z = couchSpot.y - 0.85;
  if (previousRest === "lying") hero.position.z = bedSpot.y - 1.15;
  hero.position.y = playerGroundY(hero.position.x, hero.position.z);
  legs.forEach((leg) => (leg.rotation.x = 0));
  arms.forEach((arm) => (arm.rotation.x = 0));
  toast.textContent = "The farmer stands up.";
}
const DAY_LENGTH_SECONDS = 20 * 60;
const NIGHT_LENGTH_SECONDS = 5 * 60;
const FULL_CYCLE_SECONDS = DAY_LENGTH_SECONDS + NIGHT_LENGTH_SECONDS;
let carriedBale: THREE.Mesh | null = null,
  lastDroppedBale: THREE.Mesh | null = null;
const baleObjects: THREE.Mesh[] = [],
  lastCutPosition = new THREE.Vector3(999, 999, 999),
  lastPlantPosition = new THREE.Vector3(999, 999, 999),
  fallenWheat: {
    mesh: THREE.Group;
    velocity: THREE.Vector3;
    settled: boolean;
  }[] = [];
const toast = document.querySelector("#toast")!,
  questText = document.querySelector("#questText")!,
  shardLabel = document.querySelector("#shards")!,
  location = document.querySelector("#location")!,
  wheatLabel = document.querySelector("#wheat")!,
  milkLabel = document.querySelector("#milk")!,
  vegetablesLabel = document.querySelector("#vegetables")!,
  pigMealsLabel = document.querySelector("#pigMeals")!,
  careLabel = document.querySelector("#care")!,
  plotsLabel = document.querySelector("#plots")!,
  balesLabel = document.querySelector("#bales")!,
  fedBalesLabel = document.querySelector("#fedBales")!,
  coinsLabel = document.querySelector("#coins")!,
  farmStockLabel = document.querySelector("#farmStock")!,
  dayTimerLabel = document.querySelector("#dayTimer")!,
  storedLabel = document.querySelector("#stored")!,
  milkPrompt = document.querySelector<HTMLElement>("#milkPrompt")!,
  saveButton = document.querySelector<HTMLButtonElement>("#saveButton")!,
  restartButton = document.querySelector<HTMLButtonElement>("#restartButton")!;
function refreshFarm() {
  wheatLabel.textContent = String(wheat);
  milkLabel.textContent = `${milk} pail / ${chilledMilk} fridge`;
  vegetablesLabel.textContent = `${carriedVegetables} carried / ${fridgeVegetables} fridge`;
  vegetableBundle.visible = carriedVegetables > 0;
  const fedPigs = marketAnimals.filter(
    (animal) => animal.userData.kind === "pig" && animal.userData.fedDay === farmDay,
  ).length;
  pigMealsLabel.textContent = `${fedPigs} / ${pigs}`;
  careLabel.textContent = `${cattleCare}%`;
  plotsLabel.textContent = String(ripePlots);
  balesLabel.textContent = String(bales);
  fedBalesLabel.textContent = `${fedBales} / 3`;
  coinsLabel.textContent = String(coins);
  farmStockLabel.textContent = String(sheep + pigs + vegetablePlots + horses);
  storedLabel.textContent = String(storedBales);
  shardLabel.textContent = String(shardCount);
}
type FarmMarketItem = "sheep" | "pig" | "vegetables" | "horse";
type UpgradeMarketItem = "wideHeader" | "fastBaler" | "tractorEngine";
type VehicleMarketItem = "houseTractor" | "fieldTractor" | "barnTractor";
type DefenseMarketItem = "rifle";
type MarketItem = FarmMarketItem | UpgradeMarketItem | VehicleMarketItem | DefenseMarketItem;
const marketOffers: Record<MarketItem, { price: number; label: string }> = {
  sheep: { price: 80, label: "sheep" },
  pig: { price: 100, label: "pig" },
  vegetables: { price: 40, label: "vegetable plot" },
  horse: { price: 200, label: "horse" },
  wideHeader: { price: 225, label: "wide combine header" },
  fastBaler: { price: 180, label: "power baler" },
  tractorEngine: { price: 160, label: "tractor engine" },
  rifle: { price: 300, label: "rifle" },
  houseTractor: { price: 275, label: "yard tractor" },
  fieldTractor: { price: 350, label: "field tractor" },
  barnTractor: { price: 325, label: "barn tractor" },
};
const marketNote = document.querySelector("#marketNote")!;
const marketAnimals: THREE.Group[] = [];
const deliveredVehicles = new Set<VehicleMarketItem>();
const vegetablePlotPositions: THREE.Vector2[] = [];
const vegetableGardens: THREE.Group[] = [];

function addMarketAnimal(kind: "sheep" | "pig" | "horse", number: number) {
  const animal = new THREE.Group();
  const colors = {
    sheep: 0xf3eee0,
    pig: 0xeaa0a2,
    horse: 0x7b4c32,
  };
  const coat = new THREE.MeshStandardMaterial({ color: colors[kind], roughness: 0.9 });
  const dark = new THREE.MeshStandardMaterial({ color: kind === "pig" ? 0xc77278 : 0x38261e });
  const horse = kind === "horse";
  const headBaseY = horse ? 1.34 : 0.72;
  const headBaseZ = horse ? 0.75 : 0.36;
  const body = new THREE.Mesh(new THREE.SphereGeometry(horse ? 0.55 : 0.42, 12, 9), coat);
  body.position.y = horse ? 0.98 : 0.65;
  body.scale.set(horse ? 1.02 : 1.1, horse ? 0.92 : 0.8, horse ? 1.82 : 1.3);
  const head = new THREE.Mesh(new THREE.SphereGeometry(horse ? 0.3 : 0.22, 10, 8), coat);
  head.position.set(0, horse ? 0.34 : 0.12, horse ? 0.37 : 0.17);
  const snout = new THREE.Mesh(new THREE.SphereGeometry(kind === "pig" ? 0.13 : 0.08, 8, 6), dark);
  snout.position.set(0, horse ? 0.23 : 0.1, horse ? 0.65 : 0.39);
  const headPivot = new THREE.Group();
  headPivot.position.set(0, headBaseY, headBaseZ);
  headPivot.add(head, snout);
  animal.add(body, headPivot);
  const animalLegs: THREE.Group[] = [];
  for (const [x, z] of horse
    ? [[-0.36, -0.55], [0.36, -0.55], [-0.36, 0.55], [0.36, 0.55]]
    : [[-0.28, -0.38], [0.28, -0.38], [-0.28, 0.38], [0.28, 0.38]]) {
    const legHeight = horse ? 0.92 : 0.54;
    const leg = new THREE.Group();
    leg.position.set(x, legHeight, z);
    const lowerLeg = new THREE.Mesh(
      new THREE.BoxGeometry(horse ? 0.13 : 0.14, legHeight, horse ? 0.13 : 0.14),
      horse ? dark : coat,
    );
    lowerLeg.position.y = -legHeight / 2;
    leg.add(lowerLeg);
    if (!horse) {
      const hoof = new THREE.Mesh(
        new THREE.BoxGeometry(0.17, 0.08, 0.2),
        dark,
      );
      hoof.position.set(0, -legHeight + 0.04, z > 0 ? 0.025 : -0.025);
      leg.add(hoof);
    }
    animal.add(leg);
    animalLegs.push(leg);
    if (horse) {
      const hoof = new THREE.Mesh(
        new THREE.BoxGeometry(0.17, 0.12, 0.19),
        new THREE.MeshStandardMaterial({ color: 0x171311, roughness: 1 }),
      );
      hoof.position.set(0, -legHeight + 0.05, z > 0 ? 0.025 : -0.025);
      leg.add(hoof);
    }
  }
  if (horse) {
    // Two overlapping low-poly forms create a broad, natural connection from
    // the shoulders into the head without the old thin, floating neck piece.
    const neck = new THREE.Mesh(new THREE.SphereGeometry(0.36, 12, 9), coat);
    neck.position.set(0, 1.31, 0.62);
    neck.scale.set(0.92, 1.42, 1.02);
    neck.rotation.x = -0.26;
    animal.add(neck);
    const throat = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), coat);
    throat.position.set(0, 1.47, 0.84);
    throat.scale.set(0.86, 1.16, 0.9);
    animal.add(throat);
    const innerEar = new THREE.MeshStandardMaterial({ color: 0x9b6047, roughness: 1 });
    const eyeGlint = new THREE.MeshStandardMaterial({ color: 0xe7d89e, roughness: 0.35 });
    for (const x of [-0.14, 0.14]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.25, 8), coat);
      ear.position.set(x, 0.64, 0.32);
      ear.rotation.x = -0.12;
      const earCenter = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 7), innerEar);
      earCenter.position.set(x, 0.635, 0.34);
      earCenter.rotation.x = -0.12;
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), dark);
      eye.position.set(x * 1.55, 0.41, 0.53);
      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 5), eyeGlint);
      glint.position.set(x * 1.7, 0.425, 0.556);
      headPivot.add(ear, earCenter, eye, glint);
    }
    const blaze = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0xf0dfbf, roughness: 0.9 }),
    );
    blaze.position.set(0, 0.38, 0.63);
    blaze.scale.set(0.65, 1.7, 0.18);
    headPivot.add(blaze);

    const hair = new THREE.MeshStandardMaterial({ color: 0x241812, roughness: 1 });
    const maneGroup = new THREE.Group();
    for (const offset of [-0.09, -0.045, 0, 0.045, 0.09]) {
      const maneStrand = new THREE.Mesh(
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(offset, 0.48, 0.2),
            new THREE.Vector3(offset * 1.45, 0.38, -0.25),
            new THREE.Vector3(offset * 2.1, 0.18, -0.83),
            new THREE.Vector3(offset * 2.8, 0, -1.25),
          ]),
          14,
          0.028,
          6,
          false,
        ),
        hair,
      );
      maneGroup.add(maneStrand);
    }
    // The mane shares the head pivot so it remains anchored while grazing.
    headPivot.add(maneGroup);
    const tailGroup = new THREE.Group();
    for (const offset of [-0.1, -0.05, 0, 0.05, 0.1]) {
      const tailStrand = new THREE.Mesh(
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(offset * 0.45, 1.2, -1.02),
            new THREE.Vector3(offset, 0.92, -1.36),
            new THREE.Vector3(offset * 1.8, 0.52, -1.48),
            new THREE.Vector3(offset * 2.4, 0.25, -1.22),
          ]),
          14,
          0.035,
          6,
          false,
        ),
        hair,
      );
      tailGroup.add(tailStrand);
    }
    animal.add(tailGroup);
    animal.userData.mane = maneGroup;
    animal.userData.tail = tailGroup;
  }
  if (kind === "sheep") {
    for (const [x, z] of [[-0.24, -0.15], [0.24, -0.15], [-0.24, 0.2], [0.24, 0.2]]) {
      const wool = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), coat);
      wool.position.set(x, 0.78, z);
      animal.add(wool);
    }
    const face = new THREE.MeshStandardMaterial({ color: 0x4a3a32, roughness: 1 });
    head.material = face;
    snout.material = face;
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), face);
      ear.position.set(side * 0.18, 0.24, 0.14);
      ear.scale.set(1, 0.35, 0.8);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), dark);
      eye.position.set(side * 0.18, 0.18, 0.29);
      headPivot.add(ear, eye);
    }
  } else if (kind === "pig") {
    const innerEar = new THREE.MeshStandardMaterial({ color: 0xd57982, roughness: 0.95 });
    const pigEye = new THREE.MeshStandardMaterial({ color: 0x251a1b, roughness: 0.8 });
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.24, 6), innerEar);
      ear.position.set(side * 0.18, 0.35, 0.09);
      ear.rotation.z = side * 0.36;
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), pigEye);
      eye.position.set(side * 0.19, 0.19, 0.28);
      const nostril = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 5), pigEye);
      nostril.position.set(side * 0.055, 0.1, 0.39);
      headPivot.add(ear, eye, nostril);
    }
    const curlyTail = new THREE.Mesh(
      new THREE.TorusGeometry(0.12, 0.025, 6, 10, Math.PI * 1.5),
      innerEar,
    );
    curlyTail.position.set(0, 0.8, -0.58);
    curlyTail.rotation.x = Math.PI / 2;
    animal.add(curlyTail);
  }
  const slot = number - 1;
  // Keep purchased animals in the visible, fenced pasture. The old spawn area
  // was beyond the fence, where the procedurally placed trees could hide them.
  const x = 22.7 - (slot % 3) * 2.1;
  const z = 9.6 + Math.floor(slot / 3) * 2.1;
  animal.position.set(x, yWorld(x, z), z);
  animal.rotation.y = kind === "horse" ? Math.PI / 2 : (slot % 2) * Math.PI;
  animal.userData.kind = kind;
  animal.userData.head = headPivot;
  animal.userData.legs = animalLegs;
  animal.userData.target = new THREE.Vector2(x, z);
  animal.userData.state = "grazing";
  animal.userData.stateTimer = 1.5 + Math.random() * 3;
  animal.userData.speed = kind === "horse" ? 0.72 : kind === "pig" ? 0.48 : 0.42;
  animal.traverse((object) => {
    if (object instanceof THREE.Mesh) object.castShadow = true;
  });
  scene.add(animal);
  marketAnimals.push(animal);
}

function addVegetablePlot(x: number, z: number) {
  const plot = new THREE.Group();
  const soil = new THREE.MeshStandardMaterial({ color: 0x654126, roughness: 1 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x4f8f3f, roughness: 0.9 });
  const carrot = new THREE.MeshStandardMaterial({ color: 0xe18132, roughness: 0.85 });
  plot.add(new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.16, 1.5), soil));
  const carrots: THREE.Mesh[] = [];
  const leaves: THREE.Mesh[] = [];
  for (const x of [-0.65, -0.22, 0.22, 0.65])
    for (const z of [-0.35, 0.35]) {
      const vegetable = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 6), carrot);
      vegetable.position.set(x, 0.2, z);
      const leafMesh = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.34, 5), leaf);
      leafMesh.position.set(x, 0.42, z);
      plot.add(vegetable, leafMesh);
      carrots.push(vegetable);
      leaves.push(leafMesh);
    }
  plot.position.set(x, yWorld(x, z), z);
  plot.userData.stage = "ripe";
  plot.userData.carrots = carrots;
  plot.userData.leaves = leaves;
  plot.traverse((object) => {
    if (object instanceof THREE.Mesh) object.castShadow = true;
  });
  scene.add(plot);
  vegetableGardens.push(plot);
}

function interactWithVegetablePlot() {
  const plot = vegetableGardens.find(
    (garden) => garden.position.distanceTo(hero.position) <= 2.2,
  );
  if (!plot) return false;
  const stage = plot.userData.stage as "ripe" | "bare" | "growing";
  const carrots = plot.userData.carrots as THREE.Mesh[];
  const leaves = plot.userData.leaves as THREE.Mesh[];
  if (stage === "ripe") {
    carrots.forEach((carrot) => (carrot.visible = false));
    leaves.forEach((leaf) => (leaf.visible = false));
    plot.userData.stage = "bare";
    carriedVegetables += 4;
    carryingFridgeVegetable = false;
    refreshFarm();
    toast.textContent = "Harvested 4 vegetables. Take them to the fridge and press E to store them.";
    return true;
  }
  if (stage === "growing") {
    toast.textContent = "These vegetables are still growing. They will ripen next day.";
    return true;
  }
  if (fridgeVegetables < 1) {
    toast.textContent = "You need one stored vegetable to plant this garden.";
    return true;
  }
  fridgeVegetables--;
  leaves.forEach((leaf) => (leaf.visible = true));
  carrots.forEach((carrot) => (carrot.visible = false));
  plot.userData.stage = "growing";
  refreshFarm();
  toast.textContent = "Vegetable seeds planted. They will ripen next day.";
  return true;
}

function placeVegetablePlot() {
  if (!pendingVegetablePlot || driving || resting) return;
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(hero.quaternion);
  const x = hero.position.x + forward.x * 1.6;
  const z = hero.position.z + forward.z * 1.6;
  const clear =
    Math.abs(x) < 50 &&
    Math.abs(z) < 50 &&
    canStandAt(x, z, 1.25) &&
    vegetablePlotPositions.every((plot) => plot.distanceTo(new THREE.Vector2(x, z)) > 2.1);
  if (!clear) {
    toast.textContent = "Choose a clear, open patch of ground for the vegetable plot.";
    return;
  }
  vegetablePlots++;
  vegetablePlotPositions.push(new THREE.Vector2(x, z));
  addVegetablePlot(x, z);
  pendingVegetablePlot = false;
  refreshFarm();
  marketNote.textContent = "Vegetable plot planted!";
  toast.textContent = "Fresh vegetables are now growing in your chosen plot.";
}

function replaceFarmVehicle(kind: VehicleMarketItem) {
  const deliveries: Record<VehicleMarketItem, { vehicle: THREE.Group; x: number; z: number; color: number }> = {
    houseTractor: { vehicle: tractor, x: 5, z: -8.8, color: 0xc84535 },
    fieldTractor: { vehicle: planter, x: -3.5, z: -17, color: 0xd5a42d },
    barnTractor: { vehicle: loader, x: 3, z: -25, color: 0x3f7791 },
  };
  const delivery = deliveries[kind];
  const paint = new THREE.MeshStandardMaterial({ color: delivery.color, roughness: 0.65 });
  const upgradeCab = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 0.88), paint);
  upgradeCab.position.set(0, 1.85, 0.35);
  const beacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.11, 0.15, 8),
    new THREE.MeshStandardMaterial({ color: 0xf2c94c, emissive: 0x80500d }),
  );
  beacon.position.set(0, 2.02, 0.35);
  delivery.vehicle.add(upgradeCab, beacon);
  delivery.vehicle.scale.setScalar(1.12);
  delivery.vehicle.position.set(delivery.x, yWorld(delivery.x, delivery.z) + 0.05, delivery.z);
  delivery.vehicle.rotation.y = Math.PI;
}

function buyMarketItem(kind: MarketItem) {
  const offer = marketOffers[kind];
  if (kind === "vegetables" && pendingVegetablePlot) {
    marketNote.textContent = "Place your current vegetable plot before buying another.";
    return;
  }
  if (
    (kind === "wideHeader" && wideHeader) ||
    (kind === "fastBaler" && fastBaler) ||
    (kind === "tractorEngine" && tractorEngine) ||
    (kind === "rifle" && hasRifle) ||
    ((kind === "houseTractor" || kind === "fieldTractor" || kind === "barnTractor") &&
      deliveredVehicles.has(kind))
  ) {
    marketNote.textContent = `Your ${offer.label} is already installed.`;
    return;
  }
  if (coins < offer.price) {
    marketNote.textContent = `You need ${offer.price - coins} more coins for a ${offer.label}.`;
    return;
  }
  coins -= offer.price;
  if (kind === "wideHeader") {
    wideHeader = true;
    cutter.scale.x = 1.7;
  } else if (kind === "fastBaler") {
    fastBaler = true;
  } else if (kind === "tractorEngine") {
    tractorEngine = true;
  } else if (kind === "rifle") {
    hasRifle = true;
    rifleModel.visible = true;
  } else if (kind === "houseTractor" || kind === "fieldTractor" || kind === "barnTractor") {
    deliveredVehicles.add(kind);
    replaceFarmVehicle(kind);
  } else if (kind === "vegetables") {
    pendingVegetablePlot = true;
    // Close and unfocus the shop so keyboard movement immediately returns to
    // the farmer while the player chooses a placement location.
    marketplace.hidden = true;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    refreshFarm();
    marketNote.textContent = "Face an open spot and press F to place your vegetable plot.";
    toast.textContent = "Vegetable plot ready. Walk to the desired spot, face it, and press F.";
    return;
  } else if (kind === "sheep") {
    sheep++;
    addMarketAnimal(kind, sheep + pigs + horses);
  } else if (kind === "pig") {
    pigs++;
    addMarketAnimal(kind, sheep + pigs + horses);
  } else {
    horses++;
    addMarketAnimal(kind, sheep + pigs + horses);
  }
  refreshFarm();
  marketNote.textContent = kind === "wideHeader" || kind === "fastBaler" || kind === "tractorEngine" || kind === "rifle"
    ? `${offer.label[0].toUpperCase()}${offer.label.slice(1)} installed!`
    : kind === "houseTractor" || kind === "fieldTractor" || kind === "barnTractor"
      ? `${offer.label[0].toUpperCase()}${offer.label.slice(1)} delivered!`
    : `Welcome home, new ${offer.label}!`;
  toast.textContent = `Bought ${kind === "wideHeader" || kind === "fastBaler" || kind === "tractorEngine" || kind === "rifle" ? "the" : "a"} ${offer.label} for ${offer.price} coins.${kind === "rifle" ? " Press Q to scare off nearby wild animals." : ""}`;
}
function refreshDayTimer() {
  const night = dayElapsed >= DAY_LENGTH_SECONDS;
  const remaining = Math.max(
    0,
    Math.ceil((night ? FULL_CYCLE_SECONDS : DAY_LENGTH_SECONDS) - dayElapsed),
  );
  dayTimerLabel.textContent = `${night ? "NIGHT" : "DAY"} ${Math.floor(remaining / 60)}:${String(
    remaining % 60,
  ).padStart(2, "0")}`;
}
function updateSky(dt: number) {
  const nightBlend = THREE.MathUtils.clamp(
    (dayElapsed - (DAY_LENGTH_SECONDS - 45)) / 45,
    0,
    1,
  );
  skyColor.copy(daySky).lerp(nightSky, nightBlend);
  (scene.fog as THREE.FogExp2).color.copy(skyColor);
  skyLight.intensity = THREE.MathUtils.lerp(2.2, 0.28, nightBlend);
  sun.intensity = THREE.MathUtils.lerp(3, 0.08, nightBlend);
  moonLight.intensity = THREE.MathUtils.lerp(0, 1.15, nightBlend);
  moon.visible = nightBlend > 0.01;
  starMaterial.opacity = nightBlend;
  stars.rotation.y += dt * 0.006;
}
function feedHerdBale(bale: THREE.Mesh) {
  if (cattle.length === 0 || fedBales >= 3) return false;
  const baleIndex = baleObjects.indexOf(bale);
  if (baleIndex < 0) return false;
  baleObjects.splice(baleIndex, 1);
  scene.remove(bale);
  if (lastDroppedBale === bale) lastDroppedBale = null;
  bales = Math.max(0, bales - 1);
  fedBales++;
  cattleCare = Math.min(100, cattleCare + 12);
  const sharedFeeders = marketAnimals.filter(
    (animal) => animal.userData.feedBale === bale && animal.userData.kind !== "pig",
  );
  sharedFeeders.forEach((animal) => {
    animal.userData.feedBale = undefined;
    animal.userData.state = "grazing";
    animal.userData.stateTimer = 3 + Math.random() * 5;
    animal.userData.lastFedDay = farmDay;
  });
  refreshFarm();
  toast.textContent = sharedFeeders.length
    ? `The cows, sheep, and horses share the bale (${fedBales}/3 today).`
    : `The cows eat the bale (${fedBales}/3 today).`;
  if (fedBales === 3)
    questText.textContent =
      "The herd is fed for today. You can safely end the day.";
  return true;
}
function sendCowToEatBale(bale: THREE.Mesh) {
  if (cattle.length === 0 || fedBales >= 3) return false;
  if (cattle.some((cow) => cow.userData.feedBale === bale)) return true;
  const pendingMeals = cattle.filter((cow) => cow.userData.feedBale).length;
  if (fedBales + pendingMeals >= 3) return false;
  const cow = cattle
    .filter((candidate) => !candidate.userData.feedBale)
    .sort(
      (a, b) =>
        a.position.distanceTo(bale.position) - b.position.distanceTo(bale.position),
    )[0];
  if (!cow) return false;
  cow.userData.feedBale = bale;
  cow.userData.eatingTime = 0;
  cow.userData.state = "walking";
  marketAnimals
    .filter((animal) => animal.userData.kind !== "pig")
    .forEach((animal) => {
      animal.userData.feedBale = bale;
      animal.userData.state = "feeding";
    });
  toast.textContent = "The cows, sheep, and horses are heading for the bale.";
  return true;
}
function sellBale() {
  const bale = baleObjects.find(
    (candidate) =>
      isBaleOnBarnStack(candidate) &&
      !cattle.some((cow) => cow.userData.feedBale === candidate),
  );
  if (!bale) {
    toast.textContent = "Stack a bale at the barn before selling it.";
    return;
  }
  baleObjects.splice(baleObjects.indexOf(bale), 1);
  scene.remove(bale);
  if (lastDroppedBale === bale) lastDroppedBale = null;
  bales = Math.max(0, bales - 1);
  storedBales = Math.max(0, storedBales - 1);
  coins += 25;
  refreshFarm();
  toast.textContent = "Sold one bale at the marketplace for 25 coins.";
}
function sellMilk() {
  if (chilledMilk < 1) {
    toast.textContent = "Chill a pail of milk in the refrigerator before selling it.";
    return;
  }
  chilledMilk--;
  coins += 15;
  refreshFarm();
  toast.textContent = "Sold one chilled pail of milk at the marketplace for 15 coins.";
}
function dropCarriedBale() {
  if (!carriedBale) {
    toast.textContent = "Pick up a bale with the blue loader first.";
    return;
  }
  const bale = carriedBale,
    drop = loader.localToWorld(new THREE.Vector3(0, 0.45, -1.5)),
    spacing = 0.76,
    nearby = baleObjects.filter(
      (other) => other.position.distanceTo(drop) < 1.8,
    );
  let x = drop.x,
    z = drop.z;
  if (Math.hypot(drop.x - baleStack.position.x, drop.z - baleStack.position.z) < 2.25) {
    const stackedBales = baleObjects.filter(isBaleOnBarnStack);
    const base = stackedBales.length
      ? Math.max(...stackedBales.map((other) => other.position.y)) + 0.7
      : yWorld(baleStack.position.x, baleStack.position.z) + 0.35;
    loader.remove(bale);
    scene.add(bale);
    bale.position.set(baleStack.position.x, base, baleStack.position.z);
    bale.rotation.set(0, 0, Math.PI / 2);
    baleObjects.push(bale);
    lastDroppedBale = bale;
    bales++;
    storedBales++;
    toast.textContent = "Bale stacked at the barn and ready to sell.";
  } else if (nearby.length) {
    const slots = nearby.flatMap((other) => [
      [other.position.x, other.position.z],
      [other.position.x + spacing, other.position.z],
      [other.position.x - spacing, other.position.z],
      [other.position.x, other.position.z + spacing],
      [other.position.x, other.position.z - spacing],
    ]);
    [x, z] = slots.reduce((closest, slot) =>
      Math.hypot(slot[0] - drop.x, slot[1] - drop.z) <
      Math.hypot(closest[0] - drop.x, closest[1] - drop.z)
        ? slot
        : closest,
    );
    const column = baleObjects.filter(
      (other) => Math.hypot(other.position.x - x, other.position.z - z) < 0.2,
    );
    const base = column.length
      ? Math.max(...column.map((other) => other.position.y)) + 0.7
      : yWorld(x, z) + 0.35;
    loader.remove(bale);
    scene.add(bale);
    bale.position.set(x, base, z);
    bale.rotation.set(0, 0, Math.PI / 2);
    baleObjects.push(bale);
    lastDroppedBale = bale;
    bales++;
    toast.textContent = column.length
      ? "Bale stacked neatly in the field."
      : "Bale placed neatly in the field.";
  } else {
    loader.remove(bale);
    scene.add(bale);
    bale.position.set(x, yWorld(x, z) + 0.35, z);
    bale.rotation.set(0, 0, Math.PI / 2);
    baleObjects.push(bale);
    lastDroppedBale = bale;
    bales++;
    toast.textContent = "You set the bale down where you chose.";
  }
  carriedBale = null;
  refreshFarm();
  if (
    bale.position.x > pasture.minX &&
    bale.position.x < pasture.maxX &&
    bale.position.z > pasture.minZ &&
    bale.position.z < pasture.maxZ
  )
    sendCowToEatBale(bale);
}
const cutWheatMat = new THREE.MeshStandardMaterial({
  color: 0xe5bd4c,
  roughness: 0.85,
});
function addFallenWheat(
  position: THREE.Vector3,
  velocity = new THREE.Vector3(),
  settled = false,
) {
  const clump = new THREE.Group();
  for (let stalk = 0; stalk < 4; stalk++) {
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.028, 0.62, 5),
      cutWheatMat,
    );
    stem.position.set(
      (Math.random() - 0.5) * 0.18,
      0.3,
      (Math.random() - 0.5) * 0.16,
    );
    stem.rotation.z = (Math.random() - 0.5) * 0.6;
    clump.add(stem);
  }
  clump.position.copy(position);
  scene.add(clump);
  fallenWheat.push({ mesh: clump, velocity, settled });
}
function dropCutStalks() {
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
    harvester.quaternion,
  );
  const position = harvester.position
    .clone()
    .addScaledVector(forward, 1.45)
    .add(new THREE.Vector3((Math.random() - 0.5) * 0.8, 0.8 + Math.random() * 0.2, (Math.random() - 0.5) * 0.25));
  const velocity = forward.clone().multiplyScalar(1 + Math.random()).add(
    new THREE.Vector3(Math.random() - 0.5, 1.2 + Math.random(), Math.random() - 0.5),
  );
  addFallenWheat(position, velocity);
}
function cutRowWithCombine() {
  if (harvester.position.distanceTo(lastCutPosition) < 0.3) return false;
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      harvester.quaternion,
    ),
    right = new THREE.Vector3(1, 0, 0).applyQuaternion(harvester.quaternion);
  const cut = wheatPlants.filter((plant) => {
    if (!plant.visible) return false;
    const offset = plant.position.clone().sub(harvester.position);
    return (
      offset.dot(forward) > -0.3 &&
      offset.dot(forward) < 1.65 &&
      Math.abs(offset.dot(right)) < (wideHeader ? 2.45 : 1.45)
    );
  });
  if (cut.length === 0) return false;
  lastCutPosition.copy(harvester.position);
  cut.forEach((plant) => (plant.visible = false));
  ripePlots = Math.max(0, ripePlots - cut.length);
  wheat += cut.length;
  for (let i = 0; i < Math.ceil(cut.length / 8); i++) dropCutStalks();
  refreshFarm();
  toast.textContent = `Combine cut ${cut.length} stalks under the cutter.`;
  return true;
}
function plantWheatWithTractor() {
  if (wheat < 1 || planter.position.distanceTo(lastPlantPosition) < 0.3)
    return false;
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      planter.quaternion,
    ),
    right = new THREE.Vector3(1, 0, 0).applyQuaternion(planter.quaternion);
  const seeds = wheatPlants.filter((plant) => {
    if (plant.visible) return false;
    const offset = plant.position.clone().sub(planter.position);
    return (
      offset.dot(forward) > -0.3 &&
      offset.dot(forward) < 1.55 &&
      Math.abs(offset.dot(right)) < 1.35
    );
  });
  if (seeds.length === 0) return false;
  lastPlantPosition.copy(planter.position);
  seeds.forEach((plant) => {
    plant.visible = true;
    plant.userData.maturity = 0.08;
    plant.material = new THREE.MeshStandardMaterial({
      color: 0x4f913f,
      roughness: 0.9,
    });
  });
  wheat--;
  ripePlots += seeds.length;
  refreshFarm();
  toast.textContent = `Purple planter sowed ${seeds.length} green wheat sprouts.`;
  return true;
}
let fridgeOpen = false;
function interactWithFridge() {
  if (!refrigerator || hero.position.distanceTo(refrigerator.position) > 2) return false;
  if (!fridgeOpen) {
    fridgeOpen = true;
    toast.textContent = carriedVegetables > 0
      ? "The refrigerator is open. Press E again to store your vegetables."
      : milk > 0
      ? "The refrigerator is open. Press E again to put milk inside."
      : fridgeVegetables > 0
      ? "The refrigerator is open. Press E again to take a vegetable for a pig."
      : "The refrigerator is open. Bring back fresh milk to chill it.";
    return true;
  }
  if (carriedVegetables > 0) {
    fridgeVegetables += carriedVegetables;
    toast.textContent = `Stored ${carriedVegetables} vegetables in the refrigerator.`;
    carriedVegetables = 0;
    carryingFridgeVegetable = false;
    refreshFarm();
    return true;
  }
  if (hasMilkBucket) {
    const pailWasFull = milk > 0;
    if (pailWasFull) {
      milk--;
      chilledMilk++;
      refreshFarm();
    }
    bucketMilk.visible = false;
    hero.remove(milkBucket);
    scene.add(milkBucket);
    milkBucket.position
      .copy(refrigerator.position)
      .add(new THREE.Vector3(0, 0.06, -0.18));
    milkBucket.rotation.set(0, 0, 0);
    hasMilkBucket = false;
    toast.textContent = pailWasFull
      ? `Chilled the milk and returned the pail to the refrigerator (${chilledMilk} chilled).`
      : "Returned the empty pail to the refrigerator shelf.";
    return true;
  }
  if (fridgeVegetables > 0) {
    fridgeVegetables--;
    carriedVegetables = 1;
    carryingFridgeVegetable = true;
    refreshFarm();
    toast.textContent = "Took a vegetable from the refrigerator. Carry it to a pig and press E.";
    return true;
  }
  fridgeOpen = false;
  toast.textContent = "The refrigerator door closes.";
  return true;
}
function farmAction() {
  const inField =
    hero.position.x > -40 &&
    hero.position.x < -3 &&
    hero.position.z > -40 &&
    hero.position.z < -3;
  const inPasture =
    hero.position.x > 4 &&
    hero.position.x < 26 &&
    hero.position.z > 2 &&
    hero.position.z < 18;
  if (inField) {
    toast.textContent = "Use the orange combine to harvest this wheat field.";
    return;
  }
  if (inPasture) {
    const nearestPig = marketAnimals
      .filter((animal) => animal.userData.kind === "pig")
      .sort(
        (a, b) =>
          a.position.distanceTo(hero.position) - b.position.distanceTo(hero.position),
      )[0];
    if (nearestPig && nearestPig.position.distanceTo(hero.position) <= 2) {
      if (nearestPig.userData.fedDay === farmDay) {
        toast.textContent = "This pig has already eaten vegetables today.";
        return;
      }
      if (!carryingFridgeVegetable || carriedVegetables < 1) {
        toast.textContent = "Take a vegetable from the open refrigerator, then carry it to this pig.";
        return;
      }
      carriedVegetables--;
      carryingFridgeVegetable = false;
      nearestPig.userData.fedDay = farmDay;
      refreshFarm();
      toast.textContent = "The pig happily eats its daily vegetables.";
      return;
    }
    if (cattle.length === 0) {
      toast.textContent = "The pasture is empty. The herd did not survive.";
      return;
    }
    const nearestCow = cattle.reduce((nearest, cow) =>
      cow.position.distanceTo(hero.position) < nearest.position.distanceTo(hero.position)
        ? cow
        : nearest,
    );
    if (nearestCow.position.distanceTo(hero.position) <= 2) {
      if (milkingCow) {
        toast.textContent = "Finish milking before starting another cow.";
        return;
      }
      if (!hasMilkBucket) {
        toast.textContent = "Pick up the milk bucket from the refrigerator first (P).";
        return;
      }
      if (milk > 0) {
        toast.textContent = "Your pail is full. Put it in the refrigerator before milking again.";
        return;
      }
      if (nearestCow.userData.milkedToday) {
        toast.textContent = "This cow has already been milked today.";
        return;
      }
      milkingCow = nearestCow;
      milkingElapsed = 0;
      nearestCow.userData.milking = true;
      hero.rotation.y = Math.atan2(
        hero.position.x - nearestCow.position.x,
        hero.position.z - nearestCow.position.z,
      );
      hero.remove(milkBucket);
      scene.add(milkBucket);
      milkBucket.visible = true;
      milkStream.visible = true;
      toast.textContent = "The farmer kneels down and starts milking the cow.";
      return;
    }
    if (fedBales >= 3) {
      toast.textContent = "The herd has all three bales it needs today.";
      return;
    }
    const pastureBale = baleObjects.find(
      (bale) =>
        bale.position.x > pasture.minX &&
        bale.position.x < pasture.maxX &&
        bale.position.z > pasture.minZ &&
        bale.position.z < pasture.maxZ,
    );
    if (!pastureBale) {
      toast.textContent = "Put a bale in the pasture with the loader so the cows can eat it.";
      return;
    }
    sendCowToEatBale(pastureBale);
    return;
  }
  toast.textContent =
    "There is nothing to tend here. Visit the field or pasture.";
}
function pickUpNearby() {
  if (driving || milkingCow) return;
  if (!hasMilkBucket && hero.position.distanceTo(milkBucket.position) <= 1.65) {
    if (!fridgeOpen) {
      toast.textContent = "Open the refrigerator before taking the milk pail.";
      return;
    }
    hasMilkBucket = true;
    hero.add(milkBucket);
    milkBucket.position.set(0.32, 0.42, -0.26);
    milkBucket.rotation.set(0, 0, 0);
    toast.textContent = "Picked up the milk bucket. Take it to a cow and press E.";
    return;
  }
  const shard = shards.find(
    (candidate) =>
      !candidate.userData.collected &&
      hero.position.distanceTo(candidate.position) <= 1.5,
  );
  if (shard) {
    shard.userData.collected = true;
    shard.visible = false;
    shardCount++;
    refreshFarm();
    toast.textContent = `Fresh crop collected! ${shardCount} of 12.`;
    if (interacted && shardCount >= 3)
      questText.textContent = "The market basket is ready. Enjoy the open farm.";
    return;
  }
  const wheatIndex = fallenWheat.findIndex(
    (drop) => drop.settled && hero.position.distanceTo(drop.mesh.position) <= 1.5,
  );
  if (wheatIndex >= 0) {
    const [drop] = fallenWheat.splice(wheatIndex, 1);
    scene.remove(drop.mesh);
    wheat++;
    refreshFarm();
    toast.textContent = `Picked up loose wheat. Wheat: ${wheat}.`;
    return;
  }
  toast.textContent = "Nothing nearby to pick up.";
}
function shootRifle() {
  if (!hasRifle) {
    toast.textContent = "Buy a rifle from the marketplace before confronting wild animals.";
    return;
  }
  if (driving || resting) {
    toast.textContent = "Get on foot before using the rifle.";
    return;
  }
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(hero.quaternion);
  const target = wildAnimals
    .filter((animal) => animal.visible)
    .map((animal) => {
      const offset = animal.position.clone().sub(hero.position);
      offset.y = 0;
      const distance = offset.length();
      return { animal, distance, aim: distance > 0 ? forward.dot(offset.normalize()) : -1 };
    })
    .filter(({ distance, aim }) => distance <= 24 && aim > 0.82)
    .sort((a, b) => a.distance - b.distance)[0]?.animal;
  if (!target) {
    toast.textContent = "No wild animal is in front of you and within rifle range.";
    return;
  }
  target.visible = false;
  target.userData.prey = undefined;
  target.userData.attackTime = 0;
  target.userData.killsTonight = 1;
  target.userData.respawnAt = performance.now() + 35_000;
  toast.textContent = `The ${target.userData.kind} retreats to its home range. It will return later.`;
}
addEventListener("keydown", (e) => {
  if (!gameStarted) return;
  keys.add(e.code);
  if (
    e.code === "Space" &&
    !driving &&
    !resting &&
    hero.position.y <= playerGroundY(hero.position.x, hero.position.z) + 0.14
  )
    vy = 6.2;
  if (e.code === "KeyQ") {
    e.preventDefault();
    shootRifle();
    return;
  }
  if (e.code === "KeyF" && pendingVegetablePlot && !driving && !resting) {
    e.preventDefault();
    placeVegetablePlot();
    return;
  }
  if (e.code === "KeyF" && driving && usingLoader) {
    e.preventDefault();
    dropCarriedBale();
  }
  if (e.code === "KeyP") {
    e.preventDefault();
    pickUpNearby();
  }
  if (e.code === "KeyE") {
    if (driving) {
      const vehicle = usingLoader
        ? loader
        : usingPlanter
          ? planter
          : usingHarvester
            ? harvester
            : tractor;
      driving = false;
      hero.visible = true;
      const exitPosition = findVehicleExitPosition(vehicle);
      if (exitPosition) {
        hero.position.copy(exitPosition);
        toast.textContent = "You climb down from the vehicle.";
      } else {
        // Stay in the vehicle instead of leaving the farmer embedded in scenery.
        driving = true;
        hero.visible = false;
        toast.textContent = "No clear space to get out here.";
      }
    } else if (ridingHorse) {
      dismountHorse();
    } else if (resting) {
      standUp();
    } else if (Math.hypot(hero.position.x - couchSpot.x, hero.position.z - couchSpot.y) <= 1.45) {
      restOnFurniture("sitting");
    } else if (Math.hypot(hero.position.x - bedSpot.x, hero.position.z - bedSpot.y) <= 1.45) {
      restOnFurniture("lying");
    } else if (interactWithFridge()) {
      // The kitchen interaction takes precedence over vehicles beyond the house.
    } else if (interactWithVegetablePlot()) {
      // Garden plots can be harvested or replanted directly.
    } else {
      const nearbyHorse = marketAnimals.find(
        (animal) =>
          animal.userData.kind === "horse" &&
          !animal.userData.ridden &&
          animal.position.distanceTo(hero.position) <= 2.1,
      );
      if (nearbyHorse) {
        mountHorse(nearbyHorse);
      } else if (hero.position.distanceTo(tractor.position) < 2.5) {
        driving = true;
        usingHarvester = false;
        usingPlanter = false;
        usingLoader = false;
        hero.visible = false;
        hero.position.copy(tractor.position);
        toast.textContent =
          "Green tractor started. Drive over sheaves to collect and bale them.";
      } else if (hero.position.distanceTo(harvester.position) < 2.8) {
        driving = true;
        usingHarvester = true;
        usingPlanter = false;
        usingLoader = false;
        hero.visible = false;
        hero.position.copy(harvester.position);
        toast.textContent =
          "Orange combine started. Drive through ripe wheat to cut it down.";
      } else if (hero.position.distanceTo(planter.position) < 2.8) {
        driving = true;
        usingHarvester = false;
        usingPlanter = true;
        usingLoader = false;
        hero.visible = false;
        hero.position.copy(planter.position);
        toast.textContent =
          "Purple planter started. Drive over bare dirt to sow wheat.";
      } else if (hero.position.distanceTo(loader.position) < 2.8) {
        driving = true;
        usingHarvester = false;
        usingPlanter = false;
        usingLoader = true;
        hero.visible = false;
        hero.position.copy(loader.position);
        toast.textContent =
          "Blue bale loader started. Drive over a bale to lift it, then press F to drop it.";
      } else if (hero.position.distanceTo(beacon.position) < 4) {
        interacted = true;
        questText.textContent =
          "The mill is turning. Make three bales for the herd before nightfall.";
        toast.textContent = "The windmill hums to life!";
      } else farmAction();
    }
  }
});
addEventListener("keyup", (e) => keys.delete(e.code));
const dropButton = document.querySelector<HTMLButtonElement>("#dropBale")!;
dropButton.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  dropCarriedBale();
});
const marketToggle = document.querySelector<HTMLButtonElement>("#marketToggle")!;
const marketplace = document.querySelector<HTMLElement>("#marketplace")!;
const helpButton = document.querySelector<HTMLButtonElement>("#helpButton")!;
const helpPanel = document.querySelector<HTMLElement>("#helpPanel")!;
function toggleHelp(show = helpPanel.hidden) {
  helpPanel.hidden = !show;
  helpButton.setAttribute("aria-expanded", String(show));
  helpButton.textContent = show ? "CLOSE HELP" : "? HELP";
}
marketToggle.addEventListener("click", () => {
  marketplace.hidden = !marketplace.hidden;
});
document.querySelector<HTMLButtonElement>("#marketClose")!.addEventListener("click", () => {
  marketplace.hidden = true;
});
helpButton.addEventListener("click", () => toggleHelp());
document.querySelector<HTMLButtonElement>("#helpClose")!.addEventListener("click", () => toggleHelp(false));
document.querySelector<HTMLButtonElement>("#sellBale")!.addEventListener("click", sellBale);
document.querySelector<HTMLButtonElement>("#sellMilk")!.addEventListener("click", sellMilk);
document.querySelectorAll<HTMLButtonElement>("[data-buy]").forEach((button) => {
  button.addEventListener("click", () =>
    buyMarketItem(button.dataset.buy as MarketItem),
  );
});
function endDay() {
  let dayReport = "";
  if (cattle.length > 0 && fedBales < 3) {
    const deaths = Math.min(cattle.length, 3 - fedBales);
    const lostCattle = cattle.splice(0, deaths);
    lostCattle.forEach((cow) => scene.remove(cow));
    cattleCare = Math.max(0, cattleCare - deaths * 15);
    questText.textContent =
      "Some cattle died from hunger. Feed all three daily bales to protect the rest.";
    dayReport = `${deaths} cattle died from hunger. ${cattle.length} remain.`;
  } else if (cattle.length > 0) {
    cattleCare = Math.min(100, cattleCare + 6);
    questText.textContent = "Make three more bales before the next day ends.";
  }
  const unfedPigs = marketAnimals.filter(
    (animal) => animal.userData.kind === "pig" && animal.userData.fedDay !== farmDay,
  );
  if (unfedPigs.length) {
    const pigDeaths = Math.max(1, Math.ceil(unfedPigs.length / 2));
    unfedPigs.slice(0, pigDeaths).forEach((pig) => {
      marketAnimals.splice(marketAnimals.indexOf(pig), 1);
      scene.remove(pig);
    });
    pigs = Math.max(0, pigs - pigDeaths);
    dayReport = `${dayReport} ${pigDeaths} pig${pigDeaths === 1 ? "" : "s"} died after missing vegetables.`.trim();
  }
  let ripenedGardens = 0;
  vegetableGardens.forEach((garden) => {
    if (garden.userData.stage !== "growing") return;
    garden.userData.stage = "ripe";
    (garden.userData.carrots as THREE.Mesh[]).forEach((carrot) => (carrot.visible = true));
    ripenedGardens++;
  });
  farmDay++;
  ripePlots = Math.min(18, ripePlots + 6);
  cropMaturity = Math.min(1, cropMaturity + 0.35);
  fedBales = 0;
  cattle.forEach((cow) => (cow.userData.milkedToday = false));
  refreshFarm();
  if (cattle.length > 0 || dayReport || ripenedGardens)
    toast.textContent = dayReport
      ? `${dayReport} Day ${farmDay}: ${ripenedGardens ? `${ripenedGardens} garden${ripenedGardens === 1 ? "" : "s"} ripened. ` : ""}Feed the herd and pigs.`
      : `Day ${farmDay}: feed the herd and pigs before night.`;
}
const SAVE_KEY = "greenacre-farm-save-v1";
type SavedAnimal = {
  kind: "sheep" | "pig" | "horse";
  x: number;
  y: number;
  z: number;
  rotation: number;
  fedDay?: number;
};
function saveGame() {
  const save = {
    version: 1,
    hero: { x: hero.position.x, y: hero.position.y, z: hero.position.z, rotation: hero.rotation.y },
    supplies: {
      shardCount, wheat, milk, chilledMilk, fridgeVegetables, carriedVegetables,
      carryingFridgeVegetable, cattleCare, ripePlots, farmDay, cropMaturity,
      fedBales, coins, dayElapsed, storedBales, sheep, pigs, vegetablePlots, horses,
      cattleCount: cattle.length,
      wideHeader, fastBaler, tractorEngine, hasRifle, selectedFarmer,
    },
    animals: marketAnimals.map((animal): SavedAnimal => ({
      kind: animal.userData.kind,
      x: animal.position.x,
      y: animal.position.y,
      z: animal.position.z,
      rotation: animal.rotation.y,
      fedDay: animal.userData.fedDay,
    })),
    gardens: vegetableGardens.map((garden) => ({
      x: garden.position.x,
      z: garden.position.z,
      stage: garden.userData.stage,
    })),
    field: {
      harvested: wheatPlants.flatMap((plant, index) => (plant.visible ? [] : [index])),
      looseStraw,
      fallenWheat: fallenWheat.map((drop) => ({
        x: drop.mesh.position.x,
        y: drop.mesh.position.y,
        z: drop.mesh.position.z,
      })),
      bales: baleObjects.map((bale) => ({
        x: bale.position.x,
        y: bale.position.y,
        z: bale.position.z,
        rotation: bale.rotation.z,
      })),
    },
    deliveredVehicles: [...deliveredVehicles],
    vehicles: [tractor, harvester, planter, loader].map((vehicle) => ({
      x: vehicle.position.x,
      y: vehicle.position.y,
      z: vehicle.position.z,
      rotation: vehicle.rotation.y,
    })),
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    toast.textContent = "Progress saved in this browser.";
  } catch {
    toast.textContent = "This browser could not save progress.";
  }
}
function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const save = JSON.parse(raw) as {
      hero?: { x: number; y: number; z: number; rotation: number };
      supplies?: Record<string, unknown>;
      animals?: SavedAnimal[];
      gardens?: { x: number; z: number; stage: "ripe" | "bare" | "growing" }[];
      field?: {
        harvested?: number[];
        looseStraw?: number;
        fallenWheat?: { x: number; y: number; z: number }[];
        bales?: { x: number; y: number; z: number; rotation: number }[];
      };
      deliveredVehicles?: VehicleMarketItem[];
      vehicles?: { x: number; y: number; z: number; rotation: number }[];
    };
    if (save.supplies) {
      const supplies = save.supplies;
      const number = (name: string, fallback: number) =>
        typeof supplies[name] === "number" ? supplies[name] as number : fallback;
      shardCount = number("shardCount", shardCount);
      wheat = number("wheat", wheat);
      milk = number("milk", milk);
      chilledMilk = number("chilledMilk", chilledMilk);
      fridgeVegetables = number("fridgeVegetables", fridgeVegetables);
      carriedVegetables = number("carriedVegetables", carriedVegetables);
      cattleCare = number("cattleCare", cattleCare);
      ripePlots = number("ripePlots", ripePlots);
      farmDay = number("farmDay", farmDay);
      cropMaturity = number("cropMaturity", cropMaturity);
      fedBales = number("fedBales", fedBales);
      coins = number("coins", coins);
      dayElapsed = number("dayElapsed", dayElapsed);
      storedBales = number("storedBales", storedBales);
      sheep = number("sheep", sheep);
      pigs = number("pigs", pigs);
      vegetablePlots = number("vegetablePlots", vegetablePlots);
      horses = number("horses", horses);
      const cattleCount = number("cattleCount", cattle.length);
      while (cattle.length > cattleCount) scene.remove(cattle.pop()!);
      carryingFridgeVegetable = supplies.carryingFridgeVegetable === true;
      wideHeader = supplies.wideHeader === true;
      fastBaler = supplies.fastBaler === true;
      tractorEngine = supplies.tractorEngine === true;
      hasRifle = supplies.hasRifle === true;
      if (
        supplies.selectedFarmer === "avery" ||
        supplies.selectedFarmer === "rowan" ||
        supplies.selectedFarmer === "sage"
      )
        applyFarmerStyle(supplies.selectedFarmer);
      cutter.scale.x = wideHeader ? 1.7 : 1;
      rifleModel.visible = hasRifle;
    }
    if (save.hero) {
      hero.position.set(save.hero.x, save.hero.y, save.hero.z);
      hero.rotation.y = save.hero.rotation;
    }
    if (save.field) {
      const harvested = new Set(save.field.harvested ?? []);
      wheatPlants.forEach((plant, index) => (plant.visible = !harvested.has(index)));
      looseStraw = typeof save.field.looseStraw === "number" ? save.field.looseStraw : 0;
      fallenWheat.splice(0).forEach((drop) => scene.remove(drop.mesh));
      (save.field.fallenWheat ?? []).forEach((drop) =>
        addFallenWheat(new THREE.Vector3(drop.x, drop.y, drop.z), new THREE.Vector3(), true),
      );
      baleObjects.splice(0).forEach((bale) => scene.remove(bale));
      (save.field.bales ?? []).forEach((savedBale) => {
        const bale = new THREE.Mesh(
          new THREE.CylinderGeometry(0.34, 0.34, 0.72, 10),
          hay,
        );
        bale.position.set(savedBale.x, savedBale.y, savedBale.z);
        bale.rotation.z = savedBale.rotation;
        bale.castShadow = true;
        scene.add(bale);
        baleObjects.push(bale);
      });
      bales = baleObjects.length;
      storedBales = baleObjects.filter(isBaleOnBarnStack).length;
    }
    marketAnimals.splice(0).forEach((animal) => scene.remove(animal));
    (save.animals ?? []).forEach((savedAnimal, index) => {
      addMarketAnimal(savedAnimal.kind, index + 1);
      const animal = marketAnimals[marketAnimals.length - 1];
      animal.position.set(savedAnimal.x, savedAnimal.y, savedAnimal.z);
      animal.rotation.y = savedAnimal.rotation;
      animal.userData.fedDay = savedAnimal.fedDay;
    });
    sheep = marketAnimals.filter((animal) => animal.userData.kind === "sheep").length;
    pigs = marketAnimals.filter((animal) => animal.userData.kind === "pig").length;
    horses = marketAnimals.filter((animal) => animal.userData.kind === "horse").length;
    vegetableGardens.splice(0).forEach((garden) => scene.remove(garden));
    vegetablePlotPositions.splice(0);
    (save.gardens ?? []).forEach((savedGarden) => {
      addVegetablePlot(savedGarden.x, savedGarden.z);
      vegetablePlotPositions.push(new THREE.Vector2(savedGarden.x, savedGarden.z));
      const garden = vegetableGardens[vegetableGardens.length - 1];
      garden.userData.stage = savedGarden.stage;
      (garden.userData.carrots as THREE.Mesh[]).forEach(
        (carrot) => (carrot.visible = savedGarden.stage === "ripe"),
      );
      (garden.userData.leaves as THREE.Mesh[]).forEach(
        (leaves) => (leaves.visible = savedGarden.stage !== "bare"),
      );
    });
    vegetablePlots = vegetableGardens.length;
    deliveredVehicles.clear();
    (save.deliveredVehicles ?? []).forEach((kind) => {
      if (kind === "houseTractor" || kind === "fieldTractor" || kind === "barnTractor") {
        deliveredVehicles.add(kind);
        replaceFarmVehicle(kind);
      }
    });
    save.vehicles?.forEach((savedVehicle, index) => {
      const vehicle = [tractor, harvester, planter, loader][index];
      if (!vehicle) return;
      vehicle.position.set(savedVehicle.x, savedVehicle.y, savedVehicle.z);
      vehicle.rotation.y = savedVehicle.rotation;
    });
    toast.textContent = "Saved farm progress restored.";
  } catch {
    toast.textContent = "Saved progress could not be restored.";
  }
}
let restartArmed = false;
function restartGame() {
  if (!restartArmed) {
    restartArmed = true;
    restartButton.textContent = "CONFIRM RESTART";
    toast.textContent = "Press Restart Game again to erase saved progress and start over.";
    setTimeout(() => {
      restartArmed = false;
      restartButton.textContent = "RESTART GAME";
    }, 4000);
    return;
  }
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // A reload still restarts the running session when browser storage is unavailable.
  }
  location.reload();
}
saveButton.addEventListener("click", saveGame);
restartButton.addEventListener("click", restartGame);
loadGame();
refreshFarm();
refreshDayTimer();
const youngWheatColor = new THREE.Color(0x4f913f),
  ripeWheatColor = new THREE.Color(0xd8b34a);
function tintPlantedWheat() {
  wheatPlants.forEach((plant) => {
    if (!plant.visible || plant.userData.maturity === undefined) return;
    (plant.material as THREE.MeshStandardMaterial).color.lerpColors(
      youngWheatColor,
      ripeWheatColor,
      plant.userData.maturity,
    );
  });
  requestAnimationFrame(tintPlantedWheat);
}
requestAnimationFrame(tintPlantedWheat);
let lastGrowthTime = performance.now();
function growWheat(now: number) {
  const delta = Math.min(0.05, (now - lastGrowthTime) / 1000);
  lastGrowthTime = now;
  cropMaturity = Math.min(1, cropMaturity + delta * 0.006);
  wheatPlants.forEach((plant, index) => {
    if (!plant.visible) return;
    const maturity =
      plant.userData.maturity === undefined
        ? cropMaturity
        : (plant.userData.maturity = Math.min(
            1,
            plant.userData.maturity + delta * 0.006,
          ));
    const height = 0.2 + maturity * 0.8;
    plant.scale.y = height;
    plant.position.y = plant.userData.baseY - (1 - height) * 0.28;
    plant.rotation.z = Math.sin(now * 0.0016 + index) * 0.055;
  });
  hay.color.setHex(
    cropMaturity > 0.75 ? 0xd8b34a : cropMaturity > 0.4 ? 0x9cb34b : 0x557f45,
  );
  fallenWheat.forEach((drop) => {
    if (drop.settled) return;
    drop.velocity.y -= 9.8 * delta;
    drop.mesh.position.addScaledVector(drop.velocity, delta);
    const floor = yWorld(drop.mesh.position.x, drop.mesh.position.z) + 0.12;
    if (drop.mesh.position.y <= floor) {
      drop.mesh.position.y = floor;
      drop.velocity.set(0, 0, 0);
      drop.mesh.rotation.set(Math.PI / 2, Math.random() * Math.PI, 0);
      drop.settled = true;
    }
  });
  if (driving) {
    const vehicle = usingLoader
      ? loader
      : usingPlanter
        ? planter
        : usingHarvester
          ? harvester
          : tractor;
    vehicle.position.copy(hero.position);
    vehicle.position.y = yWorld(hero.position.x, hero.position.z) + 0.05;
    vehicle.rotation.y = hero.rotation.y;
    if (usingHarvester) {
      const inField =
        hero.position.x > -40 &&
        hero.position.x < -3 &&
        hero.position.z > -40 &&
        hero.position.z < -3;
      if (inField && now - lastCut > 250) {
        lastCut = now;
        cutRowWithCombine();
      }
    } else if (usingPlanter) {
      plantWheatWithTractor();
    } else if (usingLoader) {
      if (
        lastDroppedBale &&
        loader.position.distanceTo(lastDroppedBale.position) > 2.5
      )
        lastDroppedBale = null;
      if (!carriedBale) {
        for (let i = baleObjects.length - 1; i >= 0; i--) {
          const bale = baleObjects[i];
          if (
            bale !== lastDroppedBale &&
            loader.position.distanceTo(bale.position) < 1.7
          ) {
            loader.add(bale);
            bale.position.set(0, 0.5, -1.32);
            bale.rotation.set(0, 0, Math.PI / 2);
            baleObjects.splice(i, 1);
            bales = Math.max(0, bales - 1);
            carriedBale = bale;
            refreshFarm();
            toast.textContent =
              "Bale lifted onto the loader forks. Press F to place it.";
            break;
          }
        }
      }
    } else {
      for (let i = fallenWheat.length - 1; i >= 0; i--) {
        const drop = fallenWheat[i];
        if (tractor.position.distanceTo(drop.mesh.position) < 1.4) {
          scene.remove(drop.mesh);
          fallenWheat.splice(i, 1);
          looseStraw++;
          const sheavesPerBale = fastBaler ? 2 : 5;
          toast.textContent = `Tractor collected wheat (${looseStraw}/${sheavesPerBale}).`;
          if (looseStraw >= sheavesPerBale) {
            looseStraw = 0;
            bales++;
            const bale = new THREE.Mesh(
              new THREE.CylinderGeometry(0.34, 0.34, 0.72, 10),
              hay,
            );
            bale.rotation.z = Math.PI / 2;
            bale.position
              .copy(tractor.position)
              .add(new THREE.Vector3(-0.8, 0.38, 0.55));
            bale.castShadow = true;
            scene.add(bale);
            baleObjects.push(bale);
            refreshFarm();
            toast.textContent = `A fresh wheat bale is made! Total bales: ${bales}.`;
          }
        }
      }
    }
  }
  requestAnimationFrame(growWheat);
}
requestAnimationFrame(growWheat);
renderer.domElement.addEventListener("pointerdown", (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  renderer.domElement.setPointerCapture(e.pointerId);
});
renderer.domElement.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  orbitYaw -= (e.clientX - lastX) * 0.008;
  orbitPitch = Math.max(
    0.22,
    Math.min(1.15, orbitPitch - (e.clientY - lastY) * 0.006),
  );
  lastX = e.clientX;
  lastY = e.clientY;
});
renderer.domElement.addEventListener("pointerup", (e) => {
  dragging = false;
  renderer.domElement.releasePointerCapture(e.pointerId);
  if (e.button === 2) {
    const now = performance.now();
    if (now - lastRightClick < 420) {
      camera.userData.distance = 16;
      toast.textContent = "Wide view enabled.";
      lastRightClick = 0;
    } else lastRightClick = now;
  }
});
renderer.domElement.addEventListener("contextmenu", (e) => e.preventDefault());
renderer.domElement.addEventListener(
  "wheel",
  (e) => {
    camera.userData.distance = Math.max(
      5,
      Math.min(16, (camera.userData.distance ?? 10) + e.deltaY * 0.009),
    );
  },
  { passive: true },
);
const clock = new THREE.Clock();
function chooseGrazingSpot(cow: THREE.Group) {
  // Keep the cows clear of the fence while giving each a different patch of grass.
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate = new THREE.Vector2(
      pasture.minX + 0.8 + Math.random() * (pasture.maxX - pasture.minX - 1.6),
      pasture.minZ + 0.8 + Math.random() * (pasture.maxZ - pasture.minZ - 1.6),
    );
    if (
      cattle.every(
        (other) =>
          other === cow ||
          candidate.distanceTo(new THREE.Vector2(other.position.x, other.position.z)) > 1.15,
      )
    ) {
      cow.userData.target = candidate;
      return;
    }
  }
  cow.userData.target = new THREE.Vector2(
    pasture.minX + 0.8 + Math.random() * (pasture.maxX - pasture.minX - 1.6),
    pasture.minZ + 0.8 + Math.random() * (pasture.maxZ - pasture.minZ - 1.6),
  );
}
type CowLeg = {
  upper: THREE.Mesh;
  lower: THREE.Mesh;
  upperZ: number;
  lowerZ: number;
};
function animateCowLegs(legs: CowLeg[], stride: number, amount: number) {
  legs.forEach(({ upper, lower, upperZ, lowerZ }, legIndex) => {
    const diagonalPhase = legIndex === 0 || legIndex === 3 ? 1 : -1;
    const swing = stride * diagonalPhase * amount;
    // The upper leg swings through while the lower leg bends more on its
    // backward stroke, giving the cow a four-beat, weight-shifting gait.
    upper.rotation.x = swing;
    lower.rotation.x = Math.max(0, -swing) * 0.72 - swing * 0.16;
    upper.position.z = upperZ + swing * 0.075;
    lower.position.z = lowerZ - swing * 0.055;
  });
}
function updateCattle(dt: number, time: number) {
  cattle.forEach((cow, index) => {
    const grazeParts = cow.userData.grazeParts as {
      part: THREE.Object3D;
      y: number;
      z: number;
    }[];
    const legs = cow.userData.legs as CowLeg[];
    if (cow.userData.milking) {
      animateCowLegs(legs, 0, 0);
      return;
    }
    cow.userData.stateTimer -= dt;
    const feedBale = cow.userData.feedBale as THREE.Mesh | undefined;
    if (feedBale) {
      const dx = feedBale.position.x - cow.position.x,
        dz = feedBale.position.z - cow.position.z,
        distance = Math.hypot(dx, dz);
      if (distance > 0.9) {
        grazeParts.forEach(({ part, y, z }) => {
          part.position.y = THREE.MathUtils.lerp(part.position.y, y, dt * 6);
          part.position.z = THREE.MathUtils.lerp(part.position.z, z, dt * 6);
        });
        const heading = Math.atan2(dx, dz);
        const turn = THREE.MathUtils.euclideanModulo(
          heading - cow.rotation.y + Math.PI,
          Math.PI * 2,
        ) - Math.PI;
        cow.rotation.y += turn * Math.min(1, dt * 2.5);
        const stride = Math.sin(time * 11 + index * 1.7);
        animateCowLegs(legs, stride, 0.52);
        const step = Math.min(distance, cow.userData.speed * dt);
        const stepX = (dx / distance) * step;
        const stepZ = (dz / distance) * step;
        if (canAnimalStandAt(cow, cow.position.x + stepX, cow.position.z, 0.72))
          cow.position.x += stepX;
        if (canAnimalStandAt(cow, cow.position.x, cow.position.z + stepZ, 0.72))
          cow.position.z += stepZ;
        cow.position.y = yWorld(cow.position.x, cow.position.z);
        return;
      }
      const eatingTime = (cow.userData.eatingTime as number) + dt;
      cow.userData.eatingTime = eatingTime;
      animateCowLegs(legs, 0, 0);
      const headLowering = 0.28 + Math.sin(time * 8) * 0.035;
      grazeParts.forEach(({ part, y, z }) => {
        part.position.y = THREE.MathUtils.lerp(part.position.y, y - headLowering, dt * 8);
        part.position.z = THREE.MathUtils.lerp(part.position.z, z + 0.12, dt * 8);
      });
      feedBale.scale.setScalar(Math.max(0.03, 1 - eatingTime / 5));
      if (eatingTime >= 5) {
        cow.userData.feedBale = undefined;
        cow.userData.state = "grazing";
        cow.userData.stateTimer = 3 + Math.random() * 5;
        feedHerdBale(feedBale);
      }
      return;
    }
    if (cow.userData.state === "grazing") {
      animateCowLegs(legs, Math.sin(time * 2.2 + index) * 0.12, 0.16);
      const headLowering = 0.2 + Math.sin(time * 2.2 + index) * 0.025;
      grazeParts.forEach(({ part, y, z }) => {
        part.position.y = THREE.MathUtils.lerp(part.position.y, y - headLowering, dt * 6);
        part.position.z = THREE.MathUtils.lerp(part.position.z, z + 0.08, dt * 6);
      });
      if (cow.userData.stateTimer <= 0) {
        chooseGrazingSpot(cow);
        cow.userData.state = "walking";
        cow.userData.stateTimer = 10 + Math.random() * 8;
      }
      return;
    }
    grazeParts.forEach(({ part, y, z }) => {
      part.position.y = THREE.MathUtils.lerp(part.position.y, y, dt * 6);
      part.position.z = THREE.MathUtils.lerp(part.position.z, z, dt * 6);
    });
    const target = cow.userData.target as THREE.Vector2;
    const dx = target.x - cow.position.x,
      dz = target.y - cow.position.z,
      distance = Math.hypot(dx, dz);
    if (distance < 0.12 || cow.userData.stateTimer <= 0) {
      cow.userData.state = "grazing";
      cow.userData.stateTimer = 3 + Math.random() * 5;
      return;
    }
    const heading = Math.atan2(dx, dz);
    const turn = THREE.MathUtils.euclideanModulo(
      heading - cow.rotation.y + Math.PI,
      Math.PI * 2,
    ) - Math.PI;
    cow.rotation.y += turn * Math.min(1, dt * 2.5);
    const stride = Math.sin(time * 11 + index * 1.7);
    animateCowLegs(legs, stride, 0.52);
    const step = Math.min(distance, cow.userData.speed * dt);
    const stepX = (dx / distance) * step;
    const stepZ = (dz / distance) * step;
    if (canAnimalStandAt(cow, cow.position.x + stepX, cow.position.z, 0.72))
      cow.position.x += stepX;
    if (canAnimalStandAt(cow, cow.position.x, cow.position.z + stepZ, 0.72))
      cow.position.z += stepZ;
    cow.position.y = yWorld(cow.position.x, cow.position.z);
  });
}
function canAnimalStandAt(animal: THREE.Group, x: number, z: number, radius: number) {
  if (x < pasture.minX + radius || x > pasture.maxX - radius || z < pasture.minZ + radius || z > pasture.maxZ - radius)
    return false;
  if (
    solidCircles.some(
      (obstacle) => Math.hypot(x - obstacle.x, z - obstacle.z) < radius + obstacle.radius,
    )
  )
    return false;
  if (
    solidBoxes.some((obstacle) => {
      const nearestX = THREE.MathUtils.clamp(x, obstacle.x - obstacle.width / 2, obstacle.x + obstacle.width / 2);
      const nearestZ = THREE.MathUtils.clamp(z, obstacle.z - obstacle.depth / 2, obstacle.z + obstacle.depth / 2);
      return Math.hypot(x - nearestX, z - nearestZ) < radius;
    })
  )
    return false;
  if (
    [...cattle, ...marketAnimals].some(
      (other) => other !== animal && Math.hypot(x - other.position.x, z - other.position.z) < radius + 0.65,
    )
  )
    return false;
  const vehicleCollisionRadii = [
    [tractor, 1.05],
    [harvester, 1.35],
    [planter, 1.05],
    [loader, 1.05],
  ] as const;
  return !vehicleCollisionRadii.some(
    ([vehicle, vehicleRadius]) =>
      Math.hypot(x - vehicle.position.x, z - vehicle.position.z) < radius + vehicleRadius,
  );
}
function chooseMarketAnimalSpot(animal: THREE.Group) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const target = new THREE.Vector2(
      pasture.minX + 1.2 + Math.random() * (pasture.maxX - pasture.minX - 2.4),
      pasture.minZ + 1.2 + Math.random() * (pasture.maxZ - pasture.minZ - 2.4),
    );
    const clearOfHerd = [...cattle, ...marketAnimals].every(
      (other) =>
        other === animal ||
        target.distanceTo(new THREE.Vector2(other.position.x, other.position.z)) > 1.35,
    );
    const radius = animal.userData.kind === "horse" ? 0.6 : 0.42;
    if (clearOfHerd && canAnimalStandAt(animal, target.x, target.y, radius)) {
      animal.userData.target = target;
      return;
    }
  }
  animal.userData.target = new THREE.Vector2(
    pasture.minX + 1.2 + Math.random() * (pasture.maxX - pasture.minX - 2.4),
    pasture.minZ + 1.2 + Math.random() * (pasture.maxZ - pasture.minZ - 2.4),
  );
}
function animateMarketAnimalLegs(legs: THREE.Group[], stride: number, amount: number) {
  legs.forEach((leg, index) => {
    const diagonal = index === 0 || index === 3 ? 1 : -1;
    leg.rotation.x = stride * diagonal * amount;
  });
}
function updateMarketAnimals(dt: number, time: number) {
  marketAnimals.forEach((animal, index) => {
    const head = animal.userData.head as THREE.Object3D;
    const legs = animal.userData.legs as THREE.Group[];
    const mane = animal.userData.mane as THREE.Group | undefined;
    const tail = animal.userData.tail as THREE.Group | undefined;
    if (animal.userData.ridden) {
      animateMarketAnimalLegs(legs, 0, 0);
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, 0, Math.min(1, dt * 7));
      if (tail) tail.rotation.y = Math.sin(time * 3 + index) * 0.08;
      if (mane) mane.rotation.z = Math.sin(time * 3 + index) * 0.025;
      return;
    }
    animal.userData.stateTimer -= dt;
    const feedBale = animal.userData.feedBale as THREE.Mesh | undefined;
    if (feedBale) {
      if (!baleObjects.includes(feedBale)) {
        animal.userData.feedBale = undefined;
        animal.userData.state = "grazing";
      } else {
        const dx = feedBale.position.x - animal.position.x;
        const dz = feedBale.position.z - animal.position.z;
        const distance = Math.hypot(dx, dz);
        const feedingDistance = animal.userData.kind === "horse" ? 1.45 : 1.15;
        if (distance > feedingDistance) {
          const heading = Math.atan2(dx, dz);
          const turn = THREE.MathUtils.euclideanModulo(
            heading - animal.rotation.y + Math.PI,
            Math.PI * 2,
          ) - Math.PI;
          animal.rotation.y += turn * Math.min(1, dt * 3);
          const step = Math.min(distance, 1.3 * dt);
          const radius = animal.userData.kind === "horse" ? 0.6 : 0.42;
          if (canAnimalStandAt(animal, animal.position.x + (dx / distance) * step, animal.position.z, radius))
            animal.position.x += (dx / distance) * step;
          if (canAnimalStandAt(animal, animal.position.x, animal.position.z + (dz / distance) * step, radius))
            animal.position.z += (dz / distance) * step;
          animal.position.y = yWorld(animal.position.x, animal.position.z);
          animateMarketAnimalLegs(legs, Math.sin(time * 12 + index), 0.5);
        } else {
          head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, 0.7, Math.min(1, dt * 5));
          animateMarketAnimalLegs(legs, 0, 0);
        }
        if (tail) tail.rotation.y = Math.sin(time * 3 + index) * 0.12;
        if (mane) mane.rotation.z = Math.sin(time * 2 + index) * 0.03;
        return;
      }
    }
    if (animal.userData.state === "grazing") {
      head.rotation.x = THREE.MathUtils.lerp(
        head.rotation.x,
        0.62 + Math.sin(time * 2.4 + index) * 0.1,
        Math.min(1, dt * 4),
      );
      animateMarketAnimalLegs(legs, 0, 0);
      if (tail) tail.rotation.y = Math.sin(time * 1.8 + index) * 0.14;
      if (mane) mane.rotation.z = Math.sin(time * 1.4 + index) * 0.025;
      if (animal.userData.stateTimer <= 0) {
        chooseMarketAnimalSpot(animal);
        animal.userData.state = "walking";
        animal.userData.stateTimer = 4 + Math.random() * 7;
      }
      return;
    }
    const target = animal.userData.target as THREE.Vector2;
    const dx = target.x - animal.position.x;
    const dz = target.y - animal.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 0.15 || animal.userData.stateTimer <= 0) {
      animal.userData.state = "grazing";
      animal.userData.stateTimer = 2.5 + Math.random() * 5;
      return;
    }
    const heading = Math.atan2(dx, dz);
    const turn = THREE.MathUtils.euclideanModulo(
      heading - animal.rotation.y + Math.PI,
      Math.PI * 2,
    ) - Math.PI;
    animal.rotation.y += turn * Math.min(1, dt * 3);
    const step = Math.min(distance, (animal.userData.speed as number) * dt);
    const radius = animal.userData.kind === "horse" ? 0.6 : 0.42;
    let moved = false;
    const stepX = (dx / distance) * step;
    const stepZ = (dz / distance) * step;
    if (canAnimalStandAt(animal, animal.position.x + stepX, animal.position.z, radius)) {
      animal.position.x += stepX;
      moved = true;
    }
    if (canAnimalStandAt(animal, animal.position.x, animal.position.z + stepZ, radius)) {
      animal.position.z += stepZ;
      moved = true;
    }
    if (!moved) {
      chooseMarketAnimalSpot(animal);
      animal.userData.stateTimer = 4 + Math.random() * 7;
    }
    animal.position.y = yWorld(animal.position.x, animal.position.z);
    head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, 0, Math.min(1, dt * 6));
    const stride = Math.sin(time * 11 + index * 1.7);
    animateMarketAnimalLegs(legs, stride, animal.userData.kind === "horse" ? 0.55 : 0.4);
    if (tail) tail.rotation.y = Math.sin(time * 7 + index) * 0.22;
    if (mane) mane.rotation.z = Math.sin(time * 7 + index) * 0.045;
  });
}
function animateWildLegs(legs: THREE.Group[], stride: number, amount: number) {
  legs.forEach((leg, index) => {
    const phase = index === 0 || index === 3 ? 1 : -1;
    leg.rotation.x = stride * phase * amount;
  });
}
function chooseWildRoamSpot(animal: THREE.Group) {
  const home = animal.userData.home as THREE.Vector2;
  const target = new THREE.Vector2(
    home.x + (Math.random() - 0.5) * 12,
    home.y + (Math.random() - 0.5) * 12,
  );
  animal.userData.target = target;
}
function removeLivestock(prey: THREE.Group, predator: THREE.Group) {
  const cowIndex = cattle.indexOf(prey);
  if (cowIndex >= 0) {
    cattle.splice(cowIndex, 1);
    scene.remove(prey);
  } else {
    const marketIndex = marketAnimals.indexOf(prey);
    if (marketIndex < 0) return;
    marketAnimals.splice(marketIndex, 1);
    scene.remove(prey);
    const kind = prey.userData.kind as "sheep" | "pig" | "horse";
    if (kind === "sheep") sheep = Math.max(0, sheep - 1);
    if (kind === "pig") pigs = Math.max(0, pigs - 1);
    if (kind === "horse") horses = Math.max(0, horses - 1);
  }
  predator.userData.killsTonight++;
  predator.userData.prey = undefined;
  predator.userData.attackTime = 0;
  refreshFarm();
  toast.textContent = `A ${predator.userData.kind} attacked and killed livestock in the pasture!`;
}
function updateWildAnimals(dt: number, time: number) {
  const night = dayElapsed >= DAY_LENGTH_SECONDS;
  wildAnimals.forEach((animal, index) => {
    if (!animal.visible) {
      if (performance.now() >= (animal.userData.respawnAt as number)) {
        const home = animal.userData.home as THREE.Vector2;
        animal.visible = true;
        animal.position.set(home.x, yWorld(home.x, home.y), home.y);
        animal.userData.target = home.clone();
        animal.userData.roamTimer = 3 + Math.random() * 4;
        animal.userData.killsTonight = 0;
        animal.userData.attackTime = 0;
      }
      return;
    }
    const legs = animal.userData.legs as THREE.Group[];
    const head = animal.userData.head as THREE.Object3D;
    const tail = animal.userData.tail as THREE.Object3D;
    let target = animal.userData.target as THREE.Vector2;
    if (!night) {
      animal.userData.killsTonight = 0;
      animal.userData.prey = undefined;
      animal.userData.attackTime = 0;
      animal.userData.roamTimer -= dt;
      if (animal.userData.roamTimer <= 0 || target.distanceTo(new THREE.Vector2(animal.position.x, animal.position.z)) < 0.4) {
        chooseWildRoamSpot(animal);
        target = animal.userData.target as THREE.Vector2;
        animal.userData.roamTimer = 5 + Math.random() * 9;
      }
    } else if ((animal.userData.killsTonight as number) < 1) {
      const livestock = [
        ...cattle,
        ...marketAnimals.filter((animal) => !animal.userData.ridden),
      ];
      let prey = animal.userData.prey as THREE.Group | undefined;
      if (!prey || !livestock.includes(prey)) {
        prey = livestock.sort(
          (a, b) => animal.position.distanceTo(a.position) - animal.position.distanceTo(b.position),
        )[0];
        animal.userData.prey = prey;
      }
      if (prey) {
        target = new THREE.Vector2(prey.position.x, prey.position.z);
        const distance = animal.position.distanceTo(prey.position);
        if (distance < 1.05) {
          if (animal.userData.attackTime === 0)
            toast.textContent = `A ${animal.userData.kind} is attacking livestock!`;
          animal.userData.attackTime += dt;
          animateWildLegs(legs, 0, 0);
          head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, -0.3, Math.min(1, dt * 6));
          if (animal.userData.attackTime >= 4) removeLivestock(prey, animal);
          return;
        }
      }
    } else {
      target = animal.userData.home as THREE.Vector2;
    }
    const dx = target.x - animal.position.x;
    const dz = target.y - animal.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance > 0.08) {
      const heading = Math.atan2(dx, dz);
      const turn = THREE.MathUtils.euclideanModulo(
        heading - animal.rotation.y + Math.PI,
        Math.PI * 2,
      ) - Math.PI;
      animal.rotation.y += turn * Math.min(1, dt * 3);
      const step = Math.min(distance, (animal.userData.speed as number) * dt);
      animal.position.x += (dx / distance) * step;
      animal.position.z += (dz / distance) * step;
      animal.position.x = THREE.MathUtils.clamp(animal.position.x, -50, 50);
      animal.position.z = THREE.MathUtils.clamp(animal.position.z, -50, 50);
      animal.position.y = yWorld(animal.position.x, animal.position.z);
      animateWildLegs(legs, Math.sin(time * 12 + index), 0.5);
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, 0, Math.min(1, dt * 5));
    } else {
      animateWildLegs(legs, 0, 0);
    }
    tail.rotation.y = Math.sin(time * 4 + index) * 0.18;
  });
}
function loop() {
  const dt = Math.min(clock.getDelta(), 0.05),
    t = clock.elapsedTime;
  if (!gameStarted) {
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
    return;
  }
  const airborne =
    !driving && !ridingHorse && hero.position.y > playerGroundY(hero.position.x, hero.position.z) + 0.06;
  const speed = ridingHorse
    ? keys.has("ShiftLeft")
      ? 15
      : 12
    : driving
    ? tractorEngine
      ? 9
      : 6
    : keys.has("ShiftLeft")
      ? 10
      : 5;
  const wasNight = dayElapsed >= DAY_LENGTH_SECONDS;
  dayElapsed += dt;
  if (!wasNight && dayElapsed >= DAY_LENGTH_SECONDS)
    toast.textContent = "Night has fallen. The next day begins in five minutes.";
  if (dayElapsed >= FULL_CYCLE_SECONDS) {
    dayElapsed -= FULL_CYCLE_SECONDS;
    endDay();
  }
  refreshDayTimer();
  updateSky(dt);
  updateCattle(dt, t);
  updateMarketAnimals(dt, t);
  updateWildAnimals(dt, t);
  const nearbyCow = cattle.find(
    (cow) => cow.position.distanceTo(hero.position) <= 2,
  );
  const nearbyGarden = vegetableGardens.find(
    (garden) => garden.position.distanceTo(hero.position) <= 2.2,
  );
  const nearbyPig = marketAnimals.find(
    (animal) => animal.userData.kind === "pig" && animal.position.distanceTo(hero.position) <= 2,
  );
  const nearbyHorse = marketAnimals.find(
    (animal) =>
      animal.userData.kind === "horse" &&
      !animal.userData.ridden &&
      animal.position.distanceTo(hero.position) <= 2.1,
  );
  const nearFridge = refrigerator && hero.position.distanceTo(refrigerator.position) <= 2;
  const nearCouch = Math.hypot(hero.position.x - couchSpot.x, hero.position.z - couchSpot.y) <= 1.45;
  const nearBed = Math.hypot(hero.position.x - bedSpot.x, hero.position.z - bedSpot.y) <= 1.45;
  milkPrompt.hidden =
    driving || (!ridingHorse && !nearbyCow && !nearbyGarden && !nearbyPig && !nearbyHorse && !nearFridge && !nearCouch && !nearBed && !resting) || Boolean(milkingCow);
  if (ridingHorse)
    milkPrompt.innerHTML = "PRESS <b>E</b> TO DISMOUNT HORSE";
  else if (resting)
    milkPrompt.innerHTML = resting === "sitting" ? "PRESS <b>E</b> TO STAND" : "PRESS <b>E</b> TO GET UP";
  else if (nearCouch)
    milkPrompt.innerHTML = "PRESS <b>E</b> TO SIT ON COUCH";
  else if (nearBed)
    milkPrompt.innerHTML = "PRESS <b>E</b> TO LIE ON BED";
  else if (nearbyGarden)
    milkPrompt.innerHTML = nearbyGarden.userData.stage === "ripe"
      ? "PRESS <b>E</b> TO HARVEST VEGETABLES"
      : nearbyGarden.userData.stage === "bare"
        ? "PRESS <b>E</b> TO PLANT VEGETABLES"
        : "VEGETABLES ARE GROWING";
  else if (nearbyPig)
    milkPrompt.innerHTML = nearbyPig.userData.fedDay === farmDay
      ? "PIG FED FOR TODAY"
      : carryingFridgeVegetable
        ? "PRESS <b>E</b> TO FEED PIG VEGETABLE"
        : "TAKE A VEGETABLE FROM THE FRIDGE";
  else if (nearFridge)
    milkPrompt.innerHTML = fridgeOpen
      ? carriedVegetables > 0
        ? "PRESS <b>E</b> TO STORE VEGETABLES"
        : hasMilkBucket
        ? milk > 0
          ? "PRESS <b>E</b> TO CHILL & RETURN PAIL"
          : "PRESS <b>E</b> TO RETURN PAIL"
        : fridgeVegetables > 0
          ? "PRESS <b>E</b> TO TAKE VEGETABLE"
        : "PRESS <b>E</b> TO CLOSE FRIDGE"
      : "PRESS <b>E</b> TO OPEN FRIDGE";
  else if (nearbyHorse) milkPrompt.innerHTML = "PRESS <b>E</b> TO RIDE HORSE";
  else if (nearbyCow) milkPrompt.innerHTML = "PRESS <b>E</b> TO MILK COW";
  if (refrigeratorDoor)
    refrigeratorDoor.rotation.y = THREE.MathUtils.lerp(
      refrigeratorDoor.rotation.y,
      fridgeOpen ? -1.35 : 0,
      Math.min(1, dt * 9),
    );
  if (milkingCow) {
    milkingElapsed += dt;
    hero.scale.y = 0.7;
    coat.position.y = 0.62;
    legs.forEach((leg, index) => {
      leg.rotation.x = index === 0 ? -1.05 : 1.05;
    });
    arms.forEach((arm, index) => {
      arm.rotation.x = index === 0 ? -1.3 + Math.sin(t * 12) * 0.16 : -0.85;
      arm.rotation.z = index === 0 ? 0.45 : -0.45;
    });
    const udderPosition = milkingCow.localToWorld(
      new THREE.Vector3(0, 0.3, -0.32),
    );
    milkBucket.position.copy(udderPosition);
    milkBucket.position.y =
      yWorld(milkBucket.position.x, milkBucket.position.z) + 0.01;
    milkStream.position.copy(udderPosition).add(new THREE.Vector3(0, -0.225, 0));
    milkStream.visible = true;
    if (milkingElapsed >= 2.4) {
      milkingCow.userData.milking = false;
      milkingCow.userData.milkedToday = true;
      milkingCow = null;
      milkStream.visible = false;
      bucketMilk.visible = true;
      scene.remove(milkBucket);
      hero.add(milkBucket);
      milkBucket.position.set(0.32, 0.42, -0.26);
      hero.scale.y = 1;
      coat.position.y = 0.72;
      milk++;
      cattleCare = Math.min(100, cattleCare + 2);
      refreshFarm();
      toast.textContent = `Milk collected! You now have ${milk} pail${milk === 1 ? "" : "s"}.`;
      questText.textContent =
        "Milk each cow once a day, and keep the herd fed with three bales.";
    }
  }
  let dx = 0,
    dz = 0;
  if (keys.has("ArrowUp")) dz -= 1;
  if (keys.has("ArrowDown")) dz += 1;
  if (keys.has("ArrowLeft")) dx -= 1;
  if (keys.has("ArrowRight")) dx += 1;
  if (!milkingCow && !resting && (dx || dz)) {
    const l = Math.hypot(dx, dz);
    dx /= l;
    dz /= l;
    // Keep movement tied to the player's view: rotating the camera does not
    // make the arrow keys suddenly point in unrelated world directions.
    const moveX = dx * Math.cos(orbitYaw) + dz * Math.sin(orbitYaw);
    const moveZ = -dx * Math.sin(orbitYaw) + dz * Math.cos(orbitYaw);
    // A jump keeps a little directional control, but covers far less ground
    // than running and can clear a narrow low obstacle.
    const airControlSpeed = airborne ? 2.1 : speed;
    // Air control should not let the farmer phase through walls, fences, or
    // other solid objects while jumping.
    const collisionRadius = ridingHorse ? 0.6 : 0.32;
    const stepX = moveX * airControlSpeed * dt,
      stepZ = moveZ * airControlSpeed * dt;
    // Resolve each axis separately so the farmer naturally slides along walls
    // and trunks instead of clipping through them or stopping completely.
    if (canStandAt(hero.position.x + stepX, hero.position.z, collisionRadius))
      hero.position.x += stepX;
    if (canStandAt(hero.position.x, hero.position.z + stepZ, collisionRadius))
      hero.position.z += stepZ;
    hero.rotation.y = Math.atan2(-moveX, -moveZ);
    coat.position.y = 0.7 + Math.sin(t * 15) * 0.05;
    const stride = Math.sin(t * 15);
    legs.forEach((leg, index) => {
      leg.rotation.x = (index === 0 ? 1 : -1) * stride * 0.65;
    });
    arms.forEach((arm, index) => {
      arm.rotation.x = (index === 0 ? -1 : 1) * stride * 0.75;
    });
  } else if (!milkingCow && !resting) {
    legs.forEach((leg) => (leg.rotation.x *= 0.75));
    arms.forEach((arm) => (arm.rotation.x *= 0.75));
  }
  hero.position.x = Math.max(-51, Math.min(51, hero.position.x));
  hero.position.z = Math.max(-51, Math.min(51, hero.position.z));
  if (ridingHorse) {
    ridingHorse.position.set(
      hero.position.x,
      yWorld(hero.position.x, hero.position.z),
      hero.position.z,
    );
    ridingHorse.rotation.y = hero.rotation.y + Math.PI;
    hero.position.y = ridingHorse.position.y + 1.47;
    vy = 0;
    coat.position.y = 0.72;
    legs.forEach((leg, index) => {
      leg.rotation.x = index === 0 ? -1.05 : 1.05;
      leg.rotation.z = index === 0 ? 0.65 : -0.65;
    });
    arms.forEach((arm, index) => {
      arm.rotation.x = -0.82;
      arm.rotation.z = index === 0 ? 0.26 : -0.26;
    });
  } else if (!resting) {
    vy -= 15 * dt;
    hero.position.y += vy * dt;
    const floor = playerGroundY(hero.position.x, hero.position.z);
    if (hero.position.y < floor) {
      hero.position.y = floor;
      vy = 0;
    }
  }
  (beacon.userData.sails as THREE.Group).rotation.z = t * 0.8;
  shards.forEach((s) => {
    s.rotation.y += dt * 1.5;
    s.position.y =
      yWorld(s.position.x, s.position.z) +
      0.72 +
      Math.sin(t * 2 + s.position.x) * 0.12;
  });
  const d = hero.position.distanceTo(beacon.position);
  location.textContent =
    d < 12
      ? "WINDMILL HILL"
      : hero.position.x < -13
        ? "WESTWOOD"
        : hero.position.x > 4 && hero.position.z > 2
          ? "CATTLE PASTURE"
          : hero.position.z < -1 && hero.position.x < -1
            ? "WHEAT FIELDS"
            : Math.abs(hero.position.x) > 38 || Math.abs(hero.position.z) > 38
              ? "MOUNTAIN BORDER"
              : "HOMESTEAD";
  const distance = camera.userData.distance ?? 10;
  const target = hero.position
    .clone()
    .add(
      new THREE.Vector3(
        Math.sin(orbitYaw) * Math.cos(orbitPitch) * distance,
        Math.sin(orbitPitch) * distance,
        Math.cos(orbitYaw) * Math.cos(orbitPitch) * distance,
      ),
    );
  camera.position.lerp(target, 0.14);
  camera.lookAt(hero.position.x, hero.position.y + 0.8, hero.position.z);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
loop();
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
