var Combatlog = function() {

  var self = this;

  //监听事件
  self.init = function() {
    eventEmitter.on('playerDeath', function(opponent) {
      self.log("你被 " + opponent.name + " 打败了!")
    });
    eventEmitter.on('playerRunaway-success', function(opponent) {
      self.log("你从 " + opponent.name + " 那里跑掉了!");
    });
    eventEmitter.on('playerRunaway-fail', function(opponent) {
      self.log("你逃跑失败<br>");
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