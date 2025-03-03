import { Tabs, Box, Accordion } from '@rocket.chat/fuselage';
import React, { memo, useMemo, useState } from 'react';

import type { ISetting } from '../../../../../definition/ISetting';
import Page from '../../../../components/Page';
import { useEditableSettingsGroupSections } from '../../../../contexts/EditableSettingsContext';
import { useTranslation, TranslationKey } from '../../../../contexts/TranslationContext';
import GroupPage from '../GroupPage';
import Section from '../Section';
import VoipExtensionsPage from './voip/VoipExtensionsPage';

function VoipGroupPage({ _id, ...group }: ISetting): JSX.Element {
	const t = useTranslation();

	const tabs = ['Server_Configuration', 'Extensions'];

	const [tab, setTab] = useState(tabs[0]);
	const handleTabClick = useMemo(() => (tab: string) => (): void => setTab(tab), [setTab]);
	const sections = useEditableSettingsGroupSections('Call_Center', tab);

	if (!tab && tabs[0]) {
		setTab(tabs[0]);
	}

	const tabsComponent = (
		<Tabs>
			{tabs.map((tabName) => (
				<Tabs.Item key={tabName || ''} selected={tab === tabName} onClick={handleTabClick(tabName)}>
					{tabName ? t(tabName as TranslationKey) : t(_id as TranslationKey)}
				</Tabs.Item>
			))}
		</Tabs>
	);

	return (
		<GroupPage _id={_id} {...group} tabs={tabsComponent} isCustom={true}>
			{tab === 'Extensions' ? (
				<VoipExtensionsPage />
			) : (
				<Page.ScrollableContentWithShadow>
					<Box marginBlock='none' marginInline='auto' width='full' maxWidth='x580'>
						<Accordion className='page-settings'>
							{sections.map((sectionName) => (
								<Section key={sectionName || ''} groupId={_id} sectionName={sectionName} tabName={tab} solo={false} />
							))}
						</Accordion>
					</Box>
				</Page.ScrollableContentWithShadow>
			)}
		</GroupPage>
	);
}

export default memo(VoipGroupPage);
