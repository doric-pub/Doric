//
// Created by pengfei.zhou on 2021/12/7.
//

#import "DoricDevAssetsLoader.h"
#import "DoricDev.h"

@implementation DoricDevAssetsLoader

- (__kindof DoricResource *)load:(NSString *)identifier withContext:(DoricContext *)context {
    if (DoricDev.instance.isInDevMode) {
        
    }
    return [super load:identifier withContext:context];
}
@end