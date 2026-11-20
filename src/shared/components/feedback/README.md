# Loading feedback

Use these shared components for every new asynchronous UI state. Avoid visible text such as "Loading..." or "Please wait...".

## Component selection

- **Initial page or section data:** use a layout-matching composition from `LoadingStates.tsx` (or add a new composition there).
- **Small independent request:** use `Spinner` beside the affected control or content.
- **Form submission / mutation:** use `LoadingButton` or `Spinner` inside the submitting button. Keep the action label stable.
- **Tables and collections:** preserve the surrounding page layout and use row/card skeletons.
- **Refreshing existing data:** keep the current data visible when practical; indicate activity only in the affected region.

## Accessibility and motion

- Mark loading regions with `aria-busy="true"` and provide an accessible label.
- Keep visual loading feedback free of explanatory text.
- The shimmer and spinner respect `prefers-reduced-motion`.
- Keep skeleton dimensions close to the final content to avoid layout shifts.

Add reusable, domain-specific skeleton compositions to `LoadingStates.tsx`; keep the low-level primitives in this folder.
