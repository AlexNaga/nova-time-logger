## Time logger

### Features

* Automatically login and log your time.
* Support for a custom message.
* Possible to add or subtract to today's date.
* Knows if you're trying to add a date to the weekend, which won't work.
* Check if the date you're trying to add already exists.

### How to run?

Copy the file `.env.example` , name it `.env` and change the values.

``` sh
$ npm i
$ npm run build
$ npm run client
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
