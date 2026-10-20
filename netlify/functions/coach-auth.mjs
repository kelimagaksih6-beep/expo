import {createHandlers} from '../../server/coach.mjs';
export default request=>createHandlers().auth(request);
export const config={rateLimit:{windowLimit:10,windowSize:600,aggregateBy:'domain'}};
