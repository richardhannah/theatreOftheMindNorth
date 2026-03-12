---
name: promotedev
description: Promote the /dev routes to become the root (/) routes, making the dev site the live site.
user_invocable: true
---

# Promote Dev to Production

This skill promotes the `/dev` route to become the root `/` route, making the in-progress dev site the live production site.

## Steps

1. **Update `src/App.jsx`:**
   - Change the Dev layout route from `path="/dev"` to `path="/"`
   - Remove the old root route (the placeholder Home component) if it exists
   - Keep all nested child routes under the Dev layout unchanged

2. **Update `src/components/Header/Header.jsx`:**
   - Strip the `/dev` prefix from ALL `<Link to="...">` paths in the nav menubar
   - e.g. `/dev/recap` becomes `/recap`, `/dev/house-rules` becomes `/house-rules`
   - The Home link should point to `/`
   - The logo link should remain as `/`

3. **Verify the build:**
   - Run `npm run build` and confirm no errors

4. **After promotion, the /dev route is now available again for future development.**
   - If new dev work is needed, re-add a `/dev` route in App.jsx pointing to a new Dev layout
   - Update Header links to use `/dev/...` prefixes for the dev version

## Key files
- `src/App.jsx` - Route definitions
- `src/components/Header/Header.jsx` - Navigation links
