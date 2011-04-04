jqTableKit
----------

The original TableKit uses prototype to provide table sorting, resizing, editing in html,

see <a href="http://millstream.com.au/view/code/tablekit">http://millstream.com.au/view/code/tablekit</a>

This is a port of the functionality to jQuery, where I kept all class names etc.

I have used TableKit 1.3b as base and will gradually keep on implementing functionality.
<br>There are some minor differences to TableKit, by auto-detecting,
<br>for example date-eu will accept 23-03-1999 as well as 23-3-1999.

You need to include jQuery and the jqTableKit.js, see examples/ for examples.

At the moment it supports sorting, automatic detection of formats, row striping.

To switch from TableKit to jqTableKit, all you should need to do is just change the inclusion
<br>of the javascript source files, all the names etc should remain.

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

Again, just have a look at the files in examples/ and you should be good to go.

