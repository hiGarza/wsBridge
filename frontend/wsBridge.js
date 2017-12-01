var wsBridge = {};

OO.plugin("wsBridge", function(OOO,_,$,W){
	var player = {};

	player.UIModule = function(mb,id){
		this.mb = mb;
		this.id = id;
		this.init();
	};

	player.UIModule.prototype = {
		init: function(){
			this.mb.subscribe(OO.EVENTS.PLAYER_CREATED, "BridgePlayer", _.bind(this.onPlayerCreated, this));
			this.mb.subscribe(OO.EVENTS.PLAYBACK_READY, "BridgePlayer", _.bind(this.onPlaybackReady, this));	
		},
		onPlayerCreated: function(event, elementId, params){
			this.playerId = elementId;
			this.acceptedEvent = params["wsEvent"];
		},
		onPlaybackReady: function(event){
			this.player = OOO.players[this.playerId];
			this.evtSource = new EventSource("//127.0.0.1:8080");
		    this.evtSource.onmessage = function(e) {
		    	var data = JSON.parse(e.data);
		    	if(this.acceptedEvent === data.event && this.player.getEmbedCode() === data.embedCode){
			    	wsBridge.execute(this.mb, this.player, data.message);
		    	}
			}.bind(this);
		}
	};
	return player.UIModule;
});