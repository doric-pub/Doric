#import "__$RawName__Library.h"
#import "DoricDemoPlugin.h"

@implementation __$RawName__Library
- (void)load:(DoricRegistry *)registry {
    NSString *path = [NSBundle bundleForClass:self.class].bundlePath;
    NSString *fullPath = [path stringByAppendingPathComponent:@"bundle___$__.js"];
    NSString *jsContent = [NSString stringWithContentsOfFile:fullPath encoding:NSUTF8StringEncoding error:nil];
    [registry registerJSBundle:jsContent withName:@"__$__"];
    [registry registerNativePlugin:DoricDemoPlugin.class withName:@"demoPlugin"];
}
@end