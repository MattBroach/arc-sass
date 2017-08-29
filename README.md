# ARc + SASS Starter Kit

Based on the [`redux-ssr`](https://github.com/diegohaz/arc/tree/redux-ssr) branch of the fantastic [ARc](https://github.com/diegohaz/arc) starter kit, but modified to use SASS instead of styled components. Also includes updates to API handling to better sync with Django Rest Framework's JSON-based error messages.

## 1. Installation

Due to some issues with flattened dependencies, __ARc+SASS Start Kit__ is best installed with `yarn` instead of `npm`

```sh
$ yarn install
```

## 2. Running the app

```sh
$ npm run dev
```

It will start the development server with [HMR](https://webpack.github.io/docs/hot-module-replacement) on top of it.

> [http://localhost:3000](http://localhost:3000) — Development server<br>
> [http://localhost:3001](http://localhost:3001) — Webpack assets server (for `redux-ssr` only)<br>

Now you can open [http://localhost:3000](http://localhost:3000) in browser and start developing.

## 3. Tests

```sh
$ npm run test
```

## 4. Linting

```sh
$ npm run lint
````

## License

MIT © [Matt Nishi-Broach](https://github.com/MattBroach)

original ARc MIT © [Diego Haz](https://github.com/diegohaz)
