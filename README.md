## Time logger

### Features

* Automatically login and log your time.
* Support for a custom message.
* Supports logging for the whole week.
* Supports changing the number hours to report.
* Possible to add or subtract to today's date.
* Knows if you're trying to add a date to the weekend, which won't work.
* Check if the date you're trying to add already exists.

### How to run?

``` sh
$ npm i
```

After install, change the example values in the file `.env`

``` sh
$ npm run build && npm run client
```

### How to install globally?

By linking it globally, it's possible to run command `nova` in the terminal.

``` sh
# npm link
```

### How to remove globally?

``` sh
# npm unlink
```
