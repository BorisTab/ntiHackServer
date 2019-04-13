let lastDataUsers = {};

$(document).ready(() => {
  // show();
  // setInterval('show()', 1000);
  $('.menu-btn').click((e) => {
    e.preventDefault();
    $('.menu').toggleClass('menu_active');
    $('.menu-btn').toggleClass('menu-btn_active');
  });

  $('.tab_item').not(':first').hide();
  $('.tab').click(() => {
    $(this).removeClass('active').siblings().addClass('active');
    $('.tab_item').hide().eq($(this).index()).fadeIn();
  }).eq(0).addClass('active');

  $.ajax({
    type: 'GET',
    url: '',
  }).done((data) => {
    data.map((person) => {
      $('.persons').html(`<input type="radio" value="${person}">`);
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
    if(data !== lastData) {
      data.map((person) => {
        $('.persons').html(`<input type="radio" value="${person}">`);
      });
    }
  });
};
