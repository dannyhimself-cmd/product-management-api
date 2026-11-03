import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const res = ctx.getResponse();
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] | unknown = 'Internal server error!';

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse) {
                message = exceptionResponse.message;
            }
            else if (typeof exceptionResponse === 'string') { message = exceptionResponse }
            else {
                message = 'Internal server error!';
            }
        }
        else message = 'Internal server error!';

        res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
            timestamp: new Date().toISOString(),
            path: req.url
        })
    }
}