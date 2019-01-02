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
    }

    componentDidMount() {
        const { container } = this.refs;

        const renderer = new THREE.WebGLRenderer();
        const camera = new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            this.width / this.height,
            NEAR,
            FAR,
        );
        const scene = new THREE.Scene();

        camera.position.set(0, 0, FAR);

        camera.lookAt(new THREE.Vector3(0, 0, 0));

        renderer.setSize(this.width, this.height);

        container.append(renderer.domElement);

        const vertexShader = `
            #ifdef GL_ES
            precision highp float;
            #endif

            varying vec2 initial_z;

            void main()
            {
                initial_z = position.xy;
                gl_Position = vec4(position,1.0);
            }
        `;

        const fragmentShader = `
            #ifdef GL_ES
            precision highp float;
            #endif
            
            varying vec2 initial_z;
            uniform vec2 C;
            uniform sampler2D gradient;

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

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('/data/img/juliaGradient.jpeg', (tex) => {
            const uniforms = {
                C: {
                    type: 'v2',
                    value: new THREE.Vector2(0.25, 0.52),
                },
                gradient: {
                    type: 't',
                    value: tex,
                },
            };

            const shaderMaterial = new THREE.ShaderMaterial({
                uniforms,
                vertexShader,
                fragmentShader,
            });

            const sphere = new THREE.Mesh(
                new THREE.PlaneGeometry(this.width, this.height),
                shaderMaterial,
            );

            scene.add(sphere);
            scene.add(camera);

            renderer.render(scene, camera);
        });
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
