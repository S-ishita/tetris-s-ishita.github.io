document.addEventListener('DOMContentLoaded',()=>{

    const toggle=document.getElementsByClassName('toggle-btn')[0];
    const navbar=document.getElementsByClassName('navbar-links')[0];
    const grid=document.getElementsByClassName('.grid');

    let blox=Array.from(document.querySelectorAll('.grid div.blox'));
    const width=10;
    console.log(blox);
    const startButton=document.getElementById('start-button');
    let timerId=0;
    const playerScore=document.getElementById('score');
    let score=0;
    const gameLine=document.getElementById('lines');
    let lines=0;
    const playerLevel=document.getElementById('levels');
    let level=0;
    const gameMusic=document.getElementById('music');
    const soundButton=document.getElementById('play');
    let nextRandom=0;

    const colours=[
        'midnightBlue',
        'Green',
        'Orange',
        'HotPink',
        'DarkRed',
        'Brown',
        'Magenta'
    ];

    //toggle navigation bar
    toggle.addEventListener('click',()=>{
        navbar.classList.toggle('active');
    });

    //function for music on off
    soundButton.addEventListener('click',()=>{
        if(gameMusic.muted==false){
            gameMusic.muted==true;
            soundButton.innerHTML='Music Paused';

        }else{
            gameMusic.muted=false;
            gameMusic.play();
            gameMusic.volume=0.3;
            gameMusic.loop=true;
            soundButton.innerHTML='Music Playing';
        }
    });

    const pTetrimino=[
        [2,1,width+1,width*2+1],
        [width,width+1,width+2,width*2+2],
        [width*2,width*2+1,width+1,1],
        [0,width,width+1,width+2]
    ];

    const qTetrimino=[
        [0,1,width+1,width*2+1],
        [width,width+1,width+2,width*2+2],
        [width*2+2,width*2+1,width+1,1],
        [width*2,width,width+1,width+2]
    ];

    const sTetrimino=[
        [width*2,width*2+1,width+1,width+2],
        [0,width,width+1,width*2+1],
        [2,1,width+1,width],
        [width*2+2,width+2,width+1,1]
    ];
        
    const zTetrimino=[
        [width,width+1,width*2+1,width*2+2],
        [1,width+1,width,width*2],
        [0,1,width+1,width+2],
        [width*2+1,width+1,width+1,width+2,2]
    ];

    const tTetrimino=[
        [1,width,width+1,width+2],
        [width+2,1,width+1,width*2+1],
        [width*2+1,width+1,width+1,width+2,2],
        [width,1,width+1,width*2+1],
    ];

    const bTetrimino=[
        [0,1,width,width+1],
        [1,2,width+1,width+2],
        [width+1,width+2,width*2,width*2+1],
        [width,width+1,width*2,width*2+1]
    ];
    const iTetrimino=[
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [2,width+2,width*2+2,width*3+2],
        [width*2,width*2+1,width*2+2,width*2+3]
    ]; 

    const theTetriminos=[pTetrimino,qTetrimino,sTetrimino,zTetrimino,tTetrimino,bTetrimino,iTetrimino];
    console.log(theTetriminos[0][0]);

    //create a random tetrimino

    let random=Math.floor(Math.random() * theTetriminos.length);
    let current=theTetriminos[random][currentRotation];
    console.log(current);

    //add the tetrimino to the grid with a draw function
    function draw(){
        current.forEach(index =>{
            blox[currentPosition+index].classList.add('tetrimino');
            blox[currentPosition+index].style.backgroundColor= colours[random];
        });
    }
       console.log(draw());
       
       function undraw(){
        current.forEach(index=>{
            blox[currentPosition+index].classList.remove('tetrimino');
            blox[currentPosition+index].style.backgroundColor='';
        });
       }

       //start button for start and pause
       startButton.addEventListener('click',()=>{
        if(timerId){
            clearInterval(timerId);
            timerId=null;
            startButton.innerHTML='Game Paused';
        }else{
            draw();
            timerId=setInterval(moveDown,1000);
            startButton.innerHTML='Started';
            nextRandom=Math.floor(Math.random() *theTetriminos.length);
        }
       });
       //function to move teriminos
       function moveDown(){
        undraw();
        currentPosition+=width;
        draw();
        freeze();
       }

       //function to freeze at bottom
       function freeze(){
        if(current.some(index => blox[currentPosition+index+width].classList.contains('taken'))){

            current.forEach(index =>blox[currentPosition+index].classList.add('taken'));

            //new tetrimino in grid
            random=nextRandom;
            nextRandom=Math.floor(Math.random()*theTetriminos.length);
            current=theTetriminos[random][currentRotation];
            current=4;
            draw();
            addScore();
            gameOver();

        }
       }
       //function to move tetrimino to left 
       function moveLeft(){
        undraw();
        const leftEdge=current.some(index => (currentPosition+index)%width ===0);
        if(!leftEdge) currentPosition-=1;
        if(current.some(index => blox[currentPosition+index].classList.contains('taken'))){
        currentPosition+=1;
       }
       draw();
    }

    //function for control keys
    function control(event){
        event.preventDefault();

        if(event.keyCode===37){
            moveLeft();
        }
        else if(event.keyCode==39){
            moveRight();
        }else if(event.keyCode==38){
            turnShape();
        }
    }


    document.addEventListener('keydown',control);

    const leftButton=document.getElementById('left');
    const rotateButton=document.getElementById('rotate');
    const rightButton=document.getElementById('right');
    const downButton=document.getElementById('down');

    leftButton.addEventListener('click',() =>{
        moveLeft();
    });
    rotateButton.addEventListener('click',() =>{
        turnShape();
    });
    rightButton.addEventListener('click',() =>{
        moveRight();
    });
    downButton.addEventListener('click',() =>{
        moveDown();
    });

    //function to move right
    function moveRight(){
        undraw();
        const rightEdge=current.some(index =>(currentPosition+index)%width===width-1);
        if(!rightEdge) currentPosition+=1;
        if(current.some(index =>blox[currentPosition+index].classList.contains('taken'))){
            currentPosition-=1;
        }
        draw();
    }

    //create function for tetrimino rotate
    function turnShape(){
        undraw();
        currentRotation++;
        if(currentRotation=== current.length){
            currentRotation=0;
        }
        current=theTetriminos[random][currentRotation];
        draw();
    }

    const nextBlox=document.querySelectorAll('.display-grid div');
    const nextWidth=4;
    let nextIndex=0;
    console.log(nextBlox);

    //create first position of tetrimino in display grid

    const nextTetrimino=[
        [2,1,nextWidth+1,nextWidth*2+1],
        [0,1,nextWidth+1,nextWidth*2+1],
        [nextWidth*2,nextWidth*2+1,nextWidth+1,nextWidth+2],
        [nextWidth,nextWidth+1,nextWidth*2+1,nextWidth*2+2],
        [1,nextWidth,nextWidth+1,nextWidth+2],
        [0,1,nextWidth,nextWidth+1],
        [1,nextWidth+1,nextWidth*2+1,nextWidth*3+1]
    ];
    //display next up tetrimino in display grid

    function nextUp(){
        nextBlox.forEach(next =>{
            next.classList.remove('tetrimino');
        });
        nextTetrimino[nextRandom].forEach(index => {
            nextBlox[nextIndex+index].classList.add('tetrimino');
        });
    }

    // function for high score
    const playerName=document.getElementById('playerName');
    const saveScoreBtn=document.getElementById('save-score');
    const finalScore =document.getElementById('finalScore');
    const mostRecentScore=localStorage.getItem('mostRecentScore');
    const highScores=JSON.parse(localStorage.getItem('highScores')) || [];
    finalScore.innerText=mostRecentScore;

    playerName.addEventListener('keyup',() =>{
        saveScoreBtn.disabled=!playerName.value;
    });

    saveScore=(e) =>{
        e.preventDefault();
        const score={
            score:mostRecentScore,
            name: playerName.value,
        };
        highScores.push(score);
        highScores.sort((a,b)=> b.score-a.score);
        highScores.splice(3);

        localStorage.setItem('highScores',JSON.stringify(highScores));
        window.location.assign('/');
    };

    //function to add score to game for clearing line

    function addScore(){
        for(let i=0;i<199;i+=width){
            const row=[i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];
            if(row.every(index =>blox[index].classList.contains('taken'))){
                score+=15;
                playerScore.innerHTML=score;
                line+=1;
                gameLine.innerHTML=Lines;{

                    if(lines%4 ===0 && lines<1001){
                        level+=1;
                        score+=100;
                        playerScore.innerHTML=score;
                        playerLevel.innerHTML=level;
                    }
                }

                row.forEach( index=>{
                    blox[index].classList.remove('taken');
                    blox[index].classList.remove('tetrimino');
                    blox[index].style.backgroundColor='';
                });
                const bloxRemoved=blox.splice(i,width);
                blox=bloxRemoved.concat(blox);
                blox.forEach(cell => grid.appendChild(cell));
            }

        }
    }

    //function to check game over conditions
    function gameOver(){
        if(current.some(index=>blox[currentPosition+index].classList.contains('taken'))){
            clearInterval(timerId);
            startButton.innerHTML='Game Over';
            startButton.style.backgroundColor='red';
            startButton.style.color='white';
            startButton.disabled=true;
            localStorage.setItem("mostRecentScore",score);
            return window.location.assign("first.html");
        }
    }

    //function that validates the user input in name of field of scores.html
    //TODO
    function validateForm(){
        let x=document.getElementById('playerName').value;
        if(x==""){
            alert('you must enter a name!');
            return false;
        }
    }
    validateForm();
})