import Shader from './shader'
import vsSource from './shader/main.vert'
import fsSource from './shader/main.frag'

new Promise((resolve => {
  const globalClickHandler = e => {
    window.removeEventListener('click', globalClickHandler)
    resolve(e)
  }
  window.addEventListener('click', globalClickHandler)
})).then(e => {
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)

  const audio = document.createElement('audio')
  audio.src = './ft.flac'
  audio.play()
  const audioContext = new AudioContext()
  const analyser = audioContext.createAnalyser()
  const source = audioContext.createMediaElementSource(audio)
  source.connect(analyser)
  analyser.connect(audioContext.destination)
  analyser.fftSize = 1024
  const frequencyData = new Float32Array(analyser.frequencyBinCount)
  console.log(analyser)
  
  const gl = canvas.getContext('webgl2')
  gl.viewport(0, 0, canvas.width, canvas.height)
  const shader = new Shader(gl, vsSource, fsSource)
  shader.use()
  const quad = [-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, -1.0]
  const quadVAO = gl.createVertexArray()
  const quadVBO = gl.createBuffer()
  gl.bindVertexArray(quadVAO)
  gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, true, 8, 0)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  // gl.bindVertexArray(null)
  shader.setUniform('iResolution', 'VEC2', [
    canvas.clientWidth,
    canvas.clientHeight
  ])

  // uniform buffer
  const uniformBlockIndex = gl.getUniformBlockIndex(shader.program, 'Block')
  const ubuffer = gl.createBuffer()
  gl.bindBuffer(gl.UNIFORM_BUFFER, ubuffer)
  const uniformBufferIndex = 0
  gl.uniformBlockBinding(shader.program, uniformBlockIndex, uniformBufferIndex)
  gl.bindBufferBase(gl.UNIFORM_BUFFER, uniformBufferIndex, ubuffer)

  const renderLoop = time => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  
    // resize
    if (window.innerHeight !== canvas.height || window.innerWidth !== canvas.width) {
      canvas.height = window.innerHeight
      canvas.width = window.innerWidth
      shader.setUniform('iResolution', 'VEC2', [
        canvas.clientWidth,
        canvas.clientHeight
      ])
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
  
    shader.setUniform('iTime', 'FLOAT', time)
  
    analyser.getFloatFrequencyData(frequencyData) // byteLength: 512 * 4
    gl.bufferData(gl.UNIFORM_BUFFER, frequencyData, gl.DYNAMIC_DRAW)
    // console.log(gl.getBufferParameter(gl.UNIFORM_BUFFER, gl.BUFFER_SIZE)) // 2048 ok
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  
    requestAnimationFrame(renderLoop)
  }
  renderLoop(0)
})

