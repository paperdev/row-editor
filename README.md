Row Editor
==========

## Description

Plugin for inline editing table or form rows. Provides saving data with ajax requests.

###Required HTML structure for form
````html
<p class="editable">
    <label>Text field:</label>
    <span class="view">Some text</span>
    <span class="editor">
        <input type="text" name="text">
    </span>
    <span class="trigger"></span>
</p>
````

###Required HTML structure for table
````html
<td>
    <span class="view">Some text</span>
    <span class="editor">
        <input type="text" name="text">
    </span>
</td>

...

<td class="trigger"></td>
````

## Config:

* editor (selector string) - Cell editors wrap element class
* view (selector string) - Cell view element class
* trigger (selector string) - Save and edit trigger element class
* btnEdit (html string) - Edit button element
* btnSave (html string) - Save button element
* apiUrl (url string) - Url for posting data
* setValues (bool) - If true, RowEditor will be setting editors values automatically depending on view text (optional)

## Callbacks

* onEdit - onEdit callback
* onSave - onSave callback
* onSaveComplete - onSaveComplete callback (optional)

## Requirements

* jQuery (tested on v1.7.2)