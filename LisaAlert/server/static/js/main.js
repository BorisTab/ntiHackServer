let lastDataUsers = {};

$(document).ready(() => {
  $('.menu-btn').on('click', function(e) {
    e.preventDefault();
    $('.menu').toggleClass('menu_active');
    $('.menu-btn').toggleClass('menu-btn_active');
  });

  $('.tab_item').not(':first').hide();
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
      const htmlHere = $('.people').html();
      $('.people').html(`${htmlHere}<label for="${person}" class="${person} person">
            <input id="${person}" type="checkbox" value="${person}">
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
      // console.log(lastDataUsers);
      // console.log(data.message);
      data.message.map((person) => {
        const htmlHere = $('.people').html();
        $('.people').html(`${htmlHere}<input value="${person}" id="${person}" type="checkbox">${person}`);
      });
      lastDataUsers = data.message;
    }
  });
};

$(document).on('click', '#sendGroup', (e) => {
  e.preventDefault();
  let checkedPeople = {
    users: [],
  };
  console.log($('.people').children().attr('class'));
  $('.people').find('input').each(function() {
    const person = $(this).val();
    if ($(`#${person}`).prop('checked')) {
      checkedPeople.users.push(person);
    }
  });
  console.log(checkedPeople);
  const checkedPeopleJson = JSON.stringify(checkedPeople);
  console.log(checkedPeopleJson);
  $.ajax({
    method: 'POST',
    url: '/group/create/',
    data: checkedPeopleJson,
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

