$(document).ready(function() {
    'use strict';

    // -----------------------------------------
    // Initialize controls
    // -----------------------------------------
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
    // Selectbox view
    // -----------------------------------------
    var SelectboxView = Backbone.View.extend({
        events: {
            'change': 'handleViewChange'
        },

        initialize: function(options) {
            this.$el.chosen();
            this.listenTo(this.model, 'change:' + options.observe, this.handleModelChange);
        },

        // handle change event emitted by the control
        handleViewChange: function(event) {
            this.model.set(this.options.observe, event.target.value);
        },

        // handle change event emitted by the model
        handleModelChange: function(model, value, options) {
            this.$el.val(value).trigger("liszt:updated");
        },

        render: function() {
            var selectOptions = this.options.selectOptions;

            if (selectOptions.defaultOption) {
                var label = selectOptions.defaultOption.label;
                var value = selectOptions.defaultOption.value;
                if (!value) { value = ""; }
                this._appendOption(label, value);
            }

            selectOptions.collection.each(function(model) {
                var label = model.get(selectOptions.labelPath);
                var value = model.get(selectOptions.valuePath);
                if (!value) { value = ""; }
                this._appendOption(label, value);
            }, this);

            this.$el.trigger("liszt:updated");
        },

        _appendOption: function(label, value) {
            this.$el.append('<option value="' + value + '">' + label + '</option>');
        }
    });

    // -----------------------------------------
    // Define views
    // -----------------------------------------
    var FilterView = Backbone.View.extend({
        _modelBinder: undefined,

        events: {
            'click #reset': 'handleReset'
        },

        initialize: function () {
            this.accountSelector = new SelectboxView({
                el: '#account',
                model: this.model,
                observe: 'accountId',
                selectOptions: {
                    collection: accounts,
                    labelPath: 'name',
                    valuePath: 'id',
                    defaultOption: {label: 'All Accounts', value: null}
                }
            });
            this._modelBinder = new Backbone.ModelBinder();
        },

        close: function(){
            this._modelBinder.unbind();
            this.accountSelector.remove();
        },

        handleReset: function() {
            resetFilter();
        },

        render: function () {
            this.accountSelector.render();
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