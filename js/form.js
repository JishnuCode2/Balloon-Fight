class Form {
    constructor(){
        this.input=createInput("").attribute("placeholder", "Please enter your name");
        this.greeting = createElement("h2");
        this.playButton = createButton("Play");
        this.titleImg = createImg("assets/BalloonFightTitle.jpg");
        this.controls = createElement("h2");
        this.warning = createElement("h2");
       }

    setElementsPosition(){
       this.titleImg.position(width/2-300, 60);
       this.greeting.position(width/2-250, height/2+100);
       this.playButton.position(width/2-140, height/2+50);
       this.input.position(width/2-250, 280);
       this.controls.position(width/2-270, height/2+180);
       
        this.controls.html(`Use the arrow keys to move your balloon. 
           </br> Do not get hit by any of the obstacles and be the last to survive.
           </br> Touch the coins to increase your score. Be the first to reach 30 points.`);
          
       this.warning.position(width/2-420,height/2+90)
       this.warning.html("***This is a four player game. Read the instructions before starting")
    }

    setElementsStyle(){
       this.titleImg.class("gameTitle");
       this.greeting.class("leadersText");
       this.controls.class("controlText");
       this.input.class("customInput");
       this.playButton.class("customButton");
       this.warning.class("leadersText");
    }

    mousePressed1(){
        this.playButton.mousePressed(() => {
           this.input.hide();
           this.playButton.hide();
           this.warning.hide();
           var message = `Hello ${this.input.value()} </br>wait for another player to join...`;
           this.greeting.html(message);
          
           playerCount += 1;
           player.name = this.input.value();
           player.index = playerCount;
           player.addPlayer();
           player.updateCount(playerCount);
           player.getDistance();
        })
    }

    hideObjects(){
       this.input.hide();
       this.titleImg.hide();
       this.greeting.hide();
       this.controls.hide();
    }

    display(){
        image(balloonImg,width/2-300,height/2-100,50,50);
        this.setElementsPosition();
        this.setElementsStyle();
        this.mousePressed1();
    }
}