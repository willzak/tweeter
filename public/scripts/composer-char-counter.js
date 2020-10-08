$(document).ready(() => {
  $('textarea').on('keyup', function() {
    let div = $(this).next();
    let counter = div.find('.counter');

    const maxLength = 140;
    let size = $(this).val().length;
    let charCount = maxLength - size;

    if (charCount < 0) {
      counter.addClass('negative');
      counter.html(charCount);
    } else {
      counter.removeClass('negative');
      counter.html(charCount);
    }
  });
});