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
});
