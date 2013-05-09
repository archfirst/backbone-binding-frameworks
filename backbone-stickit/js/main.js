$(document).ready(function() {
    'use strict';

    // -----------------------------------------
    // Select box handler
    // -----------------------------------------
    Backbone.Stickit.addHandler({
        selector: '.chzn-select',
        initialize: function($el, model, options) {
            $el.chosen();
            var up = function(m, v, opt) {
                if (!opt.bindKey) {
                    $el.trigger('liszt:updated');
                }
            };
            this.listenTo(model, 'change:' + options.observe, up);
        }
    });

    // -----------------------------------------
    // Slider handler
    // -----------------------------------------
    Backbone.Stickit.addHandler({
        selector: '.slider',
        events: ['change'],

        initialize: function ($el, model, options) {
            $el.slider(_.extend({
                value: model.get(options.observe),
                slide: function (event, ui) {
                    // Defer since the `slide` event is triggered
                    // before the actual $el.slide('value') is updated.
                    _.defer(function(){$el.trigger('change')});
                }
            }, options.sliderOptions));
        },

        update: function($el, val, model, options) {
            _.defer(function() {
                $el.slider('value', model.get(options.observe)).change();
            });
        },

        getVal: function($el, event, options) {
            return $el.slider('value');
        }
    });

    // -----------------------------------------
    // Initialize controls
    // -----------------------------------------
    $('#date').datepicker();

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
            'marketValue': '50'
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
        events: {
            'click #reset': 'handleReset'
        },

        bindings: {
            '#account': {
                observe: 'accountId',
                selectOptions: {
                    collection: accounts,
                    labelPath: 'name',
                    valuePath: 'id',
                    defaultOption: {label: 'All Accounts', value: null}
                }
            },
            '#date': 'date',
            '#symbol': 'symbol',
            '.actions': 'actions',
            '.order-type': 'orderType',
            '.market-value-slider': {
                observe: 'marketValue',
                sliderOptions: {
                    range: 'min',
                    min: 1,
                    max: 100,
                    step: 1
                }
            },
            '.market-value': 'marketValue'
        },

        handleReset: function() {
            resetFilter();
        },

        render: function () {
            this.stickit();
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