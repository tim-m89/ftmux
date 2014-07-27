
if(!tim_matthews) var tim_matthews={};
if(!tim_matthews.ftmux) tim_matthews.ftmux={};
if(!tim_matthews.ftmux.ftmux_js) tim_matthews.ftmux.ftmux_js = {};

tim_matthews.ftmux.ftmux_js = {

  contentLoadedFunc: function (contentWindow) {

    if (!contentWindow || !contentWindow.location || contentWindow.location.href.indexOf("://") == -1 || !contentWindow.document)
      return;

    var host = contentWindow.location.hostname;
    var path = contentWindow.location.pathname;
    var hash = contentWindow.location.hash;

    if (!host.contains("trademe.co.nz"))
      return;

    var listings = contentWindow.document.getElementsByClassName("listingImage");

    for(var i = 0; i < listings.length; i++)
      tim_matthews.ftmux.ftmux_js.processListing(contentWindow, listings[i]);
  
  },

  processListing: function(contentWindow, listing) {

    var anchors = listing.getElementsByTagName("a");
    var images = listing.getElementsByTagName("img");
    
    if(anchors.length != 1 || images.length != 1)
      return;

    var imgSource = images[0].getAttribute("src");

    if(!imgSource || !imgSource.contains("hasPhoto"))
      return;

    var link = anchors[0].getAttribute("href");

    var rqst = new XMLHttpRequest();
    rqst.open("GET", contentWindow.location.origin + link);
    rqst.responseType = "document";

    rqst.onreadystatechange = function(){

      if (rqst.readyState==4 && rqst.status==200) {
        var mainImageElem = rqst.response.getElementById("mainImage");
        var mainImageSrc = mainImageElem.getAttribute("src");
        var lastSlash = mainImageSrc.lastIndexOf("/");
        var lastDot = mainImageSrc.lastIndexOf(".");
        var imageId = mainImageSrc.slice(lastSlash+1, lastDot);
        var newSrc = "http://images.trademe.co.nz/photoserver/lv2/" + imageId + ".jpg";

        tim_matthews.ftmux.ftmux_js.setImgSrc(contentWindow, link, newSrc);
      }

    };

    rqst.send();
  },

  setImgSrc: function(win, prodHref, newImgSrc) {

    var anchors = win.document.getElementsByTagName("a");
    var done = false;

    for(var i = 0; i < anchors.length; i++)
    {
      var link = anchors[i].getAttribute("href");
      if (link != prodHref)
        continue;

      var images = anchors[i].getElementsByTagName("img");
      if(images.length != 1)
        continue;
      
      images[0].setAttribute("src", newImgSrc);
      done = true;
    }

    if(!done)
      console.log("could not find anchor with href = " + prodHref);
  },

  init: function() {

    gBrowser.addEventListener("DOMContentLoaded", function (event) {
      if (event && event.originalTarget && event.originalTarget instanceof HTMLDocument) {
        var contentDocument = event.originalTarget;
        var contentWindow = contentDocument.defaultView;
        if (contentWindow) {
            tim_matthews.ftmux.ftmux_js.contentLoadedFunc(contentWindow);
        }
      }
    }, false);

  }


};

window.addEventListener("load", tim_matthews.ftmux.ftmux_js.init(), false);


