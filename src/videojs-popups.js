videojs.registerPlugin('popups', function(options) {
  var player = this;
  var activePopups = [];
  var initialized = false;

  options = options || [];

  function addPopup(popup) {
    return new Promise((resolve) => {
      if (activePopups.some(item => item.startSeconds === popup.startSeconds)) {
        resolve();
        return;
      }

      var popupContainer = createPopupContainer(popup);
      var marker;

      if (popup.showMarker) {
        player.one('loadedmetadata', function() {
          initialized = true;
          marker = addMarker(popup);
          pushToActivePopups();
          initialized = true;
        });

        marker = addMarker(popup);
      }

      pushToActivePopups();

      function showPopup() {
        var isPopupStillActive = activePopups.some(item => item.popupContainer === popupContainer);

        if (isPopupStillActive) {
          player.el().appendChild(popupContainer);

          if (popup.stopAtPopup && !popupContainer.semaphore && isPopupStillActive) {
            player.pause();
            popupContainer.semaphore = true;
          }

        } else {
          removePopup(popupContainer, marker);
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
                removePopup(popupContainer, marker);
              }, popup.duration * 1000);
            }
          } else {
            if (popup.duration) {
              setTimeout(function () {
                removePopup(popupContainer);
              }, popup.duration * 1000);
            }
          }

        } else {
          if (!popup.startSeconds) {
            showPopup();
            if (popup.duration) {
              setTimeout(function () {
                removePopup(popupContainer);
              }, popup.duration * 1000);
            }
          }
        }
      });

      function addMarker(popup) {
        if (player.duration()) {
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
      
      removePopup(popupContainer);
    });

    return popupContainer;
  }

  function removeAllPopups() {
    while (activePopups.length > 0) {
      const { popupContainer, marker } = activePopups.pop();
      removePopup(popupContainer, marker);
    }
  }

  function removePopup(popupContainer, marker) {
    if (marker && marker.parentNode) {
      marker.parentNode.removeChild(marker);
    }

    if (popupContainer && popupContainer.parentNode) {
      popupContainer.parentNode.removeChild(popupContainer);
    }

    activePopups = activePopups.filter(item => item.popupContainer !== popupContainer);

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
        removePopup(popupToRemove.popupContainer, popupToRemove.marker);
      }
    },
    list: function() {
      return activePopups;
    }
  };
});
