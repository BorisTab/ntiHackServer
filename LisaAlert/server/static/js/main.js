let lastDataUsers = {};

$(document).ready(() => {
  // show();
  // setInterval('show()', 1000);

  $('.menu-btn').on('click', function(e) {
    e.preventDefault();
    $('.menu').toggleClass('menu_active');
    $('.menu-btn').toggleClass('menu-btn_active');
  });

  $('.tab_item').not('first').hide();
  $('.wrapper1 .tab').click(function() {
    $('.wrapper1 .tab').removeClass('active')
        .eq($(this).index()).addClass('active');
    $('.tab_item').hide().eq($(this).index()).fadeIn();
  }).eq(0).addClass('active');

  $.ajax({
    type: 'GET',
    url: '/person/iswaiting',
  }).done((data) => {
    data.map((person) => {
      $('.people').html(`<label for="${person}">
            <input id="${person}" type="checkbox">
            ${person}
          </label>`);
    });
    lastDataUsers = data;
  });
  setInterval(getUsers, 3000);
});

const getUsers = () => {
  $.ajax({
    type: 'GET',
    url: '',
  }).done((data) => {
    if (data !== lastData) {
      data.map((person) => {
        $('.people').html(`<label for="${person}">
              <input id="${person}" type="checkbox">
              ${person}
            </label>`);
      });
    }
  });
};

$('.makeGroup').submit(() => {
  const checkedPeople = {};
  $(this).find('input').each(() => {
    const person = $(this).prop('id');
    if ($(this).prop('checked')) {
      checkedPeople[`${person}`] = true;
    }
  });
  $.ajax({
    method: 'POST',
    url: '',
    data: checkedPeople,
  }).done((data) => {
    data.map((person) => {
      $(`#${person}`).css('display', 'none');
    });
  });
});
