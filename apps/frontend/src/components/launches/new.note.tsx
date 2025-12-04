import React, { useCallback, useState } from 'react';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import dayjs from 'dayjs';
import { useCalendar } from '@gitroom/frontend/components/launches/calendar.context';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { AddEditModal } from '@gitroom/frontend/components/new-launch/add.edit.modal';

export const NewNote = () => {
  const fetch = useFetch();
  const modal = useModals();
  const { integrations, reloadCalendarView } = useCalendar();
  const t = useT();
  const [loading, setLoading] = useState(false);

  const createANote = useCallback(async () => {
    setLoading(true);

    try {
      // Check if note integration exists
      let noteIntegration = integrations.find(
        (i) => i.identifier === 'note'
      );

      // If not, enable it first
      if (!noteIntegration) {
        const response = await fetch('/integrations/note/enable', {
          method: 'POST',
        });
        const data = await response.json();

        if (data.id) {
          // Create a temporary integration object for the modal
          noteIntegration = {
            id: data.id,
            name: 'Calendar Notes',
            identifier: 'note',
            picture: '/icons/platforms/note.svg',
            disabled: false,
            inBetweenSteps: false,
            editor: 'normal' as const,
            display: '',
            type: 'social',
            changeProfilePicture: false,
            changeNickName: false,
            additionalSettings: '[]',
            time: [],
          };
        } else {
          setLoading(false);
          return;
        }
      }

      const date = (await (await fetch('/posts/find-slot')).json()).date;

      modal.openModal({
        closeOnClickOutside: false,
        closeOnEscape: false,
        withCloseButton: false,
        removeLayout: true,
        askClose: true,
        classNames: {
          modal: 'w-[100%] max-w-[1400px] bg-transparent text-textColor',
        },
        id: 'add-edit-modal',
        children: (
          <AddEditModal
            allIntegrations={[noteIntegration]}
            reopenModal={createANote}
            mutate={() => {
              reloadCalendarView();
            }}
            integrations={[noteIntegration]}
            selectedChannels={[noteIntegration.id]}
            date={dayjs.utc(date).local()}
          />
        ),
        size: '80%',
        title: ``,
      });
    } finally {
      setLoading(false);
    }
  }, [integrations, fetch, modal, reloadCalendarView]);

  return (
    <button
      onClick={createANote}
      disabled={loading}
      className="text-textColor flex-1 pt-[12px] pb-[14px] ps-[16px] pe-[20px] group-[.sidebar]:p-0 min-h-[44px] max-h-[44px] rounded-md bg-newColColor hover:bg-boxHover border border-newTextColor/10 flex justify-center items-center gap-[5px] outline-none transition-colors"
      data-tooltip-id="tooltip"
      data-tooltip-content={t('add_note', 'Add a note to the calendar')}
    >
      {loading ? (
        <div className="w-[21px] h-[20px] animate-spin rounded-full border-2 border-textColor border-t-transparent" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="min-w-[21px] min-h-[20px]"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
      )}
      <div className="flex-1 text-start text-[16px] group-[.sidebar]:hidden">
        {t('add_note', 'Add Note')}
      </div>
    </button>
  );
};
