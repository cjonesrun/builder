var newGame = {
  name: "builder",
  description: "build. build. build!",
  version: 0.1,

  SAVE_INTERVAL: 5000,
  UI_REFRESH_INTERVAL: 1000,
  NUMERICAL_DISPLAY_PRECISION: 5,

  WARP_REDUCTION: 0.25,                   // how much things are slowed down when  accumulating "offline"

  game_started: new Date().getTime(),     // when this game started
  last_calculation: new Date().getTime(), // last time the game cal ran
  last_save: new Date().getTime(),        // last time the game was saved  

  base: 10,
  item_base: 1.7, /*1.3*/
  prestige_level: 0,
  prestige_base: 2,
  min_exponent: -324, // min exponent is -324

  total_value: 0, // current total value
  total_value_rate: 0, // total_value rate of change per sec
  total_value_accel: 0, // rate of change of total value rate

  // 5 items
  //item_names: [ 'bit', 'part', 'block', 'thing', 'rube goldberg machine' ];
  // 26 items
  item_names: [ 'bit', 'part', 'block', 'thing', 'object', 'widget', 'device', 'gear', 'contraption', 'gimmick', 'dingbat', 'utensil', 'gadget', 'tool', 'doohickey', 'gismo', 'doodad', 'thingamabob', 'whatchamacalit', 'paraphernalia', 'thingamajig', 'apparatus', 'appliance', 'furnishing', 'rig', 'rube goldberg'],

  // the game state
  map: {}
};


function baseCalc(game, pow) {
  return Math.round( game.base * Math.pow(game.item_base, pow));
};

function buildGameMap(game){
  for (var i=0; i < game.item_names.length; i++) {
    game.map[i] = {
      "name": game.item_names[i],
      "base": baseCalc(game, i),
      "multipliers" : {},
      "count": 0,
      "rate": 0,
      "previous": (i>0) ? i-1 : null,
      "next": (i < game.item_names.length-1) ? i+1 : null,
      "active": i===0 ? true : false
    };    
  }
}



Object.observe(newGame, function(changes) {
  changes.forEach(function(change) {
      //console.log('game-observer', change);
      addMessage( ["game-observer. detected", change.type, 'on', change.name, 'from', change.oldValue, 'to', change.object[change.name]] );
  });
});

Object.observe(newGame.map, function(changes) {
  changes.forEach(function(change) {
      //console.log('map-observer',change);
      addMessage( ["map-observer detected", change.type, 'on',  change.name, 'from', change.oldValue, 'to', change.object[change.name].name] );
  });
});

/*
var script = document.createElement('script'); script.type = 'text/javascript'; script.src = 'js/observe.js'; document.head.appendChild(script);
*/

function go() {
  buildGameMap(newGame);

  for (var i = 0; i< 10; i++){
      newGame.map[0].count += 10;  
    }
}


/*console.log(Object.getNotifier(newGame).performChange('something', function() {
  newGame.name='alksjdalsj';
}));*/
