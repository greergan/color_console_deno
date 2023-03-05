# color_console_deno
A colorized set of debugging output classes for [Deno](https://deno.land/)

A collection of classes that output to Deno.stderr which leaves "stdout" untouched. These classes are a replacement for console functions such as "console.debug(...)". They add output level, file name and line number all colorized.

These classes extend the included LogMessage class which in turn extends the Javascript Error class. This makes it possible to display the file name and line number which will help you quickly understand where your messages are being triggered.

A special object can be used as the first argument to each call. This object must contain the "message" property to be used. This object call also contain the "value" property. Any property besides the "message" and "value" properties are ignored. There are 5 columns output for each new call. If the special object is absent then the 4th column is empty. Each class uses a different color to identify itself in the console output.

```Typescript
import { debug, error, todo, trace } from "./color_console_deno/mod.ts";
const object_values = {"name": "George", "date": "2023"};
new trace({message:"Values are"}, object_values);
new trace({message:"Values are", value: object_values}, object_values);
new trace(object_values);
new trace({message:"Your message here..."});
```

The above examples will output the following. Give them a try to see how the colors work.

```
TRACE index.ts  3 Values are  {"name":"George","date":"2023"}
TRACE index.ts  4 Values are {"name":"George","date":"2023"}, {"name":"George","date":"2023"}
TRACE index.ts  5  {"name":"George","date":"2023"}
TRACE index.ts  6 Your message here...
```

## Classes

debug  
error  
todo  
trace  
