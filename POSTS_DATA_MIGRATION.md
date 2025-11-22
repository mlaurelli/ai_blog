# Posts Data Migration Plan

## Problem
The current `posts.ts` file exports a static const array that gets compiled into the bundle by Turbopack at build time. Runtime modifications to the file don't take effect until server restart.

## Solution
Convert to dynamic file reading so changes take effect immediately.

## Option 1: JSON File (Recommended)
- Move posts data to `posts.json`
- Update `posts.ts` to read from JSON file at runtime
- Simpler, cleaner, no TypeScript compilation needed

## Option 2: Keep TypeScript but Read Dynamically
- Use dynamic import() to re-read the file each time
- More complex, still involves TypeScript compilation

## Implementation Status
The current CMS update logic writes to `posts.ts` correctly, but Next.js serves the compiled version which doesn't update until server restart.
