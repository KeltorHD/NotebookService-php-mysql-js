$(function () {
    $('#login-button').click(function (e) {
      e.preventDefault();
      $('.modal-login').addClass('modal_active');
      $('body').addClass('hidden');
    });
  
    $('.modal__close-button').click(function (e) {
      e.preventDefault();
      $('.modal-login').removeClass('modal_active');
      $('.modal-register').removeClass('modal_active');
      $('.modal-restore').removeClass('modal_active');
      $('body').removeClass('hidden');
    });
  
    $('.modal-login').mouseup(function (e) {
      let modalContent = $(".modal__content");
      if (!modalContent.is(e.target) && modalContent.has(e.target).length === 0) {
        $(this).removeClass('modal_active');
        $('body').removeClass('hidden');
      }
    });

    $('.to_another_form').click(function (e) {
        //console.log('here');
        if($('.modal-login').hasClass('modal_active')){
            $('.modal-login').removeClass('modal_active');
            $('.modal-register').addClass('modal_active');
        } else {
            $('.modal-login').addClass('modal_active');
            $('.modal-register').removeClass('modal_active');
        }
    });

    $('.register-button').click(function (e) {
        e.preventDefault();
        $('.modal-register').addClass('modal_active');
        $('body').addClass('hidden');
    });
    
    // $('.modal__close-button').click(function (e) {
    //     e.preventDefault();
    //     $('.modal-register').removeClass('modal_active');
    //     $('body').removeClass('hidden');
    // });
    
    $('.modal-register').mouseup(function (e) {
        let modalContent = $(".modal__content");
        if (!modalContent.is(e.target) && modalContent.has(e.target).length === 0) {
            $(this).removeClass('modal_active');
            $('body').removeClass('hidden');
        }
    });

    $('.modal-restore').mouseup(function (e) {
      let modalContent = $(".modal__content");
      if (!modalContent.is(e.target) && modalContent.has(e.target).length === 0) {
        $(this).removeClass('modal_active');
        $('body').removeClass('hidden');
      }
    });

    $('.to_restore_form').click(function (e) {
        $('.modal-login').removeClass('modal_active');
        $('.modal-restore').addClass('modal_active');
    });

    $('.to_login_form').click(function (e) {
      $('.modal-login').addClass('modal_active');
      $('.modal-restore').removeClass('modal_active');
  });
});


;(function (document, window, index){
  'use strict';
  var inputs = document.querySelectorAll('#user_photo');
  Array.prototype.forEach.call(inputs, function (input) {
    var label = input.nextElementSibling,
        labelVal = label.innerHTML;

    input.addEventListener('change', function (e) {
      var fileName = e.target.value.split('\\').pop();

      console.log(fileName);

      if (fileName)
        $('#load_file_span').text(fileName);
      else
        $('#load_file_span').text("Загрузка...");
    });
  });
}(document, window, 0));
