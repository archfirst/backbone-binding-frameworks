$(document).ready(function() {
    'use strict';


    // -----------------------------------------
    // Initialize global handlers for controls
    // -----------------------------------------
    var selHandler = _.where(Backbone.Stickit._handlers, {selector:'select'})[0];

    Backbone.Stickit.addHandler({
        selector: 'select.selectbox',
        initialize: function($el, model, options) {
            $el.selectbox({effect: 'fade'});

            var changeSelection = function(model, value, opt) {
                $el.selectbox('change', String(value));
            };
            this.listenTo(model, 'change:' + options.observe, changeSelection);
        },

        update: function($el, val, model, options) {
            selHandler.update($el, val, model, options);
            $el.selectbox({
                onChange: function(value) {
                    if (options.onSet) {
                        value = options.onSet(value, options);
                    }
                    model.set(options.observe, value);
                }
            });
        }
    });

    Backbone.Stickit.addHandler({
        selector: '.slider-control',
        initialize: function($el, model, options) {
            $el.slider({
                range: 'min',
                min: 10,
                max: 1000,
                step: 10,
                value: model.get(options.observe),
                slide: function( event, ui ) {
                    // $el.find('.value').html(ui.value);
                }
            });

            // $el.find('.value').html(model.get(options.observe));
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
            '.market-value-slider': 'marketValue'
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