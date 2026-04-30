var vertices = [];
var textureGL = 0; // Uniform Location
var display = [ 0.0, 0.0, 0.0, 0.0 ];
var displayGL = 0; // Uniform Location

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
    CreateGeometryUI();

    createVBO(program, new Float32Array(vertices));

    angleGL = gl.getUniformLocation(program, 'Angle');

    CreateTexture(program, 'img/tekstur.jpg');

    gl.useProgram(program);

    gl.uniform4fv(angleGL, new Float32Array(angle));

    gl.uniform4fv(displayGL,new Float32Array(display));

    Render();
}

function createVBO(program, vert){
    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);
    const s = 8 * Float32Array.BYTES_PER_ELEMENT;

    let p = gl.getAttribLocation(program, 'Pos');
    gl.vertexAttribPointer(p, 3, gl.FLOAT, gl.FALSE, s, 0);
    gl.enableVertexAttribArray(p);

    const o = 3 * Float32Array.BYTES_PER_ELEMENT;
    let c = gl.getAttribLocation(program, 'Color');
    gl.vertexAttribPointer(c, 3, gl.FLOAT, gl.FALSE, s, o);
    gl.enableVertexAttribArray(c);

    const o2 = o * 2;
    let u = gl.getAttribLocation(program, 'UV');
    gl.vertexAttribPointer(u,2,gl.FLOAT,gl.FALSE,s,o2);
    gl.enableVertexAttribArray(u);
}

function Render()
{
gl.clearColor(0.0, 0.4, 0.6, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT |
gl.DEPTH_BUFFER_BIT );
gl.drawArrays(gl.TRIANGLES, 0,vertices.length / 8);
}

function AddVertex(x, y, z, r, g, b, u, v)
{
const index = vertices.length;
vertices.length += 8;
vertices[index + 0] = x;
vertices[index + 1] = y;
vertices[index + 2] = z;
vertices[index + 3] = r;
vertices[index + 4] = g;
vertices[index + 5] = b;
vertices[index + 6] = u;
vertices[index + 7] = v;
}


function AddTriangle(
    x1, y1, z1, r1, g1, b1, u1, v1,
    x2, y2, z2, r2, g2, b2, u2, v2,
    x3, y3, z3, r3, g3, b3, u3, v3)
{
AddVertex(x1, y1, z1, r1, g1, b1, u1, v1);
AddVertex(x2, y2, z2, r2, g2, b2, u2, v2);
AddVertex(x3, y3, z3, r3, g3, b3, u3, v3);
}

function AddQuad(
    x1, y1, z1, r1, g1, b1, u1, v1,
    x2, y2, z2, r2, g2, b2, u2, v2,
    x3, y3, z3, r3, g3, b3, u3, v3,
    x4, y4, z4, r4, g4, b4, u4, v4)
{
AddTriangle(
    x1, y1, z1, r1, g1, b1, u1, v1,
    x2, y2, z2, r2, g2, b2, u2, v2,
    x3, y3, z3, r3, g3, b3, u3, v3);
AddTriangle(
    x3, y3, z3, r3, g3, b3, u3, v3,
    x4, y4, z4, r4, g4, b4, u4, v4,
    x1, y1, z1, r1, g1, b1, u1, v1);
}

function CreateTriangle(width, height)
{
vertices.length = 0;
const w = width * 0.5;
const h = height * 0.5;
AddTriangle(
    0.0, h, 0.0, 1.0, 0.0, 0.0, 0.5, 1.0,
    -w, -h, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,
    w, -h, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0);
}

function CreateQuad(width, height)
{
vertices.length = 0;
const w = width * 0.5;
const h = height * 0.5;
AddQuad(
    -w, h, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
    -w,-h, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,
    w,-h, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
    w, h, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0);
}

