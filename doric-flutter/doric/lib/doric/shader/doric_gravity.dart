class DoricGravity {
  static var DoricGravitySpecified = 1;
  static var DoricGravityStart = 1 << 1;
  static var DoricGravityEnd = 1 << 2;
  static var DoricGravityShiftX = 0;
  static var DoricGravityShiftY = 4;
  static var DoricGravityLeft =
      (DoricGravityStart | DoricGravitySpecified) << DoricGravityShiftX;
  static var DoricGravityRight =
      (DoricGravityEnd | DoricGravitySpecified) << DoricGravityShiftX;
  static var DoricGravityTop =
      (DoricGravityStart | DoricGravitySpecified) << DoricGravityShiftY;
  static var DoricGravityBottom =
      (DoricGravityEnd | DoricGravitySpecified) << DoricGravityShiftY;
  static var DoricGravityCenterX = DoricGravitySpecified << DoricGravityShiftX;
  static var DoricGravityCenterY = DoricGravitySpecified << DoricGravityShiftY;
  static var DoricGravityCenter = DoricGravityCenterX | DoricGravityCenterY;

  int gravity;

  DoricGravity(int gravity) {
    this.gravity = gravity;
  }

  bool isLeft() {
    return isStatus(DoricGravityLeft);
  }

  bool isRight() {
    return isStatus(DoricGravityRight);
  }

  bool isCenterX() {
    return isStatus(DoricGravityCenterX);
  }

  bool isTop() {
    return isStatus(DoricGravityTop);
  }

  bool isBottom() {
    return isStatus(DoricGravityBottom);
  }

  bool isCenterY() {
    return isStatus(DoricGravityCenterY);
  }

  bool isCenter() {
    return isStatus(DoricGravityCenter);
  }

  bool isStatus(int status) {
    return status & gravity == status;
  }
}
