#include "DoricAsyncResult.h"

DoricAsyncResult::DoricAsyncResult() {}

void DoricAsyncResult::setResult(QString result) { this->result = result; }

void DoricAsyncResult::setError(QString exception) { this->result = exception; }

bool DoricAsyncResult::hasResult() { return !(result == EMPTY); }

QJSValue DoricAsyncResult::getResult() { return this->result; }

DoricSettableFuture *DoricAsyncResult::synchronous() { return NULL; }
