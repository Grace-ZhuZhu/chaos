const width = window.innerWidth;
const height = window.innerHeight;

// Add canvas
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// Add stats box
stats = new Stats();
stats.dom.style.position = 'absolute';
stats.dom.style.top = '0px';
stats.dom.style.right = '0px';
document.body.appendChild(stats.dom);

const near_plane = 2;
const far_plane = 100;

// Set up camera and scene
const camera = new THREE.PerspectiveCamera(
    20,
    width / height,
    near_plane,
    far_plane,
);
camera.position.set(0, 0, far_plane);
camera.lookAt(new THREE.Vector3(0, 0, 0));
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

let pointsMaterial;

fetch('//fastforwardlabs.github.io/visualization_assets/word2vec_tsne_2d.json')
    .then(response => response.json())
    .then((raw_points) => {
        const pointsGeometry = new THREE.Geometry();
        const colors = [];
        for (const point of raw_points) {
            const vertex = new THREE.Vector3(point.coords[0], point.coords[1], 0);
            pointsGeometry.vertices.push(vertex);
            const color = new THREE.Color();
            color.setHSL(Math.random(), 1.0, 0.5);
            colors.push(color);
        }
        pointsGeometry.colors = colors;
        pointsMaterial = new THREE.PointsMaterial({
            // map: spriteMap,
            size: 6,
            // transparent: true,
            // blending: THREE.AdditiveBlending,
            sizeAttenuation: false,
            vertexColors: THREE.VertexColors,
        });
        const points = new THREE.Points(pointsGeometry, pointsMaterial);
        const pointsContainer = new THREE.Object3D();
        pointsContainer.add(points);
        scene.add(pointsContainer);
    });

// Set up zoom behavior
const zoom = d3.zoom()
    .scaleExtent([near_plane, far_plane])
    .wheelDelta(() =>
    // this inverts d3 zoom direction, which makes it the rith zoom direction for setting the camera
        d3.event.deltaY * (d3.event.deltaMode ? 120 : 1) / 500)
    .on('zoom', () => {
        const event = d3.event;
        if (event.sourceEvent) {
            // Get z from D3
            const new_z = event.transform.k;

            if (new_z !== camera.position.z) {
                // Handle a zoom event
                const { clientX, clientY } = event.sourceEvent;

                // Project a vector from current mouse position and zoom level
                // Find the x and y coordinates for where that vector intersects the new
                // zoom level.
                // Code from WestLangley https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z/13091694#13091694
                const vector = new THREE.Vector3(
                    clientX / width * 2 - 1,
                    -(clientY / height) * 2 + 1,
                    1,
                );
                vector.unproject(camera);
                const dir = vector.sub(camera.position).normalize();
                const distance = (new_z - camera.position.z) / dir.z;
                const pos = camera.position.clone().add(dir.multiplyScalar(distance));


                if (camera.position.z < 20) {
                    scale = (20 - camera.position.z) / camera.position.z;
                    pointsMaterial.setValues({ size: 6 + 3 * scale });
                } else if (camera.position.z >= 20 && pointsMaterial.size !== 6) {
                    pointsMaterial.setValues({ size: 6 });
                }

                // Set the camera to new coordinates
                camera.position.set(pos.x, pos.y, new_z);
            } else {
                // Handle panning
                const { movementX, movementY } = event.sourceEvent;

                // Adjust mouse movement by current scale and set camera
                const current_scale = getCurrentScale();
                camera.position.set(camera.position.x - movementX / current_scale, camera.position.y +
          movementY / current_scale, camera.position.z);
            }
        }
    });

// Add zoom listener
const view = d3.select(renderer.domElement);
view.call(zoom);

// Disable double click to zoom because I'm not handling it in Three.js
view.on('dblclick.zoom', null);

// Sync d3 zoom with camera z position
zoom.scaleTo(view, far_plane);

// Three.js render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
}
animate();

// From https://github.com/anvaka/three.map.control, used for panning
function getCurrentScale() {
    const vFOV = camera.fov * Math.PI / 180;
    const scale_height = 2 * Math.tan(vFOV / 2) * camera.position.z;
    const currentScale = height / scale_height;
    return currentScale;
}

// Point generator function
function phyllotaxis(radius) {
    const theta = Math.PI * (3 - Math.sqrt(5));
    return function (i) {
        const r = radius * Math.sqrt(i),
            a = theta * i;
        return [
            width / 2 + r * Math.cos(a) - width / 2,
            height / 2 + r * Math.sin(a) - height / 2,
        ];
    };
}

// Temp

zoomed() {
    const { k } = d3.event.transform;

    const cursor = d3.mouse(d3.select(this.renderer.domElement).node());
    
    const cursor_coord = this.getNormalizedCoord(cursor[0], cursor[1]);
    const cusor_coord_original = this.getOriginalCoord(cursor_coord);

    const scaled_cursor_coord = new THREE.Vector2(
        cusor_coord_original.x * k,
        cusor_coord_original.y * k,
    );
    const new_cursor_coord = new THREE.Vector2().addVectors(this.currentOrigin, scaled_cursor_coord);

    const translate = new THREE.Vector2(
        cursor_coord.x - new_cursor_coord.x,
        new_cursor_coord.y - cursor_coord.y,
    );

    this.currentZoom = k;
    this.currentOrigin = new THREE.Vector2().addVectors(this.currentOrigin, translate);

    this.canvasPlane.material.uniforms.zoom.value = this.currentZoom;
    this.canvasPlane.material.uniforms.translate.value = this.currentOrigin;

    this.renderScene();
}
