precision highp float;

uniform float uAlpha;
uniform sampler2D tMap;

varying vec2 vUv;

// Ton papier : le blanc des polaroids devient crème au lieu de blanc pur
const vec3 PAPER = vec3(0.93, 0.90, 0.85);

void main() {
    vec4 texture = texture2D(tMap, vUv);

    // Photos légèrement désaturées pour rester discrètes derrière le titre
    float gray = dot(texture.rgb, vec3(0.299, 0.587, 0.114));
    vec3 color = mix(vec3(gray), texture.rgb, 0.7) * PAPER;

    // Alpha prémultiplié : même rendu partout (Safari iOS saturait les blancs)
    gl_FragColor = vec4(color * uAlpha, uAlpha);
}
