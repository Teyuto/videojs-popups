videojs.registerPlugin('popups', function(options) {
  var player = this;
  var activePopups = [];
  var initialized = false;

  options = options || [];

  addEmptyPopup();

  function addEmptyPopup() {
    addPopup({
      id: 'empty-popup',
      startSeconds: 0, 
      duration: 0,
      content: '',
      showMarker: false
    });
  }

  function addPopup(popup) {
    return new Promise((resolve) => {
      if (activePopups.some(item => item.startSeconds === popup.startSeconds)) {
        resolve();
        return;
      }

      var popupContainer = createPopupContainer(popup);
      var marker;

      var isFirstRun = true;

      if(popup.startSeconds == -1){
        initialized = true;
        marker = addMarker(popup, popup.showMarker);
        pushToActivePopups();
        initialized = true;
      }else{
        player.one('loadedmetadata', function() {
            initialized = true;
            marker = addMarker(popup, popup.showMarker);
            pushToActivePopups();
            initialized = true;
        });
      }

      marker = addMarker(popup, popup.showMarker);

      pushToActivePopups();

      function showPopup() {
        if (popup.id == 'empty-popup' || popup.duration == 0) {
            return;
        }
        if (isFirstRun && typeof popup.onStart === 'function') {
          popup.onStart();
          isFirstRun = false;
        }

        var isPopupStillActive = activePopups.some(item => item.popupContainer === popupContainer);

        if (isPopupStillActive) {
          player.el().appendChild(popupContainer);

          if (popup.stopAtPopup && !popupContainer.semaphore && isPopupStillActive) {
            player.pause();
            popupContainer.semaphore = true;
          }
        } else {
          if(popup.showOnce){
            marker=null;
          }
          removePopup(popupContainer, marker, popup);
        }

        if (popup.duration && popup.progress) {
          var remainingTime = Math.ceil(popup.duration - (player.currentTime() - popup.startSeconds));

          var progress = 100 - ((remainingTime-1) / popup.duration) * 100;
          progress = Math.max(0, Math.min(progress, 100));

          var progressBar = document.createElement('div');
          progressBar.className = 'popup-progress-bar';
          progressBar.style.width = progress + '%';
          progressBar.style.backgroundColor = popup.progressColor || '#00ff00';
          popupContainer.appendChild(progressBar);
        }

      }

      player.on('timeupdate', function() {
        var currentTime = player.currentTime();

        if (currentTime >= popup.startSeconds && currentTime <= popup.startSeconds + popup.duration) {
          showPopup();

          if (popup.stopAtPopup && !popupContainer.semaphore) {
            player.pause();
            popupContainer.semaphore = true;
          }

          if (popup.showOnce) {
            if (popup.duration) {
              setTimeout(function () {
                removePopup(popupContainer, marker, popup);
              }, popup.duration * 1000);
            }
          } else {
            if (popup.duration) {
              setTimeout(function () {
                removePopup(popupContainer, null, popup);
              }, popup.duration * 1000);
            }
          }

        } else {
          if (!popup.startSeconds) {
            showPopup();
            if (popup.duration) {
              setTimeout(function () {
                removePopup(popupContainer, marker, popup);
              }, popup.duration * 1000);
            }
          }
        }
      });

      function addMarker(popup, showMarker) {
        if (player.duration() && showMarker) {
          var markerPosition = (popup.startSeconds / player.duration()) * 100;
          var newMarker = document.createElement('div');
          newMarker.className = 'videojs-popup-marker';
          player.controlBar.progressControl.seekBar.el().appendChild(newMarker);

          newMarker.style.left = markerPosition + '%';
          newMarker.style.backgroundColor = popup.markerColor || 'red';
          var markerWidth = 5;
          newMarker.style.width = markerWidth + 'px';

          return newMarker;
        }
      }

      function pushToActivePopups() {
        if (initialized == true) {
          activePopups.push({ id: popup.id, content: popup.content, popupContainer, marker, startSeconds: popup.startSeconds, duration: popup.duration });
          resolve();
        }
      }
    });
  }

  function createPopupContainer(popup) {
    var popupContent = popup.content || '';
    var popupId = popup.id || 'popup-' + Date.now();
    var popupContainer = document.createElement('div');

    popupContainer.id = popupId;
    popupContainer.className = 'videojs-popup-container ' + (popup.theme || 'light') + ' ';

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

    popupContainer.addEventListener('mouseenter', popup.onHover || function() {});
    popupContainer.addEventListener('click', function() {
      (popup.onClick || function() {})();
      player.currentTime(popup.startSeconds + (popup.jumpSeconds || 0));
      player.play();
  
    });

    return popupContainer;
  }

  function removeAllPopups() {
    while (activePopups.length > 0) {
      const { popupContainer, marker } = activePopups.pop();
      removePopup(popupContainer, marker, null, 'direct');
    }
  }

  var onEndCalledIds = [];
  function removePopup(popupContainer, marker, popup=null, action=null) {
    if (player.paused()) {
      return;
    }
    
    if (popupContainer && popupContainer.parentNode) {
      popupContainer.parentNode.removeChild(popupContainer);
    }

    if (popup && typeof popup.onEnd === 'function' && !onEndCalledIds.includes(popup.id)) {
      popup.onEnd();
      onEndCalledIds.push(popup.id);
    }

    if((popup && popup.showOnce==true) || action=='direct'){
      if (marker && marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
      activePopups = activePopups.filter(item => item.popupContainer !== popupContainer);

      const indexToRemove = onEndCalledIds.indexOf(activePopups.id);
      if (indexToRemove !== -1) {
        onEndCalledIds.splice(indexToRemove, 1);
      }
    }

    popupContainer = null;
    marker = null;
  }

  return {
    add: function(popupArray) {
      if (Array.isArray(popupArray)) {
        popupArray.forEach(function(popup) {
          addPopup(popup);
        });
      } else {
        addPopup(popupArray);
      }
    },
    removeAll: removeAllPopups,
    removePopup: removePopup,
    removeById: function(id) {
      const popupToRemove = activePopups.find(item => item.popupContainer.id === id);
      if (popupToRemove) {
        removePopup(popupToRemove.popupContainer, popupToRemove.marker, null, 'direct');
      }
    },
    list: function() {
        return activePopups.filter(item => item.id !== 'empty-popup');
    }
  };
});
