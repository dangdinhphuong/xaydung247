Redesign the page "Invoice Template Editor - Visual Mode" to make it cleaner, more modern and professional.

Goal:
Create a professional invoice template builder similar to Notion / Webflow / Shopify editor.

Layout:
Use a clear 3-column layout.

1. Left sidebar (Block Library)
- Width: 260px
- Contains draggable blocks
- Blocks should be displayed as cards with icon + title + description
- Add spacing between blocks (12px)
- Add hover effect and drag indicator
- Group blocks by category:
  - Header
  - Customer Information
  - Invoice Information
  - Product Table
  - Totals
  - Payment Information
- Use subtle background (#F8FAFC)

2. Middle canvas (Template Structure)
- Width: flexible (around 400px)
- Shows the structure of the invoice template as draggable blocks
- Each block should appear as a card with:
  - Title
  - small preview
  - drag handle
  - edit icon
- Add soft shadow and rounded corners
- When a block is selected → highlight with blue border
- Add spacing between blocks (16px)

3. Right panel (Block Settings)
- Width: 320px
- Shows configuration for selected block
- Use grouped sections:
  - Visibility
  - Alignment
  - Size
  - Display Fields
- Use toggle switches and dropdowns
- Add clear section headers

Top toolbar:
Add a top bar with:
- Template name
- View mode toggle (Visual / HTML)
- Paper settings (size, orientation, margin)
- Save button

Invoice preview:
The preview area should look like a real A4 page with:
- subtle page shadow
- centered page
- clear safe margin indicator

Typography:
- Use modern sans-serif font
- Clear hierarchy:
  - Page title: 20px
  - Section title: 14px semibold
  - Content text: 13px

Spacing system:
Use an 8px spacing grid.

Visual style:
- Clean SaaS dashboard style
- Soft shadows
- Rounded corners (8px)
- Minimal borders
- Blue accent color for active elements

Make the UI feel like a modern no-code builder for invoice templates.