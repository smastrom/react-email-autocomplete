# React Email Autocomplete

![npm](https://img.shields.io/npm/v/@smastrom/react-email-autocomplete?color=46c119) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/react-email-autocomplete/tests.yml?branch=main&label=tests)
![dependency-count](https://img.shields.io/badge/dependency%20count-0-success)

| Before typing `@`                                                                                       | After typing `@` (optional)                                                                             |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ![@smastrom/react-email-autocomplete](https://i.ibb.co/SNTkHJQ/Screenshot-2022-12-07-alle-13-50-59.png) | ![@smastrom/react-email-autocomplete](https://i.ibb.co/DWQBQw7/Screenshot-2022-12-07-alle-13-54-23.png) |

<br />

**React Email Autocomplete** is an unstyled, zero-dependency component inspired by some european flight booking websites. As soon as users start typing their email address, it will suggest the most common email providers.

- Completely unstyled and white labeled (ships with zero CSS)
- Fully accessible with superlative keyboard controls
- Forward any event and attribute to the `<input />` element or control it with React Hook Form

[Demo and examples](https://@smastrom/react-email-autocomplete.netlify.app) — [Stackblitz](https://stackblitz.com/edit/react-4kufqv?file=src/App.js) — [NextJS](https://stackblitz.com/edit/stackblitz-starters-f36nmm?file=app%2Fpage.tsx)

<br />

## :floppy_disk: Installation

```bash
pnpm add @smastrom/react-email-autocomplete
# npm i @smastrom/react-email-autocomplete
# yarn add @smastrom/react-email-autocomplete
```

<br />

## :art: Usage / Styling

The component renders a single `div` with a very simple structure:

```js
Wrapper — div
├── Email Input Field — input
└── Dropdown — ul
    └── Suggestions - li[]
        └──[username - span:first-of-type] [@domain.com - span:last-of-type]
```

Specify `classNames` for each element you'd like to style:

```jsx
import { Email } from '@smastrom/react-email-autocomplete'

const classNames = {
  wrapper: 'my-wrapper',
  input: 'my-input',
  dropdown: 'my-dropdown',
  suggestion: 'my-suggestion',
  username: 'my-username',
  domain: 'my-domain',
}

const baseList = ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'msn.com']

function App() {
  const [email, setEmail] = useState('')

  return (
    <Email
      classNames={classNames}
      baseList={baseList}
      onChange={setEmail} // or (newValue) => customSetter(newValue)
      value={email}
    />
  )
}
```

<details><summary><strong>NextJS App Router</strong></summary>
<br />

`components/Email.tsx`

```tsx
'use client'

import { useState } from 'react'
import { Email as EmailAutocomplete } from '@smastrom/react-email-autocomplete'

const classNames = {
  wrapper: 'my-wrapper',
  input: 'my-input',
  dropdown: 'my-dropdown',
  suggestion: 'my-suggestion',
  username: 'my-username',
  domain: 'my-domain',
}

const baseList = ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'msn.com']

export function Email() {
  const [email, setEmail] = useState('')

  return (
    <EmailAutocomplete
      classNames={classNames}
      baseList={baseList}
      onChange={setEmail} // or (newValue) => customSetter(newValue)
      value={email}
    />
  )
}
```

`app/page.tsx`

```tsx
import { Email } from '@/components/Email'

export default function Home() {
  return (
    <main>
      {/* ... */}
      <Email />
      {/* ... */}
    </main>
  )
}
```

</details>

<details><summary><strong>TypeScript</strong></summary>
<br />

```ts
import type { ClassNames } from '@smastrom/react-email-autocomplete'

const myClassNames: ClassNames = {
  wrapper: 'my-wrapper',
  input: 'my-input',
}
```

</details>

<details><summary><strong>Tailwind Intellisense</strong></summary>
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

Although you can target the pseudo classes `:hover` and `:focus`, it is recommended instead to target the attribute `data-active-email` in order to avoid `:hover` styles to be applied to a suggestion as soon as the dropdown is opened (in case the cursor is hovering it).

```css
.my-suggestion[data-active-email='true'] {
  background-color: aliceblue;
}

.my-suggestion:focus {
  outline: none;
}
```

The attribute name can also be customized via `activeDataAttr` prop:

```jsx
<Email
  activeDataAttr="data-custom-attr"
  classNames={{
    ...classNames,
    suggestion: 'my-suggestion',
  }}
  baseList={baseList}
  value={email}
/>
```

```css
.my-suggestion[data-custom-attr='true'] {
  background-color: aliceblue;
}
```

## :dna: Modes

### 1. Basic Mode

Once users start typing, it displays a list of _base_ suggestions and hides it once they type `@` . It already gives a nice UX and should be enough for the vast majority of websites:

| Before typing `@`                                                                                       | After typing `@`                                                                                        |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ![@smastrom/react-email-autocomplete](https://i.ibb.co/SNTkHJQ/Screenshot-2022-12-07-alle-13-50-59.png) | ![@smastrom/react-email-autocomplete](https://i.ibb.co/ZgWCPkg/Screenshot-2022-12-07-alle-13-52-46.png) |

```jsx
import { Email } from '@smastrom/react-email-autocomplete'

const baseList = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'aol.com',
  'msn.com',
  'proton.me',
]

function App() {
  const [email, setEmail] = useState('')

  return (
    <Email
      baseList={baseList}
      onChange={setEmail} // or (newValue) => customSetter(newValue)
      value={email}
    />
  )
}
```

### 2. Refine Mode (optional)

Acts like **Basic Mode** until users type `@` . Then as they start typing the domain, it starts refining suggestions according to an extended list of domains.

| Before typing `@`                                                                                       | After typing `@`                                                                                        |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ![@smastrom/react-email-autocomplete](https://i.ibb.co/SNTkHJQ/Screenshot-2022-12-07-alle-13-50-59.png) | ![@smastrom/react-email-autocomplete](https://i.ibb.co/DWQBQw7/Screenshot-2022-12-07-alle-13-54-23.png) |

All you have to do is to provide a second array of domains to `refineList` prop. This package ships with a [curated list](https://github.com/smastrom/@smastrom/react-email-autocomplete/blob/main/src/domains.json) of the ~160 most popular world domains that you can directly import and use (thanks to **@mailcheck**):

```jsx
import { Email, domains } from '@smastrom/react-email-autocomplete'

const baseList = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'aol.com',
  'msn.com',
  'proton.me',
]

function App() {
  const [email, setEmail] = useState('')

  return (
    <Email
      baseList={baseList}
      refineList={domains}
      onChange={setEmail} // or (newValue) => customSetter(newValue)
      value={email}
    />
  )
}
```

Alternatively, you can use your own array of domains or [search]() for the one that best suits your audience.

<br />

## :globe_with_meridians: Localization

This package ships with an optional hook that simplifies managing different lists of domains according to the [browser's locale](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language).

**1 - Create an object and define lists for each browser locale:**

```js
export const emailProviders = {
  default: [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'aol.com',
    // ...
  ],
  it: [
    'gmail.com',
    'yahoo.com',
    'yahoo.it',
    'tiscali.it',
    // ...
  ],
  'it-CH': [
    'gmail.com',
    'outlook.com',
    'bluewin.ch',
    'gmx.de',
    // ...
  ],
}
```

<details><summary><strong>TypeScript</strong></summary>
<br />

```ts
import type { LocalizedList } from '@smastrom/react-email-autocomplete'

export const emailProviders: LocalizedList = {
  default: [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'aol.com',
    // ...
  ],
  // ...
}
```

</details>

You may define [lang codes](https://www.localeplanet.com/icu/iso639.html) with or without country codes.

For languages without country code (such as `it`), by default it will match all browser locales beginning with it such as `it`, `it-CH`, `it-IT` and so on.

For languages with country code (`it-CH`) it will match `it-CH` but not `it` or `it-IT`.

If you define both `it-CH` and `it`, `it-CH` will match only `it-CH` and `it` will match `it`, `it-IT` and so on.

**2 - Use the hook:**

```jsx
import { Email, useLocalizedList } from '@smastrom/react-email-autocomplete'
import { emailProviders } from '@/src/static/locales'

function App() {
  const baseList = useLocalizedList(emailProviders)
  const [email, setEmail] = useState('')

  return (
    <Email
      baseList={baseList}
      onChange={setEmail} // or (newValue) => customSetter(newValue)
      value={email}
    />
  )
}
```

### Usage with internationalization frameworks or SSR

To manually set the locale, pass its code as second argument:

```jsx
import { useRouter } from 'next/router'
import { emailProviders } from '@/src/static/locales'
import { Email, useLocalizedList } from '@smastrom/react-email-autocomplete'

function App() {
  const { locale } = useRouter()
  const baseList = useLocalizedList(emailProviders, locale)

  const [email, setEmail] = useState('')

  return (
    <Email
      baseList={baseList}
      onChange={setEmail} // or (newValue) => customSetter(newValue)
      value={email}
    />
  )
}
```

Or with NextJS App router:

`components/Email.tsx`

```tsx
'use client'

import {
  Email as EmailAutocomplete,
  useLocalizedList,
} from '@smastrom/react-email-autocomplete'
import { emailProviders } from '@/static/locales'

export function Email({ lang }: { lang: string }) {
  const baseList = useLocalizedList(emailProviders, lang)
  const [email, setEmail] = useState('')

  return (
    <EmailAutocomplete
      classNames={classNames}
      baseList={baseList}
      onChange={setEmail}
      value={email}
    />
  )
}
```

`app/page.tsx`

```tsx
import { Email } from '@/components/Email'
import { headers } from 'next/headers'

export default function Home() {
  const headersList = headers()
  const lang = headersList.get('accept-language')?.split(',')[0]

  return (
    <main>
      <Email lang={lang} />
    </main>
  )
}
```

<br />

## :8ball: onSelect callback

To invoke a callback everytime a suggestion is selected (either with mouse or keyboard), pass a callback to `onSelect` prop:

```jsx
import { Email } from '@smastrom/react-email-autocomplete'

function handleSelect(data) {
  console.log(data) // { value: 'johndoe@gmail.com', keyboard: true, position: 0 }
}

function App() {
  const [email, setEmail] = useState('')

  return (
    <Email
      baseList={baseList}
      onChange={setEmail} // or (newValue) => customSetter(newValue)
      onSelect={handleSelect}
      value={email}
    />
  )
}
```

<details><summary><strong>Type Definition</strong></summary>
<br/>

```ts
type OnSelectData = {
  value: string
  keyboard: boolean
  position: number
}

type OnSelect = (object: OnSelectData) => void | Promise<void>
```

</details>

<br />

## :cyclone: Props

| Prop           | Description                                           | Type                                   | Default   | Required           |
| -------------- | ----------------------------------------------------- | -------------------------------------- | --------- | ------------------ |
| `value`        | State or portion of state that holds the email value  | _string_                               | undefined | :white_check_mark: |
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

:bulb: React's `ref` and any other `HTMLInputElement` attribute can be passed as prop to the component and it will be forwarded to the input element.

<br />

## :keyboard: Keyboard controls

- **↑ ↓** - Navigate through suggestions / input
- **← →** - Move cursor and focus the input field while keeping list open
- **Backspace / Alphanumeric keys** - Edit the input value and keep refining suggestions
- **Enter / Space** - Confirm the suggestion
- **Escape** - Close the list and focus the input field
- **Tab / Shift + Tab** - Close the list and go to next/prev focusable input

<br />

## React Hook Form

No special configuration needed, it just works. Just follow the official React Hook Form's [Controller documentation](https://react-hook-form.com/api/usecontroller/controller).

<br />

## :dvd: License

MIT
