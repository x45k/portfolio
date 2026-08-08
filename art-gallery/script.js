import { Renderer, Program, Mesh, Triangle } from 'ogl';

const vertexShader = `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;

const fragmentShader = `
    precision highp float;

    uniform float uTime;
    uniform vec3  uColor;
    uniform vec3  uResolution;
    uniform vec2  uMouse;
    uniform float uAmplitude;
    uniform float uSpeed;
    uniform float uRandomPhase;
    uniform vec2  uRandomOffset;

    varying vec2 vUv;

    void main() {
        float mr = min(uResolution.x, uResolution.y);
        vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

        uv += uRandomOffset;
        uv += (uMouse - vec2(0.5)) * uAmplitude;

        float d = -(uTime * 0.5 + uRandomPhase) * uSpeed;
        float a = 0.0;
        for (float i = 0.0; i < 6.0; ++i) {
            a += cos(i - d - a * uv.x);
            d += sin(uv.y * i + a);
        }
        d += (uTime * 0.5 + uRandomPhase) * uSpeed;

        vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
        col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
        gl_FragColor = vec4(col, 1.0);
    }
`;

function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

const randPhase = randomRange(0, Math.PI * 2);
const randOffsetX = randomRange(-0.06, 0.06);
const randOffsetY = randomRange(-0.06, 0.06);
const randSpeed = randomRange(0.12, 0.32);
const randAmplitude = randomRange(0.008, 0.018);

const config = {
    color: [1, 1, 1],
    speed: randSpeed,
    amplitude: randAmplitude,
    mouseReact: true,
};

const container = document.getElementById('shader-container');

const renderer = new Renderer();
const gl = renderer.gl;
gl.clearColor(1, 1, 1, 1);

const geometry = new Triangle(gl);

const resolution = new Float32Array([0, 0, 0]);

const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new Float32Array(config.color) },
    uResolution: { value: resolution },
    uMouse: { value: new Float32Array([0.5, 0.5]) },
    uAmplitude: { value: config.amplitude },
    uSpeed: { value: config.speed },
    uRandomPhase: { value: randPhase },
    uRandomOffset: { value: new Float32Array([randOffsetX, randOffsetY]) },
};

let program;
try {
    program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms,
    });
} catch (e) {
    console.error(e);
    throw e;
}

const mesh = new Mesh(gl, { geometry, program });

function resize() {
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const dpr = 1;

    renderer.setSize(width * dpr, height * dpr);

    const w = gl.canvas.width;
    const h = gl.canvas.height;
    resolution[0] = w;
    resolution[1] = h;
    resolution[2] = w / h;
}

window.addEventListener('resize', resize);
if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
}
resize();

let rafId = null;
function handlePointerMove(e) {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX ?? (e.touches?.[0]?.clientX ?? 0);
        const clientY = e.clientY ?? (e.touches?.[0]?.clientY ?? 0);

        const x = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        const y = Math.min(Math.max(1 - (clientY - rect.top) / rect.height, 0), 1);

        uniforms.uMouse.value[0] = x;
        uniforms.uMouse.value[1] = y;
        rafId = null;
    });
}

if (config.mouseReact) {
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', (e) => {
        e.preventDefault();
        handlePointerMove(e);
    }, { passive: false });
    container.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handlePointerMove(e);
    }, { passive: false });
}

container.appendChild(gl.canvas);

let animationId;

function animate(timestamp) {
    animationId = requestAnimationFrame(animate);
    uniforms.uTime.value = timestamp * 0.001;
    renderer.render({ scene: mesh });
}

animate(performance.now());

window.__cleanup = function() {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
    if (config.mouseReact) {
        container.removeEventListener('mousemove', handlePointerMove);
        container.removeEventListener('touchmove', handlePointerMove);
        container.removeEventListener('touchstart', handlePointerMove);
    }
    if (gl.canvas && container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
    }
    const ext = gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
};
window.addEventListener('beforeunload', window.__cleanup);

window.__shader = {
    config,
    uniforms,
    setColor(r, g, b) {
        config.color = [r, g, b];
        uniforms.uColor.value[0] = r;
        uniforms.uColor.value[1] = g;
        uniforms.uColor.value[2] = b;
    },
    setSpeed(v) {
        config.speed = v;
        uniforms.uSpeed.value = v;
    },
    setAmplitude(v) {
        config.amplitude = v;
        uniforms.uAmplitude.value = v;
    },
};

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

document.getElementById('logo-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});