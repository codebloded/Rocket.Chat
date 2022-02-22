import { useSafely } from '@rocket.chat/fuselage-hooks';
import { useEffect, useState } from 'react';

import { IRegistrationInfo } from '../../../../definition/voip/IRegistrationInfo';
import { useEndpoint } from '../../../contexts/ServerContext';
import { useUser } from '../../../contexts/UserContext';
import { SimpleVoipUser } from '../../../lib/voip/SimpleVoipUser';
import { VoIPUser } from '../../../lib/voip/VoIPUser';
import { useWebRtcServers } from './useWebRtcServers';

type UseVoipClientResult = UseVoipClientResultResolved | UseVoipClientResultError | UseVoipClientResultLoading;

type UseVoipClientResultResolved = {
	voipClient: VoIPUser;
	registrationInfo: IRegistrationInfo;
};
type UseVoipClientResultError = { error: Error };
type UseVoipClientResultLoading = Record<string, never>;

export const isUseVoipClientResultError = (result: UseVoipClientResult): result is UseVoipClientResultError =>
	!!(result as UseVoipClientResultError).error;

export const isUseVoipClientResultLoading = (result: UseVoipClientResult): result is UseVoipClientResultLoading =>
	!result || !Object.keys(result).length;

export const useVoipClient = (): UseVoipClientResult => {
	const registrationInfo = useEndpoint('GET', 'connector.extension.getRegistrationInfoByUserId');
	const user = useUser();
	const iceServers = useWebRtcServers();

	const [result, setResult] = useSafely(useState<UseVoipClientResult>({}));

	useEffect(() => {
		if (!user || !user?._id) {
			setResult({});
			return;
		}
		registrationInfo({ id: user._id }).then(
			(data) => {
				const {
					extensionDetails: { extension, password },
					host,
					callServerConfig: { websocketPath },
				} = data;
				let client: VoIPUser;
				(async (): Promise<void> => {
					try {
						client = await SimpleVoipUser.create(extension, password, host, websocketPath, iceServers, 'video');
						setResult({ voipClient: client, registrationInfo: data });
					} catch (e) {
						setResult({ error: e as Error });
					}
				})();
			},
			(error) => {
				setResult({ error: error as Error });
			},
		);
		return (): void => {
			// client?.disconnect();
			// TODO how to close the client? before creating a new one?
		};
	}, [user, iceServers, registrationInfo, setResult]);

	return result;
};
