var count_id = 0;

function init() {
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
          displayClassOffer();
        }
    });
  explore_switcher();
}
