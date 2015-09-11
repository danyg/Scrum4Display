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

- **webs** ```String``` or ```Array``` if string is used, refers to a key in the config file which is an array with web objects
  - **url**: The full url to the web page, the symbol ~ is recogniced as the path to the application directory.
  - **refresh**: Time in minutes for refresh intervals
  - **scripts**: Javascript code to be injected in this page (jQuery is present in non-conflict mode use $, jQuery might reference to the jQuery version loaded in the page)
  - **styles**: CSS code to be injected in this page
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

## Hotkeys

- ```F5``` Refresh config file
- ```shift```+```F5``` Reload the entirely application (for devel)

# Capabilities

- Updates the layout when the config.json file is updated (could take 5 seconds)

# Development

## Create a self contained package
- ```npm install```
- ```npm run build```

### Development
- ```npm start``` this will open the application in dev mode (dev toolkit will be opened)

## Prepare next iteration
- ```npm run next``` increments the build number
- ```npm run nextMajor``` increments the major number
- ```npm run nextMinor``` increments the minor number
- ```npm run changelog``` prints the changelog (from git commits)

```npm run next``` is always executed after ```npm run build```