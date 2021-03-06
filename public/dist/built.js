// Make the editor
var initText = "", defaultMode = "javascript";
if(window.localStorage.myEditor !== undefined) {
  initText = window.localStorage.myEditor;
}

var editor = CodeMirror(document.getElementById("codeArea"),
  {
    value: initText,
    theme: 'monokai',
    autoCloseBrackets: true,
    lineNumbers: true,
    tabSize: 2,
    mode: defaultMode,
    smartIndent: true,
    autofocus: true,
  });

window.localStorage.myEditor = editor.getValue();

function saveCode(title, text) {
  if(text === "") {
    return sweetAlert("Empty file...", "You can't submit an empty file!", "error");
  } else if (title === "") {
    title = (Math.random() + 1).toString(36).substring(7);
  }

  var obj = {
    title: title,
    text: text,
    timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
  }

  $.ajax({
    type: "POST",
    url: '/upload',
    contentType: 'application/json',
    data: JSON.stringify(obj),
    success: function(data) {
      console.log("SUCCESS!", data);
      if(data.error !== undefined) {
        return sweetAlert("Title taken...", "This title is already taken! Pick another!", "error")
      }
      window.location.href = data.redirect_url;
    },
    error: function(data, err) {
      console.log("some kind of error");
      if (err) throw err;
    }
  });
}

editor.on('change', function() {
  window.localStorage.myEditor = editor.getValue();
});

// Only add listeners once DOM element exists
$(function() {

  $('#codeSubmit').click(function() {
    var title = $('#title').val();
    var text = editor.getValue();
    saveCode(title, text);
  });

  $('select').on('change', function(e) {
    var option = $("option:selected", this);
    var val = this.value;
    console.log(val);
    editor.setOption("mode", val);
  });
})