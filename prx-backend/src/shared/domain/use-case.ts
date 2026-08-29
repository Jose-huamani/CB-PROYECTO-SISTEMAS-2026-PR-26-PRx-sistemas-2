export interface UseCase<TRequest = void, TResponse = void> {
  execute(request: TRequest): Promise<TResponse>;
}
