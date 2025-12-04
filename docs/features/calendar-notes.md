# Calendar Notes Feature

Calendar Notes allow teams to add internal notes directly to the Postiz calendar. Unlike regular posts, notes are never published to any social media platform - they simply appear on the calendar as reminders or information visible to all team members.

## Overview

Notes function like scheduled posts but without an external destination. They're useful for:

- Team reminders and deadlines
- Content planning annotations
- Campaign coordination notes
- Internal communication tied to specific dates/times

## Usage

### Adding a Note

1. In the calendar view, click the **"Add Note"** button in the left sidebar
2. Write your note content in the editor
3. Set the desired date and time
4. Click Schedule/Save

The note will appear on the calendar at the scheduled time, visible to all team members with access to the calendar.

### Visual Identification

Notes are visually distinct from regular posts:
- Display a **notepad icon** instead of a social media platform icon
- Show **"Note:"** prefix in the calendar item
- Use a distinct indigo color scheme

### Note States

Notes follow the same state model as posts:
- **Draft**: Not yet scheduled
- **Scheduled**: Will appear at the specified time
- **Published**: The scheduled time has passed (notes are automatically marked published)

## Technical Details

### Architecture

Notes are implemented as a special internal integration type:

```
Provider: NoteProvider
Identifier: 'note'
Type: Internal (hidden from integration list)
```

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| NoteProvider | `libraries/nestjs-libraries/src/integrations/social/note.provider.ts` | Backend provider that handles note "publishing" |
| NewNote | `apps/frontend/src/components/launches/new.note.tsx` | Frontend button component |
| Note Icon | `apps/frontend/public/icons/platforms/note.svg` | Visual icon asset |

### API Endpoints

#### Enable Note Integration

```
POST /integrations/note/enable
```

Enables the note integration for the current organization. Called automatically when a user clicks "Add Note" for the first time.

**Response:**
```json
{
  "id": "integration-id",
  "existing": false
}
```

### Database

Notes use the existing `Post` model with:
- `integrationId` pointing to the org's note integration
- `providerIdentifier` = `'note'`
- No `releaseURL` (notes have no external destination)

### Publishing Behavior

When a note's scheduled time arrives:
1. The worker picks up the post job
2. Detects `providerIdentifier === 'note'`
3. Immediately marks the post as published
4. No external API calls are made
5. No notifications are sent

## Configuration

Notes are enabled by default for all organizations. No additional configuration is required.

### Channel Limits

Notes do **not** count against an organization's channel limits. The note integration is a special internal integration that exists outside the billing/subscription model.

## Differences from Regular Posts

| Feature | Regular Post | Note |
|---------|-------------|------|
| External publishing | Yes | No |
| Platform icon | Social media | Notepad |
| Release URL | Yes | No |
| Analytics | Yes | No |
| Character limits | Platform-specific | 10,000 |
| Channel limit | Counts | Doesn't count |
| Notifications | Yes | No |

## Future Enhancements

Potential improvements for the notes feature:

- [ ] Note-specific color coding
- [ ] Note categories/tags
- [ ] Note templates
- [ ] Note comments/replies
- [ ] Note assignments to team members
- [ ] Note completion checkboxes
- [ ] Recurring notes
