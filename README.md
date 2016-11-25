# Scrum4Display
An app for Scrum Display, to see all what a scrum team needs

# How to use it
With the package created, you need to create config.json file in the package directory.
Then execute Scrum4Display.exe

##config.json
```json
{
	"webs": "mondays_layout",
	"mondays_layout": [
		{
			"url": "file://~/test.html",
			"script": "$('body').html('INJECTED');",
			"scripts": [
				"file:///home/user/scripts/awesome-script.js"
			],
			"style": "body{background: #444; color: #eee;}",
			"stylesheets": [
				"https://fonts.googleapis.com/css?family=Pacifico",
				"file:///home/user/stylesheets/usePacifico.css"
			],
			"refresh": 5,
			"type": "top-left"
		},
		{
			"url": "http://www.lipsum.com/feed/html",
			"type": "bottom-left"
		},
		{
			"url": "http://www.lipsum.com/feed/html",
			"refresh": 1,
			"type": "top-right",
			"height": "90%"
		},
		{
			"url": "file://~/test.html",
			"type": "bottom-right",
			"top": "90%",
			"height": "10%"
		}
	],
	"dim": "low",
	"serverEditor": {
		"port": 5580,
		"disabled": true
	},
	"fullscreen": false,
	"hackScripts": [
		"file:///home/user/scripts/awesome-app-level-script.js"
	]
```

- **webs** ```String``` or ```Array``` if string is used, refers to a key in the config file which is an array with web objects
  - **url**: The full url to the web page, the symbol ~ is recogniced as the path to the application directory.
  - **refresh**: Time in minutes for refresh intervals
  - **script**: Javascript code to be injected in this web (jQuery is present in non-conflict mode use _$ The variable $ or jQuery might reference to the jQuery version used by the loaded web)
  - **scripts**: List of Javascript source files to be injected in this web (jQuery is present in non-conflict mode use _$ The variable $ or jQuery might reference to the jQuery version used by the loaded web)
  - **style**: CSS code to be injected in this page
  - **stylesheets**: List of CSS source files to be injected in this web
  - **type**: Layout disposition acepted values top-left, top-right, bottom-left, bottom-right
  - **top**: CSS top for layout (% is recomended)
  - **left**: CSS left for layout (% is recomended)
  - **bottom**: CSS bottom for layout (% is recomended)
  - **right**: CSS right for layout (% is recomended)
  - **width**: CSS width for layout (% is recomended)
  - **height**: CSS height for layout (% is recomended)
  - **zIndex**: CSS z-index for layout
  - **opacity**: CSS opacity for layout
- **dim**
  - low
  - medium
  - high
  - insane
- **serverEditor**
  - **port**: an port number if not specified 9001 is used as default value
  - **disabled**: true|false if not specified false is used as default value
- **fullscreen**: true|false if not specified true is used as default value
- **hackScripts**: List of Javascript source files to be injected at app level

## Hotkeys

- ```F5``` Refresh config file
- ```ctrl```+```F5``` Reload the entirely application cleaning the cache (for devel)
- ```F12``` Open a Config Editor Window
- ```F11``` Toggles fullscreen
- ```ctrl```+```shift```+```i``` Open Dev Tools

# Capabilities

- Updates the layout when the config.json file is updated (could take 5 seconds)
- Config Edit (http://<host>:9001/) allows to edit the config file remotely via web browser
- Dev Tools per iframe
- Hackable! / Plugins

# Development

## Create a self contained package
- ```cd app```
- ```npm install```
- ```npm run build```

## Development
- ```npm start``` this will open the application in dev mode (dev toolkit will be opened)
