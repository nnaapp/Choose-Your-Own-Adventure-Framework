import { writable } from 'svelte/store';
import { StoryTree } from './tree.js';
import type { StoryTreeJSON } from './tree.ts';
import * as data from './resources/alternatestory.json';

let tree = StoryTree.PopulateFromJSON(data as StoryTreeJSON);

export const gameTree = writable(tree);
