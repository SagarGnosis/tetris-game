const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

 
 context.scale(10,10)


function createPiece(type) {
  const phrases = {
    '1': 'We design and develop applications',
    '2': 'that run the world and',
    '3': 'showcase the future',
  };

  const phrase = phrases[type];
  const rows = phrase.split(' ');
  const matrix = rows.map(row => row.split(''));

  return matrix;
}


function collide (arena , player){
  const [m , o] =[player.matrix, player.pos];
  for ( let y = 0; y < m.length; ++y) {
    for ( let x = 0; x < m[y].length; ++x){
      if (m[y][x] !== 0 && 
        (arena[y + o.y] && 
          arena[y+ o.y][x + o.x]) !== 0){
        return true;
      }
    }
  }
  return false;
}

function createMatrix(w , h ){
  const matrix =[];
  while(h--){
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}


function draw() {
  context.fillStyle = '#000';
 context.fillRect(0,0,canvas.width, canvas.height );

 drawMatrix(arena, {x:0, y:0});
 drawMatrix(player.matrix , player.pos);


}
function drawMatrix(matrix , offset){
matrix.forEach((row,y) => {
  row.forEach((value, x) => {
    if (value !== (null || 0)) {
      context.fillStyle = 'orange';
      context.fillRect(x+ offset.x,y+offset.y,1,1);
    }
  });
});
}
function merger(arena,player){
  player.matrix.forEach((row , y)=>{
    row.forEach((value, x)=>{
      if(value !== 0){
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    })
  })
}
function playerdrop(){
  player.pos.y++;
  if(collide(arena, player)){
    player.pos.y--;
    merger(arena,player);
     playerReset();
    // arenaSweep();
    // updateScore();
    player.pos.y = 0;
  }
  dropCounter=0;
}

function playerMove(dir){
  player.pos.x +=dir;
  if (collide (arena , player)) {
    player.pos.x -= dir;
  }
}
function playerReset() {
  const pieces = '123';
  const randomPiece = pieces[pieces.length * Math.random() | 0];
  player.matrix = createPiece(randomPiece);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
  }
}


let dropCounter = 0;
let dropInterval= 1000;
let lastTime = 0;
function update(time=0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if(dropCounter > dropInterval){
    playerdrop();
  }

  draw();
  requestAnimationFrame(update);
}
const arena = createMatrix(50,30);

const player ={
  pos : {x:20,y:0},
  matrix: null,
  score: 0
}
document.addEventListener('keydown', event => {
  if(event.keyCode === 37) {
    playerMove(-1);
  }
  else if (event.keyCode === 39) {
    playerMove(1);
  }
  else if(event.keyCode === 40) {
    playerdrop();
  }
});

playerReset();
// updateScore();
update();
