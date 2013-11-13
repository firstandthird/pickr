(function($){
  
  $.declare('pickr', {
    defaults: {
      // Used to detect if user clicked on modal
      // instead of another input.
      hideDelay: 100,

      displayMonths: 3,
      template: '##template##',
      currentMonth: new Date(),
      dayLabels: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      dateFormat: '%Y-%m-%d'
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
          start: this.monthStartIndex(month)
        });
      }

      var data = {
        timef: TimeFormat,
        months: months,
        dayLabels: this.dayLabels
      };

      this.render(data, this.pickrContainer);
    },

    showModal: function() {
      if(!this.focus) {
        this.focus = true;
        this.update();
      }
    },

    hideModal: function() {
      this.hideTimer = setTimeout(this.proxy(function(){
        this.pickrContainer.empty();
        this.focus = false;
      }), this.hideDelay);
    },

    containerClicked: function(event) {
      event.stopPropagation();

      clearTimeout(this.hideTimer);
      
      this.focus = true;
      this.el.focus();

      var target = $(event.target);

      if(target.is('.pickr-day')) {
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
    },

    selectDate: function(date) {
      this.el.val(TimeFormat(this.dateFormat, date));
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