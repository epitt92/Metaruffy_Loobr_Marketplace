import { Subject, ReplaySubject } from 'rxjs'

export const NotificationAction = (() => {
	const rtcEvents$ = new Subject<Object>()
	return {
		triggerAction: (status = {}) => rtcEvents$.next(status),
		listen: rtcEvents$,
	}
})()