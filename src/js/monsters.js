var Monsters = function() {
    var inBossBattle = false;
    var monsterList = [
        //First Tier
        {name:"老鼠", killed:0},
        {name:"蝙蝠", killed:0},

        //Second Tier
        {name:"狗熊", killed:0},
        {name:"稻草人", killed:0},
        //Third Tier
        {name: "宝箱怪", killed: 0},
        {name: "狼人", killed: 0},

        //Fourth Tier
        {name: "石头人", killed: 0},
        {name: "鳄鱼", killed: 0},

        //Fifth Tier
        {name: "剑姬", killed: 0},
        {name: "剑客", killed: 0},
    ];

    var bossList = [
        {name: "红熊王", currentHealth: 91204, maximumHealth: 91204, strength: 151, dexterity: 151, constitution: 151, status: 0},
        {name: "骷髅领主", currentHealth: 372100, maximumHealth: 372100, strength: 305, dexterity: 305, constitution: 305, status: 0},
        {name: "亡灵骑士", currentHealth: 864900, maximumHealth: 864900, strength: 465, dexterity: 465, constitution: 465, status: 0},
        {name: "大帝 昂布呐斯", currentHealth: 1638400, maximumHealth: 1638400, strength: 640, dexterity: 640, constitution: 640, status: 0},
        {name: "斯基劳爵士", currentHealth: 2930944, maximumHealth: 2930944, strength: 856, dexterity: 856, constitution: 856, status: 0}
    ];

    var instancedMonster = {
        name: "",
        currentHealth: 0,
        maximumHealth: 0,
        strength: 0,
        dexterity: 0,
        constitution: 0,
        status: 0
    };

    var self = this;
    //Save Method
    self.save = function() {
        var monstersSave = {
            savedMonsterList: monsterList,
            savedInstancedMonster: instancedMonster,
            savedInBossBattle: inBossBattle
        };
        localStorage.setItem("monstersSave",JSON.stringify(monstersSave));
    };

    //Load Method
    self.load = function() {
        var monstersSave = JSON.parse(localStorage.getItem("monstersSave"));
        if (monstersSave) {
            if (monstersSave.savedMonsterList !== undefined) {
                loadMonsterList(monstersSave.savedMonsterList);
            }
            if (monstersSave.savedInstancedMonster !== undefined) {
                loadInstancedMonster(monstersSave.savedInstancedMonster);
            }
            if (monstersSave.savedInBossBattle !== undefined) {
                inBossBattle = monstersSave.savedInBossBattle;
            }
        }
    };

    var loadMonsterList = function(savedMonsterList) {
        for (var i = 0; i < savedMonsterList.length; i++) {
            if (i == monsterList.length) {
                break;
            }
            if (savedMonsterList[i].killed !== undefined) {
                monsterList[i].killed = savedMonsterList[i].killed;
            }
        }
    };

    var loadInstancedMonster = function(savedInstancedMonster) {
        if (savedInstancedMonster.name !== undefined) {
            instancedMonster.name = savedInstancedMonster.name;
        }
        if (savedInstancedMonster.currentHealth !== undefined) {
            instancedMonster.currentHealth = savedInstancedMonster.currentHealth;
        }
        if (savedInstancedMonster.maximumHealth !== undefined) {
            instancedMonster.maximumHealth = savedInstancedMonster.maximumHealth;
        }
        if (savedInstancedMonster.strength !== undefined) {
            instancedMonster.strength = savedInstancedMonster.strength;
        }
        if (savedInstancedMonster.dexterity !== undefined) {
            instancedMonster.dexterity = savedInstancedMonster.dexterity;
        }
        if (savedInstancedMonster.constitution !== undefined) {
            instancedMonster.constitution = savedInstancedMonster.constitution;
        }
        if (savedInstancedMonster.status !== undefined) {
            instancedMonster.status = savedInstancedMonster.status;
        }
    };

    //Getters
    self.getMonsterList = function() {
        return monsterList;
    };

    self.getInstancedMonster = function() {
        return instancedMonster;
    };

    self.getBossMonster = function(number) {
        return bossList[number];
    };

    self.getInBossBattle = function() {
        return inBossBattle;
    };

    //Setters
    self.setInstancedMonster = function(updatedMonster) {
        instancedMonster = updatedMonster;
    };

    self.setInBossBattle = function(boolean) {
        inBossBattle = boolean;
    };

    //Other Methods
    self.attackMelee = function() {
        if(player.getInBattle()) {
            self.battle(instancedMonster, false);
        }
    };

    self.loadMonsterInfo = function(monster) {
        if (monster !== undefined) {
            document.getElementById("monstername").innerHTML = monster.name;
            document.getElementById("monsterhp").innerHTML = Math.round(monster.currentHealth);
            document.getElementById("monsterstr").innerHTML = monster.strength;
            document.getElementById("monsterdex").innerHTML = monster.dexterity;
            document.getElementById("monstercon").innerHTML = monster.constitution;
            document.getElementById("monsterbar").style.width = 100*(monster.currentHealth/monster.maximumHealth) + "%";
            if (!inBossBattle) {
                document.getElementById("combatlog").innerHTML = "You are attacked by a " + monster.name + "!<br>";
            }
            else {
                document.getElementById("combatlog").innerHTML = "You challenge a floor boss! You begin fighting " + monster.name + "!<br>";
            }
            player.setInBattle(true);
        }
        else {
            document.getElementById("monstername").innerHTML = "None";
            document.getElementById("monsterhp").innerHTML = "0";
            document.getElementById("monsterstr").innerHTML = "0";
            document.getElementById("monsterdex").innerHTML = "0";
            document.getElementById("monstercon").innerHTML = "0";
            document.getElementById("monsterbar").style.width = "0%";
        }
    };

    /**
     * 攻击怪物
     * @param  {[type]} monster   [description]
     * @param  {[type]} spellCast [description]
     * @return {[type]}           [description]
     */
    self.battle = function(monster, spellCast) {
        if(!player.getInBattle()) {
            player.setInBattle(true);
            player.loadRestButton();
            player.loadExploreButton();
            self.loadMonsterInfo(monster);
            if (buffs.getCastFireballInBattle()) {
                spells.castSpell("fireball");
            }
        }
        else {
            var isDead = false;
            if (!spellCast) {
                document.getElementById("combatlog").innerHTML = '';
                if (buffs.getCastCureInBattle() && player.getHealthCurrentValue() <= player.getHealthMaximumValue()/2) {
                    if (!spells.castSpell("cure")) {
                        isDead = playerAttacks(monster);
                    }
                    else {
                        buffs.updateTemporaryBuffs(true);
                        return true;
                    }
                }
                else {
                    //玩家攻击
                    isDead = playerAttacks(monster);
                }
            }
            if (!isDead) {
                //怪物攻击
                isDead = monsterAttacks(monster);
            }
        }
        buffs.updateTemporaryBuffs(true);
    };

    var playerAttacks = function(monster) {
        var damage = damageFormula(player.getStrengthLevel() + player.getStrengthBonus(), player.getDexterityLevel() + player.getDexterityBonus(), monster.constitution, monster.currentHealth);
        if (buffs.getRageTimeLeft() !== 0) {
            damage *= 5;
        }
        if (damage >= monster.currentHealth) {
            damage = monster.currentHealth;
        }
        eventEmitter.emit('playerAttack', monster, Math.round(damage));
        return self.monsterTakeDamage(monster, damage);
    };

    /**
     * 怪物损血
     * @param  {Object} monster 怪物实例
     * @param  {Number} damage  受到伤害
     * @return {Boolean}         是否死亡，true死亡
     */
    self.monsterTakeDamage = function(monster, damage) {
        monster.currentHealth -= damage;
        document.getElementById("monsterhp").innerHTML = Math.floor(monster.currentHealth);
        document.getElementById("monsterbar").style.width = 100*(monster.currentHealth/monster.maximumHealth) + "%";
        if (monster.currentHealth <= 0) {
            monsterDeath(monster);
            return true;
        }
        return false;
    };

    /**
     * 怪物死亡，通知日志以及探索button解锁
     * @param  {[type]} monster 怪物实例
     */
    var monsterDeath = function(monster) {
        player.setInBattle(false);
        if (!inBossBattle) {
            eventEmitter.emit('monsterDead', 'attack', monster, player);
            updateMonsterKilled(monster.name);
        }
        else {
            eventEmitter.emit('monsterDead', 'attack', monster, player);
            eventEmitter.emit('floorbossDead', monster);
            tower.setBossFound(false);
            tower.setLastBossDefeated(player.getCurrentFloor());
            tower.bossDefeated();
            inBossBattle = false;
        }
        //upgrades.gainExcelia(monster);
        player.loadRestButton();
        player.loadExploreButton();
        self.loadMonsterInfo();
    };

    var updateMonsterKilled = function(name) {
        for (var i = 0; i < monsterList.length; i++) {
            if (monsterList[i].name == name) {
                monsterList[i].killed++;
            }
        }
    };

    /**
     * 伤害计算
     * @param  {Number} attackerStrength     攻击者力量
     * @param  {Number} attackerDexterity    攻击者敏捷
     * @param  {Number} defenderConstitution 防御者体格
     * @param  {Number} defenderHealth       防御者生命
     * @return {Number}                      伤害值
     */
    var damageFormula = function(attackerStrength, attackerDexterity, defenderConstitution, defenderHealth) {
        var strengthWeigth = 2;
        var dexterityWeigth = 0.1;
        var constitutionWeigth = 0.5;
        var damage = ((attackerStrength * strengthWeigth) - (defenderConstitution * constitutionWeigth)) * (attackerDexterity * dexterityWeigth);

        if (damage < 0) {
            damage = 0;
        }
        else if (damage > defenderHealth) {
            damage = defenderHealth;
        }
        return damage;
    };

    var monsterAttacks = function(monster) {
        var damage = damageFormula(monster.strength, monster.dexterity, player.getConstitutionLevel() + player.getConstitutionBonus(), player.getHealthCurrentValue());
        if (buffs.getRageTimeLeft() !== 0) {
            damage = damage*2;
        }
        if (buffs.getAegisTimeLeft() === 0) {
            //考虑屏障系统
            player.setHealthCurrentValue(player.getHealthCurrentValue() - damage);
            eventEmitter.emit("playerHurted", "attack", monster, Math.round(damage))
            if (player.getHealthCurrentValue() === 0) {
                eventEmitter.emit("playerDead", monster);
                return true;
            }
        }
        else {
            document.getElementById("combatlog").innerHTML += "Aegis absorbed " + Math.round(damage) + " damage from " + monster.name + "'s attack.<br>";
        }
        eventEmitter.emit('monsterAttack', monster);
        return false;
    };

    /**
     * 
     * @param  {[type]} boolean [description]
     * @return {[type]}         [description]
     */
    self.battleChance = function(boolean) {
        if (boolean) {
            rollMonster();
            return true;
        }
        else {
            var check = Math.random()*100;
            if (check <= tower.getFloorMonsterDensity(player.getCurrentFloor())) {
                rollMonster();
                return true;
            }
            return false;
        }
    };

    /**
     * 随机怪物，进入战斗
     * 由于默认一层10个，后面需要修改
     */
    var rollMonster = function() {
        var tier = Math.floor((player.getCurrentFloor()-1)/10);
        var monster = Math.floor(Math.random()*10);
        while(monster == 10) {
            monster = Math.floor(Math.random()*10);
        }
        instancedMonster = createMonster((tier*10) + monster);
        self.battle(instancedMonster, false);
    };

    /**
     * 创建怪物
     * TODO: 更加优雅的怪物对象代码
     * @param  {Number} number 创建代码
     * @return {Object}        怪物实例
     */
    var createMonster = function(number) {
        var tempMonster = {name: "", currentHealth: 0, maximumHealth:0 , strength: 0, dexterity: 0, constitution: 0, status: 0};
        var statPool = Math.round((player.getCurrentFloor() * 15) + Math.pow(1.1, player.getCurrentFloor() - 1) - 1);
        tempMonster.name = monsterList[number].name;
        tempMonster.strength++;
        tempMonster.dexterity++;
        tempMonster.constitution++;
        //中间件方式实现装饰者

        tempMonster.addDecorators = function(decorators) {
            var self = this;
            //TODO: 实现多称号而不是单一称号
            decorators(self);
        };
        statPool -= 3;
        randomMonsterTitle(tempMonster);
        distributeStats(tempMonster, statPool);
        tempMonster.maximumHealth = calculateHealth(tempMonster.constitution);
        tempMonster.currentHealth = tempMonster.maximumHealth;
        return tempMonster;
    };

    /**
     * 为怪物添加随机称号
     * @param  {Object} monster 怪物实例
     */
    var randomMonsterTitle = function(monster) {
        //TODO: 更加优雅的代码
        //TODO: 实现无称号
        var decorators = [
            function(monster) {
                monster.name = "懦弱的 " + monster.name;
                monster.strength -= 2;
                monster.constitution -= 2;
            },
            function(monster) {
                monster.name = "强壮的 " + monster.name;
                monster.strength += 2;
                monster.constitution += 2;
            },            
        ];
        let index = Math.floor((Math.random()*decorators.length)); 
        monster.addDecorators(decorators[index]);
    };


    /**
     * TODO: 解析
     * 加强怪物？？？
     * @param  {[type]} monster  [description]
     * @param  {[type]} statPool [description]
     * @return {[type]}          [description]
     */
    var distributeStats = function(monster, statPool) {
        var choice;
        while (statPool !== 0) {
            choice = Math.floor(Math.random()*3);
            while (choice == 3) {
                choice = Math.floor(Math.random()*3);
            }
            if (choice === 0) {
                monster.strength++;
            }
            else if (choice == 1) {
                monster.dexterity++;
            }
            else if (choice == 2) {
                monster.constitution++;
            }
            statPool--;
        }
    };

    /**
     * 根据体格计算血量
     * @param  {Number} constitution 体格值
     * @return {Number}              HP值
     */
    var calculateHealth = function(constitution) {
        return (Math.pow(constitution, 2) * 4);
    };

    /**
     * 逃跑
     */
    self.runAway = function() {
        if (player.getInBattle()) {
            var runRoll = Math.random() * (instancedMonster.strength + instancedMonster.dexterity + instancedMonster.constitution);
            if (runRoll < player.getSpeedLevel()) {
                eventEmitter.emit('playerRunaway-success', instancedMonster);
                
                self.loadMonsterInfo();
                player.setSpeedExperience(player.getSpeedExperience() + runRoll);
                player.setInBattle(false);
                player.loadExploreButton();
                player.loadRestButton();
            }
            else {
                //逃跑失败
                eventEmitter.emit('playerRunaway-fail');
                self.battle(instancedMonster, true);
            }
        }
        if (inBossBattle) {
            inBossBattle = false;
        }
    }
};

var monsters = new Monsters();