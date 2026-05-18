Redesign the Invoice Template Editor to become a modern visual builder with a large editing canvas and direct manipulation editing (similar to Webflow or Framer).

Current problems:
- The "Live Preview" area is too small and does not use screen space efficiently.
- Editing requires using side panels instead of interacting with the preview directly.
- The editor does not feel like a visual design tool.

Goal:
Transform the editor into a WYSIWYG invoice layout builder where users can visually design the invoice directly on the canvas.

Layout Requirements

Use a 4-column editor layout similar to modern design tools.

Left Sidebar (Navigation)
Width: 72px
Contains main navigation icons:
Dashboard
Invoices
Customers
Products
Reports
Settings

Block Library Panel
Width: 260px
Contains draggable components grouped by category:

Header
Company Info
Invoice Title
Invoice Info

Customer Info
Customer Details

Content
Product Table
Totals
Payment Info

Footer
Signature
Footer Note

Blocks must be draggable into the canvas.

Structure Panel
Width: 260px
Shows the hierarchical structure of the invoice layout.

Users can:
Reorder blocks
Hide/show blocks
Select blocks

Main Canvas (Preview)
This is the main workspace.

Canvas must take all remaining screen width (minimum 65% of screen).

The invoice page should appear centered on a gray background like a design canvas.

Canvas behavior:
Zoom controls (50%, 75%, 100%, Fit width)
Pan when zoomed
Auto-center the invoice page

Editing Interaction (WYSIWYG)

Users must be able to edit directly on the canvas.

Text Editing
Click any text to edit inline.
Support cursor editing like a document editor.

Block Selection
Hover a block → show blue outline
Click block → select it

When selected show quick toolbar:
Move
Duplicate
Delete
Edit settings

Drag and Drop
Blocks must be draggable:

From Block Library → Canvas
Within Canvas → reorder
From Structure Panel → reorder

Drop indicators should appear between blocks.

Visual Feedback
Hover: light blue outline
Selected: strong blue outline
Drag: show placeholder position

Inspector Panel (Right)

When a block is selected, show a settings inspector panel.

Width: 300px

Inspector includes:
Typography settings
Spacing
Alignment
Border
Visibility
Dynamic data bindings

Example:
Company Name
Customer Name
Invoice Date
Invoice Number
Product Rows
Totals

Responsive UX Improvements

Reduce padding in side panels.
Avoid large empty whitespace.
The canvas must visually dominate the screen.

The editor must feel like a design tool, not a form.

Interaction Inspiration

Use interaction patterns similar to:

Webflow Editor
Framer Builder
Notion Page Builder
Shopify Theme Editor

User Experience Goal

Users should be able to build and customize an invoice layout visually without touching code.

The canvas must feel like the primary editing surface.
Side panels are only supporting tools.