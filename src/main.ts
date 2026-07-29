import "./style.css";
import * as THREE from "three";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `<div class="ui"><header><div class="brand"><b>✦</b><div><h1>GREENACRE FARM</h1><small>OPEN COUNTRY EXPLORATION</small></div></div><div class="compass"><span>W</span><i></i><b>N</b><i></i><span>E</span></div><div class="shards">♧ <strong id="shards">0</strong><small> FARM LEVEL</small></div></header><aside class="quest"><p>FARM JOURNAL</p><h2>A farmer's first day</h2><span id="questText">Harvest wheat, then take care of the cattle.</span><div><i></i><i></i><i></i></div></aside><aside class="farm-status"><p>FARM SUPPLIES</p><div>Wheat <b id="wheat">0</b></div><div>Cattle care <b id="care">50%</b></div><div>Ripe plots <b id="plots">18</b></div><div>Field bales <b id="bales">0</b></div><div>Barn stack <b id="stored">0</b></div><button id="dropBale">DROP BALE (F)</button><button id="sleep">END DAY</button></aside><div class="location" id="location">HOMESTEAD</div><div class="guide"><b>ARROWS</b> move / drive <b>DRAG</b> look around <b>SHIFT</b> sprint <b>SPACE</b> jump <b>E</b> interact / tractor <b>F</b> drop bale</div><div class="toast" id="toast">Walk into the wheat field and press E to harvest.</div></div>`;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87c7db);
scene.fog = new THREE.FogExp2(0x87c7db, 0.012);
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
scene.add(new THREE.HemisphereLight(0xdaf2ff, 0x355a55, 2.2));
const sun = new THREE.DirectionalLight(0xffecae, 3);
sun.position.set(-18, 30, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);
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
const trunk = new THREE.MeshStandardMaterial({ color: 0x68482d }),
  leaf = new THREE.MeshStandardMaterial({ color: 0x246946, flatShading: true }),
  rockM = new THREE.MeshStandardMaterial({
    color: 0x6f7d7c,
    flatShading: true,
  });
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
}
function rock(x: number, z: number) {
  const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45, 0), rockM);
  r.position.set(x, yWorld(x, z) + 0.25, z);
  r.scale.set(1.4, 0.75, 1);
  r.castShadow = true;
  scene.add(r);
}
for (let i = 0; i < 180; i++) {
  const x = (Math.random() - 0.5) * 96,
    z = (Math.random() - 0.5) * 96;
  const insideField = x > -40 && x < -2 && z > -40 && z < -2;
  if (
    Math.hypot(x, z) < 10 ||
    (Math.abs(x - 27) < 8 && Math.abs(z + 22) < 9) ||
    insideField
  )
    continue;
  if (Math.random() > 0.34) tree(x, z, 0.65 + Math.random() * 0.7);
  else rock(x, z);
}
const shards: THREE.Group[] = [];
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
  addBox(barnRed, x, y + 1.5, z, 6, 3, 4.5);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(3.7, 2.2, 4), farmWood);
  roof.position.set(x, y + 4, z);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  scene.add(roof);
  addBox(
    new THREE.MeshStandardMaterial({ color: 0x4e2c22 }),
    x,
    y + 0.8,
    z - 2.28,
    1.25,
    1.6,
    0.05,
  );
}
function farmhouse(x: number, z: number) {
  const y = yWorld(x, z);
  const wall = new THREE.MeshStandardMaterial({ color: 0xe8ddbd });
  addBox(wall, x, y + 1.3, z, 4.6, 2.6, 3.8);
  const top = new THREE.Mesh(
    new THREE.ConeGeometry(3.05, 1.75, 4),
    new THREE.MeshStandardMaterial({ color: 0x66513e }),
  );
  top.position.set(x, y + 3.45, z);
  top.rotation.y = Math.PI / 4;
  top.castShadow = true;
  scene.add(top);
  addBox(farmWood, x, y + 0.75, z - 1.92, 0.9, 1.5, 0.07);
}
function fenceLine(x: number, z: number, length: number, vertical: boolean) {
  for (let i = 0; i < length; i++) {
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
  }
}
barn(4, -5);
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
tractor.position.set(1.6, yWorld(1.6, -5) + 0.05, -5);
tractor.rotation.y = Math.PI / 2;
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
harvester.position.set(-1.3, yWorld(-1.3, -5) + 0.05, -5);
harvester.rotation.y = Math.PI / 2;
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
planter.position.set(-4.1, yWorld(-4.1, -5) + 0.05, -5);
planter.rotation.y = Math.PI / 2;
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
loader.position.set(-6.7, yWorld(-6.7, -5) + 0.05, -5);
loader.rotation.y = Math.PI / 2;
loader.traverse((o) => {
  if (o instanceof THREE.Mesh) o.castShadow = true;
});
scene.add(loader);
const baleStack = new THREE.Group();
baleStack.position.set(1.5, yWorld(1.5, -7) + 0.05, -7);
scene.add(baleStack);
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
fenceLine(fieldX - fieldW / 2, fieldZ + fieldD / 2, 41, false);
// Hay bales mark the field edge.
for (const [x, z] of [
  [-38, -38],
  [-37.3, -38],
  [-4, -38],
]) {
  const bale = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.34, 0.65, 10),
    hay,
  );
  bale.rotation.z = Math.PI / 2;
  bale.position.set(x, yWorld(x, z) + 0.35, z);
  bale.castShadow = true;
  scene.add(bale);
}
// Pasture: a distinct grass pen with grazing cattle.
fenceLine(5, 3, 12, false);
fenceLine(5, 3, 10, true);
fenceLine(14.9, 3, 10, true);
fenceLine(5, 11.1, 12, false);
for (const [x, z] of [
  [7, 5],
  [10, 7],
  [13, 5.5],
  [8, 9.5],
]) {
  const cow = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xf5f0df }),
  );
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.32, 0.32),
    new THREE.MeshStandardMaterial({ color: 0xf5f0df }),
  );
  head.position.set(0, 0.05, 0.52);
  cow.add(body, head);
  cow.position.set(x, yWorld(x, z) + 0.42, z);
  cow.rotation.y = Math.random() * Math.PI;
  cow.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  scene.add(cow);
}
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
function creature(x: number, z: number, color: number) {
  const g = new THREE.Group(),
    body = new THREE.Mesh(
      new THREE.SphereGeometry(0.52, 10, 8),
      new THREE.MeshStandardMaterial({ color }),
    ),
    head = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 9, 8),
      new THREE.MeshStandardMaterial({ color }),
    );
  head.position.set(0, 0.16, 0.48);
  g.add(body, head);
  g.position.set(x, yWorld(x, z) + 0.5, z);
  g.userData.origin = g.position.clone();
  scene.add(g);
  return g;
}
const creatures = [
  creature(-15, 10, 0xd6ac7c),
  creature(-12, 13, 0xd6ac7c),
  creature(14, 9, 0x899e76),
];
const hero = new THREE.Group(),
  denim = new THREE.MeshStandardMaterial({ color: 0x315b91, roughness: 0.8 }),
  flannel = new THREE.MeshStandardMaterial({
    color: 0xa64031,
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
for (const x of [-0.125, 0.125]) {
  const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, 0.3, 5, 8), denim);
  leg.position.set(x, 0.32, 0);
  const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.29), boot);
  shoe.position.set(x, 0.09, -0.06);
  hero.add(leg, shoe);
}
for (const x of [-0.32, 0.32]) {
  const arm = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.07, 0.4, 5, 7),
    flannel,
  );
  arm.position.set(x, 0.8, 0);
  arm.rotation.z = x < 0 ? 0.12 : -0.12;
  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 7), skin);
  hand.position.set(x, 0.55, -0.02);
  hero.add(arm, hand);
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
  hatBrim,
  hatCrown,
  hatBand,
);
hero.position.set(0, yWorld(0, 0), 0);
hero.traverse((o) => {
  if (o instanceof THREE.Mesh) o.castShadow = true;
});
scene.add(hero);
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
  storedBales = 0;
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
  careLabel = document.querySelector("#care")!,
  plotsLabel = document.querySelector("#plots")!,
  balesLabel = document.querySelector("#bales")!,
  storedLabel = document.querySelector("#stored")!;
