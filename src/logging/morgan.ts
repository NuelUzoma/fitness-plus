import * as morgan from 'morgan';
import { logger } from 'src/logging/logger';


const stream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};

const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream }
);


export { morganMiddleware }