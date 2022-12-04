# :love_letter: React Bella Email

### The email input that your users will love.

[Demo and examples](https://react-bella-email.netlify.app) — [Stackblitz]()

<br />

![react-bella-email](https://i.ibb.co/6tBV0QL/Schermata-2022-09-18-alle-15-18-14.png)

**React Bella Email** is a tiny, zero-dependency controlled input that aims to replace the typical `<input type="email" />` of your form by **providing the best UX** and all the flexibility you'd expect from a native input:

- Fully accessible with great keyboard controls
- Completely unstyled and white labeled
- Forward the most common event handlers and attributes
- Controllable with React Hook Form

> :bulb: **React Bella Email** also ships with a curated list of ~160 world's most popular email providers in order to get started quickly.

<br />

## :floppy_disk: Installation

```bash
npm i -S react-bella-email
# yarn add react-bella-email
# pnpm add react-bella-email
```

<br />

## :cyclone: Props

| Prop           | Description                                                                                      | Type                                   | Default   | Required           |
| -------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------- | --------- | ------------------ |
| `value`        | State or portion of state to hold the email                                                      | _string_                               | undefined | :white_check_mark: |
| `onChange`     | State setter or custom dispatcher to update the email                                            | _Change_                               | undefined | :white_check_mark: |
| `baseList`     | Domains to suggest while typing the username                                                     | _string[]_                             | undefined | :white_check_mark: |
| `refineList`   | Domains to refine suggestions after typing `@`                                                   | _string[]_                             | []        | :x:                |
| `onSelect`     | Custom callback to invoke on suggestion select                                                   | _Select_                               | () => {}  | :x:                |
| `minChars`     | Minimum chars required to display suggestions                                                    | _1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8_ | 2         | :x:                |
| `maxResults`   | Maximum number of suggestions to display                                                         | _2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8_      | 6         | :x:                |
| `classNames`   | Class names for each element                                                                     | _ClassNames_                           | undefined | :x:                |
| `className`    | Class name of the wrapper element                                                                | _string_                               | undefined | :x:                |
| `nextElement`  | DOM ID of the next focusable element. If set, it will be focused after a suggestion is selected. | _string_                               | undefined | :x:                |
| `wrapperId`    | DOM ID of the wrapper element                                                                    | _string_                               | undefined | :x:                |
| `customPrefix` | Custom prefix for dropdown unique ID                                                             | _string_                               | `rbe_`    | :x:                |

### Are also available:

- Events: `onBlur`, `onFocus`, `onInput` and `onKeyDown`.

- Attributes: `id`, `name`, `placeholder`, `required`, `disabled`, `readOnly` and `pattern`.

- React's `ref`.

> :bulb: They are all forwarded to the `<input />` element.

<br />

## :art: Styling

The component renders a single `div` with a very simple structure:

```js
Wrapper — div
├── Email Input Field — input
└── Dropdown — ul
    └── Suggestions[] - li
        └──[username - span:first-of-type] [@domain.com - span:last-of-type]
```

You can either specify `classNames` for the elements you'd like to style:

```jsx
const myClassNames = {
  wrapper: 'my-wrapper',
  input: 'my-input',
  dropdown: 'my-dropdown',
  suggestion: 'my-suggestion',
  username: 'my-username',
  domain: 'my-domain',
};

function App() {
  const [email, setEmail] = useState('');

  return (
    <Email
      classNames={myClassNames}
      baseList={baseList}
      onChange={setEmail} // or (value) => customSetter(value)
      value={email}
    />
  );
}
```

<details><summary><strong>TypeScript</strong></summary>
<br />

```ts
import type { ClassNames } from 'react-bella-email';

const myClassNames: ClassNames = {
  wrapper: 'my-wrapper',
  input: 'my-input',
};
```

</details>

<details><summary><strong>Tailwind Intellisense for VSCode</strong></summary>
<br />

You can add a this property in VSCode's `settings.json` in order to enable autcomplete for any object property or variable ending with `ClassNames`.

```json
  "tailwindCSS.experimental.classRegex": [
    ["ClassNames \\=([^;]*);", "'([^']*)'"],
    ["ClassNames \\=([^;]*);", "\"([^\"]*)\""],
    ["ClassNames \\=([^;]*);", "\\`([^\\`]*)\\`"]
  ],
```

</details>

Or add a class to the container via `className` prop:

```jsx
function App() {
  const [email, setEmail] = useState('');

  return (
    <Email
      className="my-wrapper"
      baseList={baseList}
      onChange={setEmail} // or (value) => customSetter(value)
      value={email}
    />
  );
}
```

And target any child:

```css
/* Wrapper */
.my-wrapper {
}

/* Input field */
.my-wrapper input {
}

/* Dropdown */
.my-wrapper ul {
}

/* Suggestions */
.my-wrapper li {
}

/* Username */
.my-wrapper li > span:first-of-type {
}

/* Domain */
.my-wrapper li > span:last-of-type {
}
```

<details><summary><strong>Basic styles</strong></summary>

<br />

This package ships with **zero css**. Initial styles enough to see the component in action may match the following properties:

```css
.my-wrapper,
.my-input {
  position: relative;
}

.my-input,
.my-dropdown,
.my-suggestion {
  font-size: inherit;
  box-sizing: border-box;
  width: 100%;
}

.my-dropdown {
  position: absolute;
  margin: 0.45rem 0 0 0;
  padding: 0;
  list-style-type: none;
  z-index: 999;
}

.my-suggestion {
  cursor: pointer;
  user-select: none;
  overflow: hidden;
}
```

</details>

<br />

## :dna: Modes

### 1. Basic Mode

Once users start typing, it displays a list of _base_ suggestions and hides it once they type `@` . It already gives a nice UX and should be enough for the vast majority of websites:

![react-bella-email](https://i.ibb.co/2hqKpY6/Schermata-2022-09-18-alle-15-18-35.png)

```jsx
import { Email } from 'react-bella-email';

const baseList = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'aol.com',
  'msn.com',
  'proton.me',
];

function App() {
  const [email, setEmail] = useState('');

  return (
    <Email
      className="my-wrapper"
      baseList={baseList}
      onChange={setEmail} // or (value) => customSetter(value)
      value={email}
    />
  );
}
```

### 2. Refine Mode

Acts like **Basic Mode** until users type `@` . Then as they start typing the domain, it refines the suggestions according to an extended list of domains (autocomplete).

![react-bella-email](https://i.ibb.co/6tBV0QL/Schermata-2022-09-18-alle-15-18-14.png)

All you have to do is to provide a second array of domains to `refineList` prop. This package ships with a curated [list]() of the ~160 most popular world domains (thanks to **@mailcheck**):

```jsx
import { Email, domains } from 'react-bella-email';

const baseList = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'aol.com',
  'msn.com',
  'proton.me',
];

function App() {
  const [email, setEmail] = useState('');

  return (
    <Email
      className="my-wrapper"
      baseList={baseList}
      refineList={domains}
      onChange={setEmail} // or (value) => customSetter(value)
      value={email}
    />
  );
}
```

Alternatively, you can create your own array of domains or [search]() for the one that more suits your audience.

<br />

## :globe_with_meridians: Internationalization

It would be a great to display the first suggestions according to the user's browser locale. **React Bella Email** includes a very simple hook that does exactly that.

**1 - Create an object with the lists for each browser locale:**

```js
export const lists = {
  it: ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'msn.com'],
  'de-DE': ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'msn.com'],
  default: ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'msn.com'], // 'default' is required.
};
```

You can specify lang codes with or without region codes. In case you don't specify a region code (such as `it`), it will match `it`, `it-CH` and `it-IT` and so on. Instead, if you specify `it-CH` it will match only `it-CH` but not `it` or `it-IT`.

**2 - Use `useLocalizedList` hook:**

```jsx
import lists from './lists';
import { Email, useLocalizedList } from 'react-bella-email';

