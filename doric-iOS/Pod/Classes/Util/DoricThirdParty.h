/*
 * Copyright [2021] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//
//  DoricThirdParty.h
//  Doric
//
//  Created by pengfei.zhou on 2021/9/6.
//


#if __has_include(<SDWebImage/SDWebImage.h>)
#ifndef DORIC_USE_SDWEBIMAGE
#define DORIC_USE_SDWEBIMAGE 1
#endif
#elif __has_include(<YYWebImage/YYWebImage.h>)
#ifndef DORIC_USE_YYWEBIMAGE
#define DORIC_USE_YYWEBIMAGE 1
#endif
#endif

#if __has_include(<PINCache/PINCache.h>)
#ifndef DORIC_USE_PINCACHE
#define DORIC_USE_PINCACHE 1
#endif
#elif  __has_include(<YYCache/YYCache.h>)
#ifndef DORIC_USE_YYCACHE
#define DORIC_USE_YYCACHE 1
#endif
#elif __has_include(<TMCache/TMCache.h>)
#ifndef DORIC_USE_TMCACHE
#define DORIC_USE_TMCACHE 1
#endif
#endif