var clickTimeout = 210;
var monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

suite('pickr', function() {
  teardown(function(){
    $('.pickr-container').remove();
    var els = $('.test-subject');
    els.unbind();
    els.removeData();
    els.val('');
    els.blur();
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

    test('pickr class on div', function () {
      var el = $('#inline');

      el.pickr();

      assert.ok(el.hasClass('pickr'));
      assert.ok(el.next().attr('style') !== '');
      assert.ok(el.next().hasClass('pickr-container'));
    });
  });

  suite('Event binding', function () {
    test('pickr should bind to focus and blur on the element and click on the container', function () {
      var el = $('#date-picker'),
        container, elEvents, containerEvents;

      el.pickr();
      container = el.next();
      elEvents = $._data(el.get(0), 'events');
      containerEvents = $._data(container.get(0), 'events');

      assert.equal(elEvents.focus.length, 1);
      assert.equal(elEvents.blur.length, 1);
      assert.equal(containerEvents.click.length, 2);
    });
    test('pickr should not bind to focus and blur on an inline element but yes on click on the container', function () {
      var el = $('#inline'),
        container, elEvents, containerEvents;

      el.pickr();
      container = el.next();
      elEvents = $._data(el.get(0), 'events');
      containerEvents = $._data(container.get(0), 'events');

      assert.ok(typeof elEvents.focus === 'undefined');
      assert.ok(typeof elEvents.blur === 'undefined');
      assert.equal(containerEvents.click.length, 2);
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

      var $day = $('.pickr-day').first().click();
      var month = date.getMonth() + 1;

      if (month < 10){
        month = '0' + month;
      }

      assert.equal(el.val(), date.getFullYear() + '-' + month + '-01');
      assert.ok($day.hasClass('pickr-day--selected'));

      setTimeout(function(){
        assert.ok(!$('.pickr-container').is(':empty'));
        done();
      }, clickTimeout);
    });

    test('selecting a date should fire a custom event', function (done) {
      var el = $('#date-picker');

      var date = new Date();
      el.pickr();
      el.focus();

      var month = date.getMonth() + 1;

      if (month < 10){
        month = '0' + month;
      }

      el.on('pickr:selected', function (e, value) {
        assert.equal(value, date.getFullYear() + '-' + month + '-01');
        done();
      });

      $('.pickr-day').first().click();
    });

    test('clicking previous arrow should change month back', function() {
      var el = $('#date-picker');

      el.pickr({
        currentMonth: new Date(2013, 10, 1)
      });

      el.focus();

      $('.pickr-prev-month').click();

      assert.ok($.trim($('.pickr-month-title').first().text()).indexOf('October') > -1);
    });

    test('clicking next arrow should advance month', function() {
      var el = $('#date-picker');

      el.pickr({
        currentMonth: new Date(2013, 10, 1)
      });

      el.focus();

      $('.pickr-next-month').click();

      assert.ok($.trim($('.pickr-month-title').first().text()).indexOf('December') > -1);
    });

    test('A selected day should persist when changing months', function () {
      var el = $('#date-picker'),
        pickr;

      el.pickr({
        currentMonth: new Date(2013, 10, 1)
      });

      el.focus();
      pickr = el.data('pickr');

      var day = $('.pickr-day').first().click().text();

      pickr.nextMonth();
      pickr.prevMonth();

      assert.equal($('.pickr-day--selected').text(), day);
    });

    test('clicking month title should go to today', function() {
      var el = $('#date-picker');

      el.pickr({
        currentMonth: new Date(2013, 10, 1)
      });

      el.focus();

      $('.pickr-prev-month').click();
      $('.pickr-month-title').click();

      assert.equal($.trim($('.pickr-month-title').first().text()), monthNames[new Date().getMonth()]);
    });
  });

  suite('multiple date calendar', function () {
    var el, pickr, $day;

    setup(function () {
      el = $('#inline');

      el.pickr({
        multiple: 2
      });

      $day = $('.pickr-day');
      pickr = el.data('pickr');
    });

    test('should only allow to select n given dates', function () {
      var called = 0;

      el.on('pickr:selected', function (e, values) {
        called++;
        assert.ok(Array.isArray(values));
        assert.ok(values.length === called);
      });

      $day.eq(0).click();
      $day.eq(1).click();
      $day.eq(2).click();

      assert.equal(called, 2);
    });
    test('dates can be un selected when they\'re clicked twice', function () {
      var called = 0;

      el.on('pickr:selected', function () {
        called++;
      });

      $day.eq(0).click();
      $day.eq(0).click();

      assert.equal(called, 2);
      assert.equal(pickr.value.length, 0);
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
