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
            toast('Submitted successfully')
            localStorage.subscriber = email
            handleSubscribed()
          },
          error: function() {
            toast('Network error, try again later.')
          }
        })

      } else {
        toast('Invalid email address')
      }

    }

  }

  function handleSubscribed() {

    descText.innerHTML = 'Thanks, when we are ready, we will send an email to ' + localStorage.subscriber
    subscribeForm.classList.add('subscribed')
    submitButton.innerHTML = 'Check Progress'

    submitButton.onclick = function() {
      location.href = 'https://github.com/margox/css.coffee'
    }

  }

}()