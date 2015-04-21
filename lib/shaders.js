var glslify       = require('glslify')
var createShader  = require('gl-shader')


var forward = glslify({
  vertex: "\
    precision mediump float;\
    attribute vec3 position;\
    attribute float arcLength;\
    attribute vec4 color;\
    uniform mat4 model, view, projection;\
    varying vec4 fragColor;\
    varying vec3 worldPosition;\
    varying float pixelArcLength;\
    void main() {\
      vec4 worldCoordinate = model * vec4(position, 1);\
      gl_Position = projection * view * worldCoordinate;\
      worldPosition = position;\
      pixelArcLength = arcLength;\
      fragColor = color;\
    }",

  fragment: "\
    precision mediump float;\
    uniform vec3      clipBounds[2];\
    uniform sampler2D dashTexture;\
    uniform float     dashScale;\
    uniform float     opacity;\
    varying vec3    worldPosition;\
    varying float   pixelArcLength;\
    varying vec4    fragColor;\
    void main() {\
      if(any(lessThan(worldPosition, clipBounds[0])) || any(greaterThan(worldPosition, clipBounds[1]))) {\
        discard;\
      }\
      float dashWeight = texture2D(dashTexture, vec2(dashScale * pixelArcLength, 0)).r;\
      if(dashWeight < 0.5) {\
        discard;\
      }\
      gl_FragColor = fragColor * opacity;\
    }",

  inline: true
})

var pick = glslify({
  vertex: "\
    precision mediump float;\
    attribute vec3 position;\
    attribute float arcLength;\
    attribute vec4 color;\
    uniform mat4 model, view, projection;\
    varying vec4 fragColor;\
    varying vec3 worldPosition;\
    varying float pixelArcLength;\
    void main() {\
      vec4 worldCoordinate = model * vec4(position, 1);\
      gl_Position = projection * view * worldCoordinate;\
      worldPosition = position;\
      pixelArcLength = arcLength;\
      fragColor = color;\
    }",

  fragment: "\
    precision mediump float;\
    #pragma glslify: packFloat = require(glsl-read-float)\
    uniform float pickId;\
    uniform vec3 clipBounds[2];\
    varying vec3 worldPosition;\
    varying float pixelArcLength;\
    varying vec4 fragColor;\
    void main() {\
      if(any(lessThan(worldPosition, clipBounds[0])) || any(greaterThan(worldPosition, clipBounds[1]))) {\
        discard;\
      }\
      gl_FragColor = vec4(pickId/255.0, packFloat(pixelArcLength).xyz);\
    }",

  inline: true
})

// var forward = glslify({
//   vert: '../shaders/vertex.glsl',
//   frag: '../shaders/fragment.glsl',
//   sourceOnly: true
// })

// var pick = glslify({
//   vert: '../shaders/vertex.glsl',
//   frag: '../shaders/pick.glsl',
//   sourceOnly: true
// })

exports.createShader = function(gl) {
  return createShader(gl, forward)
}

exports.createPickShader = function(gl) {
  return createShader(gl, pick)
}
