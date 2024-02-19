# Requirements
Svelte

Typescript (https://svelte.dev/blog/svelte-and-typescript)

Python (for CSV to JSON parser)

# Using CSV to JSON Converter

story_csv_to_json.py in the tools directory can convert a CSV (formatted a specific way) to a JSON containing story data.

## Usage
```bash
python3 story_csv_to_json.py <tree_csv_dir> <types_csv_dir> <output_json_dir>
```
See the tools/examples directory for examples.

# Using Svelte

## Running

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
