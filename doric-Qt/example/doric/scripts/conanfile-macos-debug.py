from conans import ConanFile

class DoricCore(ConanFile):
    license = "MIT"
    name = "DoricCore"
    settings = "os", "compiler", "build_type", "arch"

    def package(self):
        self.copy("*.h", dst="include", src="../../doric")
        self.copy("*.a", dst="lib",src="../../../binary/debug/doric")
        self.copy("*", dst="qml",src="../resources")
        self.copy("*.js", dst="js",src="../../../../doric-js/bundle")
    def package_info(self):
        self.cpp_info.libs = ["DoricCore"]