function refreshFarm() {
  wheatLabel.textContent = String(wheat);
  careLabel.textContent = `${cattleCare}%`;
  plotsLabel.textContent = String(ripePlots);
  balesLabel.textContent = String(bales);
  storedLabel.textContent = String(storedBales);
  shardLabel.textContent = String(shardCount);
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
  if (nearby.length) {
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
    storedBales++;
    toast.textContent = column.length
      ? "Bale stacked neatly on the pile."
      : "Bale placed neatly beside the stack.";
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
}
function dropHarvest() {
  for (let i = 0; i < 3; i++) {
    const sheaf = new THREE.Group();
    for (let stalk = 0; stalk < 6; stalk++) {
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.55, 5),
        hay,
      );
      stem.position.set(
        (Math.random() - 0.5) * 0.24,
        0.28,
        (Math.random() - 0.5) * 0.24,
      );
      stem.rotation.z = (Math.random() - 0.5) * 0.45;
      sheaf.add(stem);
    }
    sheaf.position
      .copy(hero.position)
      .add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          1.2 + i * 0.2,
          (Math.random() - 0.5) * 0.4,
        ),
      );
    scene.add(sheaf);
    fallenWheat.push({
      mesh: sheaf,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 1.1,
        0.5 + i * 0.15,
        (Math.random() - 0.5) * 1.1,
      ),
      settled: false,
    });
  }
}
const cutWheatMat = new THREE.MeshStandardMaterial({
  color: 0xe5bd4c,
  roughness: 0.85,
});
function dropCutStalks() {
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
    harvester.quaternion,
  );
  for (let i = 0; i < 1; i++) {
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
    const spread = new THREE.Vector3(
      (Math.random() - 0.5) * 0.8,
      0,
      (Math.random() - 0.5) * 0.25,
    );
    clump.position
      .copy(harvester.position)
      .addScaledVector(forward, 1.45)
      .add(spread);
    clump.position.y += 0.8 + Math.random() * 0.2;
    scene.add(clump);
    fallenWheat.push({
      mesh: clump,
      velocity: forward
        .clone()
        .multiplyScalar(1 + Math.random())
        .add(
          new THREE.Vector3(
            Math.random() - 0.5,
            1.2 + Math.random(),
            Math.random() - 0.5,
          ),
        ),
      settled: false,
    });
  }
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
      Math.abs(offset.dot(right)) < 1.45
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
function farmAction() {
  const inField =
    hero.position.x > -40 &&
    hero.position.x < -3 &&
    hero.position.z > -40 &&
    hero.position.z < -3;
  const inPasture =
    hero.position.x > 4 &&
    hero.position.x < 16 &&
    hero.position.z > 2 &&
    hero.position.z < 13;
  if (inField) {
    if (ripePlots === 0) {
      toast.textContent = "These plots need another day to grow.";
      return;
    }
    ripePlots--;
    cropMaturity = Math.max(0.16, cropMaturity - 0.075);
    wheat += 2;
    shardCount++;
    dropHarvest();
    refreshFarm();
    toast.textContent = "Harvested wheat dropped at your feet.";
    questText.textContent =
      "The field is producing. Feed the cattle in the pasture.";
    return;
  }
  if (inPasture) {
    if (wheat === 0) {
      toast.textContent = "The cattle need wheat. Harvest the fields first.";
      return;
    }
    wheat--;
    cattleCare = Math.min(100, cattleCare + 18);
    refreshFarm();
    toast.textContent = "The cattle are well fed and content.";
    if (cattleCare >= 80)
      questText.textContent =
        "The herd is thriving. Your farm is off to a fine start.";
    return;
  }
  toast.textContent =
    "There is nothing to tend here. Visit the field or pasture.";
}
addEventListener("keydown", (e) => {
  keys.add(e.code);
  if (
    e.code === "Space" &&
    !driving &&
    hero.position.y <= yWorld(hero.position.x, hero.position.z) + 0.14
  )
    vy = 6.2;
  if (e.code === "KeyF" && driving && usingLoader) {
    e.preventDefault();
    dropCarriedBale();
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
      hero.position.copy(vehicle.position).add(new THREE.Vector3(1, 0, 0));
      toast.textContent = "You climb down from the vehicle.";
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
        "The mill is turning. Bring wheat from the field to the cattle.";
      toast.textContent = "The windmill hums to life!";
    } else farmAction();
  }
});
addEventListener("keyup", (e) => keys.delete(e.code));
const dropButton = document.querySelector<HTMLButtonElement>("#dropBale")!;
dropButton.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  dropCarriedBale();
});
document.querySelector("#sleep")!.addEventListener("click", () => {
  farmDay++;
  ripePlots = Math.min(18, ripePlots + 6);
  cropMaturity = Math.min(1, cropMaturity + 0.35);
  cattleCare = Math.max(0, cattleCare - 8);
  refreshFarm();
  toast.textContent = `Day ${farmDay}: the wheat has grown, and the cattle need attention.`;
  if (cattleCare < 35)
    questText.textContent = "The cattle are unhappy. Feed them wheat soon.";
});
refreshFarm();
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
          toast.textContent = `Tractor collected wheat (${looseStraw}/3).`;
          if (looseStraw >= 3) {
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
function loop() {
  const dt = Math.min(clock.getDelta(), 0.05),
    t = clock.elapsedTime;
  const speed = keys.has("ShiftLeft") ? 10 : 5;
  let dx = 0,
    dz = 0;
  if (keys.has("ArrowUp")) dz -= 1;
  if (keys.has("ArrowDown")) dz += 1;
  if (keys.has("ArrowLeft")) dx -= 1;
  if (keys.has("ArrowRight")) dx += 1;
  if (dx || dz) {
    const l = Math.hypot(dx, dz);
    dx /= l;
    dz /= l;
    hero.position.x += dx * speed * dt;
    hero.position.z += dz * speed * dt;
    hero.rotation.y = Math.atan2(-dx, -dz);
    coat.position.y = 0.7 + Math.sin(t * 15) * 0.05;
  }
  hero.position.x = Math.max(-51, Math.min(51, hero.position.x));
  hero.position.z = Math.max(-51, Math.min(51, hero.position.z));
  vy -= 15 * dt;
  hero.position.y += vy * dt;
  const floor = yWorld(hero.position.x, hero.position.z);
  if (hero.position.y < floor) {
    hero.position.y = floor;
    vy = 0;
  }
  (beacon.userData.sails as THREE.Group).rotation.z = t * 0.8;
  shards.forEach((s) => {
    s.rotation.y += dt * 1.5;
    s.position.y =
      yWorld(s.position.x, s.position.z) +
      0.72 +
      Math.sin(t * 2 + s.position.x) * 0.12;
    if (!s.userData.collected && hero.position.distanceTo(s.position) < 1.25) {
      s.userData.collected = true;
      s.visible = false;
      shardCount++;
      shardLabel.textContent = String(shardCount);
      toast.textContent = `Fresh crop collected! ${shardCount} of 12.`;
      if (interacted && shardCount >= 3)
        questText.textContent =
          "The market basket is ready. Enjoy the open farm.";
    }
  });
  creatures.forEach((c, i) => {
    const o = c.userData.origin as THREE.Vector3;
    c.position.x = o.x + Math.sin(t * 0.5 + i) * 1.2;
    c.position.z = o.z + Math.cos(t * 0.45 + i) * 0.8;
    c.position.y = yWorld(c.position.x, c.position.z) + 0.5;
    c.rotation.y = t * 0.5 + i;
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
