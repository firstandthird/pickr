
/*!
 * pickr - A javascript datepicker
 * v0.3.4
 * https://github.com/firstandthird/pickr
 * copyright First + Third 2014
 * MIT License
*/
(function($){
  
  $.declare('pickr', {
    defaults: {
      // Used to detect if user clicked on modal
      // instead of another input.
      hideDelay: 150,

      displayMonths: 1,
      template: '<div class="pickr-months">  <button type="button" class="pickr-prev-month">&lsaquo;</button>  <button type="button" class="pickr-next-month">&rsaquo;</button>  <% for (var i = 0; i < months.length; i++) { var month = months[i]; %>    <div class="pickr-month" data-pickr-date="<%= month.date %>">      <div class="pickr-month-title">        <%= timef(\'%F\', month.date) %>        <% if(today.getFullYear() !== month.date.getFullYear()) { %>          &nbsp; <span><%= timef(\'(%Y)\', month.date) %></span>        <% } %>      </div>      <div class="pickr-days">        <div class="pickr-days-labels">          <% for(var l = 0; l < dayLabels.length; l++) { %>          <div class="pickr-days-label"><%= dayLabels[l] %></div>          <% } %>        </div>                <% if(month.start > 0) { %>          <% for(var d = 1; d < month.start+1; d++) { %>          <div class="pickr-empty-day <%= (d === month.start) ? \'pickr-empty-day--last\' : \'\' %>">&nbsp;</div>          <% } %>        <% } %>        <% for(var d = 1; d < month.days+1; d++) { %>        <% var isToday = (today.getMonth() === month.date.getMonth() && today.getDate() === d); %>        <% var isSelected = month.selected.indexOf(d) > -1; %>        <% var isPastDay = (!allowPastDays && ~~timef(\'%Y%m%d\', new Date(month.date.getFullYear(), month.date.getMonth(), d)) < ~~timef(\'%Y%m%d\', today)); %>        <% var firstDay = (d === 1); %>        <div class="pickr-day<%= isToday ? \' pickr-today\' : \'\' %><%= isPastDay ? \' pickr-past\' : \'\' %><%= isSelected ? \' pickr-day--selected\' : \'\' %><%= firstDay ? \' pickr-first-day\' : \'\' %>"><%= d %></div>        <% } %>        <% if(month.end > 0) { %>          <% for(var d = 1; d < month.end+1; d++) { %>          <div class="pickr-empty-day <%= (d === month.end) ? \'pickr-empty-day--last\' : \'\' %>">&nbsp;</div>          <% } %>        <% } %>      </div>    </div>  <% } %></div>',
      currentMonth: new Date(),
      dayLabels: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      dateFormat: '%Y-%m-%d',
      allowPastDays: true,
      inline: false,
      multiple: false
    },

    init: function() {
      this.el.addClass('pickr');
      this.pickrContainer = $('<div></div>').addClass('pickr-container');
      this.el.after(this.pickrContainer);
      this.inline = this.el.prop('tagName').toLowerCase() !== 'input' || this.inline;
      this.focus = false;
      this.value = [];
      this.selectedDate = {};

      //set to 1st of month
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);

      if(this.el.data('pickr-format')) {
        this.dateFormat = this.el.data('pickr-format');
      }

      this.bindEvents();

      if (this.inline) {
        this.pickrContainer.addClass('pickr-inline');
        this.showModal();
      }
    },

    bindEvents: function() {
      if (!this.inline){
        this.el.on('focus', this.proxy(this.showModal));
        this.el.on('blur', this.proxy(this.hideModal));
      }

      this.pickrContainer.on('click', this.proxy(this.containerClicked));
      this.pickrContainer.on('click', '*', this.proxy(this.containerClicked));
    },

    update: function() {
      var months = [], i, month;

      for(i = 0; i < this.displayMonths; i++) {
        month = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + i, 1);

        months.push({
          date: month,
          selected: this.selectedInMonth(month),
          days: this.daysInMonth(month),
          start: this.monthStartIndex(month),
          end: this.monthEndIndex(month)
        });
      }

      var data = {
        timef: dateFormat,
        months: months,
        dayLabels: this.dayLabels,
        today: new Date(),
        allowPastDays: this.allowPastDays
      };

      this.render(data, this.pickrContainer);
      this.pickrContainer.find('.pickr-empty-day, .pickr-day').each(function (index) {
        if (index % 7 === 0){
          $(this).addClass('pickr-day-first');
        }
      });
    },

    showModal: function() {
      if(!this.focus) {
        this.focus = true;

        if (!this.inline){
          var offset = this.el.offset();
          this.pickrContainer.css({
            left: offset.left,
            top: offset.top + this.el.outerHeight()
          });
        }

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

      if (!this.inline) {
        this.el.focus();
      }

      var target = $(event.target);

      if(target.is('.pickr-day') && !target.is('.pickr-past')) {
        var daySelected = target.text();
        var selectedDate = new Date(target.parents('.pickr-month').data('pickr-date'));

        if (!target.is('.pickr-day--selected')){
          selectedDate.setDate(daySelected);

          if (this.multiple === false){
            this.pickrContainer.find('.pickr-day--selected').removeClass('pickr-day--selected');
          }
          else if (!this.canAddMoreDates()){
            return;
          }

          target.addClass('pickr-day--selected');
          this.selectDate(selectedDate);
        }
        else if (this.multiple !== false) {
          target.removeClass('pickr-day--selected');
          this.removeDate(selectedDate);
        }
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

    removeDate: function (date) {
      var value = dateFormat(this.dateFormat, date);

      var i = this.value.indexOf(value);
      this.value.splice(i, 1);

      var month = this.selectedDate[this.getDateKey(date)],
        j = month.indexOf(date.getDate());

      month.splice(j, 1);

      this.updateValue(this.value);
    },

    getDateKey: function (date) {
      return date.getMonth() + '/' + date.getFullYear();
    },

    storeDate: function (date, formatted) {
      if (this.value.length < this.multiple || this.multiple === true){
        this.value.push(formatted);
      }
      else if (this.multiple === false){
        this.value = [formatted];
        this.selectedDate = {};
      }

      if (!Array.isArray(this.selectedDate[this.getDateKey(date)])){
        this.selectedDate[this.getDateKey(date)] = [];
      }

      this.selectedDate[this.getDateKey(date)].push(date.getDate());
    },

    selectDate: function(date) {
      var value = dateFormat(this.dateFormat, date);

      this.storeDate(date, value);
      this.updateValue(this.value);
    },

    updateValue: function (value) {
      this.el.trigger('pickr:selected', [value]);

      if (!this.inline){
        this.el.val(value.join(' '));
        this.el.trigger('input');
        this.el.blur();
      }
    },

    canAddMoreDates: function () {
      if (!this.multiple){
        return true;
      }
      else if (this.multiple) {
        if ($.type(this.multiple) === 'number') {
          return this.value.length < this.multiple;
        }
        else {
          return true;
        }
      }
    },

    selectedInMonth: function (date) {
      return this.selectedDate[this.getDateKey(date)] || [];
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
