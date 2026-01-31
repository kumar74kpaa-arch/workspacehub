import {createNextHandler} from '@genkit-ai/next';
import '@/ai/flows/suggest-optimal-workspace';

export const {GET, POST} = createNextHandler();
