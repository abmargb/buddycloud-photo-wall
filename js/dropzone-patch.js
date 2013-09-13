Dropzone.prototype.uploadFile = function(file) {
  var formData, handleError, input, inputName, inputType, key, progressObj, response, value, xhr, _i, _len, _ref, _ref1, _ref2,
	_this = this;

  xhr = new XMLHttpRequest();
  xhr.open(this.options.method, this.options.url, true);
  response = null;
  handleError = function() {
	return _this.errorProcessing(file, response || _this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr);
  };
  xhr.onload = function(e) {
	var _ref;

	response = xhr.responseText;
	if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
	  try {
		response = JSON.parse(response);
	  } catch (_error) {
		e = _error;
		response = "Invalid JSON response from server.";
	  }
	}
	if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
	  return handleError();
	} else {
	  return _this.finished(file, response, e);
	}
  };
  xhr.onerror = function() {
	return handleError();
  };
  progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
  progressObj.onprogress = function(e) {
	var progress;

	file.upload = {
	  progress: progress,
	  total: e.total,
	  bytesSent: e.loaded
	};
	progress = 100 * e.loaded / e.total;
	return _this.emit("uploadprogress", file, progress, e.loaded);
  };
  xhr.setRequestHeader("Accept", "application/json");
  formData = new FormData();
  if (this.options.params) {
	_ref1 = this.options.params;
	for (key in _ref1) {
	  value = _ref1[key];
	  formData.append(key, value);
	}
  }
  if (this.element.tagName === "FORM") {
	_ref2 = this.element.querySelectorAll("input, textarea, select, button");
	for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
	  input = _ref2[_i];
	  inputName = input.getAttribute("name");
	  inputType = input.getAttribute("type");
	  if (!inputType || inputType.toLowerCase() !== "checkbox" || input.checked) {
		formData.append(inputName, input.value);
	  }
	}
  }
  this.emit("sending", file, xhr, formData);
  formData.append(this.options.paramName, file);
  return xhr.send(formData);
};