# Keep or Sweep Facebook

## Project setup
```
npm install
```

### Build configuration

#### Facebook App ID

We need to set the Facebook app ID. Get it from https://developers.facebook.com and set it as an environment variable named `VUE_APP_FACEBOOK_APP_ID` like so:

```
VUE_APP_FACEBOOK_APP_ID=12345 npm run [serve|build]
```

#### HTTPS and host

In order for the Facebook login and app authorization to work, the app has to be served via HTTPS and the host has to be configured in the bacis app settings as app domain on https://developers.facebook.com.

### Compiles and hot-reloads for development
```
npm run serve -- --https --cert path/to/cert --key path/to/key --host=HOST
```

HOST can be "localhost" or anything configured in `/etc/hosts`.

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
