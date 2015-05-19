/* Issues

  - Not saving/retrieving annotations: http://blog.arkofwellness.com/progest-e-my-favorite-product/

*/

var hl = function() {
  var wrapper = document.createElement('span');
  wrapper.className = "ranger-hl";
  return wrapper;
}();

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.ranger-hl { background: rgba(255,255,10,0.5); cursor: default }';
document.getElementsByTagName('head')[0].appendChild(style);

// chrome.storage.local.remove(window.location.href);

setTimeout(function() {

  chrome.storage.local.get(window.location.href, function(data) {
    var storage = data[window.location.href];
    if (!storage) return;

    Object.keys(storage).forEach(function(key) {
      var range = storage[key];
      console.log('Attempting to paint', key);
      console.log(range);
      new Ranger(range).paint(hl);
    });

  });
  
}, 4000);



document.onkeyup = function(e) {
  
  if (e.which == 72) {
    
    if (window.getSelection() && window.getSelection().rangeCount > 0) {
      range = window.getSelection().getRangeAt(0);
      
      if (range.collapsed) {
        var id = Ranger.utils.unpaintBySampleNode(range.startContainer);
        removeRange(id);
        return;
      }
      
      var ranger = new Ranger(range);
      
      addRange(ranger.toJSON());

      ranger.paint(hl);
      window.getSelection().removeAllRanges();
    }
    
  }
  
};

var addRange = function(range) {
  
  var href = window.location.href;
  
  chrome.storage.local.get(href, function(storage) {
    
    storage[href] = storage[href] || {};
    
    storage[href][range.id] = range;
    chrome.storage.local.set(storage);
    
    // var oReq = new XMLHttpRequest();
    // oReq.onload = function () {
    //   console.log(this.responseText);
    // };
    // oReq.open("PUT", "http://localhost:3000/frank/", true);
    // oReq.send();
    
    var site = encodeURIComponent(window.btoa(href));
    
    var req = new XMLHttpRequest();
    req.open("PUT", ["http://localhost:3000/frank", site, range.id].join('/'));
    req.onload = function () {
      console.log(this.responseText);
    }
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(range));
    
  });
  
};

var removeRange = function(id) {
  
  var href = window.location.href;
  
  chrome.storage.local.get(href, function(storage) {
    
    delete storage[href][id];
    
    chrome.storage.local.set(storage);
    
    var site = encodeURIComponent(window.btoa(href));
    
    var req = new XMLHttpRequest();
    req.open("DELETE", ["http://localhost:3000/frank", site, id].join('/'));
    req.onload = function () {
      console.log(this.responseText);
    }
    req.send();
    
    
  });
  
};