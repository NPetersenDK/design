/* design v1.0.0 - dsToast(message, kind): kind is ok | warn | err | info */
function dsToast(message, kind) {
  var area = document.querySelector(".toast-area");
  if (!area) {
    area = document.createElement("div");
    area.className = "toast-area";
    document.body.appendChild(area);
  }
  var t = document.createElement("div");
  t.className = "toast " + (kind || "info");
  t.setAttribute("role", "status");
  t.textContent = message;
  area.appendChild(t);
  setTimeout(function () { t.remove(); }, 4000);
}
