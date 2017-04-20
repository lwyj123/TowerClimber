var System = function() {
    var ticks = 0;
    var refreshSpeed = 1000;

    var init = false;
    var idleMode = false;

    var theGame;
    var idleHealthSlider;
    var idleManaSlider;
    var trackOptOut = false;

    var self = this;
    //Save Method
    var save = function() {
        var systemSave = {
            savedTicks: ticks,
            trackOptOut: trackOptOut
        };
        localStorage.setItem("systemSave",JSON.stringify(systemSave));
    };

    var saveAll = function() {
        save();
        player.save();
        buffs.save();
        monsters.save();
        tower.save();
        inventory.save();
    };

    self.toggleTracking = function() {
        trackOptOut = !trackOptOut;
        saveAll();
        location.reload();
    }

    //Load Method
    var load = function() {
        var systemSave = JSON.parse(localStorage.getItem("systemSave"));
        if (systemSave) {
            if (systemSave.savedTicks !== undefined) {
                ticks = systemSave.savedTicks;
            }
            if (systemSave.trackOptOut !== undefined) {
                trackOptOut = systemSave.trackOptOut;
            }
        }
    };

    var loadAll = function() {
        load();
        player.load();
        //upgrades.load();
        buffs.load();
        monsters.load();
        tower.load();
        inventory.load();
    };


    //Setters

    self.runGame = function() {
        theGame = window.setInterval(main, refreshSpeed);
    };

    self.gameSpeed = function(number) {
        eventEmitter.emit("gameSpeedChange");
        if (idleMode) {
            refreshSpeed = number;
            theGame = window.clearInterval(theGame);
            self.runGame();
            document.getElementById("speed").innerHTML = 1000/number;
        }
    };

    self.exportGame = function() {
        theGame = window.clearInterval(theGame);
        saveAll();

        var exportedData = {
            systemSave: localStorage.getItem('systemSave'),
            playerSave: localStorage.getItem('playerSave'),
            upgradesSave: localStorage.getItem('upgradesSave'),
            buffsSave: localStorage.getItem('buffsSave'),
            monstersSave: localStorage.getItem('monstersSave'),
            towerSave: localStorage.getItem('towerSave'),
            inventorySave: localStorage.getItem('inventorySave')
        };

        document.getElementById('dataContainer').innerHTML = JSON.stringify(exportedData);
        this.runGame();
    };

    self.importGame = function() {
        theGame = window.clearInterval(theGame);
        try {
            var text = document.getElementById('dataContainer').value;
            var importedData = JSON.parse(text);

            if (confirm("Are you sure you want to import this data? Your existing save will be wiped.")) {
                localStorage.clear();

                localStorage.setItem('systemSave', importedData.systemSave);
                localStorage.setItem('playerSave', importedData.playerSave);
                localStorage.setItem('upgradesSave', importedData.upgradesSave);
                localStorage.setItem('buffsSave', importedData.buffsSave);
                localStorage.setItem('monstersSave', importedData.monstersSave);
                localStorage.setItem('towerSave', importedData.towerSave);
                localStorage.setItem('inventorySave', importedData.inventorySave);

                loadAll();
                location.reload();
            }
        } catch (e) {
            console.warn(e);
            alert('Unable to parse save game data!');
        }
        this.runGame();
    };

    self.hardReset = function() {
        theGame = window.clearInterval(theGame);
        eventEmitter.emit('gameReset');
        if (confirm("Are you sure you want to wipe all your progress?")) {
            // localStorage.clear();
            localStorage.removeItem('systemSave');
            localStorage.removeItem('playerSave');
            localStorage.removeItem('upgradesSave');
            localStorage.removeItem('buffsSave');
            localStorage.removeItem('monstersSave');
            localStorage.removeItem('towerSave');
            localStorage.removeItem('inventorySave');

            
        }
        else {
            this.runGame();
        }
    };

    var updateTime = function(number) {
        /*
        document.getElementById("seconds").innerHTML = number % 60;
        number = Math.floor(number / 60);
        document.getElementById("minutes").innerHTML = number % 60;
        number = Math.floor(number / 60);
        document.getElementById("hours").innerHTML = number % 24;
        number = Math.floor(number / 24);
        document.getElementById("days").innerHTML = number;
        */
    };

    var main = function() {
        if (!init) {
            startTheEngine();
        }
        ticks++;
        if (player.getResting()) {
            player.rest();
        }


        updateTime(ticks);
        eventEmitter.emit("TimeChange");
        saveAll();
    };


    var startTheEngine = function() {
        loadAll();
        //loadIdleHealthSlider();
        //loadIdleManaSlider();
        //loadIdleButton();
        player.loadPlayerScreen();
        player.loadExploreButton();
        player.loadRestButton();
        buffs.updateTemporaryBuffs(false);
        //buffs.updateToggleableBuffs();
        buffs.updatePermanentBuffs();
        if (player.getInBattle()) {
            monsters.loadMonsterInfo(monsters.getInstancedMonster());
        }
        tower.loadTowerScreen();
        self.gameSpeed(200);
        init = true;
    };
    /*
    var loadIdleButton = function() {
        if (idleMode) {
            document.getElementById("idleSwitch").innerHTML = '<button class="btn btn-success" onClick="system.toggleIdle()">放置开始</button>';
        }
        else {
            document.getElementById("idleSwitch").innerHTML = '<button class="btn btn-danger" onClick="system.toggleIdle()">放置关闭</button>';
        }
    };
    */
};

$.get( "https://raw.githubusercontent.com/lwyj123/TowerClimber/master/CHANGELOG.md", function( data ) {

    var converter       = new showdown.Converter(),
        md_content        = data,
        md_to_html      = converter.makeHtml( md_content );
    $("#changelog").html( md_to_html );

});

var eventEmitter = new HJevent();
var system = new System();
system.runGame();
