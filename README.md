# React Email Suggestions

### You React's email companion.

<br />

_First released: October 1st, 2022_

[Demo and examples]() — [Playground]()

<br />

# API

This package exports two modules **completely independent** between each other:

## :envelope: Email Component

It aims to replace the typical `<input type="email" />` of your form by giving the best UX with all the flexibility you'd expect from an input field:

- Fully accessible with great keyboard controls
- Add the most common event handlers and attributes
- Completely unstyled and white labeled
- Controllable with React Hook Form

![react-email-suggestions](https://i.ibb.co/nCNZvsg/Schermata-2022-09-18-alle-15-18-14.png)

---

**Jump to:** [Props](#-cyclone--props) | [Styling](#-art--styling) | [Usage and Behavior](#usage-and-behavior) | [Keyboard controls](#keyboard-controls)

---

## :see_no_evil: useSuggestion hook

A special hook that helps you get and use the corrected/suggested email if the supplied one is presumably incorrect.

You can use it with any email/text input and of course with Email component.

![react-email-suggestions](https://i.ibb.co/W5qMLxv/Schermata-2022-09-18-alle-14-51-15.png)

---

**Jump to:** [How suggestion is evaluated?](#how-suggestion-is-evaluated-) | [Usage](#usage) | [Customizing Options](#customizing-options) | [Accessibity](#accessibity)

---

<br />

# Email Component

## :cyclone: API

| Prop             | Description                                                                                      | Type                                                               | Default   | Required           |
| ---------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | --------- | ------------------ |
| `value`          | State or portion of state that will hold the email                                               | _string_                                                           | undefined | :white_check_mark: |
| `onChange`       | State setter or custom dispatcher to update the state                                            | _Dispatch<SetStateAction<string\>>_ \| _((value: string) => void)_ | undefined | :white_check_mark: |
| `baseList`       | Domains to suggest while typing the username                                                     | _string[]_                                                         | undefined | :white_check_mark: |
| `refineList`     | Domains to refine suggestions after typing the username                                          | _string[]_                                                         | []        | :x:                |
| `onSelect`       | Custom callback to invoke on suggestion select                                                   | _(object: SelectParam) => void \| Promise\<void\>_                 | undefined | :x:                |
| `startAfter`     | Minimum chars required to display suggestions                                                    | _1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8_                             | 2         | :x:                |
| `maxSuggestions` | Maximum number of suggestions to display                                                         | _2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8_                                  | 6         | :x:                |
| `nextElement`    | DOM ID of the next focusable element. If set, it will be focused after a suggestion is selected. | _string_                                                           | undefined | :x:                |
| `classNames`     | Class names of each child                                                                        | _ClassNames_                                                       | undefined | :x:                |
| `className`      | Class name of the wrapper element                                                                | _string_                                                           | undefined | :x:                |

### Are also available:

- Events: `onBlur`, `onFocus`, `onInput` and `onKeyDown`.

- Attributes: `id`, `name`, `placeholder`, `minLength`, `maxLength`, `pattern`, `readOnly` and `required`.

- React's `ref` and `children`.

> :warning: Events, attributes and `ref` are added directly to the `<input />` element.

<br />

## :art: Styling

The component renders a `div` with a very simple DOM structure:

```js
Wrapper — div
├──Email Input Field — input
└── Dropdown — ul
    └── Suggestions - li
        └──[username - span:first-of-type] [@domain.com - span:last-of-type]
```

You can either specify `classNames` for each element:

```jsx
// You can assign only the classes you need, no need to declare them all.

const myClassNames = {
  wrapper: 'my-wrapper',
  input: 'my-input',
  dropdown: 'my-dropdown',
  suggestion: 'my-suggestion',
  username: 'my-username',
  domain: 'my-domain',
};

function App() {
  return (
    <Email
      classNames={myClassNames}
      baseList={baseList}
      domainList={domainList}
      onChange={setEmail}
      value={email}
    />
  );
}
```

<details><summary><strong>Tailwind Intellisense</strong></summary>
<br />

You can add a setting like this in VSCode `settings.json` in order to enable autcomplete for any object property variables ending with `ClassNames`.

```json
  "tailwindCSS.experimental.classRegex": [
    ["ClassNames \\=([^;]*);", "'([^']*)'"],
    ["ClassNames \\=([^;]*);", "\"([^\"]*)\""],
    ["ClassNames \\=([^;]*);", "\\`([^\\`]*)\\`"]
  ],
```

</details>
<br />

Or just add the wrapper class via `className` prop:

```jsx
function App() {
  return (
    <Email
      className="my-wrapper"
      baseList={baseList}
      domainList={domainList}
      onChange={setEmail}
      value={email}
    />
  );
}
```

And target any child via CSS:

```css
.my-wrapper {
  /* Wrapper */
}

.my-wrapper input {
  /* Input field */
}

.my-wrapper ul {
  /* Dropdown */
}

.my-wrapper li {
  /* Suggestions */
}

.my-wrapper li > span:first-of-type {
  /* Username */
}

.my-wrapper li > span:last-of-type {
  /* Domain */
}
```

### :warning: Basic styles

I decided to ship this package with **zero css** for a couple of reasons:

- Any pre-applied style most likely won't match your website/form appearance and
  I definitely don't want that you find yourself overriding useless styles with `!important`.
- Basic styles to rule positioning and size are just a dozen of CSS properties.
  There's absolutely no need to ship my own class names just for that.

Wheter or not you have CSS resets applied, Email component basic styles should match the following properties:

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

That's enough to see the component in action. Then you can just proceed to the fun part like styling borders, colors and hover effects.

<br />

## :dna: Usage and Behavior

### 1. Basic

Once users start typing, it displays a list of _base_ suggestions and hides it once they type `@` . It already gives a nice UX and should be enough for the vast majority of websites:

![react-email-suggestions](https://i.ibb.co/2hqKpY6/Schermata-2022-09-18-alle-15-18-35.png)

```jsx
import { Email } from 'react-email-suggestions';

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
      onChange={setEmail} // or (value) => setEmail(value)
      value={email}
    />
  );
}
```

### 2. With Refine

Acts like **Basic** until users type `@` . Then as they start typing the domain, it refines the suggestions according to an extended list of domains (like an autocomplete).

![react-email-suggestions](https://i.ibb.co/nCNZvsg/Schermata-2022-09-18-alle-15-18-14.png)

All you have to do is to provide a second array of domains to `refineList` prop. This package already comes with a curated [list]() of the ~160 most popular world domains (thanks to **@mailcheck**):

```jsx
import { Email, domains } from 'react-email-suggestions';

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
      onChange={setEmail}
      value={email}
    />
  );
}
```

Alternatively, you can create your own array of domains or [search]() for the one that better suits your audience.

<br />

### onChange with object state

```jsx
function App() {
  const [payload, setPayload] = useState({
    name: '',
    lastName: '',
    email: '',
  });

  function handleChange(value) {
    setPayLoad((prevData) => ({
      ...prevData,
      email: value,
    }));
  }

  return (
    // ...
    <Email
      className="my-wrapper"
      baseList={baseList}
      onChange={handleChange}
      value={payload.email}
    />
    // ...
  );
}
```

<br />

### Custom onSelect callback

You may have to invoke a callback (e.g. server email validation), everytime a suggestion is selected (either with mouse or keyboard):

```ts
type SelectParam = {
  valueSelected: string;
  withKeyboard: boolean;
  position: number;
};

type OnSelect = (object: SelectParam) => void | Promise<void>;
```

```jsx
import { Email, domains } from 'react-email-suggestions';

function App() {
  const [email, setEmail] = useState('');

  function handleSelect({ valueSelected, withKeyboard, position }) {
    console.log(valueSelected, withKeyboard, position);
  }

  return (
    <Email
      className="my-wrapper"
      baseList={baseList}
      refineList={domains}
      onChange={setEmail}
      onSelect={handleSelect}
      value={email}
    />
  );
}
```

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

# useSuggestion

This hook helps you get and use a suggestion if the supplied email includes typos in the domain by using the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) algorithm.

![react-email-suggestions](https://i.ibb.co/W5qMLxv/Schermata-2022-09-18-alle-14-51-15.png)

## :thinking: How suggestion is evaluated?

### First attempt - Full Domain Search

If the user types an email with a domain not included in the list, it will look for a very similar one among the same list and suggest it.

| Input Email        | Suggestion         | Distance |
| ------------------ | ------------------ | -------- |
| george@`gneil.con` | george@`gmail.com` | 3        |

> `gmail.com` is in your list.

### Last attempt - Extension Search

If there's no domain match (the domain name is presumably correct), it will check if the extension is included in your extension list; if not, it will check if thre's similar one among the same list and suggest it.

| Input Email          | Suggestion           | Distance |
| -------------------- | -------------------- | -------- |
| mandy@react`.con`    | mandy@react`.com`    | 1        |
| mandy@react`.con.bt` | mandy@react`.com.br` | 2        |

> `react.*` is not included in your list but `.com` is. Same for `.com.br`.

This package ships with the ~80 NameCheap's most popular country-code TLDs that you can directy use (or you can create your own).

> :warning: Domains with more than two extensions will be ignored.

<br />

## :dna: Usage

Whenever there's a suggestion available, `suggestion` value will turn from _undefined_ to _string_ (and viceversa). Then just use the value in your UI.

The most obvious usage would be to try to get a suggestion after blur and reset it once focusing or confirming:

```jsx
import { useSuggestion, domains, extensions } from 'react-email-suggestions';

function App() {
  const [value, setValue] = useState('');
  const { suggestion, getSuggestion, resetSuggestion } = useSuggestion(
    domains,
    extensions
  );

  function handleChange(event) {
    setValue(event.target.value);
  }

  function handleBlur(event) {
    if (value.length >= 10) {
      getSuggestion(event.target.value);
    }
  }

  function handleFocus() {
    resetSuggestion();
  }

  function handleConfirm() {
    setValue(suggestion);
    resetSuggestion();
  }

  return (
    <>
      <input
        type="email"
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
      />

      <div style={{ minHeight: 30 }}>
        {suggestion && (
          <>
            Did you mean
            <button type="button" onClick={handleConfirm}>
              {suggestion}
            </button>?
          </>
        )}
      </div>
    </>
  );
}
```

### Usage with Email component

```jsx
import { useSuggestion, domains, extensions } from 'react-email-suggestions';

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

  const { suggestion, getSuggestion, resetSuggestion } = useSuggestion(
    domains,
    extensions
  );

  function handleBlur() {
    if (email.length > 10) {
      getSuggestion(email);
    }
  }

  function handleReset() {
    if (suggestion) {
      resetSuggestion();
    }
  }

  function handleConfirm() {
    setEmail(suggestion);
    resetSuggestion();
  }

  return (
    <>
      <Email
        onBlur={handleBlur}
        onFocus={handleReset}
        baseList={baseList}
        domainList={domains}
        onChange={setEmail}
        value={email}
      />

      <div style={{ minHeight: 30 }}>
        {suggestion && (
          <>
            Did you mean
            <button type="button" onClick={handleConfirm}>
              {suggestion}
            </button>?
          </>
        )}
      </div>
    </>
  );
}
```

## :level_slider: Customizing Options

Although it is not required, you can customize the maximum distance for both domains and extensions:

```jsx
const { suggestion, setSuggestion, resetSuggestion } = useSuggestion(
  domains,
  extensions,
  {
    // Default values
    maxDomainDistance: 3,
    maxExtensionDistance: 2,
  }
);
```

### maxDomainDistance

**Full Domain Search - First Attempt**

By default, for an email containing `gneil.con`, `gmail.com` will be suggested if present in the list.

On the contrary, if set to `2`, `gmail.com` won't be suggested unless the input email contains `gneil.com` and so on.

> :warning: For domain names (without the extension) shorter or equal than 3 chars (like `moz` or `mdn`), the maximum tolerancy is always lowered down to `1`.

---

### maxExtensionDistance

**Extensions Search - Last Attempt**

By default, for an input email containing the extension `,con`, the suggestion will return `.com` if present in your extension list.

On the contrary, if set to `1`, `.com` won't be returned unless the input email contains an extension like `.con`.

> :warning: For extensions shorter or equal than 4 chars (like `.de`), the maximum tolerancy is lowered down to `1`.

<br />

## :open_umbrella: Accessibity

Making accessible the suggestion is extremely simple by using aria live regions:

```jsx
function App() {
  // ...

  return (
    <>
      {/* ... */}

      <div
        aria-live="assertive"
        aria-atomic="true"
        aria-relevant="additions"
        style={{ minHeight: 30 }}
      >
        {suggestion && (
          <>
            Did you mean
            <button type="button" onClick={handleConfirm}>
              {suggestion}
            </button>?<p className="visually-hidden">Click the button to confirm the suggestion.</p>
          </>
        )}
      </div>
    </>
  );
}
```

Whenever new child nodes are added to the container (a suggestion is available), their content will be announced by screen readers.

To dive deeper you can read this [great article](https://almerosteyn.com/2017/09/aria-live-regions-in-react) by Almero Stein.

<br/>

## :dvd: License

MIT Licensed. Copyright (c) Simone Mastromattei 2022.
