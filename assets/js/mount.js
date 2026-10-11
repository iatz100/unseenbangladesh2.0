/* Unseen Bangladesh 2.0 — mounts one master component.
   Each page holds only <div data-component="NAME"></div> followed by this script. The script runs
   synchronously while the page is parsed, so the master is in place before anything after it is
   parsed and painted (no flash, no delayed header or footer). The markup comes from components-data.js,
   which the build writes from assets/components/*.html. Asset paths are made absolute from this file. */
(function () {
  var self = document.currentScript;
  var slot = self && self.previousElementSibling;
  if (!slot || !slot.hasAttribute("data-component")) return;
  var master = window.UB_MASTERS && window.UB_MASTERS[slot.getAttribute("data-component")];
  if (!master) { console.warn("component not loaded:", slot.getAttribute("data-component")); return; }
  var assetRoot = new URL("../", self.src).href;                  // .../assets/
  var html = master.replace(/(href|src)="assets\//g, function (m, attr) { return attr + '="' + assetRoot; });
  var tpl = document.createElement("template");
  tpl.innerHTML = html;
  slot.replaceWith(tpl.content);
  self.remove();
})();