function CreateCube(width, height, length, div){
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;
    const l = length * 0.5;

    let color = 0.0;

    for(let i = 0; i < div; i++)
    {
        for(let j = 0; j < div; j++)
        {
            //front
            AddQuad(
            -w+(width/div)*i, h-(height/div)*j, l, color, 0.0, 0.0, 0.0, 1.0,
            -w+(width/div)*i, h-(height/div)*(j+1), l, color, 0.0, 0.0, 0.0, 0.0,
            -w+(width/div)*(i+1), h-(height/div)*(j+1), l, color, 0.0, 0.0, 1.0, 0.0,
            -w+(width/div)*(i+1), h-(height/div)*j, l, color, 0.0, 0.0, 1.0, 1.0
            ); 
            //back 
            AddQuad(
            w-(width/div)*i, h-(height/div)*j, -l, color, 0.0, 0.0, 0.0, 1.0,
            w-(width/div)*i, h-(height/div)*(j+1), -l, color, 0.0, 0.0, 0.0, 0.0,
            w-(width/div)*(i+1), h-(height/div)*(j+1), -l, color, 0.0, 0.0, 1.0, 0.0,
            w-(width/div)*(i+1), h-(height/div)*j, -l, color, 0.0, 0.0, 1.0, 1.0
            );
            //left 
            AddQuad(
            -w, h-(height/div)*j, -l+(length/div)*i, 0.0, color, 0.0, 0.0, 1.0,
            -w, h-(height/div)*(j+1), -l+(length/div)*i, 0.0, color, 0.0, 0.0, 0.0,
            -w, h-(height/div)*(j+1), -l+(length/div)*(i+1), 0.0, color, 0.0, 1.0, 0.0,
            -w, h-(height/div)*j, -l+(length/div)*(i+1), 0.0, color, 0.0, 1.0, 1.0
            );
            //right 
            AddQuad(
            w, h-(height/div)*j, l-(length/div)*i, 0.0, color, 0.0, 0.0, 1.0,
            w, h-(height/div)*(j+1), l-(length/div)*i, 0.0, color, 0.0, 0.0, 0.0,
            w, h-(height/div)*(j+1), l-(length/div)*(i+1), 0.0, color, 0.0, 1.0, 0.0,
            w, h-(height/div)*j, l-(length/div)*(i+1), 0.0, color, 0.0, 1.0, 1.0
            );
            //top
            AddQuad(
            -w+(width/div)*i, h, -l+(length/div)*j, 0.0, 0.0, color, 0.0, 1.0,
            -w+(width/div)*i, h, -l+(length/div)*(j+1), 0.0, 0.0, color, 0.0, 0.0,
            -w+(width/div)*(i+1), h, -l+(length/div)*(j+1), 0.0, 0.0, color, 1.0, 0.0,
            -w+(width/div)*(i+1), h, -l+(length/div)*j, 0.0, 0.0, color, 1.0, 1.0
            ); 
            //bottom
            AddQuad(
            -w+(width/div)*i, -h, l-(length/div)*j, 0.0, 0.0, color, 0.0, 1.0,
            -w+(width/div)*i, -h, l-(length/div)*(j+1), 0.0, 0.0, color, 0.0, 0.0,
            -w+(width/div)*(i+1), -h, l-(length/div)*(j+1), 0.0, 0.0, color, 1.0, 0.0,
            -w+(width/div)*(i+1), -h, l-(length/div)*j, 0.0, 0.0, color, 1.0, 1.0
            ); 

            if(color==1.0){
                color=0.0
            } else {color=1.0}
        } 
    }
}

function CreateGeometryUI() {
    const ew = document.getElementById("w");
    const w = ew ? ew.value : 1.0;
    const eh = document.getElementById("h");
    const h = eh ? eh.value : 1.0;
    const el = document.getElementById("l");
    const l = el ? el.value : 1.0;
    const esd = document.getElementById("sd");
    const sd = esd ? esd.value : 1.0;
    document.getElementById("ui").innerHTML =
'Width: <input type="number" id="w" value="' + w + 
'"onchange= "initShaders();"><br>' +
'Height: <input type="number" id="h" value="'+ h +
'"onchange= "initShaders();"><br>' +
'Length: <input type="number" id="l" value="'+ l +
'"onchange= "initShaders();"><br>' +
'SubDiv: <input type="number" id="sd" value="'+ sd +
'"onchange= "initShaders();">'
;
    let e = document.getElementById("shape");
    switch (e.selectedIndex) {
        case 0: CreateTriangle(w, h); break;
        case 1: CreateQuad(w, h); break;
        case 2: CreateCube(w, h, l, sd); break;
    }
}

var mouseX = 0, mouseY = 0;
var angle = [ 0.0, 0.0, 0.0, 1.0 ];
var angleGL = 0;
document.getElementById('gl').addEventListener(
'mousemove', function(e) {
if (e.buttons == 1)
{
// Left mouse button pressed
angle[0] -= (mouseY - e.y) * 0.1;
angle[1] += (mouseX - e.x) * 0.1;
gl.uniform4fv(angleGL, new Float32Array(angle));
Render();
}
mouseX = e.x;
mouseY = e.y;
});

function CreateTexture(prog, url)
{
    // Load texture to graphics card
    const texture = LoadTexture(url);
    // Flip y axis so it fits OpenGL standard
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    // Activate texture to texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Add uniform location to fragment shader
    textureGL = gl.getUniformLocation(prog, 'Texture');
    // Add uniform location to fragment shader
    displayGL = gl.getUniformLocation(prog, 'Display');
}

function LoadTexture(url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
    gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
        gl.RGBA, gl.UNSIGNED_BYTE, image);
        SetTextureFilters(image);
    };
    image.src = url;
    return texture;
}

function SetTextureFilters(image)
{
    if (IsPow2(image.width) && IsPow2(image.height))
    {
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    else
    {
        gl.texParameteri(gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
}

function IsPow2(value)
{
return (value & (value - 1)) === 0;
}

function Update()
{
    // Show texture (boolean) last element
    const t = document.getElementById('t');
    display[3] = t.checked ? 1.0 : 0.0;
    // Update array to graphics card and render
    gl.uniform4fv(displayGL,new Float32Array(display));
    Render();
}



