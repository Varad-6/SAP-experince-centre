'use client';

import React, { useRef, useEffect } from 'react';

export interface ChromaKeyCanvasProps {
  videoElement: HTMLVideoElement | null;
  keyColorHex: string;
  similarity?: number;
  smoothness?: number;
  width?: number;
  height?: number;
  className?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [
    ((num >> 16) & 255) / 255.0,
    ((num >> 8) & 255) / 255.0,
    (num & 255) / 255.0,
  ];
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 v_texCoord;
  uniform sampler2D u_video;
  uniform vec3 u_keyColor;
  uniform float u_similarity;
  uniform float u_smoothness;

  vec3 rgb2ycbcr(vec3 rgb) {
    float y = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    float cb = -0.168736 * rgb.r - 0.331264 * rgb.g + 0.5 * rgb.b;
    float cr = 0.5 * rgb.r - 0.418688 * rgb.g - 0.081312 * rgb.b;
    return vec3(y, cb, cr);
  }

  void main() {
    vec4 texColor = texture2D(u_video, v_texCoord);
    vec3 ycbcr = rgb2ycbcr(texColor.rgb);
    vec3 keyYcbcr = rgb2ycbcr(u_keyColor);
    float dist = distance(ycbcr.gb, keyYcbcr.gb);
    float alpha = smoothstep(u_similarity, u_similarity + u_smoothness, dist);
    gl_FragColor = vec4(texColor.rgb, alpha * texColor.a);
  }
`;

export const ChromaKeyCanvas: React.FC<ChromaKeyCanvasProps> = ({
  videoElement,
  keyColorHex,
  similarity = 0.38,
  smoothness = 0.10,
  width = 1280,
  height = 720,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !videoElement) return;

    const gl = (
      canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) ||
      canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false })
    ) as WebGLRenderingContext | null;

    if (!gl) return;

    // Compile shader helper
    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Geometry quad
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Texture coords (inverted Y for WebGL texture orientation)
    const texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0, 1,
        1, 1,
        0, 0,
        0, 0,
        1, 1,
        1, 0,
      ]),
      gl.STATIC_DRAW
    );

    const aTex = gl.getAttribLocation(program, 'a_texCoord');
    gl.enableVertexAttribArray(aTex);
    gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 0, 0);

    // Texture object
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Uniform locations
    const uKeyColor = gl.getUniformLocation(program, 'u_keyColor');
    const uSimilarity = gl.getUniformLocation(program, 'u_similarity');
    const uSmoothness = gl.getUniformLocation(program, 'u_smoothness');

    const rgb = hexToRgb(keyColorHex);
    gl.uniform3f(uKeyColor, rgb[0], rgb[1], rgb[2]);
    gl.uniform1f(uSimilarity, similarity);
    gl.uniform1f(uSmoothness, smoothness);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);

    let animationId: number;

    const render = () => {
      if (videoElement.readyState >= 2) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          videoElement
        );
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      gl.deleteTexture(texture);
      gl.deleteBuffer(posBuffer);
      gl.deleteBuffer(texBuffer);
      gl.deleteProgram(program);
    };
  }, [videoElement, keyColorHex, similarity, smoothness]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`w-full h-full object-contain pointer-events-none ${className}`}
    />
  );
};
