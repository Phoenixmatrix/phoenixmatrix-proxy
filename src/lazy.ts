import {Observable, Observer} from 'rxjs';

type Factory<T> = () => T;

function lazy<T>(factory: Factory<T>): Observable<T> {
  const source$: Observable<T> = Observable.create((subscriber: Observer<T>) => {
    subscriber.next(factory());
    subscriber.complete();
  })

  return source$.publishReplay().refCount();
}

export default lazy;
