(function () {
  var jsEscape = function (content) {
    return content
      .replace(/(['\\])/g, '\\$1')
      .replace(/[\f]/g, "\\f")
      .replace(/[\b]/g, "\\b")
      .replace(/[\n]/g, "\\n")
      .replace(/[\t]/g, "\\t")
      .replace(/[\r]/g, "\\r")
      .replace(/[\u2028]/g, "\\u2028")
      .replace(/[\u2029]/g, "\\u2029");
  };
  define({
    write: function (pluginName, moduleName, write) {
      var fs = require.nodeRequire('fs'),
          text = jsEscape(fs.readFileSync(moduleName, 'utf8'));
      write(
        "(function () {" +
          "var css = '" + text + "'," +
          "styleTag = document.createElement('style');" +
          "styleTag.type = 'text/css';" +
          "if (styleTag.stylesheet) {" +
            "styleTag.stylesheet.cssText = css;" +
          "} else {" +
            "styleTag.appendChild(document.createTextNode(css));" +
          "}" +
          "document.getElementsByTagName('head')[0].appendChild(styleTag);" +
          "define('" + pluginName + "!" + moduleName + "', function () {});\n" +
        "})();");
    },
    load: function (name, parentRequire, load, config) {
      if (config.isBuild) {
        load();
      } else {
        var linkTag = document.createElement('link');
        linkTag.type = 'text/css';
        linkTag.rel = 'stylesheet';
        linkTag.href = name;
        document.getElementsByTagName("head")[0].appendChild(linkTag);
        load();
      }
    }
  });
})();
