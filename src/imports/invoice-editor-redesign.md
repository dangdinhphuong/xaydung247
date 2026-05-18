Redesign the Invoice Template Editor layout to use ONLY TWO PANELS instead of three.

Remove the 3-column layout.

Use a clean 2-panel SaaS layout:

LEFT PANEL – Editor
RIGHT PANEL – Live Preview

-----------------------------------------
GLOBAL LAYOUT
-----------------------------------------

Use a full-width layout with:

- Left panel: 50% width (Editor)
- Right panel: 50% width (Preview)

Add a draggable vertical divider between panels.

Both panels must have independent scroll.

-----------------------------------------
LEFT PANEL – EDITOR (Visual Mode)
-----------------------------------------

Combine:
- Block library
- Block settings
- Canvas builder

All in ONE unified editor panel.

Structure inside left panel:

Top:
- Template name
- Mode switch (Visual / HTML)
- Paper settings (collapsible)

Below:
If Visual mode:
- Block library collapsible sidebar inside the left panel
- Drag and drop blocks into editable canvas
- Block settings appear inline or in a floating drawer

If HTML mode:
- Full height code editor (Monaco-style)
- Variable insertion tools above editor
- Snippet buttons

Remove the separate middle canvas column.

-----------------------------------------
RIGHT PANEL – PREVIEW
-----------------------------------------

Keep only ONE preview component shared by both modes.

Must include:
- A4 / A5 real proportions
- Print safe area
- Real invoice sample data
- Status badge
- Accurate spacing

Preview must not look like a card inside a card.
Make it centered and clean.

-----------------------------------------
DESIGN RULES
-----------------------------------------

- Remove unnecessary background cards in the editor.
- Use subtle dividers.
- Keep header fixed at top.
- Improve spacing and alignment.
- Maintain professional SaaS appearance.

-----------------------------------------
RESPONSIVE
-----------------------------------------

Tablet:
- Editor 60%
- Preview 40%

Mobile:
- Switch to tab-based:
  [ Editor ] [ Preview ]
  One visible at a time.

Ensure consistency between Visual and HTML modes.