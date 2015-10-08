


$(function () {
  var txt;
  $('.slack-submit0').on('click', function () {
    txt = '@futakera 山辺さん、ご来客です。';
  });
  $('.slack-submit1').on('click', function () {
    txt = '@futakera 山田さん、ご来客です。';
  });
  $('.slack-submit2').on('click', function () {
    txt = '@futakera 小川さん、ご来客です。';
  });
  $('.slack-submit3').on('click', function () {
    txt = '@futakera 川角さん、ご来客です。';
  });
  $('.slack-submit4').on('click', function () {
    txt = '@futakera 鈴木さん、ご来客です。';
  });
  $('.slack-submit5').on('click', function () {
    txt = 'ご来客です。';
  });

  $('.slack-submit0, .slack-submit1, .slack-submit2, .slack-submit3, .slack-submit4, .slack-submit5').on('click', function () {
      $("#overlay").fadeIn();　/*ふわっと表示*/
      setTimeout("execute();", 10000);
      var url = 'https://slack.com/api/chat.postMessage';
      var data = {
          token: 'xoxp-2169984525-11522516720-11857100949-9f1248011f',
          channel: '#bot-test',
          username: 'test-bot',
          text: txt
      };
      $.ajax({
          url: url,
          data: data,
      });


  });
});

function execute() {
	$("#overlay").fadeOut();　/*ふわっと消える*/
}

$(window).on('touchmove.noScroll', function(e) {
    e.preventDefault();
});
