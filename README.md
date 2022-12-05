# :love_letter: React Bella Email

### The email input field that your users will love.

[Demo and examples](https://react-bella-email.netlify.app) — [Stackblitz]()

<br />

![react-bella-email](https://i.ibb.co/6tBV0QL/Schermata-2022-09-18-alle-15-18-14.png)

**React Bella Email** is a tiny, zero-dependency controlled component that aims to replace the typical `<input type="email" />` of your form by **providing the best UX** with all the flexibility you'd expect from a native input:

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

| Prop           | Description                                           | Type                                   | Default   | Required           |
| -------------- | ----------------------------------------------------- | -------------------------------------- | --------- | ------------------ |
| `value`        | State or portion of state to hold the email           | _string_                               | undefined | :white_check_mark: |
| `onChange`     | State setter or custom dispatcher to update the email | _OnChange_                             | undefined | :white_check_mark: |
| `baseList`     | Domains to suggest while typing the username          | _string[]_                             | undefined | :white_check_mark: |
| `refineList`   | Domains to refine suggestions after typing `@`        | _string[]_                             | []        | :x:                |
| `onSelect`     | Custom callback on suggestion select                  | _OnSelect_                             | () => {}  | :x:                |
| `minChars`     | Minimum chars required to display suggestions         | _1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8_ | 2         | :x:                |
| `maxResults`   | Maximum number of suggestions to display              | _2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8_      | 6         | :x:                |
| `classNames`   | Class names for each element                          | _ClassNames_                           | undefined | :x:                |
| `className`    | Class name of the wrapper element                     | _string_                               | undefined | :x:                |
| `wrapperId`    | DOM ID of the wrapper element                         | _string_                               | undefined | :x:                |
| `customPrefix` | Custom prefix for dropdown unique ID                  | _string_                               | `rbe_`    | :x:                |
| `isInvalid`    | Value of `aria-invalid`                               | _boolean_                              | undefined | :x:                |

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
    └── Suggestions - li[]
        └──[username - span:first-of-type] [@domain.com - span:last-of-type]
```

You can either specify `classNames` for any element you'd like to style:

```jsx
const myClassNames = {
  wrapper: 'my-wrapper',
  input: 'my-input',
  dropdown: 'my-dropdown',
  suggestion: 'my-suggestion',
  username: 'my-username',
  domain: 'my-domain'
};

function App() {
  const [email, setEmail] = useState('');

  return (
    <Email
      classNames={myClassNames}
      baseList={baseList}
      onChange={setEmail} // or (newValue) => customSetter(newValue)
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
  input: 'my-input'
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

Or add a class to the wrapper `div` via `className` prop, and target any child:

```css
.my-wrapper {
  /* Wrapper */
}

.my-wrapper input {
  /* Input field */
}

.my-wrapper li > span:first-of-type {
  /* Username */
}

/* ... */
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

### Focus/Hover styles

Although you can target the pseudo classes `:hover` and `:focus`, it is recommended instead to target the attribute `data-email-active` in order to avoid `:hover` styles to be applied to a suggestion as soon as the dropdown is opened in case the cursor is hovering it.

```css
.my-suggestion[data-email-active='true'] {
  background-color: aliceblue;
}

.my-suggestion:focus {
  outline: none;
}
```

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
  'proton.me'
];

function App() {
  const [email, setEmail] = useState('');

  return (
    <Email
      className="my-wrapper"
      baseList={baseList}
      onChange={setEmail} // or (newValue) => customSetter(newValue)
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
  'proton.me'
];

function App() {
  const [email, setEmail] = useState('');

  return (
    <Email
      className="my-wrapper"
      baseList={baseList}
      refineList={domains}
      onChange={setEmail} // or (newValue) => customSetter(newValue)
      value={email}
    />
  );
}
```

Alternatively, you can create your own array of domains or [search]() for the one that more suits your audience.

<br />

## :globe_with_meridians: Localization

It is great to display different suggestions according to [user's locale](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language). **React Bella Email** includes a very simple hook that does exactly that.

**1 - Create an object and define lists for each browser locale:**

```js
export const lists = {
  default: ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'msn.com', 'proton.me'], // Required
  it: ['gmail.com', 'yahoo.com', 'yahoo.it', 'tiscali.it', 'libero.it', 'outlook.com'],
  'it-CH': ['gmail.com', 'outlook.com', 'bluewin.ch', 'gmx.de', 'libero.it', 'sunrise.ch']
};
```

<details><summary><strong>TypeScript</strong></summary>
<br />

```ts
import type { LocalizedList } from 'react-bella-email';

export const lists: LocalizedList = {
  default: ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'msn.com', 'proton.me'], // Required
  it: ['gmail.com', 'yahoo.com', 'yahoo.it', 'tiscali.it', 'libero.it', 'outlook.com']
};
```

</details>

You can specify [lang codes](https://www.localeplanet.com/icu/iso639.html) with or without country codes. In case you don't specify a country code (such as `it`), it will match browser locales such as `it`, `it-CH` and `it-IT` and so on.

Instead, if you specify `it-CH` it will match `it-CH` but not `it` or `it-IT`.

**2 - Use the hook:**

```jsx
import { lists } from './lists';
import { Email, useLocalizedList } from 'react-bella-email';

function App() {
  const baseList = useLocalizedList(lists);
  const [email, setEmail] = useState('');

  return (
    <Email
      className="my-wrapper"
      baseList={baseList}
      onChange={setEmail} // or (newValue) => customSetter(newValue)
      value={email}
    />
  );
}
```

### Usage with internationalization frameworks

If you prefer to keep the suggestions in line with your app locale instead of the browser's one, you can directly pass the locale string as second argument:

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
      onChange={setEmail} // or (newValue) => customSetter(newValue)
      value={email}
    />
  );
}
```

<br />

## :8ball: onSelect callback

If you need to invoke a callback (e.g. server validation), everytime a suggestion is selected (either with mouse or keyboard), you can do that by passing a function to `onSelect` prop:

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
      onChange={setEmail} // or (newValue) => customSetter(newValue)
      onSelect={handleSelect}
      value={email}
    />
  );
}
```

<details><summary><strong>Type Definition</strong></summary>
<br/>

```ts
type OnSelectData = {
  value: string;
  keyboard: boolean;
  position: number;
};

type OnSelect = (object: OnSelectData) => void | Promise<void>;
```

</details>

<br />

## React Hook Form

No special configuration needed, it just works. Just follow the official React Hook Form's [Controller documentation](https://react-hook-form.com/api/usecontroller/controller).

<br />

## :keyboard: List keyboard controls

- **↑ ↓** - Navigate through suggestions / input field
- **← →** - Move cursor and focus the input field while keeping list open
- **Backspace / Alphanumeric keys** - Edit the input value and keep refining suggestions
- **Enter / Space** - Confirm the suggestion
- **Escape** - Close the list and focus the input field
- **Tab / Shift + Tab** - Close the list and go to next/prev focusable input

<br />

## :dvd: License

MIT Licensed. Copyright (c) Simone Mastromattei 2022.
