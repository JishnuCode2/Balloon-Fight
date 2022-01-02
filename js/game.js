class Game{
    constructor(){
       this.gameOver = false;
       this.resetButton = createButton("");
       this.playerName = createElement("h2");
       this.downKeyActive = false
       this.leader1 = createElement("h3");
       this.leader2 = createElement("h3");
       this.leaderBoardTitle = createElement("h2")
       this.leader3 = createElement("h3");
       this.leader4 = createElement("h3");
    }

    getState(){
      
        database.ref("gameState").on("value",function(data){
             gameState = data.val();
         })
    }

    updateState(state){
        database.ref("/").update({
            gameState : state
        })
    }

    start(){
        form = new Form();
        form.display();
        player = new Player();
        playerCount = player.getCount();

        balloon1 = createSprite(width/2-100,height/2);
        balloon2 = createSprite(width/2+100,height/2);
        balloon1.addImage("balloon1Animation", balloonImg);
        balloon1.addImage("blast",blastImage);
        balloon2.addImage("balloon2Animation", balloonImg);
        balloon2.addImage("blast",blastImage);
        balloon1.debug = true;
        balloon2.debug = true;
        balloon1.scale = 0.2;
        balloon2.scale = 0.2;
        balloon3 = createSprite(width/2-100,height/2);
        balloon4 = createSprite(width/2+100,height/2);
        balloon3.addImage("balloon1Animation", balloonImg);
        balloon3.addImage("blast",blastImage);
        balloon4.addImage("balloon2Animation", balloonImg);
        balloon4.addImage("blast",blastImage);
        balloon3.debug = true;
        balloon4.debug = true;
        balloon3.scale = 0.2;
        balloon4.scale = 0.2;

        balloon1.setCollider("rectangle",0,-100,200,200);
        balloon2.setCollider("rectangle",0,-100,200,200);
        balloon3.setCollider("rectangle",0,-100,200,200);
        balloon4.setCollider("rectangle",0,-100,200,200);
        balloons = [balloon1,balloon2,balloon3,balloon4];

       obstacleGroup = new Group();
       lifeGroup = new Group();
       scoreGroup = new Group();
    }

    play(){
        form.hideObjects()
        player.getDistance()
        Player.getPlayersInfo();
        player.getBalloonsAtEnd()
        this.resetButton.position(width-80,50);
        this.resetButton.class("resetButton")
        this.handleResetButton();


        if(allPlayers !== undefined){
           image(back_img,0,0,width,height)
           var index = 0;
           this.showLife()
           this.showLeaderboard()
           for(var plr in allPlayers){
               index += 1;
               var x = allPlayers[plr].positionX;
               var y = allPlayers[plr].positionY;
               var currentLife = allPlayers[plr].life
               balloons[index-1].position.x = x;
               balloons[index-1].position.y = y;
               if(currentLife <= 0){
                   balloons[index-1].changeImage("blast", blastImage);
                   balloons[index-1].setCollider("circle",0,0,10);
               }
               if(index === player.index){
                   this.playerName.position(x,y+65);
                   this.playerName.html(allPlayers[plr].name)

                   this.handleObstacleCollision(index);
                   this.handleScoreCollision(index);
                   this.handleLifeCollision(index);
                   if(player.life <= 0){
                       this.gameOver = true;
                       this.showGameOver()
                       gameState = 2
                   }
               }
           }
           this.handlePlayerControls(); 
          if(frameCount%100 === 0 && !this.gameOver){
              this.addSprite(scoreImg,0.1,scoreGroup,powerCoins,200)
           }
           if (frameCount % 20 === 0 && this.gameOver === false) {
              this.addSprite(cannonballImg,0.2,obstacleGroup,obstacles,100);
           }
           if(frameCount % 90 === 0 && this.gameOver === false) {
              this.addSprite(lifeImg,0.2,lifeGroup,life,150);
           }

           if (player.score >= 30) {
             gameState = 3;
             player.rank += 1;
             Player.updatePlayersAtEnd(player.rank);
             player.update();
             this.showRank();
          }


  
        }
        drawSprites();
    }

    endGame(){
           this.leader1.html("");
           this.leader2.html("");
           this.leaderBoardTitle.html("");
           this.playerName.html("");
           this.leader3.html("");
           this.leader4.html("");

    }

    handlePlayerControls(){
    if(!this.gameOver){
        if(keyIsDown(UP_ARROW) && player.positionY>50){
           player.positionY -= 6;
           this.downKeyActive = true
           player.update()
        }
        if(keyIsDown(DOWN_ARROW) && player.positionY<height-50){
           player.positionY += 6;
           this.downKeyActive = true

           player.update()
        }
        if(keyIsDown(LEFT_ARROW) && player.positionX>50){
           player.positionX -= 6;

           player.update()
        }
        if(keyIsDown(RIGHT_ARROW) && player.positionX<width-50){
           player.positionX += 6;

           player.update()
        }
    }

    }
 

    showLife(){
      push();
      image(lifeImg, player.positionX-70, player.positionY - 100, 20, 20);
      fill("white");
      rect(player.positionX-40,  player.positionY - 100, 180, 20);
      fill("#f50057");
      rect(player.positionX-40, player.positionY - 100, player.life, 20);
      noStroke();
      pop();
    }
  
 addSprite(image,scale,spriteGroup, spriteName, colliderWidth)
    {       
            var x, y,velocityX,velocityY;
            x = random(0, width-50);
            y = 0
            var rand = Math.round(random(1,4))
     
            switch(rand){
                case 1: 
                        x = 0;
                        y = random(50,height-50);
                        velocityX = 5;
                        velocityY = 0; 
                break;
                case 2:               
                        x = width;
                        y = random(50,height-50);
                        velocityX = -5;
                        velocityY = 0;
                break;
                case 3: 
                        x = random(0,width);
                        y = height;
                        velocityX = 0;
                        velocityY = -5;
                break;
                case 4: 
                        x = random(0,width);
                        y = 0;
                        velocityX = 0;
                        velocityY = 5;
                default : break;
            }

            spriteName = createSprite(x,y);
            spriteName.debug = true;
            spriteName.addImage("image",image);
            spriteName.velocityY =  velocityY;
            spriteName.velocityX = velocityX;
            spriteName.setCollider("circle",0,0,colliderWidth)
    
            spriteName.scale = scale
            spriteName.lifetime = 300;
            spriteGroup.add(spriteName);


    }




    
    
   handleObstacleCollision(index){
        if(balloons[index-1].collide(obstacleGroup) && this.gameOver === false){
           if (this.downKeyActive) {
               player.positionY += 100;
              } else {
                player.positionY -= 100;
              }
        
              if (player.life > 0) {
                player.life -= 90;
              var blast = createSprite(balloons[index-1].position.x,balloons[index-1].position.y);
              blast.addImage("blast", blastImage);
              blast.scale = 0.3;
              blast.life = 20;
              blastSound.play();
            }


        
        
        
              player.update();

        }
    }


   handleScoreCollision(index) {
    balloons[index - 1].overlap(scoreGroup, function(collector, collected) {
      player.score += 1
      player.update();
      scoreSound.play();
      collected.remove();
    });
  }

  handleLifeCollision(index) {
    balloons[index - 1].overlap(lifeGroup, function(collector, collected) {
      if(player.life < 180){
          player.life += 40 
      }
  
      player.update();
      scoreSound.play();
      collected.remove();
    });
  }

    showGameOver(){
        push();
        textSize(40);
        fill("white");
        stroke("white");
        text("You lost. Play again by pressing the reset Button",250,height/2+100);
        text("Your score: "+player.score,250,height/2+150);
        pop(); 
     
    }

    showRank(){
        push();
        textSize(40);
        fill("white");
        stroke("white");
        text("You Won! Play again by pressing the reset Button",250,height/2+100);
        text("Your Rank: "+player.rank,250,height/2+150);
        pop(); 
    }

    showLeaderboard() {
    
        var leader1, leader2,leader3,leader4
        var players = Object.values(allPlayers);
        if (
          (players[0].rank === 0 && players[1].rank === 0) ||
          players[0].rank === 1
        ) {
          // &emsp;    This tag is used for displaying four spaces.
          leader1 =
            players[0].rank +
            "." +
            "&emsp;" +
            players[0].name +
            "&emsp;" +
            players[0].score;
    
          leader2 =
            players[1].rank +
            "." +
            "&emsp;" +
            players[1].name +
            "&emsp;" +
            players[1].score;

          leader3 =
          players[2].rank +
          "." +
          "&emsp;" +
          players[2].name +
          "&emsp;" +
          players[2].score;

          leader4 = 
          players[3].rank +
          "." +
          "&emsp;" +
          players[3].name +
          "&emsp;" +
          players[3].score;
        }
    
        if (players[1].rank === 1) {
          leader1 =
            players[1].rank +
             "." +
            "&emsp;" +
            players[1].name +
            "&emsp;" +
            players[1].score;
    
          leader2 =
            players[0].rank +
            "." +
            "&emsp;" +
            players[0].name +
            "&emsp;" +
            players[0].score;

            leader3 =
            players[2].rank +
            "." +
            "&emsp;" +
            players[2].name +
            "&emsp;" +
            players[2].score;
  
            leader4 = 
            players[3].rank +
            "." +
            "&emsp;" +
            players[3].name +
            "&emsp;" +
            players[3].score;
        }

        if(players[2].rank === 1){
            leader1 =
            players[2].rank +
            "." +
            "&emsp;" +
            players[2].name +
            "&emsp;" +
            players[2].score;

            leader2 =
            players[0].rank +
             "." +
            "&emsp;" +
            players[0].name +
            "&emsp;" +
            players[0].score;
    
          leader3 =
            players[1].rank +
            "." +
            "&emsp;" +
            players[1].name +
            "&emsp;" +
            players[1].score;

          leader4 = 
          players[3].rank +
          "." +
          "&emsp;" +
          players[3].name +
          "&emsp;" +
          players[3].score;

        }

        if(players[3].rank === 1){
            leader1 =
            players[3].rank +
            "." +
            "&emsp;" +
            players[3].name +
            "&emsp;" +
            players[3].score;

            leader2 =
            players[0].rank +
             "." +
            "&emsp;" +
            players[0].name +
            "&emsp;" +
            players[0].score;
    
          leader3 =
            players[1].rank +
            "." +
            "&emsp;" +
            players[1].name +
            "&emsp;" +
            players[1].score;

          leader4 = 
          players[2].rank +
          "." +
          "&emsp;" +
          players[2].name +
          "&emsp;" +
          players[2].score;

        }

        this.leader1.position(100,80);
        this.leader2.position(100,110);
        this.leader3.position(100,140);
        this.leader4.position(100,170);
    
        this.leader1.html(leader1);
        this.leader2.html(leader2);
        this.leader3.html(leader3);
        this.leader4.html(leader4);

        this.leaderBoardTitle.position(100,50);
        this.leaderBoardTitle.html("Leader board:--- ");
    }
      
    

    handleResetButton(){
        this.resetButton.mousePressed(() => {
            database.ref("/").set({
                playersAtEnd: 0,
                playerCount: 0,
                gameState: 0,
                palyers: {}
              });
              window.location.reload();
        })
    }

}