-function() {

  'use strict'

  var subscribed = localStorage.subscriber ? true : false
  var emailReg = /^[\d,a-z]([\w\.\-]+)@([a-z0-9\-]+).([a-z\.]+[a-z])$/i
  var descText = $('#desc-text')
  var subscribeForm = $('#subscribe-form')
  var emailText = $('#email-text')
  var submitButton = $('#submit-button')

  if (subscribed) {

    handleSubscribed()

  } else {

    submitButton.onclick = function() {

      var email = emailText.value

      if (emailReg.test(email)) {

        ajax({
          url: '/api/subscribe',
          method: 'POST',
          data: {
            email: email
          },
          success: function() {
            toast('提交成功')
            localStorage.subscriber = email
            handleSubscribed()
          },
          error: function() {
            toast('网络错误，请稍候再试...')
          }
        })

      } else {
        toast('邮箱有误，请检查')
      }

    }

  }

  function handleSubscribed() {

    descText.innerHTML = '感谢留意，我们将在一切就绪之后发送通知到您的邮箱：' + localStorage.subscriber
    subscribeForm.classList.add('subscribed')
    submitButton.innerHTML = '前往Github查看进度'

    submitButton.onclick = function() {
      location.href = 'https://github.com/margox/css.coffee'
    }

  }

}()