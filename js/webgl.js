var vertices = [];

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

function Render()
{
gl.clearColor(0.0, 0.4, 0.6, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT |
gl.DEPTH_BUFFER_BIT );
gl.drawArrays(gl.TRIANGLES, 0,vertices.length / 6);
}

function AddVertex(x, y, z, r, g, b)
{
const index = vertices.length;
vertices.length += 6;
vertices[index + 0] = x;
vertices[index + 1] = y;
vertices[index + 2] = z;
vertices[index + 3] = r;
vertices[index + 4] = g;
vertices[index + 5] = b;
}


function AddTriangle(x1, y1, z1, r1, g1, b1,
x2, y2, z2, r2, g2, b2,
x3, y3, z3, r3, g3, b3)
{
AddVertex(x1, y1, z1, r1, g1, b1);
AddVertex(x2, y2, z2, r2, g2, b2);
AddVertex(x3, y3, z3, r3, g3, b3);
}

function AddQuad(x1, y1, z1, r1, g1, b1,
x2, y2, z2, r2, g2, b2,
x3, y3, z3, r3, g3, b3,
x4, y4, z4, r4, g4, b4)
{
AddTriangle(x1, y1, z1, r1, g1, b1,
x2, y2, z2, r2, g2, b2,
x3, y3, z3, r3, g3, b3);
AddTriangle(x3, y3, z3, r3, g3, b3,
x4, y4, z4, r4, g4, b4,
x1, y1, z1, r1, g1, b1);
}

function CreateTriangle(width, height)
{
vertices.length = 0;
const w = width * 0.5;
const h = height * 0.5;
AddTriangle(0.0, h, 0.0, 1.0, 0.0, 0.0,
-w, -h, 0.0, 0.0, 1.0, 0.0,
w, -h, 0.0, 0.0, 0.0, 1.0);
}

function CreateQuad(width, height)
{
vertices.length = 0;
const w = width * 0.5;
const h = height * 0.5;
AddQuad(-w, h, 0.0, 1.0, 0.0, 0.0,
-w,-h, 0.0, 0.0, 1.0, 0.0,
w,-h, 0.0, 0.0, 0.0, 1.0,
w, h, 0.0, 1.0, 1.0, 0.0);
}

function CreateCube(width, height, length, divX, divY, divZ){
vertices.length = 0;
const w = width * 0.5;
const h = height * 0.5;
const l = length * 0.5;

let color = 0.0;


for(let i = 0; i < divX; i++){
    for(let j = 0; j < divY; j++){
        //front
        AddQuad(
        -w+(width/divX)*i, h-(height/divY)*j, l, color, 0.0, 0.0,
        -w+(width/divX)*i, h-(height/divY)*(j+1), l, color, 0.0, 0.0,
        -w+(width/divX)*(i+1), h-(height/divY)*(j+1), l, color, 0.0, 0.0,
        -w+(width/divX)*(i+1), h-(height/divY)*j, l, color, 0.0, 0.0
        ); 
        //back 
        AddQuad(
        w-(width/divX)*i, h-(height/divY)*j, -l, color, 0.0, 0.0,
        w-(width/divX)*i, h-(height/divY)*(j+1), -l, color, 0.0, 0.0,
        w-(width/divX)*(i+1), h-(height/divY)*(j+1), -l, color, 0.0, 0.0,
        w-(width/divX)*(i+1), h-(height/divY)*j, -l, color, 0.0, 0.0
        );
        if(color==1.0){
            color=0.0
        } else {color=1.0}
    }
    
}

//left
AddQuad(
    -w, h, -l, 1.0, 0.0, 0.0,
    -w, -h, -l, 0.0, 1.0, 0.0,
    -w, -h, l, 0.0, 0.0, 1.0,
    -w, h, l, 1.0, 1.0, 0.0
);
//right
AddQuad(
    w, h, l, 1.0, 0.0, 0.0,
    w, -h, l, 0.0, 1.0, 0.0,
    w, -h, -l, 0.0, 0.0, 1.0,
    w, h, -l, 1.0, 1.0, 0.0
);
//bottom
AddQuad(
    -w, -h, l, 1.0, 0.0, 0.0,
    -w, -h, -l, 0.0, 1.0, 0.0,
    w, -h, -l, 0.0, 0.0, 1.0,
    w, -h, l, 1.0, 1.0, 0.0
);
//top
AddQuad(
    -w, h, -l, 1.0, 0.0, 0.0,
    -w, h, l, 0.0, 1.0, 0.0,
    w, h, l, 0.0, 0.0, 1.0,
    w, h, -l, 1.0, 1.0, 0.0
);
}

function CreateGeometryUI() {
    const ew = document.getElementById("w");
    const w = ew ? ew.value : 1.0;
    const eh = document.getElementById("h");
    const h = eh ? eh.value : 1.0;
    const el = document.getElementById("l");
    const l = el ? el.value : 1.0;
    const esdx = document.getElementById("sdx");
    const sdx = esdx ? esdx.value : 1.0;
    const esdy = document.getElementById("sdy");
    const sdy = esdy ? esdy.value : 1.0;
    const esdz = document.getElementById("sdz");
    const sdz = esdz ? esdz.value : 1.0;
    document.getElementById("ui").innerHTML =
'Width: <input type="number" id="w" value="' + w + 
'"onchange= "initShaders();"><br>' +
'Height: <input type="number" id="h" value="'+ h +
'"onchange= "initShaders();"><br>' +
'Length: <input type="number" id="l" value="'+ l +
'"onchange= "initShaders();"><br>' +
'SubDivX: <input type="number" id="sdx" value="'+ sdx +
'"onchange= "initShaders();"><br>' +
'SubDivY: <input type="number" id="sdy" value="'+ sdy +
'"onchange= "initShaders();"><br>' +
'SubDivZ: <input type="number" id="sdz" value="'+ sdz +
'"onchange= "initShaders();">'
;
    let e = document.getElementById("shape");
    switch (e.selectedIndex) {
        case 0: CreateTriangle(w, h); break;
        case 1: CreateQuad(w, h); break;
        case 2: CreateCube(w, h, l, sdx, sdy, sdz); break;
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



