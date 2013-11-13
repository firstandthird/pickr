(function($){
  
  $.declare('pickr', {
    defaults: {
      displayMonths: 1,
      template: '##template##',
      currentMonth: new Date(),
      dayLabels: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    },

    init: function() {
      this.el.addClass('pickr');
      this.pickrContainer = $('<div></div>').addClass('pickr-container');
      this.el.after(this.pickrContainer);
      this.bindEvents();
    },

    bindEvents: function() {
      this.el.on('focus', this.proxy(this.showModal));
      this.el.on('blur', this.proxy(this.hideModal));
    },

    update: function() {
      console.log('update');

      var months = [], i, month;

      for(i = 0; i < this.displayMonths; i++) {
        month = new Date(this.currentMonth.getYear(), this.currentMonth.getMonth() + i, 1);

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
      this.update();
    },

    hideModal: function() {
      this.pickrContainer.empty();
    },

    daysInMonth: function(date) {
      var month = new Date(date.getFullYear(), date.getMonth()+1, 0);
      return month.getDate();
    },

    monthStartIndex: function(date) {
      var month = new Date(date.getFullYear(), date.getMonth(), 1);
      return month.getDay();
    }
  });
}(jQuery));