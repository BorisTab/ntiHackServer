let lastDataUsers = {};

$(document).ready(() => {
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
    url: '/person/is_waiting/',
  }).done((data) => {
    data.message.map((person) => {
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
    url: '/person/is_waiting/',
  }).done((data) => {
    if (data !== lastDataUsers) {
      $('.people').empty();
      data.message.map((person) => {
        $('.people').html(`<label for="${person}">
              <input id="${person}" type="checkbox">
              ${person}
            </label>`);
      });
    }
  });
};

$('.makeGroup').submit(() => {
  let checkedPeople = [];
  $(this).find('input').each(() => {
    const person = $(this).prop('id');
    if ($(this).prop('checked')) {
      checkedPeople.push(person);
    }
  });
  $.ajax({
    method: 'POST',
    url: '/group/create/',
    data: checkedPeople,
  }).done(() => {
    checkedPeople.map((person) => {
      $(`#${person}`).css('display', 'none');
    });
    checkedPeople = [];
  });
});
