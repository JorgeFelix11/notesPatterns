var pubSub = {
    events: {},
    subscribe: function (eventName, fn) {
      this.events[eventName] = this.events[eventName] || [];
      this.events[eventName].push(fn);
    },
    publish: function (eventName, data, data2, data3, data4, data5) {
      if (this.events[eventName]) {
        this.events[eventName].forEach(function(fn) {
          fn(data, data2, data3, data4, data5);
        });
      }
    }
  };