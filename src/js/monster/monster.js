//怪物类
//TODO: 集成到系统里面
//TODO: 把name等设置为私有变量
function Monster(name, seed) {
    this.name = name;
    randomBaseProperty(this, seed);
}
function randomBaseProperty(monster, seed) {
    //TODO: 根据seed随机设置基础属性
    monster.STR = parseInt(Math.random()*100 +20);
    monster.CON = parseInt(Math.random()*100 +20);
    monster.MGC = parseInt(Math.random()*100 +20);
    monster.DEX = parseInt(Math.random()*100 +20);
    monster.SPD = parseInt(Math.random()*100 +20);
}


Monster.prototype.getName = function() {
    return this.name;
};
Monster.prototype.getSTR = function() {
    return this.STR;
};
Monster.prototype.getCON = function() {
    return this.CON;
};
Monster.prototype.getMGC = function() {
    return this.MGC;
};
Monster.prototype.getDEX = function() {
    return this.DEX;
};
//考虑SPD以后有用
Monster.prototype.getSPD = function() {
    return this.SPD;
};

Monster.decorators = {};
Monster.decorators.strong = {
    getName: function() {
        return '强壮的 ' + this._super.getName();
    },
    getSTR: function() {
        return parseInt(this._super.getSTR() * 1.2);
    },
    getCON: function() {
        return parseInt(this._super.getCON() * 1.1);
    }
};
Monster.decorators.weak = {
    getName: function() {
        return '弱小的 ' + this._super.getName();
    },
    getSTR: function() {
        return parseInt(this._super.getSTR() * 0.9);
    },
    getCON: function() {
        return parseInt(this._super.getCON() * 0.95);
    }
};
Monster.decorators.elite = {
    getName: function() {
        return  this._super.getName() + '精英';
    },
    getSTR: function() {
        return parseInt(this._super.getSTR() * 2);
    },
    getCON: function() {
        return parseInt(this._super.getCON() * 3);
    }
}


//装饰者模式
Monster.prototype.decorate = function (decorator) {  
    var F = function () {},
    overrides = this.constructor.decorators[decorator],
    i,
    newobj;

    // Create prototype chain
    F.prototype = this;
    newobj = new F();
    newobj._super = F.prototype;

    // 装饰者替换原来属性
    for (i in overrides) {
        if (overrides.hasOwnProperty(i)) {
            newobj[i] = overrides[i];
        }
    }

    return newobj;
}