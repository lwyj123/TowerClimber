var Combatlog = function() {

  var self = this;

  //监听事件
  //TODO: 考虑死亡和攻击不区分怪物和玩家，用一个统一的方式
  self.init = function() {
    eventEmitter.on('playerDead', function(opponent) {
      self.log("你被 " + opponent.name + " 打败了!<br />")
    });
    eventEmitter.on('playerRunaway-success', function(opponent) {
      self.log("你从 " + opponent.name + " 那里跑掉了!<br />");
    });
    eventEmitter.on('playerRunaway-fail', function(opponent) {
      self.log("你逃跑失败<br>");
    });
    //playerHurted， 参数1为类型，参数2为攻击者，参数3为攻击值
    eventEmitter.on("playerHurted", function() {
      switch(arguments[0]) {
        case 'attack':
          self.log("你被 " + arguments[1].name + "打伤了，损失了" + arguments[2] + "点血量<br />");
          break;
      }
    });
    //playerAttack，参数1为攻击者，参数2为伤害量
    eventEmitter.on("playerAttack", function() {
      self.log("你攻击 " + arguments[0].name + "，造成了" + arguments[1] + "点伤害<br />");
    });

    //monsterDead，参数0为死亡类型，参数1为怪物，参数2为实施者，没有为null
    eventEmitter.on("monsterDead", function() {
      switch(arguments[0]) {
        case 'attack':
          self.log(arguments[1].name + " 被 " + arguments[2].getName() + " 打败了<br />");
          break;
      }
    });
    eventEmitter.on("floorbossDead", function(monster) {
      self.log("本层boss被打败了，可以进入下一层了<br />");
    });





  };

  self.log = function(log) {
    document.getElementById("combatlog").innerHTML += log;
  };
  self.refresh = function() {
    document.getElementById("combatlog").innerHTML = "";
  };
};

var combatlog = new Combatlog();
combatlog.init();