// uniform variables
uniform int drawHighlight;

// Rademacher's parameters
const float k1 = 0.2;
const float k2 = 0.9;
const float k3 = 0.1;
const float k4 = 0.5;

// npr info
const float  b      = 0.8;
const float  y      = 0.5;
const float  alpha  = 0.2;
const float  beta   = 0.6;
const float k_amb   = 0.6;
const vec4 k_blue = vec4(0.0, 0.0, b, 1.0);
const vec4 k_yell = vec4(y, y, 0.0, 1.0);
const vec4 k_diff = vec4(0.5, 0.5, 0.5, 1.0);

const vec4 k_cool = k_blue + alpha * k_diff;
const vec4 k_warm = k_yell + beta  * k_diff;

// material info
const vec4 ambMaterial = vec4(0.5, 0.5, 0.5, 1.0);
const vec4 diffMaterial = vec4(0.8, 0.2, 0.2, 1.0);
const vec4 specMaterial = vec4(0.3, 0.3, 0.3, 1.0);
const float shinMaterial =  64.0;

// varying variables
varying vec3 normal;
varying vec3 vtoL;
varying vec3 vtoL2;

void main(void)
{
	vec3 N = normalize(normal);
	vec3 L1 = normalize(vtoL);
    vec3 L2 = normalize(vtoL2);

    // npr
    float LdotN1 = dot(L1, N);
    float LdotN2 = dot(L2, N);
    vec4 warmColor = (k_warm - diffMaterial * k1) * k2 * LdotN1;
    vec4 coolColor = (k_cool - diffMaterial * k3) * k4 * LdotN2;
    

    // ambient
	vec4 ambient = gl_LightSource[0].ambient * ambMaterial;

    // diffuse
   	float NdotL = dot(N, L1);
    vec4 diffse = gl_LightSource[0].diffuse * diffMaterial;

    // specular
    vec3 H = normalize(gl_LightSource[0].halfVector.xyz);
    float NdotH = dot(N, H);
    float spec = pow(max(0.0, NdotH), shinMaterial);
    if(NdotL <= 0.0) {
        spec = 0.0;
    }
    vec4 specular = spec * gl_LightSource[0].specular * specMaterial;

    vec4 shading = ambient + diffse + specular;
    vec4 npr     = coolColor + warmColor;
	gl_FragColor  = k_amb * shading + npr;
    if(drawHighlight == 1) {
        if(NdotH > 0.98) {
            gl_FragColor.xyz = vec3(1.0, 1.0, 1.0);
        }
    }
}
