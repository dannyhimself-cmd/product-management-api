import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(map(data => {
            if(typeof data === 'object' && data !== null && 'data' in data) {
                return data;
            }

            return { data }
        }));
    }
}