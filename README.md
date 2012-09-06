Row Editor
==========

## Description

Plugin for editing table rows with ajax data save.

###Required html structure
````html
...

<td>
    <span class="re-view">Some text</span>
    <div class="re-editor">
        <input type="text" name="text">
    </div>
</td>

<td>
    <span class="re-view">Value 1</span>
    <div class="re-editor">
        <select name="select">
            <option value="Value 1">Value 1</option>
            <option value="Value 2">Value 2</option>
            <option value="Value 3">Value 3</option>
        </select>
    </div>
</td>

....
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