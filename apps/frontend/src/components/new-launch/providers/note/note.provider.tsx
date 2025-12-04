'use client';

import { FC } from 'react';
import {
  PostComment,
  withProvider,
} from '@gitroom/frontend/components/new-launch/providers/high.order.provider';

/**
 * Note provider - a simple internal provider for calendar notes.
 * Notes don't post anywhere, they just appear on the calendar.
 * No settings needed, just the content editor.
 */
const SettingsComponent: FC = () => {
  return null;
};

export default withProvider({
  postComment: PostComment.POST,
  minimumCharacters: [],
  SettingsComponent: SettingsComponent,
  CustomPreviewComponent: undefined,
  dto: undefined,
  checkValidity: async () => true,
  maximumCharacters: 10000,
});
