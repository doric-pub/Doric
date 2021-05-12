from conans import ConanFile

class DoricCore(ConanFile):
    license = "MIT"
    name = "DoricCore"
    settings = "os", "compiler", "build_type", "arch"

    def package(self):
        self.copy("*.h", dst="include", src="doric")
        self.copy("*.a", dst="lib",src="../binary/dest")
    def package_info(self):
        self.cpp_info.libs = ["DoricCore"]