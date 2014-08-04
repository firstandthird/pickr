(function($){
  
  $.declare('pickr', {
    defaults: {
      // Used to detect if user clicked on modal
      // instead of another input.
      hideDelay: 150,

      displayMonths: 1,
      template: '##template##',
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
      var value = TimeFormat(this.dateFormat, date);

      var i = this.value.indexOf(value);
      this.value.splice(i, 1);

      var month = this.selectedDate[this.getDateKey(date)],
        j = month.indexOf(date.getDate());

      month.splice(j, 1);

      this.updateValue(this.value.join(' '));
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
      var value = TimeFormat(this.dateFormat, date);

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