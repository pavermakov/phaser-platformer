var GameState = {
  init: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.world.setBounds(0, 0, 360, 700);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED = 500;
  },

  preload: function() {
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('platform', 'assets/images/platform.png');
    this.load.image('barrel', 'assets/images/barrel.png');
    this.load.image('arrow', 'assets/images/arrow.png');
    this.load.image('button', 'assets/images/button.png');

    this.load.spritesheet('player', 'assets/images/player.png', 66, 90, 11, 1, 1);

    this.load.text('level', 'assets/data/level.json');
  },

  create: function() {
    this.levelData = JSON.parse(this.game.cache.getText('level'));

    this.createGround();
    this.createPlatforms();

    this.player = this.game.add.sprite(this.levelData.playerData.x, this.levelData.playerData.y, 'player');
    this.game.physics.arcade.enable(this.player);
    this.player.anchor.setTo(0.5);
    this.player.scale.setTo(0.5);
    this.player.animations.add('walk', [20, 12], 8, true);
    this.player.customParams = {
      mustJump: false,
      movingLeft: false,
      movingRight: false
    };
    this.game.camera.follow(this.player);

    this.createOnscreenControls();
  },

  update: function (){
    this.game.physics.arcade.collide(this.player, this.ground);
    this.game.physics.arcade.collide(this.player, this.platforms);

    this.player.body.velocity.x = 0;

    if(this.cursors.left.isDown || this.player.customParams.movingLeft) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
    } else if(this.cursors.right.isDown || this.player.customParams.movingRight){
      this.player.body.velocity.x = this.RUNNING_SPEED;
    }

    if((this.cursors.up.isDown || this.player.customParams.mustJump) && this.player.body.touching.down) {
      this.player.body.velocity.y = -this.JUMPING_SPEED;
      this.player.customParams.mustJump = false;
    }
  },

  createGround: function() {
    var x = 0, y = this.game.world.height - 50, currentWidth = 0, totalWidth = this.game.world.width, groundItem;
    this.ground = this.game.add.group();
    this.ground.enableBody = true;

    while(currentWidth < totalWidth) {
      groundItem = this.ground.create(x, y, 'ground');
      groundItem.anchor.setTo(0, 0.5);
      groundItem.scale.setTo(0.3);
      x += groundItem.width;
      currentWidth += groundItem.width;
    }

    this.ground.setAll('body.allowGravity', false);
    this.ground.setAll('body.immovable', true);
  },

  createPlatforms: function() {
    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;

    var platform, platformLength = 6;
    this.levelData.platformData.forEach(function(element) {
      for(var i = 0; i < platformLength; i++){
        platform = this.platforms.create(element.x + 35 * i, element.y, 'platform');
        platform.scale.set(0.3);
      }  
    }, this);

    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);
  },

  createOnscreenControls: function() {
    this.leftArrow = this.game.add.button(40, 560, 'arrow');
    this.leftArrow.fixedToCamera = true;
    this.leftArrow.anchor.setTo(0.5);
    this.leftArrow.scale.setTo(-0.2, 0.2);
    this.leftArrow.alpha = 0.7;

    this.leftArrow.events.onInputDown.add(function(){
      this.player.customParams.movingLeft = true;
    }, this);

    this.leftArrow.events.onInputUp.add(function(){
      this.player.customParams.movingLeft = false;
    }, this);

    this.leftArrow.events.onInputOut.add(function(){
      this.player.customParams.movingLeft = false;
    }, this);

    this.rightArrow = this.game.add.button(120, 560, 'arrow');
    this.rightArrow.fixedToCamera = true;
    this.rightArrow.anchor.setTo(0.5);
    this.rightArrow.scale.setTo(0.2);
    this.rightArrow.alpha = 0.7;

    this.rightArrow.events.onInputDown.add(function(){
      this.player.customParams.movingRight = true;
    }, this);

    this.rightArrow.events.onInputUp.add(function(){
      this.player.customParams.movingRight = false;
    }, this);

    this.rightArrow.events.onInputOut.add(function(){
      this.player.customParams.movingRight = false;
    }, this);


    this.actionButton = this.game.add.button(this.game.world.width - 40, 560, 'button');
    this.actionButton.fixedToCamera = true;
    this.actionButton.anchor.setTo(0.5);
    this.actionButton.scale.setTo(0.3);
    this.actionButton.alpha = 0.7;

    this.actionButton.events.onInputDown.add(function(){
      this.player.customParams.mustJump = true;
    }, this);

    this.actionButton.events.onInputUp.add(function(){
      this.player.customParams.mustJump = false;
    }, this);
  }

};

var game = new Phaser.Game(360, 592, Phaser.AUTO);
game.state.add('GameState', GameState);
game.state.start('GameState');
