
/*!
 * pickr - A javascript datepicker
 * v0.1.2
 * https://github.com/firstandthird/pickr
 * copyright First + Third 2013
 * MIT License
*/
(function($){
  
  $.declare('pickr', {
    defaults: {
      // Used to detect if user clicked on modal
      // instead of another input.
      hideDelay: 150,

      displayMonths: 1,
      template: '<div class="pickr-months">  <button type="button" class="pickr-prev-month">Prev</button>  <button type="button" class="pickr-next-month">Next</button>  <% for (var i = 0; i < months.length; i++) { var month = months[i]; %>    <div class="pickr-month" data-pickr-date="<%= month.date %>">      <div class="pickr-month-title">        <%= timef(\'%F\', month.date) %>        <% if(today.getFullYear() !== month.date.getFullYear()) { %>          &nbsp; <span><%= timef(\'(%Y)\', month.date) %></span>        <% } %>      </div>      <div class="pickr-days">        <div class="pickr-days-labels">          <% for(var l = 0; l < dayLabels.length; l++) { %>          <div class="pickr-days-label"><%= dayLabels[l] %></div>          <% } %>        </div>                <% if(month.start > 0) { %>        <div class="pickr-day-buffer">          <% for(var d = 1; d < month.start+1; d++) { %>          <div class="pickr-empty-day">&nbsp;</div>          <% } %>        </div>        <% } %>        <% for(var d = 1; d < month.days+1; d++) { %>        <% var isToday = (today.getMonth() === month.date.getMonth() && today.getDate() === d); %>        <% var isPastDay = (!allowPastDays && ~~timef(\'%Y%m%d\', new Date(month.date.getFullYear(), month.date.getMonth(), d)) < ~~timef(\'%Y%m%d\', today)); %>        <div class="pickr-day <%= isToday ? \'pickr-today\' : \'\' %> <%= isPastDay ? \'pickr-past\' : \'\' %>"><%= d %></div>        <% } %>        <% if(month.end > 0) { %>        <div class="pickr-day-buffer">          <% for(var d = 1; d < month.end+1; d++) { %>          <div class="pickr-empty-day">&nbsp;</div>          <% } %>        </div>        <% } %>      </div>    </div>  <% } %></div>',
      currentMonth: new Date(),
      dayLabels: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      dateFormat: '%Y-%m-%d',
      allowPastDays: true
    },

    init: function() {
      this.el.addClass('pickr');
      this.pickrContainer = $('<div></div>').addClass('pickr-container');
      this.el.after(this.pickrContainer);
      this.focus = false;

      if(this.el.data('pickr-format')) {
        this.dateFormat = this.el.data('pickr-format');
      }

      this.bindEvents();
    },

    bindEvents: function() {
      this.el.on('focus', this.proxy(this.showModal));
      this.el.on('blur', this.proxy(this.hideModal));
      this.pickrContainer.on('click', this.proxy(this.containerClicked));
      this.pickrContainer.on('click', '*', this.proxy(this.containerClicked));
    },

    update: function() {
      var months = [], i, month;

      for(i = 0; i < this.displayMonths; i++) {
        month = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + i, 1);

        months.push({
          date: month,
          days: this.daysInMonth(month),
          start: this.monthStartIndex(month),
          end: this.monthEndIndex(month)
        });
      }

      var data = {
        timef: TimeFormat,
        months: months,
        dayLabels: this.dayLabels,
        today: new Date(),
        allowPastDays: this.allowPastDays
      };

      this.render(data, this.pickrContainer);
    },

    showModal: function() {
      if(!this.focus) {
        this.focus = true;
        var offset = this.el.offset();
        this.pickrContainer.css({
          left: offset.left,
          top: offset.top + this.el.outerHeight()
        });
        this.update();
      }
    },

    hideModal: function(event) {
      event.preventDefault();
      this.hideTimer = setTimeout(this.proxy(function(){
        this.pickrContainer.empty();
        this.focus = false;
      }), this.hideDelay);
    },

    containerClicked: function(event) {
      event.stopPropagation();
      event.preventDefault();

      clearTimeout(this.hideTimer);
      
      this.focus = true;
      this.el.focus();

      var target = $(event.target);

      if(target.is('.pickr-day') && !target.is('.pickr-past')) {
        var daySelected = target.text();
        var selectedDate = new Date(target.parents('.pickr-month').data('pickr-date'));
        selectedDate.setDate(daySelected);
        this.selectDate(selectedDate);
      }

      if(target.is('.pickr-prev-month')) {
        this.prevMonth();
      }

      if(target.is('.pickr-next-month')) {
        this.nextMonth();
      }

      if(target.is('.pickr-month-title')) {
        this.today();
      }
    },

    selectDate: function(date) {
      this.el.val(TimeFormat(this.dateFormat, date));
      this.el.trigger('input');
      this.el.blur();
    },

    daysInMonth: function(date) {
      var month = new Date(date.getFullYear(), date.getMonth()+1, 0);
      return month.getDate();
    },

    monthStartIndex: function(date) {
      var month = new Date(date.getFullYear(), date.getMonth(), 1);
      return month.getDay();
    },

    monthEndIndex: function(date) {
      var month = new Date(date.getFullYear(), date.getMonth(), this.daysInMonth(date));
      return 6 - month.getDay();
    },

    prevMonth: function() {
      this.currentMonth.setMonth(this.currentMonth.getMonth() - this.displayMonths);
      this.update();
    },

    nextMonth: function() {
      this.currentMonth.setMonth(this.currentMonth.getMonth() + this.displayMonths);
      this.update();
    },

    today: function() {
      this.currentMonth = new Date();
      this.update();
    }
  });
}(jQuery));