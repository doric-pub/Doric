//
// Created by pengfei.zhou on 2021/12/7.
//

#import "DoricDevAssetsLoader.h"
#import "DoricDev.h"
#import <DoricCore/DoricRemoteResource.h>

@implementation DoricDevAssetsLoader

- (__kindof DoricResource *)load:(NSString *)identifier withContext:(DoricContext *)context {
    if (DoricDev.instance.isInDevMode) {
        return [[DoricRemoteResource alloc] initWithContext:context
                                                 identifier:[NSString stringWithFormat:@"http://%@:7778/assets/%@",
                                                                                       DoricDev.instance.ip,
                                                                                       identifier]];
    }
    return [super load:identifier withContext:context];
}
@end