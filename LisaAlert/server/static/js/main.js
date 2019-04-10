// function show() {
//   $.ajax({
//     url: '127.0.0.1:5000/update_map',
//     cache: false,
//     success: (html) => {
//       $('#main').html(html);
//     },
//   });
// }

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
});
