import {ExplicitRegion} from '../region/explicit/explicit.region';
import {CommentRegion} from '@core/node/region/comment/comment.region';

const map = new Map();
map.set('explicit.region', ExplicitRegion);
map.set('comment.region', CommentRegion);
export const regionMap = map;
