import * as fetchingActionType from '~/constants/fetchingActionType';
import { Observable } from 'rxjs';


const _handleRequest = (res) => {

    if (
        200 >= res.status && res.status < 300
        && res.data
    ) {

        const {
            data,
            message,
            STATUS,
            ...meta
        } = res.data;

        if (STATUS === 'ERROR') {
            
            throw new Error(message);
            return;
        }

        return {
            meta,
            payload: {
                data,
                message
            }
        };
    }

    throw new Error(`respone status: ${res.status}`);
};

export default ( key, services, options ) => {

    options = options || {};
    var {
        handleRequest = _handleRequest,
        beforeAction,
        afterAction
    } = options;

    return (action$, store) => {

        return action$
            .ofType(`${key}#${fetchingActionType.FETCH_START}`)
            .mergeMap(action => {

                return  Observable.create(async obs => {

                    try {
                        
                        let service = services;
                        if (action.meta && action.meta.api) {
    
                            service = services[action.meta.api];
                        }
                        const res = await service(...action.payload);

                        const preAction = handleRequest(res);
                        preAction.type = `${key}#${fetchingActionType.FETCHING_SUCCESS}`;
                        if (action.meta) {

                            preAction.meta = {
                                ...action.meta,
                                ...preAction.meta,
                            };
                        }

                        if (beforeAction) {

                            if (typeof beforeAction !== "object") {

                                beforeAction = beforeAction(action, store);
                            }
                            obs.next(beforeAction);
                        }

                        obs.next(preAction);

                        if (afterAction) {

                            if (typeof afterAction !== "object") {

                                afterAction = afterAction(action, store);
                            }
                            obs.next(afterAction);
                        }

                        obs.complete();
                        
                    } catch (error) {

                        obs.next({
                            type: `${key}#${fetchingActionType.FETCHING_ERROR}`,
                            payload: {
                                message: error.message,
                                error: true
                            },
                            error
                        });
                        obs.complete();
                    }
                })
                    .takeUntil(action$.ofType(`${key}#${fetchingActionType.FETCH_START}`))
                    .takeUntil(action$.ofType(`${key}#${fetchingActionType.FETCHING_CANCEL}`))
                    .takeUntil(action$.ofType(`${key}#${fetchingActionType.FETCHING_ERROR}`))
                ;
            });
    };
};