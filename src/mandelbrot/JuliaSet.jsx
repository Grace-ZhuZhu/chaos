/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import * as d3 from 'd3';
import * as THREE from 'three';

const VIEW_ANGLE = 45;
const NEAR = 0.1;
const FAR = 1000;

export class JuliaSet extends Component {
    constructor(props) {
        super(props);

        const { screenWidth, screenHeight } = this.props;
        this.width = screenWidth / 2;
        this.height = screenHeight;

        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = null;
        this.canvasPlane = null;

        this.uniformValues = {
            offset: new THREE.Vector2(0, 0),
            C: new THREE.Vector2(0.25, 0.52),
            zoom: 1,
            translate: new THREE.Vector2(0, 0),
        };
    }

    componentDidMount() {
        this.setupRenderer();
        this.setupCamera();
        this.setupScene();
        this.renderer.render(this.scene, this.camera);
    }

    setupRenderer = () => {
        const { container } = this.refs;
        this.renderer.setSize(this.width, this.height);
        container.append(this.renderer.domElement);

        this.setupDragAndZoomHandler();
    }

    setupCamera = () => {
        this.camera = new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            this.width / this.height,
            NEAR,
            FAR,
        );
        this.camera.position.set(0, 0, FAR);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    setupScene = () => {
        const { vertexShader, fragmentShader } = this.getShaders();

        const uniforms = {
            C: {
                type: 'v2',
                value: this.uniformValues.C,
            },
            zoom: {
                type: 'f',
                value: this.uniformValues.zoom,
            },
            offset: {
                type: 'v2',
                value: this.uniformValues.offset,
            },
            translate: {
                type: 'v2',
                value: this.uniformValues.translate,
            },
        };

        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
        });

        this.canvasPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(this.width, this.height),
            shaderMaterial,
        );

        this.scene.add(this.canvasPlane);
        this.scene.add(this.camera);
    }

    getShaders() {
        const vertexShader = `
            #ifdef GL_ES
            precision highp float;
            #endif

            varying vec2 initial_z;
            uniform float zoom;
            uniform vec2 offset;
            uniform vec2 translate;

            void main()
            {
                float scale = 1.0/zoom;
                initial_z = (position.xy - translate) * scale;
                gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            #ifdef GL_ES
            precision highp float;
            #endif
            
            varying vec2 initial_z;
            uniform vec2 C;

            void main()
            {
                vec2 Z = initial_z;
                const int MAX_ITERATION = 1000;    
                int iteration = 0;
                for (int i = 0; i < MAX_ITERATION; i += 1) {
                    if (length(Z) > max(length(C), float(2))) {
                        break;
                    }
        
                    vec2 zSquared = vec2(Z.x * Z.x - Z.y * Z.y, 2.0 * Z.x * Z.y);
        
                    Z = zSquared + C;

                    iteration = i;
                }
        
                vec4 outside_color = vec4(.12, .76, .66, 1.0);
                vec4 inside_color = vec4(.98, .3, .4, 1.0);
                float rate = float(iteration) / float(MAX_ITERATION);

                gl_FragColor = outside_color + (inside_color - outside_color) * rate;
            }
        `;
        return {
            vertexShader,
            fragmentShader,
        };
    }

    setupDragAndZoomHandler() {
        const drag = d3.drag()
            .on('drag', () => this.dragged());

        const zoom = d3.zoom()
            .translateExtent([
                [-this.width * 2, -this.height * 2],
                [this.width * 2, this.height * 2],
            ])
            .on('zoom', () => this.zoomed());

        const view = d3.select(this.renderer.domElement);
        view.call(drag);
        view.call(zoom);
    }

    dragged() {
        const { dx, dy } = d3.event;
        const { value: lastOffset } = this.uniformValues.offset;
        const moved = new THREE.Vector2(-dx / this.width, dy / this.height);
        this.canvasPlane.material.uniforms.offset.value = lastOffset.add(moved);

        this.renderScene();
    }

    zoomed() {
        const { transform } = d3.event;
        const { k } = transform; // The whole scale

        const cursor = d3.mouse(d3.select(this.renderer.domElement).node());

        const cursor_coord = new THREE.Vector2(
            (cursor[0] - this.centerX) / (this.width / 2),
            (cursor[1] - this.centerY) / (this.height / 2),
        );

        const scaled_cursor_coord = new THREE.Vector2(
            cursor_coord.x * k,
            cursor_coord.y * k,
        );

        this.canvasPlane.material.uniforms.zoom.value = k;
        this.canvasPlane.material.uniforms.translate.value = new THREE.Vector2(
            cursor_coord.x - scaled_cursor_coord.x,
            scaled_cursor_coord.y - cursor_coord.y,
        );


        this.renderScene();
    }

    renderScene() {
        this.canvasPlane.material.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return (
            <div
                id="juliaSet"
                ref="container"
                width={this.width}
                height={this.height}
                style={{ border: '1px solid #000000' }}
            />
        );
    }
}
