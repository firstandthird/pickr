(function($){
  
  $.declare('pickr', {
    defaults: {
      displayMonths: 1,
      template: '##template##',
      currentMonth: new Date()
    },

    init: function() {
      this.el.addClass('pickr');
      this.bindEvents();
    },

    bindEvents: function() {
      this.el.on('focus', this.proxy(this.showModal));
      this.el.on('blur', this.proxy(this.hideModal));
    },

    update: function() {
      var months = [];

      for(var i = 0; i < this.displayMonths; i++) {
        months.push({

        });
      }

      var data = {
        months: months
      };

      this.modal = $(template(this.template, data));

      this.el.after(this.modal);
    },

    showModal: function() {
      this.update();
    },

    hideModal: function() {
      this.modal.remove();
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