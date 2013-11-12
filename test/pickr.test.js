suite('pickr', function() {
  teardown(function(){
    $('.pickr-modal').remove();
    var el = $('#date-picker');
    el.unbind();
    el.removeData();
    el.blur();
  });

  suite('init', function() {
    test('pickr exists', function() {
      assert.ok(typeof $.fn.pickr === 'function');
    });

    test('pickr class on input', function() {
      var el = $('#date-picker');
      
      el.pickr();

      assert.ok(el.hasClass('pickr'));
    });
  });

  suite('show/hide', function() {
    test('pickr should show on focus', function() {
      var el = $('#date-picker');

      el.pickr();

      el.focus();

      assert.equal($('.pickr-modal').length, 1);
    });

    test('pickr should hide on blur', function() {
      var el = $('#date-picker');

      el.pickr();

      el.focus();

      assert.equal($('.pickr-modal').length, 1);

      el.blur();

      assert.equal($('.pickr-modal').length, 0);
    });
  });
});
