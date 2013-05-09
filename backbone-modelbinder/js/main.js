$(document).ready(function() {
    'use strict';

    // -----------------------------------------
    // Initialize controls
    // -----------------------------------------
    $('#account').chosen();

    $('#date').datepicker();

    $('#market-value .control').slider({
        range: 'min',
        min: 10,
        max: 1000,
        step: 10,
        value: 500,
        slide: function( event, ui ) {
            $('#market-value .value').html(ui.value);
        }
    });

    $('#market-value .value').html(500);

    // -----------------------------------------
    // Initialize the model
    // -----------------------------------------
    var filterModel = new Backbone.Model();

    var resetFilter = function() {
        filterModel.set({
            'accountId': 1,
            'date': moment(new Date()).format('MM/DD/YYYY'),
            'symbol': 'AAPL',
            'actions': ['Sell'],
            'orderType': 'Limit',
            'marketValue': '400'
        });
    };

    resetFilter();

    var accounts = new Backbone.Collection([
        {id: 1, name: 'Account 1'},
        {id: 2, name: 'Account 2'},
        {id: 3, name: 'Account 3'}
    ]);

    // -----------------------------------------
    // Define views
    // -----------------------------------------
    var FilterView = Backbone.View.extend({
        _modelBinder: undefined,

        events: {
            'click #reset': 'handleReset'
        },

        initialize: function () {
            this._modelBinder = new Backbone.ModelBinder();
        },

        close: function(){
            this._modelBinder.unbind();
        },

        handleReset: function() {
            resetFilter();
        },

        render: function () {
            // Initialize dropdown
            var dropdown = $('#account');
            dropdown.append('<option value="">All Accounts</option>');
            accounts.each(function(account) {
                dropdown.append('<option value="' + account.id + '">' + account.get('name') + '</option>');
            });
            $('#account').trigger("liszt:updated");

            this._modelBinder.bind(this.model, this.el);
        }
    });

    var ModelDataView = Backbone.View.extend({

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            var data = this.model.toJSON();
            this.$el.find('#account-value').html(data.accountId);
            this.$el.find('#date-value').html(data.date);
            this.$el.find('#symbol-value').html(data.symbol);
            this.$el.find('#action-value').html(JSON.stringify(data.actions));
            this.$el.find('#order-type-value').html(data.orderType);
            this.$el.find('#market-value-value').html(data.marketValue);
        }
    });

    // -----------------------------------------
    // Instantiate and render views
    // -----------------------------------------
    var filterView = new FilterView({
        model: filterModel,
        el: '#container'
    });

    var modelDataView = new ModelDataView({
        model: filterModel,
        el: '#model-data'
    });

    filterView.render();
    modelDataView.render();
});