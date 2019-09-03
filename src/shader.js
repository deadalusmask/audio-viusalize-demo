function loadShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const errMsg = `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    gl.deleteShader(shader)
    throw new Error(errMsg)
  }
  return shader
}
export default class Shader {
  constructor(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
      return null
    }
    this.gl = gl
    this.program = shaderProgram
    this.uniformIndex = 0
  }
  use() {
    this.gl.useProgram(this.program)
  }
  setUniform(name, type, value) {
    switch (type) {
      case 'BOOL':
        return this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), Number(value))
      case 'INT':
        return this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), Math.round(value))
      case 'FLOAT':
        return this.gl.uniform1f(this.gl.getUniformLocation(this.program, name), value)
      case 'VEC2':
        return this.gl.uniform2fv(this.gl.getUniformLocation(this.program, name), value)
      case 'VEC3':
        return this.gl.uniform3fv(this.gl.getUniformLocation(this.program, name), value)
      case 'VEC4':
        return this.gl.uniform4fv(this.gl.getUniformLocation(this.program, name), value)
      case 'MAT2':
        return this.gl.uniformMatrix2fv(this.gl.getUniformLocation(this.program, name), false, value)
      case 'MAT3':
        return this.gl.uniformMatrix3fv(this.gl.getUniformLocation(this.program, name), false, value)
      case 'MAT4':
        return this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, name), false, value)
      default:
        return
    }
  }
}
