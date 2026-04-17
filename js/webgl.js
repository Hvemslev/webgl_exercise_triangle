var gl = document.getElementById('gl').getContext('webgl') || document.getElementById('id').getContext('experimental-webgl');

function initWebGL()
{
    if(!gl)
    {
        alert("WebGL is not supported");
    }
    let canvas = document.getElementById('gl');
    if(canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight){
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    initViewport();
}

function initViewport(){
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.4, 0.6, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    initShaders();
}

function initShaders(){
    const vs = initVertexShader();
    const fs = initFragmentShader();

    let program = initShaderProgram(vs, fs);

    if(!ValidateShaderProgram(program)){
        return false;
    }
    return createGeometryBuffers(program);
}

function initVertexShader(){
    let e = document.getElementById('vs');
    let shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shader, e.value);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        alert("failed init"+gl.VERTEX_SHADER);
        return;
    }
    return shader;
}

function initFragmentShader(){
    let e = document.getElementById('fs');
    let shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, e.value);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        alert("failed init"+gl.FRAGMENT_SHADER);
        return;
    }
    return shader;
}



function initShaderProgram(vs, fs){
    let p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);

    if(!gl.getProgramParameter(p, gl.LINK_STATUS))
    {
        alert("failed linking program");
        return;
    }
    return p;
}

function ValidateShaderProgram(p){
    gl.validateProgram(p);

    if(!gl.getProgramParameter(p, gl.VALIDATE_STATUS))
    {
        alert("errors found validating shader program");
        return false;
    }
    return true;
}

function createGeometryBuffers(program){
    const vertices =
    [
        0.0, 0.5, 0.0, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 0.0, 1.0
    ];

    createVBO(program, new Float32Array(vertices));

    gl.useProgram(program);

    Render();
}

function createVBO(program, vert){
    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);
    const s = 6 * Float32Array.BYTES_PER_ELEMENT;

    let p = gl.getAttribLocation(program, 'Pos');
    gl.vertexAttribPointer(p, 3, gl.FLOAT, gl.FALSE, s, 0);
    gl.enableVertexAttribArray(p);

    const o = 3 * Float32Array.BYTES_PER_ELEMENT;
    let c = gl.getAttribLocation(program, 'Color');
    gl.vertexAttribPointer(c, 3, gl.FLOAT, gl.FALSE, s, o);
    gl.enableVertexAttribArray(c);
}

function Render(){
    gl.clearColor(0.0, 0.4, 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}