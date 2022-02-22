import { Select } from '@rocket.chat/fuselage';
import React, { ComponentProps, forwardRef } from 'react';

import { FreePaidDropDownGroup } from '../definitions/FreePaidDropDownDefinitions';

const FreePaidDropDownAnchor = forwardRef<HTMLInputElement, Partial<ComponentProps<typeof Select>> & { group?: FreePaidDropDownGroup }>(
	function FreePaidDropDownAnchor(props, ref) {
		const { group } = props;

		const selectedFilter = group?.items.find((item) => item.checked)?.label;

		return <Select ref={ref} placeholder={selectedFilter} options={[]} onChange={(): number => 0} {...props} mie='x8' />;
	},
);

export default FreePaidDropDownAnchor;
