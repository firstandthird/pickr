suite('pickr', function() {
  teardown(function(){
    $('.pickr-container').remove();
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

      assert.equal($('.pickr-container').length, 1);
    });

    test('pickr should hide on blur', function(done) {
      var el = $('#date-picker');

      el.pickr();

      el.focus();

      assert.ok(!$('.pickr-container').is(':empty'));

      el.blur();

      setTimeout(function(){
        assert.ok($('.pickr-container').is(':empty'));
        done();
      }, 110);
    });

    test('pickr should not hide when clicked', function(done) {
      var el = $('#date-picker');

      el.pickr();

      el.focus();

      assert.ok(!$('.pickr-container').is(':empty'));

      $('.pickr-container').click();

      setTimeout(function(){
        assert.ok(!$('.pickr-container').is(':empty'));
        done();
      }, 110);
    });
  });

  suite('month render', function() {
    test('modal should show one month', function() {
      var el = $('#date-picker');

      el.pickr();

      el.focus();

      assert.equal($('.pickr-month').length, 1);
    });

    test('should have a div for each day', function() {
      var el = $('#date-picker');

      el.pickr();

      el.focus();

      assert.equal($('.pickr-day').length, el.pickr('daysInMonth', new Date()));
    });
  });

  suite('date helpers', function() {
    test('number of days in month', function() {
      var el = $('#date-picker');

      el.pickr();

      assert.equal(el.pickr('daysInMonth', new Date(2013, 0, 1)), 31);
      assert.equal(el.pickr('daysInMonth', new Date(2013, 1, 1)), 28);
      assert.equal(el.pickr('daysInMonth', new Date(2013, 3, 1)), 30);

      //Check leapyear
      assert.equal(el.pickr('daysInMonth', new Date(2012, 1, 1)), 29);
    });

    test('month start index', function(){
      var el = $('#date-picker');

      el.pickr();

      assert.equal(el.pickr('monthStartIndex', new Date(2013, 10, 1)), 5);
    });
  });
});
