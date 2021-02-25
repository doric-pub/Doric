#include "DoricLayout.h"

void DoricLayout::apply(int frameSizeWidth, int frameSizeHeight) {
  this->resolved = false;
  this->measure(frameSizeWidth, frameSizeHeight);
}

void DoricLayout::apply() {}

void DoricLayout::measure(int targetSizeWidth, int targetSizeHeight) {}
