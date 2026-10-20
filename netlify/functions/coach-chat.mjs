import {createHandlers} from '../../server/coach.mjs';
export default request=>createHandlers().chat(request);
export const config={rateLimit:{windowLimit:12,windowSize:60,aggregateBy:'domain'}};
