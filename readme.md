# Video.js Popups Plugin

The Video.js Popups Plugin enhances your Video.js player by allowing you to display interactive popups at specified timestamps during video playback. These popups can contain custom HTML content, offering a dynamic and engaging experience for your audience.

## Compatibility

This plugin version is compatible with Video.js v8.x.

## Getting Started

### Prerequisites

Make sure you have [Video.js](https://videojs.com/) installed in your project before using this plugin.

### Installation

Include the Video.js library and the `videojs-popups` files in your HTML file:

```html
<!-- Video.js library -->
<link href="https://vjs.zencdn.net/8.6.1/video-js.css" rel="stylesheet"/>
<script src="https://vjs.zencdn.net/8.6.1/video.min.js"></script>

<!-- Video.js Popups plugin -->
<link href="https://cdn.jsdelivr.net/gh/Teyuto/videojs-popups@main/src/videojs-popups.min.css" rel="stylesheet"/>
<script src="https://cdn.jsdelivr.net/gh/Teyuto/videojs-popups@main/src/videojs-popups.min.js"></script>
```

### Usage

Initialize Video.js as you normally would and add the Video.js Popups Plugin:

```javascript
// Create a video player
var player = videojs('my-video');

// Add Video.js Popups Plugin
player.popups([
{
    content: 'Your awesome popup',
    startSeconds: 2,
    position: 'center'
}
]},
```

Make sure to replace `'my-video'` with your actual video player ID.

### Extended usage
```javascript
// Add Video.js Popups Plugin

var popupsManager = player.popups();

popupsManager.add([
    {
        id: 'popup-1'
        content: 'Your awesome popup',
        showMarker: true,
        stopAtPopup: false,
        startSeconds: 2,
        duration: 5,
        position: 'center',
        theme: 'dark',
        markerColor: 'yellow',
        jumpSeconds: 10,
        showOnce: false,
        onClick: function() {
            console.log('Popup clicked!');
        },
        onHover: function() {
            console.log('Popup hovered!');
        }
    },
    // Add more popups as needed
]);

// Example: Remove all popups
popupsManager.removeAll();

// Example: Remove a popup by ID
popupsManager.removeById('popup-1');

// Retrieve and log the list of all active popups
var activePopups = popupsManager.list();
```

**Note for Live Streams:**

If the plugin is used for live video streams, *it is not necessary* to specify `startSeconds` in the popup options. Additionally, it is advisable to set `showMarker` to `false` for a cleaner experience.

**Real-time Popup Updates:**

Combine the `add` and `remove` functions with WebSocket communication to create real-time popups. An exemplary use case includes showcasing products in real-time during a live shopping event.


## Options

Each popup in the `player.popups` array can have the following options:

- `id`: Popup identifier
- `content`: HTML content of the popup.
- `showMarker`: Display markers on the progress bar.
- `stopAtPopup`: Pause the video when the popup is displayed.
- `startSeconds`: Start time of the popup in seconds.
- `duration`: Duration of the popup in seconds.
- `position`: Position of the popup, which can be specified as follows:
  - 'center': Center of the video player.
  - 'top-left', 'top-center', 'top-right': Top positions.
  - 'bottom-left', 'bottom-center', 'bottom-right': Bottom positions.
  - '10,90': Custom position using coordinates (percentage values).
- `theme`: Theme of the popup (e.g., 'dark', 'light' or custom css class).
- `markerColor`: Color of the progress bar marker (default red).
- `jumpSeconds`: Number of seconds to jump when clicking the popup marker.
- `showOnce`: Destroy popup after first appearance
- `onClick`: Function to execute when the popup is clicked.
- `onHover`: Function to execute when the popup is hovered over.

## Example
Check the provided HTML `examples/index.html` file for a working example.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---