function App() {
  const baseList = useLocalizedList(lists);
  const [email, setEmail] = useState('');

  return (
    <Email
      className="my-wrapper"
      baseList={baseList}
      onChange={setEmail} // or (value) => customSetter(value)
      value={email}
    />
  );
}
```

### Usage with internationalization frameworks

The default stategy explained above relies on the browser locale. No matter the language of your app, it will always display suggestions according to the browser locale.

Instead, if you prefer to keep the suggestions in line with your app locale, you can directly pass the locale string as second argument:

```jsx
import lists from './lists';
import { useRouter } from 'next/router';
import { Email, useLocalizedList } from 'react-bella-email';

function App() {
  const { locale } = useRouter();
  const baseList = useLocalizedList(lists, locale);

  const [email, setEmail] = useState('');

  return (
    <Email
      className="my-wrapper"
      baseList={baseList}
      onChange={setEmail} // or (value) => customSetter(value)
      value={email}
    />
  );
}
```

<br />

## :8ball: Callbacks

### onChange with object state

```jsx
function App() {
  const [payload, setPayload] = useState({
    name: '',
    email: '',
  });

  function handleChange(value) {
    setPayLoad((prevData) => ({
      ...prevData,
      email: value,
    }));
  }

  return (
    <Email
      className="my-wrapper"
      baseList={baseList}
      onChange={handleChange}
      value={payload.email}
    />
  );
}
```

<details><summary><strong>Type Definition</strong></summary>
<br/>

```ts
type Change =
  | React.Dispatch<React.SetStateAction<string>>
  | ((value: string) => void | Promise<void>);
```

</details>

<br />

### Custom onSelect callback

You might need to invoke a callback (e.g. server email validation), everytime a suggestion is selected (either with mouse or keyboard). You can do that by passing a function to `onSelect` prop:

```jsx
import { Email, domains } from 'react-bella-email';

function App() {
  const [email, setEmail] = useState('');

  function handleSelect({ value, keyboard, position }) {
    console.log(value, keyboard, position);
  }

  return (
    <Email
      className="my-wrapper"
      baseList={baseList}
      refineList={domains}
      onChange={setEmail} // or (value) => customSetter(value)
      onSelect={handleSelect}
      value={email}
    />
  );
}
```

<details><summary><strong>Type Definition</strong></summary>
<br/>

```ts
type SelectData = {
  value: string;
  keyboard: boolean;
  position: number;
};

type OnSelect = (object: SelectData) => void | Promise<void>;
```

</details>

<br />

### React Hook Form

No special configuration needed, it just works. Just follow the official React Hook Form's [Controller documentation](https://react-hook-form.com/api/usecontroller/controller).

<br />

## :keyboard: Keyboard controls

- **Up / Down arrow** - Navigate through suggestions
- **Enter / Space** - Confirm the suggestion and focus the input field (or the next one).
- **Tab / Shift + Tab** - Close the list and go to next/prev focusable input
- **Backspace** - Keep the list open and keep refining the suggestions
- **Escape** - Close the list and focus the input field

<br />

## :dvd: License

MIT Licensed. Copyright (c) Simone Mastromattei 2022.
