// init from localstorage if they are present, bfore starting the timer
init(window.localStorage['builder']);

addMessage(['starting prestige is', game.prestige_base+'^'+game.prestige_level,'=', numberFormat(prestigeMultiplier()) ] );

// show/hide components

