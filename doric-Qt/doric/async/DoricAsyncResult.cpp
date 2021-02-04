#include "DoricAsyncResult.h"

DoricAsyncResult::DoricAsyncResult() {}

DoricAsyncResult::DoricAsyncResult(QJSValue result) { this->result = result; }

void DoricAsyncResult::setResult(QJSValue result) {
  this->result = result;
  if (this->callback != NULL) {
    this->callback->onResult(result);
    this->callback->onFinish();
  }
}

void DoricAsyncResult::setError(QJSValue exception) {
  this->result = exception;
  if (this->callback != NULL) {
    this->callback->onResult(result);
    this->callback->onFinish();
  }
}

bool DoricAsyncResult::hasResult() { return !result.equals(EMPTY); }

QJSValue DoricAsyncResult::getResult() { return this->result; }

void DoricAsyncResult::setCallback(DoricCallback *callback) {
  this->callback = callback;
  if (this->result.isError()) {
    this->callback->onError(result);
    this->callback->onFinish();
  } else if (!result.equals(EMPTY)) {
    this->callback->onResult(result);
    this->callback->onFinish();
  }
}

DoricSettableFuture *DoricAsyncResult::synchronous() { return NULL; }
