var clickTimeout = 210;

suite('pickr', function() {
  teardown(function(){
    $('.pickr-container').remove();
    var el = $('#date-picker');
    el.unbind();
    el.removeData();
    el.val('');
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
      }, clickTimeout);
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
      }, clickTimeout);
    });
  });

  suite('month render', function() {
    test('modal should show one month', function() {
      var el = $('#date-picker');

      el.pickr({
        displayMonths: 1
      });

      el.focus();

      assert.equal($('.pickr-month').length, 1);
    });

    test('should have a div for each day', function() {
      var el = $('#date-picker');

      el.pickr({
        displayMonths: 1
      });

      el.focus();

      assert.equal($('.pickr-day').length, el.pickr('daysInMonth', new Date()));
    });
  });

  suite('calendar actions', function() {
    test('clicking a day should update input and close modal', function() {
      var el = $('#date-picker');

      el.pickr();

      var date = new Date();

      el.focus();

      $('.pickr-day').first().click();

      assert.equal(el.val(), date.getFullYear() + '-' + (date.getMonth() + 1) + '-01');

      setTimeout(function(){
        assert.ok(!$('.pickr-container').is(':empty'));
        done();
      }, clickTimeout);
    });

    test('clicking previous arrow should change month back', function() {
      var el = $('#date-picker');

      el.pickr({
        currentMonth: new Date(2013, 10, 1)
      });

      el.focus();

      $('.pickr-prev-month').click();

      assert.equal($('.pickr-month-title').first().text(), 'October');
    });

    test('clicking next arrow should advance month', function() {
      var el = $('#date-picker');

      el.pickr({
        currentMonth: new Date(2013, 10, 1)
      });

      el.focus();

      $('.pickr-next-month').click();

      assert.equal($('.pickr-month-title').first().text(), 'December');
    });

    test('clicking month title should go to today', function() {
      var el = $('#date-picker');

      el.pickr({
        currentMonth: new Date(2013, 10, 1)
      });

      el.focus();

      $('.pickr-prev-month').click();
      $('.pickr-month-title').click();

      assert.equal($('.pickr-month-title').first().text(), 'November');
    });
  });

  suite('past events', function() {
    test('if past events disabled, day should have class', function() {
      var el = $('#date-picker');

      el.pickr({
        currentMonth: new Date(2013, 10, 1),
        allowPastDays: false
      });

      el.focus();

      $('.pickr-prev-month').click();

      assert.ok($('.pickr-day').first().hasClass('pickr-past'));
    });

    test('clicking past day when disabled shouldn\'t update input', function() {
      var el = $('#date-picker');

      el.pickr({
        currentMonth: new Date(2013, 10, 1),
        allowPastDays: false
      });

      el.focus();

      $('.pickr-prev-month').click();

      $('.pickr-past').first().click();

      assert.equal(el.val(), '');
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

    test('month end index', function(){
      var el = $('#date-picker');

      el.pickr();

      assert.equal(el.pickr('monthEndIndex', new Date(2013, 11, 1)), 4);
    });
  });
});
