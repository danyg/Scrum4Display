# Scrum4Display
An app for Scrum Display, to see all what a scrum team needs


# How it works

## Create a self contained package
- ```npm install```
- ```npm run-script build```
For development propuses
- ```npm start```

## How to use it
With the package created, you need to create config.json file in the package directory.
Then execute Scrum4Display.exe

#config.json
```json
{
	"webs": [
		{
			"url": "file://~/test.html",
			"scripts": "$('body').html('INJECTED');",
			"styles": "body{background: #444; color: #eee;}",
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
	"dim": "low"
```
- **webs**
-- **url**: The full url to the web page, the symbol ~ is recogniced as the path to the application directory.
-- **refresh**: Time in minutes for refresh intervals
-- **scripts**: Javascript code to be injected in this page
-- **styles**: CSS code to be injected in this page
-- **type**: Layout disposition acepted values top-left, top-right, bottom-left, bottom-right
-- **top**: CSS top for layout (% is recomended)
-- **left**: CSS left for layout (% is recomended)
-- **width**: CSS width for layout (% is recomended)
-- **height**: CSS height for layout (% is recomended)
- **dim**
-- low
-- medium
-- high
-- insane

### Hotkeys

- ```F5``` Refresh config file
- ```shift```+```F5``` Reload the entirely application (for devel)
