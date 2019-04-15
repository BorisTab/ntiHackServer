let lastDataUsers = {};

$(document).ready(() => {
  $('.menu-btn').on('click', function(e) {
    e.preventDefault();
    $('.menu').toggleClass('menu_active');
    $('.menu-btn').toggleClass('menu-btn_active');
  })

  $(".tab_item").not(":first").hide();
  $(".wrapper1 .tab").click(function() {
    $(".wrapper1 .tab").removeClass("active").eq($(this).index()).addClass("active");
    $(".tab_item").hide().eq($(this).index()).fadeIn()
  }).eq(0).addClass("active");
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
    lastDataUsers = data.message;
  });
  setInterval(getUsers, 3000);
});

const getUsers = () => {
  $.ajax({
    type: 'GET',
    url: '/person/is_waiting/',
  }).done((data) => {
    let check = true;
    data.message.map((item) => {
      const id = data.message.indexOf(item);
      if (item !== lastDataUsers[id]) {
        check = false;
      }
    });
    if (!check) {
      console.log(lastDataUsers);
      console.log(data.message);
      $('.people').empty();
      data.message.map((person) => {
        $('.people').html(`<label for="${person}"><input class="person" id="${person}" type="checkbox">${person}</label>`);
      });
      lastDataUsers = data.message;
    }
  });
};

$(document).on('click', '#sendGroup', (e) => {
  console.log('ass');
  e.preventDefault();
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
  }).done((data) => {
    if (data.status === 'OK') {
      checkedPeople.map((person) => {
        $(`#${person}`).css('display', 'none');
      });
      checkedPeople = [];
    }
  });
  return false;
});
