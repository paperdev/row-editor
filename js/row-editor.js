/*
 * jQuery RowEditor Plugin
 * version: 0.1 (2012-09-07)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * @author Rainum, rainum.ua@gmail.com
 *
 * Project repository: https://github.com/rainum/row-editor
 */

// Utility object creation support
if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
        'use strict';

        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function($) {
    'use strict';

    var RowEditor = {
        init: function(options, elem) {
            var self = this;

            self.row = $(elem);

            //Getting all options
            self.options = $.extend({}, $.fn.rowEditor.options, options);

            self.isForm = !!self.row.closest('form').length;

            //Set all RowEditor fields
            self.trigger = self.row.find(self.options.trigger);
            self.views = self.row.find(self.options.view);
            self.editors = self.row.find(self.options.editor);
            self.btnEdit = $(self.options.btnEdit);
            self.btnSave = $(self.options.btnSave);
            self.btnReset = $(self.options.btnReset);
            self.cells = self.isForm ? self.row : self.row.find('td');

            //Find cells view and editor and add it to cell object
            self.cells.each(function(i, cell) {
                cell.editor = $(cell).find(self.options.editor).find('input, select').not(':disabled'); //You can specify any excluding filter
                cell.view = $(cell).find(self.options.view);
            });

            if (!self.editors.is(':hidden')) { //Check if editor block not hidden in css
                self.editors.hide();
            }

            if (self.options.setValues) {
                self.setValues();
            }

            self.buildControls();
        },

        //Create controls in row
        buildControls: function() {
            var self = this;

            self.trigger.append(self.btnEdit, self.btnSave, self.btnReset);
            self.btnSave.hide();
            self.btnReset.hide();
            self.bindEvents();
        },

        //Method for delegating all events
        bindEvents: function() {
            var self = this;

            self.btnEdit.on('click', $.proxy(self.edit, self));
            self.btnSave.on('click', $.proxy(self.save, self));
            self.btnReset.on('click', $.proxy(self.reset, self));

            self.cells.each(function(i, cell) {
                $(cell.editor).on('keypress', function(e) {
                    if (e.keyCode === 13) {
                        self.save();
                        e.preventDefault();
                    }
                });
            });
        },

        //Begin editing
        edit: function() {
            var self = this;

            self.cells.each(function(i, cell) {
                cell.editor.removeAttr('disabled');
            });

            self.views.hide();
            self.btnEdit.hide();
            self.editors.show();
            self.btnSave.show();
            self.btnReset.show();

            //Fire onEdit callback
            if (typeof self.options.onEdit === 'function') {
                self.options.onEdit.apply(self);
            }
        },

        //Saving changes
        save: function() {
            var self = this;

            //Fire onSave callback
            if (typeof self.options.onSave === 'function') {
                self.options.onSave.apply(self);
            }

            /*
             * Refresh grid view if request successfully completed and fire onSaveComplete event
             * Recommended to use .done() callback on production
             */
            self.saveData().always(function() {
                self.refreshView();

                if (typeof self.options.onSaveComplete === 'function') {
                    self.options.onSaveComplete.apply(self, arguments);
                }

                self.editors.hide();
                self.btnSave.hide();
                self.btnReset.hide();
                self.views.show();
                self.btnEdit.show();
            });

            self.cells.each(function(i, cell) {
                cell.editor.attr('disabled', true);
            });
        },

        reset: function() {
            this.setValues();
        },

        refreshView: function() {
            var self = this;

            //Refresh grid view after saving
            self.cells.each(function(i, cell) {
                var $editor = cell.editor,
                    val = '';

                if ($editor.is('[type="checkbox"]')) {
                    val = $editor.is(':checked') ? 'Yes' : 'No';
                } else if ($editor.is('[type="radio"]')) {
                    val = $editor.filter(':checked').val();
                } else {
                    val = $editor.val();
                }

                cell.view.text(val);
            });

            return self;
        },

        //Setting editors values automatically
        setValues: function() {
            var self = this;

            self.cells.each(function(i, cell) {
                var $editor = cell.editor,
                    val = cell.view.text();

                if ($editor.is('[type="text"], select')) {
                    $editor.val(val);
                } else if ($editor.is('[type="radio"]')) {
                    $editor.filter('[value="' + val + '"]').attr('checked', 'checked');
                } else if ($editor.is('[type="checkbox"]') && val.toLocaleLowerCase() === 'yes') {
                    $editor.attr('checked', 'checked');
                }
            });
        },

        //Collect values from editors
        getValues: function() {
            var self = this,
                values = {};

            self.cells.each(function(i, cell) {
                var $editor = cell.editor,
                    val = null;

                if ($editor.is('[type="text"], select')) {
                    val = $editor.val();
                } else if ($editor.is('[type="radio"]')) {
                    val = $editor.filter(':checked').val();
                } else if ($editor.is('[type="checkbox"]')) {
                    val = $editor.is(':checked');
                }

                if ($editor.length) {
                    values[$editor.attr('name')] = val;
                }
            });

            return values;
        },

        //Send row data to server
        saveData: function() {
            var self = this;

            return $.ajax({
                url: self.options.apiUrl,
                data: self.getValues()
            });
        }
    };

    $.fn.rowEditor = function(options) {
        return this.each(function() {
            var rowEditor = Object.create(RowEditor);
            rowEditor.init(options, this);
            $.data(this, 'rowEditor', rowEditor);
        });
    };

    $.fn.rowEditor.options = {
        editor: '.editor',                               //Row editors wrap selector
        view: '.view',                                   //Row view element selector
        trigger: '.trigger',                             //Element selector for rendering Save and Edit controls
        btnEdit: '<input type="button" value="Edit">',   //Edit button html string (optional)
        btnSave: '<input type="button" value="Save">',   //Save button html string (optional)
        btnReset: '<input type="button" value="Reset">', //Reset button html string (optional)
        apiUrl: '',                                      //Url for posting data
        setValues: true,                                 //If true, RowEditor will be setting editors values automatically depending on view text (optional)
        onEdit: null,                                    //onEdit callback (optional)
        onSave: null,                                    //onSave callback (optional)
        onSaveComplete: null                             //onSaveComplete callback (optional)
    };
})(jQuery);
