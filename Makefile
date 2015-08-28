install:
	npm update npm -g
	npm install -g cordova ionic bower grunt 
	npm install -g ios-deploy
	npm install
	npm install grunt-concurrent@1.0.0
	sudo gem install compass
	grunt build
	cordova platform add android


run:
	cordova run andriod -- device
