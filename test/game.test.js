/* global 

    test,
    expect,
    game,
    LCstorage
*/


beforeEach(() => {
    global.gamePage = global.game = new com.nuclearunicorn.game.ui.GamePage();
    //TODO: use special UI system specifically for unit tests
    game.setUI(new classes.ui.UISystem("gameContainerId"));
});

test("basic sanity check, game must load hoglasave without crashing", () => {
    var hoglasave = require("./res/save.js");
    LCstorage["com.nuclearunicorn.kittengame.savedata"] = hoglasave;

    game.load();
});


//--------------------------------
//      Basic faith stuff
//--------------------------------
test("Faith praising should correctly discard faith resoruce and update religion.faith", () => {
    game.resPool.get("faith").value = 1000;
    game.religion.praise();

    expect(game.resPool.get("faith").value).toBe( 0.0001);
    expect(game.religion.faith).toBe(1000);
});


//--------------------------------
//      Ecology tests
//--------------------------------
test("Pollution values must be sane", () => {
    //TODO: please add other effects there

    var bld = game.bld;
    var POL_LBASE = bld.getPollutionLevelBase();
    

    expect(POL_LBASE).toBeGreaterThanOrEqual(100000);

    bld.cathPollution = 100000;
    bld.update();

    let effects = bld.pollutionEffects;
    expect(effects["catnipPollutionRatio"]).toBe(0);
    expect(effects["pollutionHappines"]).toBe(0);

    //----------------------
    //level 0.5
    //----------------------

    bld.cathPollution = POL_LBASE/2;
    bld.update();
    expect(bld.getPollutionLevel()).toBe(0);
    expect(effects["catnipPollutionRatio"]).toBeGreaterThanOrEqual(-0.1);
    expect(effects["pollutionHappines"]).toBe(0);

    //----------------------
    //~lvl 1
    //----------------------
    bld.cathPollution = POL_LBASE;
    bld.update();
    expect(bld.getPollutionLevel()).toBe(1);
    expect(effects["catnipPollutionRatio"]).toBeGreaterThanOrEqual(-0.2);
    //expect(effects["pollutionHappines"]).toBe(0);

    //----------------------
    //  level 1.5
    //----------------------
    bld.cathPollution = POL_LBASE * 10 / 2;
    bld.update();
    expect(bld.getPollutionLevel()).toBe(1);
    expect(effects["catnipPollutionRatio"]).toBeGreaterThanOrEqual(-0.25);

    //----------------------
    //~lvl 2
    //----------------------
    bld.cathPollution = POL_LBASE * 10;
    bld.update();
    expect(bld.getPollutionLevel()).toBe(2);
    expect(effects["catnipPollutionRatio"]).toBeGreaterThanOrEqual(-0.25);
    //expect(effects["pollutionHappines"]).toBeGreaterThanOrEqual(-25);

    //----------------------
    //~lvl 3
    //----------------------
    bld.cathPollution = POL_LBASE * 100;
    bld.update();
    expect(bld.getPollutionLevel()).toBe(3);
    expect(effects["catnipPollutionRatio"]).toBeGreaterThanOrEqual(-0.275);
    //expect(effects["pollutionHappines"]).toBeGreaterThanOrEqual(-25);

    //----------------------
    //~lvl 4
    //----------------------
    bld.cathPollution = POL_LBASE * 1000;
    bld.update();
    expect(bld.getPollutionLevel()).toBe(4);
    expect(effects["catnipPollutionRatio"]).toBeGreaterThanOrEqual(-0.3);
    //expect(effects["pollutionHappines"]).toBeGreaterThanOrEqual(-30);
});