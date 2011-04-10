jqTableKit
----------

TableKit (subset) ported to jQuery (part of a project I have done for a client of mine)
You can reach me at www.edlin.org if you want to get in touch regarding potential projects.

You can see a small demo of the plugin at:
<a href="http://blog.edlin.org/tablekit-for-jquery-jqtablekit">http://blog.edlin.org/tablekit-for-jquery-jqtablekit</a>

The original TableKit uses prototype to provide table sorting, resizing, editing in html,
see <a href="http://millstream.com.au/view/code/tablekit">http://millstream.com.au/view/code/tablekit</a>

This is a port of the functionality to jQuery, where I kept all class names etc to
maintain compability.

I have used TableKit 1.3b as base and will gradually keep on implementing functionality.
There are some minor differences to TableKit, by auto-detecting,
for example date-eu will accept 23-03-1999 as well as 23-3-1999.

You need to include jQuery and the jqTableKit.css, jqTableKit.js, see examples/ for examples.

At the moment it supports sorting, automatic detection of formats, row striping and resizing.

To switch from TableKit to jqTableKit, all you should need to do is just change the inclusion
of the javascript source files, all the names etc should remain.

Read the TableKit documentation for more detailed information, it works with same class names etc.
Below is some brief documentation:

The tables that should be resizable need to have the class
    'resizable'

The tables that should be sortable need to have the class
    'sortable'

These classes are used for the tr tags, define the colors for these classes for row striping
    'roweven' css class used for row striping
    'rowodd'  css class used for row striping

css class for the column header or first row in table:
    'nosort' - the column will have no sorting activated

css classes/ids for the column headers, these determine what kind of content are in the columns
    'date-iso'          e.g. 2005-03-26T19:51:34Z
    'date'              e.g. Mon, 18 Dec 1995 17:28:35 GMT
    'date-eu'           e.g. 25-12-2006
    'date-au'           e.g. 25/12/2006 05:30:00 PM
    'time'              e.g. 05:30:00 PM
    'currency'          e.g. $55.00 - detects: $ £ ¥ € ¤
    'datasize'          e.g. 30MB - detects: B, KB, MB, GB, TB
    'number'            e.g. 12.4, -13.0
    'casesensitivetext'
    'text'

if no recognized class/id is found, it will try to auto detect the format in the order of
the css classes listed above.

You can override options by passing arguments to the init method.
At the bottom of jqTableKit.js you will see the init method being called,
you can modify it to pass arguments, example:
    setTimeout("$('table').jqTableKit({'minWidth' : 100})", 100);

Accepted arguments (their default value listed first)
-----------------------------------------------------
* stripe : true: enables row striping
* rowEvenClass : 'roweven': css class used for row striping
* rowOddClass : 'rowodd': css class used for row striping
* minWidth : 10: minimum width in pixels of a resizable column

