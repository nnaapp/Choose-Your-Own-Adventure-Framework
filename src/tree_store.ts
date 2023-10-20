import { writable } from 'svelte/store';
import { StoryTree } from './tree.ts';
import type { StoryTreeJSON } from './tree.ts';
import * as data from './resources/convertedstory2.json';

let tree = StoryTree.PopulateFromJSON(data as StoryTreeJSON);

export const gameTree = writable(tree);
