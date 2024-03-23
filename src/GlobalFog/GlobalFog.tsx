import { useEffect } from 'react';
import { ShaderChunk } from 'three';

export default function GlobalFog() {
	useEffect(() => {
		function modifyShaderChunk() {
			ShaderChunk.fog_fragment = /* glsl */ `
            #ifdef USE_FOG
            vec3 fogOrigin = cameraPosition;
            vec3 fogDirection = normalize(vWorldPosition - fogOrigin);
            float fogDepth = distance(vWorldPosition, fogOrigin);
        
           
            fogDepth *= fogDepth;
        
            float heightFactor = 0.01;
            float fogFactor = heightFactor * exp(-fogOrigin.y * fogDensity) * (
                1.0 - exp(-fogDepth * fogDirection.y * fogDensity)) / fogDirection.y;
            fogFactor = saturate(fogFactor);
        
            gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
            #endif
        `;

			ShaderChunk.fog_pars_fragment = /* glsl */ `
            #ifdef USE_FOG
              uniform float fogTime;
              uniform vec3 fogColor;
              varying vec3 vWorldPosition;
              #ifdef FOG_EXP2
                uniform float fogDensity;
              #else
                uniform float fogNear;
                uniform float fogFar;
              #endif
            #endif`;

			ShaderChunk.fog_vertex = /* glsl */ `
            #ifdef USE_FOG
              vWorldPosition = worldPosition.xyz;
            #endif
            `;

			ShaderChunk.fog_pars_vertex = /* glsl */ `
            #ifdef USE_FOG
              varying vec3 vWorldPosition;
            #endif
            `;
		}
		modifyShaderChunk();
	}, []);

	return (
		<>
			<fogExp2 attach='fog' args={['#2a3a59', 0.001]} />

			{/* DirectionLight is needed so shaderchunk got filled with worldPositon */}
			<directionalLight
				position={[0, 10, 0]}
				intensity={0.0}
				castShadow
			/>

			{/* !Make sure to add the shadows to the Canvas */}
		</>
	);
}
