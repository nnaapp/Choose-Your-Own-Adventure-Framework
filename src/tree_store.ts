import { writable } from 'svelte/store';
import { StoryTree } from './tree.js';
import type { StoryTreeJSON } from './tree.ts';
import * as data from './resources/readablestory.json';

// console.log(data);
// let trees = new StoryTree();
let trees = StoryTree.PopulateFromJSON(data as StoryTreeJSON);
let selectedTree = 0;

export const gameTree = writable(trees);
export const currentTreeIndex = writable(selectedTree);
