import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GooeyOverlayProps {
  triggerSelector?: string;
  color?: [number, number, number]; // 0..1 RGB
  pageColor?: string;
  scale?: number;
  speed?: number;
  className?: string;
}

const VERT = `
  precision mediump float;
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAG = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_ratio;
  uniform float u_progress;
  uniform float u_col_width;
  uniform float u_seed;
  uniform float u_scale;
  uniform float u_speed;
  uniform vec2 u_resolution;
  uniform vec3 u_color;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p + u_seed) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i + vec2(0.0)), f - vec2(0.0)),
                   dot(hash(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
               mix(dot(hash(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)),
                   dot(hash(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x), u.y);
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_ratio;
    float t = u_time * u_speed * 0.001;
    float n = noise(uv * (1.0 / max(u_scale, 0.01)) + t);
    float wave = smoothstep(0.0, 1.0, u_progress * 2.0 - uv.y - n * 0.4);
    float col = step(fract(uv.x / u_col_width + n * 0.2), wave);
    vec3 color = mix(vec3(0.0), u_color, col);
    gl_FragColor = vec4(color, col * 0.95);
  }
`;

export default function GooeyOverlay({
  triggerSelector = '.gooey-trigger',
  color = [0.95, 0.42, 0.18],
  scale = 0.35,
  speed = 0.25,
  className = '',
}: GooeyOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ progress: 0, time: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    const compile = (src: string, type: number) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn('Shader error:', gl.getShaderInfoLog(sh));
      }
      return sh;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(VERT, gl.VERTEX_SHADER));
    gl.attachShader(program, compile(FRAG, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRatio = gl.getUniformLocation(program, 'u_ratio');
    const uProgress = gl.getUniformLocation(program, 'u_progress');
    const uCol = gl.getUniformLocation(program, 'u_col_width');
    const uSeed = gl.getUniformLocation(program, 'u_seed');
    const uScale = gl.getUniformLocation(program, 'u_scale');
    const uSpeed = gl.getUniformLocation(program, 'u_speed');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uColor = gl.getUniformLocation(program, 'u_color');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let raf = 0;
    const render = (t: number) => {
      stateRef.current.time = t;
      gl.uniform1f(uTime, t);
      gl.uniform1f(uRatio, canvas.width / canvas.height);
      gl.uniform1f(uProgress, stateRef.current.progress);
      gl.uniform1f(uCol, 0.7);
      gl.uniform1f(uSeed, 0.231);
      gl.uniform1f(uScale, scale);
      gl.uniform1f(uSpeed, speed);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform3f(uColor, color[0], color[1], color[2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const trigger = document.querySelector(triggerSelector);
    let st: ScrollTrigger | undefined;
    if (trigger) {
      st = ScrollTrigger.create({
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => { stateRef.current.progress = self.progress; },
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      st?.kill();
    };
  }, [color, scale, speed, triggerSelector]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-[5] ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
