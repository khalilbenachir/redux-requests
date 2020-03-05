import {
  success,
  error,
  abort,
  Driver,
  createRequestInstance,
  sendRequest,
  watchRequests,
  networkReducer,
  requestsPromiseMiddleware,
  requestsCacheMiddleware,
  clearRequestsCache,
  serverRequestsFilterMiddleware,
  countServerRequests,
  RequestAction,
} from './index';

success('type');
error('type');
abort('type');

const requestAction: RequestAction = {
  type: 'FETCH',
  request: { url: '/' },
  meta: {
    driver: 'default',
    asPromise: true,
    runByWatcher: false,
    abortOn: ['ABORT'],
    takeLatest: false,
    cache: 1,
    cacheKey: 'key',
    cacheSize: 2,
    dependentRequestsNumber: 1,
    isDependentRequest: true,
    customKey: 'customValue',
    requestKey: '1',
    asMutation: true,
    mutations: {
      FETCH: {
        updateData: () => 'data',
        revertData: () => 'data',
      },
    },
  },
};

let dummyDriver: Driver;
dummyDriver({}, requestAction);

createRequestInstance({ driver: dummyDriver });
createRequestInstance({
  driver: { default: dummyDriver, anotherDriver: dummyDriver },
});

const requestInstanceConfig = {
  driver: dummyDriver,
  onRequest: (request, action) => request,
  onSuccess: (response, action) => response,
  onError: (error, action) => ({ error }),
  onAbort: action => {},
};

createRequestInstance(requestInstanceConfig);

sendRequest(requestAction);
sendRequest({ type: 'type', payload: { request: {} } });
sendRequest({ type: 'type', payload: { request: [{}] } });
sendRequest(
  { type: 'type', request: [{}, {}] },
  {
    dispatchRequestAction: true,
    silent: false,
    runOnRequest: false,
    runOnSuccess: false,
    runOnError: false,
    runOnAbort: false,
  },
);

watchRequests();
watchRequests({
  takeLatest: true,
  abortOn: 'TYPE',
});
watchRequests({ abortOn: ['TYPE'] });

networkReducer({
  isRequestActionQuery: () => true,
  getData: data => data,
  getError: error => error,
});

requestsPromiseMiddleware();
requestsPromiseMiddleware({ auto: true });

requestsCacheMiddleware();

clearRequestsCache();
clearRequestsCache('TYPE');
clearRequestsCache('TYPE', 'ANOTHER_TYPE');

serverRequestsFilterMiddleware({ serverRequestActions: [{ type: 'REQUEST' }] });

countServerRequests({ serverRequestActions: {} });
countServerRequests({ serverRequestActions: {}, finishOnFirstError: false });
