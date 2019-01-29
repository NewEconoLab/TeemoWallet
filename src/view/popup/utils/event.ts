const cache:any[] = [];
const EventHandler = {
  init() {
    window.addEventListener(
      'click',
      function () {
        cache.map((v) => {
            if(v) {
                v();
            }
        });
      },
      false);
  },
  add(func) {
    // 如果已经有
    if (cache.indexOf(func) !== -1) {
      return;
    }
    cache.push(func);
  },
  remove(func) {
    for (let i = 0; i < cache.length; i++) {
      const item = cache[i];
      if (item === func) {
        cache.splice(i, 1);
        break;
      }
    }
  }
};
EventHandler.init();
export default EventHandler;
