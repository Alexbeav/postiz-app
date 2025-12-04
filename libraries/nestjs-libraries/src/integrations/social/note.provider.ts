import {
  AuthTokenDetails,
  PostDetails,
  PostResponse,
  SocialProvider,
} from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { makeId } from '@gitroom/nestjs-libraries/services/make.is';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
import { Integration } from '@prisma/client';

/**
 * NoteProvider is a special internal provider for calendar notes.
 * Notes are not posted anywhere - they simply appear on the calendar
 * as reminders or information for the team.
 */
export class NoteProvider extends SocialAbstract implements SocialProvider {
  identifier = 'note';
  name = 'Note';
  isBetweenSteps = false;
  scopes: string[] = [];
  editor = 'normal' as const;

  // Notes have no character limit
  maxLength() {
    return 10000;
  }

  // Notes don't need OAuth - they're internal
  async refreshToken(refreshToken: string): Promise<AuthTokenDetails> {
    return {
      refreshToken: '',
      expiresIn: 0,
      accessToken: 'note-internal',
      id: 'note',
      name: 'Note',
      picture: '',
      username: 'note',
    };
  }

  async generateAuthUrl() {
    const state = makeId(6);
    return {
      url: '',
      codeVerifier: makeId(10),
      state,
    };
  }

  // Direct authentication for notes - creates an internal integration
  async authenticate(params: {
    code: string;
    codeVerifier: string;
    refresh?: string;
  }): Promise<AuthTokenDetails> {
    const id = makeId(20);
    return {
      refreshToken: '',
      expiresIn: 0,
      accessToken: 'note-internal-' + id,
      id: 'note-' + id,
      name: 'Calendar Notes',
      picture: '',
      username: 'note',
    };
  }

  // Notes don't post anywhere - just mark as completed immediately
  async post(
    id: string,
    accessToken: string,
    postDetails: PostDetails[],
    integration: Integration
  ): Promise<PostResponse[]> {
    return postDetails.map((p) => ({
      id: p.id,
      postId: 'note-' + p.id,
      status: 'completed',
      releaseURL: '', // Notes have no external URL
    }));
  }
}
