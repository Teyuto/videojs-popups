videojs.registerPlugin('popups', function(options) {
    var player = this;
  
    options = options || [];
  
    options.forEach(function(popup) {
      var marker;
      var popupContent = popup.content || '';
      var showMarkers = popup.showMarkers || false;
      var stopAtPopup = popup.stopAtPopup || false;
      var startSeconds = popup.startSeconds || 0;
      var duration = popup.duration || 5;
      var theme = popup.theme || 'light';
      var markerColor = popup.markerColor || 'red';
      var jumpSeconds = popup.jumpSeconds || 0;
      var onClick = popup.onClick || function() {};
      var onHover = popup.onHover || function() {};
  
      var popupContainer = document.createElement('div');
      
      popupContainer.className = 'videojs-popup-container '+theme+' ';
  
      if (popup.position) {
        if (popup.position.includes(',')) {
          var [positionTopPercentage, positionLeftPercentage] = popup.position.split(',').map(parseFloat);
  
          if (!isNaN(positionTopPercentage) && !isNaN(positionLeftPercentage)) {
            popupContainer.style.top = positionTopPercentage + '%';
            popupContainer.style.left = positionLeftPercentage + '%';
          }
        } else {
          popupContainer.classList.add('videojs-popup-' + popup.position);
        }
      }
  
      popupContainer.innerHTML = popupContent;
  
      popupContainer.addEventListener('mouseenter', onHover);
      popupContainer.addEventListener('click', function() {
        onClick();
        player.currentTime(player.currentTime() + jumpSeconds);
        player.play();
      });
  
      if (showMarkers) {
        var marker;
  
        player.one('loadedmetadata', function() {
          var markerPosition = (startSeconds / player.duration()) * 100;
  
          marker = document.createElement('div');
          marker.className = 'videojs-popup-marker';
          player.controlBar.progressControl.seekBar.el().appendChild(marker);
  
          marker.style.left = markerPosition + '%';
          marker.style.backgroundColor = markerColor;
          marker.style.width = markerWidth + 'px';
        });
      }
  
      let stopSem = false;
      player.on('timeupdate', function() {
        var currentTime = player.currentTime();
  
        if (currentTime >= startSeconds && currentTime <= startSeconds + duration) {
          showPopup();
          if (stopAtPopup && !stopSem) {
            player.pause();
            stopSem = true;
          }
        } else {
          hidePopup();
        }
      });
  
      function showPopup() {
        player.el().appendChild(popupContainer);
      }
  
      function hidePopup() {
        if (popupContainer.parentNode) {
          popupContainer.parentNode.removeChild(popupContainer);
        }
      }
    });
  });