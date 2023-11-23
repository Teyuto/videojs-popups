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
<link href="../src/videojs-popups.css" rel="stylesheet"/>
<script src="../src/videojs-popups.js"></script>
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
},
```

Make sure to replace `'my-video'` with your actual video player ID.

### Extended usage
```javascript
// Add Video.js Popups Plugin
player.popups([
    {
        content: 'Your awesome popup',
        showMarkers: true,
        stopAtPopup: false,
        startSeconds: 2,
        duration: 5,
        position: 'center',
        theme: 'dark',
        markerColor: 'yellow',
        jumpSeconds: 10,
        onClick: function() {
            console.log('Popup clicked!');
        },
        onHover: function() {
            console.log('Popup hovered!');
        }
    },
    // Add more popups as needed
]);
```

## Options

Each popup in the `player.popups` array can have the following options:

- `html`: HTML content of the popup.
- `showMarkers`: Display markers on the progress bar.
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
- `onClick`: Function to execute when the popup is clicked.
- `onHover`: Function to execute when the popup is hovered over.

## Example
Check the provided HTML `examples/index.html` file for a working example.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---