install:
	brew install android-sdk ant gradle
	npm update npm -g
	npm install -g cordova ionic bower grunt 
	npm install -g ios-deploy
	npm install
	npm install grunt-concurrent@1.0.0
	sudo gem install compass
	grunt build
	cordova platform add android
	ionic plugin add cordova-plugin-whitelist
	ionic plugin add cordova-plugin-camera
	ionic plugin add cordova-plugin-file-transfer

run:
	cordova run andriod -- device

build:
	grunt build
	cordova build android
