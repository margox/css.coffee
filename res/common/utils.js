-function(exports) {

  "use strict";

  exports.$ = document.querySelector.bind(document)

  var u = navigator.userAgent.toLowerCase()

  exports.Browser = {
    isAndroid: u.indexOf('android') > -1 || u.indexOf('linux') > -1,
    isIPhone: u.indexOf('iphone') > -1,
    isIPad: u.indexOf('ipad') > -1,
    isWeixin: u.indexOf('micromessenger') > -1,
    isApp: u.indexOf('59store') > -1
  }

  var toastTimer = null

  exports.toast = function(msg) {

    var $toast

    if ($('#toast')) {
      $toast = $('#toast')
    } else {
      $toast = document.createElement('div')
      $toast.id = 'toast'
      $toast.className = 'toast'
      document.body.appendChild($toast)
    }

    clearTimeout(toastTimer)

    $toast.innerHTML = msg
    $toast.focus()
    $toast.classList.add('active')

    toastTimer = setTimeout(function() {
      $toast.classList.remove('active')
    }, 3000)

  }

  exports.getUrlParam = function(param, url) {

    url = url || window.location.search
    var reg = new RegExp("(^|/?|&)" + param + "=([^&]*)(#|&|$)")
    var r = url.substr(1).match(reg)
    return r != null ? unescape(r[2]) : null

  }

  exports.getHashParam = function(param, url) {

    url = url || window.location.hash
    var reg = new RegExp("(^|/?|&)" + param + "=([^&]*)(#|&|$)")
    var r = url.substr(1).match(reg)
    return r != null ? unescape(r[2]) : null

  }

  exports.ajax = function(options) {

    var xhr = new XMLHttpRequest
    var method = options.method || 'get'

    xhr.timeout = 10000

    if (method.toLowerCase() !== 'get') {
      xhr.open(method, options.url, true)
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8")
      xhr.send(jsonToUrl(options.data))
    } else {
      xhr.open('get', options.url + '?' + jsonToUrl(options.data), true)
      xhr.send(null)
    }

    xhr.ontimeout = function() {

      options.error({
        status: '-1',
        msg: '网络请求超时'
      })

      xhr.abort && xhr.abort()

    }

    xhr.onreadystatechange = function() {

      var data = {}

      if (xhr.readyState === 4) {

        if (xhr.status === 200) {

          try{
            data = JSON.parse(xhr.responseText)
            if (data.status === 0) {
              options.success && options.success(data)
            } else if (data) {
              options.error && options.error(data)
            }
          } catch(e) {
            options.error && options.error({
              status: '-1',
              msg: e.message
            })
          }

        } else {

          options.error && options.error({
            status: xhr.status,
            msg: xhr.status
          })

          xhr.abort && xhr.abort()

        }

      }

    }

  }

  exports.Cookie = {

    get: function(name) {

      var arr,reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")

      if (arr = document.cookie.match(reg)) {
        return arr[2]
      } else {
        return null
      }

    },

    set: function(name, value, domain) {

      var exp = new Date()
      exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000)

      if (domain) {
        document.cookie = name + "="+ escape(value) + ";domain=" + domain + ";expires=" + exp.toGMTString()
      } else {
        document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString()
      }

    },

    delete: function(name) {

      var exp = new Date()
      var cval = Cookie.get(name)

      exp.setTime(exp.getTime() - 1)

      if (cval !== null) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()
      }

    }

  }

  exports.jsonToUrl = function(json) {

    var result = ''

    for (var item in json) {
      if (json.hasOwnProperty(item)) {
        result += ('&' + item + '=' + json[item])
      }
    }

    return result

  }

  exports.randomString = function(len) {

    len = len || 32
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789'
    var maxPos = chars.length
    var code = ''

    for (var i = 0; i < len; i++) {
      code += chars.charAt(Math.floor(Math.random() * maxPos))
    }

    return code

  }

  try{
    localStorage.setItem('__private_mode_test__', '1')
  } catch(e) {
    toast('请退出隐私模式')
  }

}(window)