// Variables globales pour la scène 3D
let scene, camera, renderer;
let robots = [], products = [], sparks = [];
let animationId;
let isVisible = true;
const clock = new THREE.Clock();

// Configurations par état (manuel, semi-auto, automated)
const stateConfigs = {
    manual: {
        productionSpeed: 0.5,
        robotSpeed: 0.3,
        robotCount: 2,
        color: 0xff4444
    },
    'semi-auto': {
        productionSpeed: 1.5,
        robotSpeed: 1.0,
        robotCount: 4,
        color: 0xf59e0b
    },
    automated: {
        productionSpeed: 3.5,
        robotSpeed: 2.0,
        robotCount: 8,
        color: 0x10b981
    }
};

/**
 * Initialise la scène Three.js
 */
function initThreeJS() {
    if (!utils.isWebGLAvailable()) {
        document.getElementById('fallback').hidden = false;
        return null;
    }

    // Scène
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0f172a, 5, 50);

    // Caméra
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0f172a);
    renderer.shadowMap.enabled = true;

    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Éclairage
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(2048, 2048);
    scene.add(directionalLight);

    // Sol
    const floorGeometry = new THREE.PlaneGeometry(30, 20);
    const floorMaterial = new THREE.MeshLambertMaterial({
        color: 0x2a2a2a,
        transparent: true,
        opacity: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Tapis roulant
    const beltGeometry = new THREE.BoxGeometry(20, 0.2, 2);
    const beltMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const conveyorBelt = new THREE.Mesh(beltGeometry, beltMaterial);
    conveyorBelt.position.set(0, 0.1, 0);
    conveyorBelt.castShadow = true;
    scene.add(conveyorBelt);

    return { scene, camera, renderer };
}

/**
 * Crée les robots selon l'état courant
 * @param {string} state
 */
function createRobots(state) {
    const config = stateConfigs[state];

    // Nettoyage des robots existants
    robots.forEach(robot => scene.remove(robot.group));
    robots = [];

    for (let i = 0; i < config.robotCount; i++) {
        const robotGroup = new THREE.Group();

        // Base
        const baseGeometry = new THREE.CylinderGeometry(0.3, 0.5, 0.8, 8);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.castShadow = true;
        robotGroup.add(base);

        // Bras
        const armGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.2);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0x4a9eff });
        const arm = new THREE.Mesh(armGeometry, armMaterial);
        arm.position.y = 1;
        arm.castShadow = true;
        robotGroup.add(arm);

        // LED
        const ledGeometry = new THREE.SphereGeometry(0.1, 8, 6);
        const ledMaterial = new THREE.MeshBasicMaterial({
            color: config.color,
            emissive: config.color,
            emissiveIntensity: 0.3
        });
        const led = new THREE.Mesh(ledGeometry, ledMaterial);
        led.position.set(0, 0.2, 0.4);
        robotGroup.add(led);

        // Positionnement circulaire
        const angle = (i / config.robotCount) * Math.PI * 2;
        const radius = 4 + Math.random() * 2;
        robotGroup.position.set(
            Math.cos(angle) * radius,
            0.4,
            Math.sin(angle) * radius + (Math.random() - 0.5) * 8
        );

        scene.add(robotGroup);
        robots.push({
            group: robotGroup,
            arm: arm,
            led: led,
            baseRotation: Math.random() * Math.PI * 2,
            speed: 1 + Math.random() * 0.5
        });
    }
}

/**
 * Crée un produit sur le tapis roulant
 * @param {number} x
 * @param {number} delay
 */
function createProduct(x = -10, delay = 0) {
    setTimeout(() => {
        const productGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const hue = Math.random();
        const productMaterial = new THREE.MeshLambertMaterial({
            color: new THREE.Color().setHSL(hue, 0.7, 0.6)
        });
        const product = new THREE.Mesh(productGeometry, productMaterial);
        product.position.set(x, 0.5, (Math.random() - 0.5) * 1.5);
        product.castShadow = true;
        product.userData = {
            velocity: stateConfigs[ui.currentState].productionSpeed + Math.random() * 0.5,
            processed: false
        };
        scene.add(product);
        products.push(product);
    }, delay * 1000);
}

/**
 * Crée un effet d'étincelles
 * @param {THREE.Vector3} position
 */
function createSparkEffect(position) {
    for (let i = 0; i < 5; i++) {
        const sparkGeometry = new THREE.SphereGeometry(0.02, 4, 3);
        const sparkMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            emissive: 0xffaa00
        });
        const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
        spark.position.copy(position);
        spark.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                Math.random() * 2,
                (Math.random() - 0.5) * 2
            ),
            life: 1
        };
        scene.add(spark);
        sparks.push(spark);
    }
}

/**
 * Boucle d'animation principale
 */
function animate() {
    if (!isVisible) {
        setTimeout(animate, 100);
        return;
    }

    animationId = requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = clock.getDelta();
    const config = stateConfigs[ui.currentState];

    // Animation des robots
    robots.forEach((robot, index) => {
        const speed = config.robotSpeed * robot.speed;
        robot.group.rotation.y = robot.baseRotation + elapsedTime * speed;
        robot.arm.rotation.z = Math.sin(elapsedTime * 3 + index) * 0.3;
        robot.arm.rotation.x = Math.cos(elapsedTime * 2 + index) * 0.2;
    });

    // Animation des produits
    products.forEach((product, index) => {
        product.position.x += product.userData.velocity * deltaTime;
        product.rotation.y += deltaTime * 2;

        if (!product.userData.processed && product.position.x > -2 && product.position.x < 2) {
            product.userData.processed = true;
            createSparkEffect(product.position);
            product.material.color.setHex(config.color);
            product.material.emissive.setHex(config.color);
            product.material.emissiveIntensity = 0.2;
        }

        if (product.position.x > 12) {
            scene.remove(product);
            products.splice(index, 1);
        }
    });

    // Animation des étincelles
    sparks.forEach((spark, index) => {
        spark.position.add(spark.userData.velocity.clone().multiplyScalar(deltaTime));
        spark.userData.velocity.y -= 5 * deltaTime;
        spark.userData.life -= deltaTime * 2;

        if (spark.userData.life <= 0) {
            scene.remove(spark);
            sparks.splice(index, 1);
        } else {
            spark.material.opacity = spark.userData.life;
            spark.scale.setScalar(spark.userData.life);
        }
    });

    // Mouvement léger de la caméra
    camera.position.x = Math.sin(elapsedTime * 0.1) * 0.5;
    camera.position.y = 8 + Math.sin(elapsedTime * 0.15) * 0.3;

    renderer.render(scene, camera);
}

/**
 * Gère le redimensionnement de la fenêtre
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Exporte les fonctions pour main.js
window.factory = {
    initThreeJS,
    createRobots,
    createProduct,
    animate,
    onWindowResize,
    cleanup: () => utils.cleanupThreeJS(scene, renderer)
};
