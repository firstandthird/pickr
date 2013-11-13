(function($){
  
  $.declare('pickr', {
    defaults: {
      // Used to detect if user clicked on modal
      // instead of another input.
      hideDelay: 100,

      displayMonths: 1,
      template: '##template##',
      currentMonth: new Date(),
      dayLabels: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    },

    init: function() {
      this.el.addClass('pickr');
      this.pickrContainer = $('<div></div>').addClass('pickr-container');
      this.el.after(this.pickrContainer);
      this.focus = false;
      this.bindEvents();
    },

    bindEvents: function() {
      this.el.on('focus', this.proxy(this.showModal));
      this.el.on('blur', this.proxy(this.hideModal));
      this.pickrContainer.on('click', '*', this.proxy(this.containerClicked));
    },

    update: function() {
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
      console.log('focus', this.focus);
      if(!this.focus) {
        this.focus = true;
        this.update();
      }
    },

    hideModal: function() {
      console.log('blur', this.focus);

      this.hideTimer = setTimeout(this.proxy(function(){
        //this.pickrContainer.empty();
        //this.focus = false;
      }), this.hideDelay);
    },

    containerClicked: function(event) {
      console.log('click');

      event.stopPropagation();

      clearTimeout(this.hideTimer);
      
      this.focus = true;
      this.el.focus();
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